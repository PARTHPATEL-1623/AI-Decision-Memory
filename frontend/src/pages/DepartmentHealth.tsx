import React, { useState, useEffect } from 'react';
import { useStore, UserPersona } from '../store';
import { getHealthReport, DepartmentHealthReport } from '../api';
import { ShieldCheck, ShieldAlert, Clock, FolderGit2, RefreshCw, UserSquare2, Eye, Compass } from 'lucide-react';

export const DepartmentHealth: React.FC = () => {
  const { userPersona, setUserPersona, onboardingRole, setOnboardingRole } = useStore();
  const [report, setReport] = useState<DepartmentHealthReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = () => {
    setLoading(true);
    getHealthReport()
      .then((data) => setReport(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handlePersonaChange = (persona: UserPersona) => {
    setUserPersona(persona);
  };

  if (loading) {
    return (
      <div className="py-12 space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="h-8 w-1/3 rounded bg-slate-200 shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 rounded bg-slate-200 shimmer" />
          <div className="h-40 rounded bg-slate-200 shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in py-6">
      
      {/* Role-Switcher control panel */}
      <div className="bg-navy-dark text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-electric/15 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="space-y-1 text-center md:text-left relative z-10">
          <h3 className="font-bold text-lg font-serif flex items-center justify-center md:justify-start gap-1.5">
            <UserSquare2 className="w-5 h-5 text-electric animate-pulse" />
            Active Demo Persona Switcher
          </h3>
          <p className="text-xs text-slate-300">Toggle views to experience the MVP from different organizational roles.</p>
        </div>

        <div className="inline-flex rounded-xl bg-slate-900 border border-slate-700 p-1 shrink-0 relative z-10">
          {(["Employee", "Manager", "New Hire"] as UserPersona[]).map((persona) => (
            <button
              key={persona}
              onClick={() => handlePersonaChange(persona)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide ${
                userPersona === persona 
                  ? 'bg-electric text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {persona}
            </button>
          ))}
        </div>
      </div>

      {/* Main compliance metrics info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-dark font-serif">Department Memory Health</h1>
          <p className="text-slate-400 text-sm">Auditing organizational documentation consistency and query velocity.</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm shrink-0">
          <div>
            <span className="text-slate-400 uppercase tracking-wider block">Global Compliance</span>
            <span className="text-lg font-bold text-navy-dark font-serif">{report?.overallComplianceScore}%</span>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div>
            <span className="text-slate-400 uppercase tracking-wider block">Total Catalogued</span>
            <span className="text-lg font-bold text-navy-dark font-serif">{report?.totalDecisionsCatalogued} decisions</span>
          </div>
        </div>
      </div>

      {/* Departments Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {report?.departmentScorecards.map((card) => {
          const isGood = card.healthStatus === 'Good';
          const isRisk = card.healthStatus === 'At Risk';

          return (
            <div
              key={card.departmentName}
              className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md hover:border-slate-300 transition-all border-l-4 ${
                isGood ? 'border-l-emerald-500' : isRisk ? 'border-l-amber-500' : 'border-l-red-500'
              }`}
            >
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <h4 className="font-bold text-navy-dark text-base font-serif">{card.departmentName} Squad</h4>
                
                {/* Traffic light indicator status */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  isGood ? 'bg-emerald-100 text-emerald-700' : isRisk ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isGood ? 'bg-emerald-500' : isRisk ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  {card.healthStatus} Health
                </span>
              </div>

              {/* Grid detail variables */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                
                {/* Score 1 */}
                <div className="bg-slate-50 p-3 rounded-xl space-y-0.5">
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Logged Entries</span>
                  <span className="text-sm font-extrabold text-slate-700 flex items-center gap-1">
                    <FolderGit2 className="w-4 h-4 text-slate-400" />
                    {card.decisionsCount} Decisions
                  </span>
                </div>

                {/* Score 2 */}
                <div className="bg-slate-50 p-3 rounded-xl space-y-0.5">
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Fully Reasoned</span>
                  <span className="text-sm font-extrabold text-slate-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    {card.fullReasoningPercentage}%
                  </span>
                </div>

                {/* Score 3 */}
                <div className="bg-slate-50 p-3 rounded-xl space-y-0.5">
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">AI Query Latency</span>
                  <span className="text-sm font-extrabold text-slate-700 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {card.avgTimeToAnswerMs} ms
                  </span>
                </div>

                {/* Score 4 */}
                <div className="bg-slate-50 p-3 rounded-xl space-y-0.5">
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Drift Conflicts</span>
                  <span className="text-sm font-extrabold text-slate-700 flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                    {card.contradictionCount} Flags
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
