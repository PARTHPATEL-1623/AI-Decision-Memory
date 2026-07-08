import React, { useState, useEffect } from 'react';
import { getDecisions, getHealthReport, getVendorTracker, Decision } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, PieChart as PieIcon, ShieldAlert, Award, FileQuestion } from 'lucide-react';

export const Analytics: React.FC = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [vendorData, setVendorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDecisions(),
      getHealthReport(),
      getVendorTracker()
    ]).then(([decs, health, vendor]) => {
      setDecisions(decs);
      setHealthData(health);
      setVendorData(vendor);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-12 space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="h-8 w-1/3 rounded bg-slate-200 shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded bg-slate-200 shimmer" />
          <div className="h-64 rounded bg-slate-200 shimmer" />
        </div>
      </div>
    );
  }

  // 1. Calculate department distribution
  const deptMap: Record<string, number> = {};
  decisions.forEach(d => {
    deptMap[d.department] = (deptMap[d.department] || 0) + 1;
  });
  const departmentChartData = Object.keys(deptMap).map(key => ({
    name: key,
    count: deptMap[key]
  }));

  // 2. Build timeline data (decisions by month)
  // Let's group decisions in late 2025 and 2026 chronologically
  const timelineMap: Record<string, number> = {
    "Jan 25": 0, "Feb 25": 0, "Mar 25": 0, "Apr 25": 0, "May 25": 0, "Jun 25": 0,
    "Jul 25": 0, "Aug 25": 0, "Sep 25": 0, "Oct 25": 0, "Nov 25": 0, "Dec 25": 0,
    "Jan 26": 0, "Feb 26": 0, "Mar 26": 0, "Apr 26": 0, "May 26": 0, "Jun 26": 0, "Jul 26": 0
  };

  decisions.forEach(d => {
    const date = new Date(d.dateDecided);
    const year = String(date.getFullYear()).slice(-2);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthStr = months[date.getMonth()];
    const key = `${monthStr} ${year}`;
    if (key in timelineMap) {
      timelineMap[key]++;
    }
  });

  const timelineChartData = Object.keys(timelineMap).map(key => ({
    period: key,
    Decisions: timelineMap[key]
  }));

  // 3. Count contradictions & overdue renewals for Risk Metrics
  const contradictionCount = decisions.filter(d => d.contradictedBy !== null).length;
  const overdueContractsCount = vendorData?.upcomingReviews?.filter((u: any) => u.daysRemaining < 0).length || 0;
  const skeletonDecisionsCount = decisions.filter(d => d.alternativesConsidered.length === 0 || d.sources.length === 0).length;

  const COLORS = ['#1E2A5E', '#3B5BFF', '#3C4D9F', '#718096', '#4A5568', '#CBD5E1'];

  return (
    <div className="space-y-8 animate-fade-in py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-dark font-serif">Timeline & Analytics</h1>
        <p className="text-slate-400 text-sm">Visualizing the flow, depth, and health of institutional memory.</p>
      </div>

      {/* Institutional Risk Assessment Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-navy-dark text-base font-serif flex items-center gap-2 border-b border-slate-100 pb-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          Institutional Risk Alerts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overdue Vendor Contracts */}
          <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-700 text-sm">Vendor Renewal Risks</h5>
              <p className="text-xs text-red-600 font-semibold mt-0.5">{overdueContractsCount} Expired contracts</p>
              <p className="text-[11px] text-slate-400 mt-1">Vendor decision evaluations have lapsed. Risk of auto-renewing under suboptimal pricing.</p>
            </div>
          </div>

          {/* Undocumented Rationale */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
            <FileQuestion className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-700 text-sm">Reasoning Gaps</h5>
              <p className="text-xs text-amber-600 font-semibold mt-0.5">{skeletonDecisionsCount} Undocumented records</p>
              <p className="text-[11px] text-slate-400 mt-1">Decisions lacks alternative options analysis or linked sources. High risk of context loss.</p>
            </div>
          </div>

          {/* Policy Contradictions */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-700 text-sm">Policy Contradictions</h5>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{contradictionCount} Silent drift flags</p>
              <p className="text-[11px] text-slate-400 mt-1">Superseded or contradictory decision pairs detected without linked supersession trails.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Plots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-navy-dark text-sm font-serif">Decisions Logged Over Time</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', borderColor: '#e2e8f0' }} />
                <Line type="monotone" dataKey="Decisions" stroke="#3B5BFF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-navy-dark text-sm font-serif">Decisions by Department</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', borderColor: '#e2e8f0' }} />
                <Bar dataKey="count" fill="#1E2A5E" radius={[6, 6, 0, 0]}>
                  {departmentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
