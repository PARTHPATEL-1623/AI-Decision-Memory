import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { getDecisions, Decision } from '../api';
import { Clock, GraduationCap, Zap, Search, User, ArrowRight, BookOpen, Layers } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [recentDecisions, setRecentDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');
  const { setActiveScreen, setSelectedDecisionId } = useStore();

  useEffect(() => {
    getDecisions()
      .then((data) => setRecentDecisions(data.slice(0, 5)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      // Navigate to Ask AI screen and store the search context if needed
      setActiveScreen('ask-ai');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in py-6">
      {/* Top Slide-like Header Band */}
      <div className="bg-navy-dark text-white rounded-2xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-electric/25 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric text-white text-xs font-semibold uppercase tracking-wider">
            📥 Capture • 🧠 Understand • 🗂 Store • 🔍 Retrieve
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
            Institutional memory meets modern SaaS.
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Turn fragmented reasoning buried in Jira, Slack, and email into an structured, searchable audit trail of organizational decisions.
          </p>
        </div>
      </div>

      {/* Quantified Pain Points / Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 3-5 Hours lost */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-t-4 border-t-red-400 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded">Rysun Target Pains</span>
          </div>
          <h3 className="text-3xl font-bold text-navy-dark font-serif">3–5 hrs</h3>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Re-debating waste</p>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Time lost per employee every single week re-litigating settled architectures, configurations, or product choices.
          </p>
        </div>

        {/* Card 2: Onboarding delays */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-t-4 border-t-amber-400 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-50 px-2 py-0.5 rounded">Onboarding Lag</span>
          </div>
          <h3 className="text-3xl font-bold text-navy-dark font-serif">6 weeks</h3>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Onboarding Delay</p>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Average delay for new hires to understand "why we do things this way" and grasp original design rationale.
          </p>
        </div>

        {/* Card 3: Target gains */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-t-4 border-t-emerald-400 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-50 px-2 py-0.5 rounded">Projected ROI</span>
          </div>
          <h3 className="text-3xl font-bold text-navy-dark font-serif">70% gain</h3>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Productivity Impact</p>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Projected statistics: 50% faster onboarding, 40% cost reduction, 80% risk reduction, 70% efficiency boost.
          </p>
        </div>
      </div>

      {/* Hero Search Redirect */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-bold text-navy-dark font-serif text-lg">Looking for a specific decision rationale?</h4>
          <p className="text-xs text-slate-400">Jump into the Ask AI screen to query decisions semantically.</p>
        </div>
        <button
          onClick={() => setActiveScreen('ask-ai')}
          className="px-5 py-2.5 rounded-xl bg-electric text-white font-semibold flex items-center gap-2 hover:bg-navy-medium shadow-md hover:shadow-lg transition-all text-sm shrink-0"
        >
          <Search className="w-4 h-4" />
          Open Ask AI Console
        </button>
      </div>

      {/* Main Feed: Recent Decisions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h2 className="text-2xl font-bold text-navy-dark font-serif">Recent Decision Feed</h2>
          <button
            onClick={() => setActiveScreen('search')}
            className="text-xs font-semibold text-electric flex items-center gap-1 hover:underline"
          >
            Browse all decisions
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-5 border border-slate-200 bg-white rounded-xl space-y-3">
                <div className="h-5 w-1/3 rounded shimmer" />
                <div className="h-4 w-3/4 rounded shimmer" />
                <div className="h-4 w-1/4 rounded shimmer" />
              </div>
            ))}
          </div>
        ) : recentDecisions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No decisions catalogued yet. Run the capture simulator to ingest some.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentDecisions.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  setSelectedDecisionId(d.id);
                  setActiveScreen('detail');
                }}
                className="p-5 border border-slate-200 bg-white rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in group"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-navy-dark text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase">
                      {d.id}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                      {d.department}
                    </span>
                    <span className="text-slate-400 text-xs">{d.dateDecided}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy-dark font-serif group-hover:text-electric transition-colors">
                    {d.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {d.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {d.tags.map((t) => (
                      <span key={t} className="border border-slate-200 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side: Stakeholders & Click */}
                <div className="flex md:flex-col items-end gap-3 self-stretch justify-between md:justify-center border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 shrink-0">
                  <div className="flex items-center -space-x-2">
                    {d.stakeholders.map((s, idx) => (
                      <div
                        key={idx}
                        title={`${s.name} (${s.role})`}
                        className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase"
                      >
                        {s.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-electric group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    View Record
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
