import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { getDecisions, Decision, classifyIntent } from '../api';
import { Search, Brain, HelpCircle, X, Network, Link2, Info, ArrowUpRight } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'decision' | 'stakeholder' | 'system' | 'source' | 'contradiction';
  x: number;
  y: number;
  data: any;
}

interface GraphEdge {
  sourceId: string;
  targetId: string;
  type: string;
}

export const DecisionMap: React.FC = () => {
  const { setSelectedDecisionId, setActiveScreen } = useStore();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    getDecisions()
      .then(data => setDecisions(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-12 space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="h-8 w-1/3 bg-slate-200 rounded shimmer" />
        <div className="h-[500px] bg-slate-200 rounded-2xl shimmer" />
      </div>
    );
  }

  // 1. Process data to build Nodes and Edges
  const nodesMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  // Anchor decisions in a middle ring, stakeholders outer, systems inner, sources furthest outer
  const centerX = 380;
  const centerY = 280;

  // Track counts to place them symmetrically
  const decNodes = decisions.slice(0, 15); // limit to 15 decisions to keep graph readable
  
  // Collect unique entities
  const uniqueStakeholders = Array.from(new Set(decNodes.flatMap(d => d.stakeholders.map(s => s.name))));
  const uniqueSystems = Array.from(new Set(decNodes.flatMap(d => d.linkedEntities.filter(e => e.type === 'system').map(e => e.name))));
  const uniqueSources = Array.from(new Set(decNodes.flatMap(d => d.sources.slice(0, 1)))); // 1 source per decision for cleaner graph

  // Place Systems (Inner Ring: radius 90)
  uniqueSystems.forEach((sys, i) => {
    const angle = (i / uniqueSystems.length) * 2 * Math.PI;
    const radius = 95;
    nodesMap.set(`sys-${sys}`, {
      id: `sys-${sys}`,
      label: sys,
      type: 'system',
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      data: { name: sys, type: 'system' }
    });
  });

  // Place Decisions (Middle Ring: radius 180)
  decNodes.forEach((d, i) => {
    const angle = (i / decNodes.length) * 2 * Math.PI;
    const radius = 190;
    nodesMap.set(d.id, {
      id: d.id,
      label: d.id,
      type: 'decision',
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      data: d
    });

    // Connect decisions to their systems
    d.linkedEntities.filter(e => e.type === 'system').forEach(sys => {
      if (nodesMap.has(`sys-${sys.name}`)) {
        edges.push({ sourceId: d.id, targetId: `sys-${sys.name}`, type: 'system-link' });
      }
    });
  });

  // Place Stakeholders (Outer Ring: radius 270)
  uniqueStakeholders.forEach((sh, i) => {
    const angle = (i / uniqueStakeholders.length) * 2 * Math.PI + 0.2;
    const radius = 280;
    nodesMap.set(`stakeholder-${sh}`, {
      id: `stakeholder-${sh}`,
      label: sh,
      type: 'stakeholder',
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      data: { name: sh, type: 'stakeholder' }
    });

    // Connect decisions to their stakeholders
    decNodes.forEach(d => {
      if (d.stakeholders.some(s => s.name === sh)) {
        edges.push({ sourceId: d.id, targetId: `stakeholder-${sh}`, type: 'stakeholder-link' });
      }
    });
  });

  // Place Contradictions (Short edges between conflicted decisions)
  decNodes.forEach(d => {
    if (d.contradictedBy) {
      if (nodesMap.has(d.id) && nodesMap.has(d.contradictedBy)) {
        edges.push({ sourceId: d.id, targetId: d.contradictedBy, type: 'contradiction' });
      }
    }
  });

  const nodes = Array.from(nodesMap.values());

  // Build seed vocabulary for intent classification
  const seedVocabulary = new Set<string>();
  decisions.forEach(d => {
    const text = `${d.title} ${d.summary} ${d.tags.join(" ")} ${d.department}`.toLowerCase().replace(/[^\w\s]/g, "");
    text.split(' ').filter(t => t).forEach(token => seedVocabulary.add(token));
  });

  const classification = searchQuery ? classifyIntent(searchQuery, seedVocabulary) : { intent: 0, message: "" };

  // Search filtering logic
  const isMatch = (node: GraphNode) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (node.type === 'decision') {
      return node.data.title.toLowerCase().includes(q) || node.data.summary.toLowerCase().includes(q) || node.id.toLowerCase().includes(q);
    }
    return node.label.toLowerCase().includes(q);
  };

  // Find direct connections for the side panel list
  const getDirectConnections = (node: GraphNode) => {
    const connected: Array<{ id: string; label: string; type: string; details: string }> = [];
    
    edges.forEach(e => {
      if (e.sourceId === node.id) {
        const target = nodesMap.get(e.targetId);
        if (target) {
          connected.push({
            id: target.id,
            label: target.label,
            type: target.type,
            details: target.type === 'decision' ? target.data.title : 'Direct node relationship'
          });
        }
      } else if (e.targetId === node.id) {
        const source = nodesMap.get(e.sourceId);
        if (source) {
          connected.push({
            id: source.id,
            label: source.label,
            type: source.type,
            details: source.type === 'decision' ? source.data.title : 'Direct node relationship'
          });
        }
      }
    });

    return connected;
  };

  // Node Color configurations matching existing Navy/Electric palette
  const getNodeStyles = (node: GraphNode, isHighlighted: boolean) => {
    let fill = '#FFFFFF';
    let stroke = '#718096';
    let size = 8;
    
    switch (node.type) {
      case 'decision':
        fill = '#3B5BFF'; // Electric Blue Accent
        stroke = '#2B3A8C';
        size = 14;
        break;
      case 'system':
        fill = '#10B981'; // Emerald Green
        stroke = '#047857';
        size = 10;
        break;
      case 'stakeholder':
        fill = '#1E2A5E'; // Deep Navy
        stroke = '#3C4D9F';
        size = 10;
        break;
      case 'contradiction':
        fill = '#EF4444'; // Red Conflict
        stroke = '#B91C1C';
        size = 12;
        break;
    }

    const opacity = searchQuery && !isHighlighted ? 0.15 : 1;

    return { fill, stroke, size, opacity };
  };

  return (
    <div className="space-y-6 animate-fade-in py-6 flex flex-col h-[700px] relative">
      
      {/* Top Search bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-navy-dark font-serif">Decision Intelligence Map</h1>
          <p className="text-slate-400 text-sm">Interactive visualization map of core decisions, owners, and technology systems.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search map... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-electric"
          />
        </div>
      </div>

      {/* Map Content Box */}
      <div className="flex-grow bg-white border border-slate-200 rounded-2xl relative shadow-md overflow-hidden flex">
        
        {searchQuery && classification.intent !== 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 border border-electric/30 shadow-lg px-4 py-2.5 rounded-xl z-20 flex items-center gap-2 text-[10px] text-navy-dark backdrop-blur-sm animate-fade-in font-bold">
            <Brain className="w-4 h-4 text-electric animate-pulse shrink-0" />
            <span>
              {classification.intent === 1 && "Hey there! Try searching decisions like 'microservices' or 'dark mode' to highlight nodes."}
              {classification.intent === 2 && "Vague query. Try typing 'Snowflake', 'Datadog' or 'Monorepo' to isolate nodes."}
              {classification.intent === 3 && `No nodes matched '${searchQuery}'. Try 'microservices', 'dark mode', or 'monorepo'.`}
              {classification.intent === 4 && "I couldn't process that input — try rephrasing."}
            </span>
          </div>
        )}

        {/* SVG Network Visualizer */}
        <div className="flex-grow relative h-full">
          <svg className="w-full h-full select-none" viewBox="0 0 760 560">
            {/* Draw Edges first */}
            {edges.map((edge, idx) => {
              const srcNode = nodesMap.get(edge.sourceId);
              const tgtNode = nodesMap.get(edge.targetId);
              if (!srcNode || !tgtNode) return null;

              const isEdgeMatch = isMatch(srcNode) || isMatch(tgtNode);
              const opacity = searchQuery ? (isEdgeMatch ? 0.7 : 0.05) : 0.35;
              const isContradiction = edge.type === 'contradiction';

              return (
                <line
                  key={idx}
                  x1={srcNode.x}
                  y1={srcNode.y}
                  x2={tgtNode.x}
                  y2={tgtNode.y}
                  stroke={isContradiction ? '#EF4444' : '#CBD5E1'}
                  strokeWidth={isContradiction ? 2.5 : 1}
                  strokeDasharray={isContradiction ? '4 2' : undefined}
                  opacity={opacity}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const matches = isMatch(node);
              const { fill, stroke, size, opacity } = getNodeStyles(node, matches);
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                  opacity={opacity}
                >
                  {/* Outer selection ring */}
                  {(isSelected || (searchQuery && matches)) && (
                    <circle
                      r={size + 6}
                      fill="none"
                      stroke={node.type === 'contradiction' ? '#EF4444' : '#3B5BFF'}
                      strokeWidth={1.5}
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={size}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2}
                    className="transition-all duration-300 group-hover:scale-110 shadow-sm"
                  />

                  {/* Label (Show decision ID or standard label) */}
                  <text
                    y={size + 14}
                    textAnchor="middle"
                    className="text-[9px] font-semibold fill-slate-700 bg-white select-none transition-colors"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Persistent Bottom-Left Stats Widget */}
        <div className="absolute bottom-5 left-5 bg-navy-dark text-white rounded-xl p-4 shadow-xl border border-navy-medium max-w-[190px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Decision Coverage</span>
            <Network className="w-3.5 h-3.5 text-electric" />
          </div>
          <div className="text-2xl font-bold font-serif text-white">82%</div>
          <div className="text-[9px] text-slate-400 mt-1 leading-normal">Mock metrics: percentage of technology squads with at least one linked decision memory node.</div>
        </div>

        {/* Legend Panel (Top-Left) */}
        <div className="absolute top-5 left-5 bg-white/95 border border-slate-200 rounded-xl p-3.5 shadow space-y-2 text-[10px] text-slate-500 font-semibold backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3B5BFF]" />
            <span>Decision Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1E2A5E]" />
            <span>Stakeholder Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span>System Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <span>Contradiction Link</span>
          </div>
        </div>

        {/* RIGHT SIDE PANEL SLIDE-IN */}
        {selectedNode && (
          <div className="w-80 bg-white border-l border-slate-200 shadow-2xl h-full flex flex-col z-30 animate-fade-in shrink-0 relative">
            {/* Header info */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-electric" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Node Insights</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Content area */}
            <div className="p-5 flex-grow overflow-y-auto space-y-6">
              
              {/* Type Badge */}
              <div>
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  selectedNode.type === 'decision' ? 'bg-electric/10 text-electric' :
                  selectedNode.type === 'system' ? 'bg-emerald-100 text-emerald-700' :
                  selectedNode.type === 'stakeholder' ? 'bg-navy-dark/10 text-navy-dark' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedNode.type} node
                </span>
                
                {/* Node Title */}
                <h3 className="font-bold text-navy-dark text-base font-serif mt-2">
                  {selectedNode.type === 'decision' ? selectedNode.data.title : selectedNode.label}
                </h3>
              </div>

              {/* Specific detail rendering */}
              {selectedNode.type === 'decision' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-400 uppercase">Operational Summary</div>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">{selectedNode.data.summary}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-400 uppercase">Sign-Off Date</div>
                    <p className="text-slate-600 font-semibold">{selectedNode.data.dateDecided}</p>
                  </div>
                  
                  {/* Action detail view */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSelectedDecisionId(selectedNode.id);
                        setActiveScreen('detail');
                      }}
                      className="w-full py-2 bg-navy-dark text-white rounded-lg hover:bg-navy-medium text-xs font-semibold flex justify-center items-center gap-1 shadow"
                    >
                      Inspect Full Record
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Related node connections */}
              <div className="space-y-3">
                <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Connected Edges</div>
                <div className="space-y-2">
                  {getDirectConnections(selectedNode).map((conn, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        const target = nodesMap.get(conn.id);
                        if (target) setSelectedNode(target);
                      }}
                      className="p-2.5 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-navy-dark">{conn.id}</span>
                        <span className="text-[9px] uppercase font-bold text-slate-400">{conn.type}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{conn.label}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
