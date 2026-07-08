import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { getDecisions, askAI, Decision } from '../api';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  Sparkles, 
  GitFork, 
  HelpCircle, 
  Activity,
  AlertCircle,
  Brain
} from 'lucide-react';

export const TraceabilityTimeline: React.FC = () => {
  const { selectedDecisionId, setSelectedDecisionId, setActiveScreen } = useStore();
  
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [activeDecision, setActiveDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Selection details
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  
  // AI Insights state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<any | null>(null);

  useEffect(() => {
    getDecisions()
      .then(list => {
        setDecisions(list);
        
        // If a decision is already selected globally, default to it
        if (selectedDecisionId) {
          const found = list.find(d => d.id === selectedDecisionId);
          if (found) setActiveDecision(found);
        } else if (list.length > 0) {
          // Default to the first decision in list
          setActiveDecision(list[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedDecisionId]);

  // Reset event selection and AI insights when active decision changes
  const handleDecisionChange = (id: string) => {
    const found = decisions.find(d => d.id === id);
    if (found) {
      setActiveDecision(found);
      setSelectedDecisionId(found.id);
      setSelectedEvent(null);
      setAiInsights(null);
    }
  };

  const handleFetchAIInsights = async (event: any) => {
    if (!activeDecision) return;
    setAiLoading(true);
    setAiInsights(null);

    // Build RAG prompt query using stakeholders, systems, or tags
    const primaryTag = activeDecision.tags[0] || 'architecture';
    const primaryOwner = activeDecision.stakeholders[0]?.name || 'Aman Verma';
    const query = `find decisions related to tag ${primaryTag} or owned by ${primaryOwner}`;

    try {
      const result = await askAI(query);
      setAiInsights(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="h-8 w-1/3 bg-slate-200 rounded shimmer" />
        <div className="h-64 bg-slate-200 rounded-2xl shimmer" />
      </div>
    );
  }

  // Lifecycle Icons mapping
  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'trigger': return '📥';
      case 'requirement': return '📋';
      case 'story': return '🎫';
      case 'development': return '⚙️';
      case 'ship': return '🚀';
      default: return '📍';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in py-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb path */}
      <div className="flex flex-wrap justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="text-xs font-semibold text-slate-500 hover:text-navy-dark flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </button>
          <span className="text-slate-300">/</span>
          {activeDecision && (
            <button
              onClick={() => {
                setSelectedDecisionId(activeDecision.id);
                setActiveScreen('detail');
              }}
              className="px-2.5 py-1 rounded bg-[#3B5BFF]/10 text-electric text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
              title="Return to detailed specifications sheet"
            >
              <GitFork className="w-3 h-3" />
              Traceability Path: {activeDecision.id}
            </button>
          )}
        </div>

        {/* Picker Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Focus Decision:</span>
          <select
            value={activeDecision?.id || ''}
            onChange={(e) => handleDecisionChange(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-navy-dark focus:ring-electric"
          >
            {decisions.map(d => (
              <option key={d.id} value={d.id}>{d.id} — {d.title}</option>
            ))}
          </select>
        </div>
      </div>

      {activeDecision ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns: Vertical Timeline */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-navy-dark">{activeDecision.title}</h2>
              <p className="text-slate-400 text-xs mt-0.5">Chronology audit map detailing the decision lifecycle milestones.</p>
            </div>

            {/* Vertical Timeline Nodes */}
            <div className="relative pl-8 border-l border-slate-200 ml-4 space-y-8 py-2">
              {activeDecision.lifecycleEvents.map((evt, idx) => {
                const isSelected = selectedEvent === evt;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedEvent(evt);
                      setAiInsights(null); // Clear previous insights on event click
                    }}
                    className={`relative group cursor-pointer transition-all duration-300 p-4 border rounded-xl hover:shadow bg-white ${
                      isSelected ? 'border-electric ring-2 ring-electric/15' : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {/* Floating Left Pin Icon */}
                    <div className="absolute -left-12 top-4 w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-sm shadow group-hover:scale-110 transition-transform">
                      {getEventIcon(evt.type)}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex justify-between items-center">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                          {evt.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{evt.date}</span>
                      </div>
                      <h4 className="font-bold text-navy-dark text-sm font-serif leading-snug">{evt.label}</h4>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-50">
                        <span>Signed: {evt.author}</span>
                        <span className="font-semibold text-slate-500">Source: {evt.source}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Event Details Panel & AI Insights */}
          <div className="space-y-6">
            
            {/* Event Details Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h3 className="font-bold text-navy-dark text-sm font-serif">Event Detail Rationale</h3>
                <Activity className="w-4 h-4 text-slate-400 animate-pulse" />
              </div>

              {selectedEvent ? (
                <div className="space-y-4 text-xs animate-fade-in">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <div className="text-[9px] uppercase font-bold text-slate-400 mb-0.5">Author</div>
                      <div className="font-bold text-slate-700">{selectedEvent.author}</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <div className="text-[9px] uppercase font-bold text-slate-400 mb-0.5">Priority</div>
                      <div className={`font-bold uppercase text-[9px] px-1.5 py-0.2 rounded inline-block ${
                        selectedEvent.priority === 'High' ? 'bg-red-100 text-red-700' :
                        selectedEvent.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {selectedEvent.priority}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <div className="text-[9px] uppercase font-bold text-slate-400 mb-0.5">Source Channel</div>
                      <div className="font-bold text-slate-700">{selectedEvent.source}</div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <div className="text-[9px] uppercase font-bold text-slate-400 mb-0.5">Date Logged</div>
                      <div className="font-bold text-slate-700">{selectedEvent.date}</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-50">
                    {/* View in Source system link */}
                    <a
                      href="https://r-ideathon-2025-decision-memory.io/source-viewer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold flex justify-center items-center gap-1.5 shadow-sm transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      View in Source System
                    </a>

                    {/* Find related AI Insights button */}
                    <button
                      onClick={() => handleFetchAIInsights(selectedEvent)}
                      disabled={aiLoading}
                      className="w-full py-2 bg-navy-dark text-white hover:bg-navy-medium rounded-lg text-xs font-semibold flex justify-center items-center gap-1.5 shadow"
                    >
                      {aiLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-electric animate-bounce" />
                          Find Related AI Insights
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <HelpCircle className="w-7 h-7 text-slate-300 mx-auto mb-1" />
                  Select a lifecycle timeline stage card on the left to inspect metadata details.
                </div>
              )}
            </div>

            {/* AI Insights Display */}
            {aiInsights && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5 animate-fade-in max-h-[300px] overflow-y-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-navy-dark font-serif border-b border-slate-50 pb-1.5">
                  <Brain className="w-4 h-4 text-electric" />
                  Related Decision Rationale
                </div>
                
                {aiInsights.isSuccess ? (
                  <div className="space-y-3.5 text-xs text-slate-600">
                    <p className="leading-relaxed border-l-2 border-electric pl-2.5">
                      {aiInsights.answer.replace(/\{([^}]+)\}/g, '$1')}
                    </p>
                    
                    {/* Click link to read it */}
                    {aiInsights.matchedDecisionId && (
                      <button
                        onClick={() => handleDecisionChange(aiInsights.matchedDecisionId)}
                        className="text-xs font-bold text-electric hover:underline flex items-center gap-0.5"
                      >
                        Inspect this decision timeline
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs">
                    No related decision records found sharing similar tags or deciders.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-1" />
          <p className="text-slate-400 text-sm">Please select a decision from the top picker to display its traceability path.</p>
        </div>
      )}
    </div>
  );
};
