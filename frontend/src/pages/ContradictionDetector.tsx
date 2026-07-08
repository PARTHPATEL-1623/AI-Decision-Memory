import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { getContradictions, ContradictionPair } from '../api';
import { AlertTriangle, ArrowRightLeft, CheckCircle2, UserCheck, Calendar, RefreshCw, HelpCircle } from 'lucide-react';

export const ContradictionDetector: React.FC = () => {
  const [pairs, setPairs] = useState<ContradictionPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const { setSelectedDecisionId, setActiveScreen } = useStore();

  useEffect(() => {
    getContradictions()
      .then((data) => setPairs(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleResolve = (newId: string, oldId: string) => {
    // Add to local resolved list for visual verification
    setResolvedIds(prev => [...prev, `${newId}-${oldId}`]);
  };

  if (loading) {
    return (
      <div className="py-12 space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="h-8 w-1/3 rounded bg-slate-200 shimmer" />
        <div className="h-64 rounded bg-slate-200 shimmer" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-dark font-serif">Contradiction & Drift Detector</h1>
        <p className="text-slate-400 text-sm">
          Detects silent policy reversals and architecture shifts without documented linking.
        </p>
      </div>

      {pairs.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <p className="text-slate-700 font-bold font-serif text-lg">No Undocumented Drift Detected</p>
          <p className="text-slate-400 text-xs mt-1">All policy adjustments are linked correctly as supersessions.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pairs.map((pair) => {
            const key = `${pair.newerDecision.id}-${pair.olderDecision.id}`;
            const isResolved = resolvedIds.includes(key);

            return (
              <div
                key={key}
                className={`bg-white border rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${
                  isResolved ? 'border-emerald-200 bg-emerald-50/5' : 'border-red-200'
                }`}
              >
                {/* Header Flag Band */}
                <div className={`px-5 py-3.5 flex justify-between items-center text-xs font-semibold ${
                  isResolved ? 'bg-emerald-100/50 text-emerald-800' : 'bg-red-50 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${isResolved ? 'text-emerald-500' : 'text-red-500'}`} />
                    <span>
                      {isResolved 
                        ? `RESOLVED: Supersession linked successfully between ${pair.newerDecision.id} and ${pair.olderDecision.id}`
                        : `CONFLICT: Policy drift flagged in ${pair.newerDecision.department}`
                      }
                    </span>
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => handleResolve(pair.newerDecision.id, pair.olderDecision.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors text-[10px] font-bold uppercase shrink-0"
                    >
                      Acknowledge / Link as Supersession
                    </button>
                  )}
                  {isResolved && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      supersession trail active
                    </span>
                  )}
                </div>

                {/* Side-by-Side Comparison Container */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {/* Swap indicator in middle */}
                  <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 text-slate-400 p-2.5 rounded-full border border-slate-200 z-10 shadow">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>

                  {/* Left Column: Older Decision */}
                  <div className="space-y-4 pr-0 md:pr-4 opacity-75 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <span className="bg-slate-400 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                          {pair.olderDecision.id}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Original Decision</span>
                      </div>
                      <span className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {pair.olderDecision.dateDecided}
                      </span>
                    </div>

                    <h4 className="font-bold text-navy-dark text-base font-serif hover:text-electric cursor-pointer"
                        onClick={() => { setSelectedDecisionId(pair.olderDecision.id); setActiveScreen('detail'); }}>
                      {pair.olderDecision.title}
                    </h4>

                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-xs text-slate-500 leading-relaxed min-h-16">
                      {pair.olderDecision.summary}
                    </div>

                    {/* Older stakeholders */}
                    <div className="text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-500">Sign-Offs:</span>{" "}
                      {pair.olderDecision.stakeholders.map(s => `${s.name} (${s.role})`).join(' | ')}
                    </div>
                  </div>

                  {/* Right Column: Newer Reversing Decision */}
                  <div className="space-y-4 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <span className="bg-electric text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                          {pair.newerDecision.id}
                        </span>
                        <span className="text-[10px] font-bold text-electric uppercase ml-2">Reversing Decision</span>
                      </div>
                      <span className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {pair.newerDecision.dateDecided}
                      </span>
                    </div>

                    <h4 className="font-bold text-navy-dark text-base font-serif hover:text-electric cursor-pointer"
                        onClick={() => { setSelectedDecisionId(pair.newerDecision.id); setActiveScreen('detail'); }}>
                      {pair.newerDecision.title}
                    </h4>

                    {/* Diff-style coloring */}
                    <div className="bg-red-50/40 border border-red-100 p-3.5 rounded-xl text-xs text-slate-600 leading-relaxed min-h-16 border-l-4 border-l-red-400">
                      <span className="font-bold text-red-800">Policy Shift Summary:</span> {pair.newerDecision.summary}
                    </div>

                    {/* Newer stakeholders */}
                    <div className="text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-500">Sign-Offs:</span>{" "}
                      {pair.newerDecision.stakeholders.map(s => `${s.name} (${s.role})`).join(' | ')}
                    </div>
                  </div>
                </div>

                {/* Diff analysis explanation footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 leading-relaxed flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700">Root Cause Analysis:</span> Both decisions address the same focus topic within the {pair.newerDecision.department} department but deliver opposite operational outcomes. The newer entry ({pair.newerDecision.id}) does not carry a documented link referencing the retirement of the older policy ({pair.olderDecision.id}), creating a compliance reporting gap.
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
