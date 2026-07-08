import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { getDecisionById, getDecisions, Decision } from '../api';
import { ArrowLeft, Calendar, User, FileText, CheckCircle2, AlertTriangle, Link, Layers, ListTodo, CornerDownRight } from 'lucide-react';

export const DecisionDetail: React.FC = () => {
  const { selectedDecisionId, setSelectedDecisionId, setActiveScreen } = useStore();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [allDecisions, setAllDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedDecisionId) return;

    setLoading(true);
    Promise.all([
      getDecisionById(selectedDecisionId),
      getDecisions()
    ]).then(([det, list]) => {
      setDecision(det);
      setAllDecisions(list);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedDecisionId]);

  if (loading) {
    return (
      <div className="py-12 space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="h-6 w-20 bg-slate-200 rounded shimmer" />
        <div className="p-6 border border-slate-200 bg-white rounded-xl space-y-4">
          <div className="h-8 w-1/2 rounded shimmer" />
          <div className="h-4 w-3/4 rounded shimmer" />
          <div className="h-20 w-full rounded shimmer" />
        </div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <p className="text-slate-400">Decision not found.</p>
        <button
          onClick={() => setActiveScreen('dashboard')}
          className="mt-4 text-electric font-semibold flex items-center gap-1 mx-auto hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    );
  }

  // Look up contradictions
  // Case A: This decision was superseded by a later decision (e.g. DEC-003 superseded by DEC-014)
  const successor = decision.contradictedBy 
    ? allDecisions.find(d => d.id === decision.contradictedBy)
    : null;

  // Case B: This decision reverses an older decision (e.g. DEC-014 reverses DEC-003)
  const predecessor = allDecisions.find(d => d.contradictedBy === decision.id);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 animate-fade-in">
      {/* Back link */}
      <button
        onClick={() => {
          setSelectedDecisionId(null);
          // If we had a previous screen, return to it. Default to search/dashboard
          setActiveScreen('dashboard');
        }}
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-navy-dark transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Decision Feed
      </button>

      {/* Contradiction Warning Banner */}
      {successor && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">⚠️ Warning: Policy Drift Detected.</span> This decision was superseded and reversed by a newer decision:{" "}
            <button
              onClick={() => {
                setSelectedDecisionId(successor.id);
              }}
              className="underline font-semibold text-red-900 hover:text-red-700"
            >
              {successor.title} ({successor.id})
            </button>{" "}
            on {successor.dateDecided}.
          </div>
        </div>
      )}

      {predecessor && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">⚠️ Warning: Supersession Event.</span> This decision explicitly reverses and supersedes an older policy/decision:{" "}
            <button
              onClick={() => {
                setSelectedDecisionId(predecessor.id);
              }}
              className="underline font-semibold text-amber-900 hover:text-amber-700"
            >
              {predecessor.title} ({predecessor.id})
            </button>{" "}
            on {predecessor.dateDecided}.
          </div>
        </div>
      )}

      {/* Main Detail Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Navy Header Band */}
        <div className="bg-navy-dark px-6 py-8 text-white relative">
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <span className="bg-electric px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
              {decision.id}
            </span>
            <span className="bg-white/15 px-3 py-1 rounded text-xs font-medium uppercase tracking-wider">
              {decision.department}
            </span>
          </div>
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Decided on {decision.dateDecided}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif leading-tight">
              {decision.title}
            </h1>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {decision.tags.map((t) => (
                <span key={t} className="bg-white/10 text-slate-200 text-[10px] px-2 py-0.5 rounded-full font-medium">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Summary Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-navy-dark text-base font-serif flex items-center gap-2 border-b border-slate-100 pb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Executive Summary ("Why" Choice)
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm md:text-base">
              {decision.summary}
            </p>
          </div>

          {/* Alternatives Considered */}
          {decision.alternativesConsidered.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-navy-dark text-base font-serif flex items-center gap-2 border-b border-slate-100 pb-2">
                <Layers className="w-5 h-5 text-electric" />
                Alternatives Evaluated & Rejections
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {decision.alternativesConsidered.map((alt, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full" />
                      <span className="font-bold text-slate-700 text-sm">{alt.option}</span>
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase">Rejected Option</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pl-4">
                      <span className="font-medium text-slate-700">Reason for Rejection: </span>
                      {alt.rejectedBecause}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stakeholders & Roles */}
          <div className="space-y-4">
            <h3 className="font-bold text-navy-dark text-base font-serif flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-5 h-5 text-slate-400" />
              Stakeholder Matrix & Sign-Offs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {decision.stakeholders.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-navy-dark/10 border border-navy-dark/15 flex items-center justify-center font-bold text-navy-dark uppercase shrink-0 text-sm">
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-700 text-sm leading-tight">{s.name}</h5>
                    <p className="text-xs text-slate-400">{s.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Audit Sources & Role Scopes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Audit Sources */}
            <div className="space-y-3">
              <h4 className="font-bold text-navy-dark text-sm flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-slate-400" />
                Linked Verification Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {decision.sources.map((src, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold">
                    <Link className="w-3 h-3 text-slate-400" />
                    {src}
                  </span>
                ))}
              </div>
            </div>

            {/* Relevant Roles */}
            <div className="space-y-3">
              <h4 className="font-bold text-navy-dark text-sm flex items-center gap-2">
                <ListTodo className="w-4.5 h-4.5 text-slate-400" />
                Target Audience Roles
              </h4>
              <div className="flex flex-wrap gap-2">
                {decision.relevantForRoles.map((role, idx) => (
                  <span key={idx} className="bg-electric/10 text-electric px-2.5 py-0.5 rounded-lg text-xs font-semibold">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
