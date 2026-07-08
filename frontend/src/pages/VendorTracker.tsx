import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { getVendorTracker, VendorTrackerResult, VendorReviewItem } from '../api';
import { Calendar, DollarSign, AlertCircle, RefreshCw, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export const VendorTracker: React.FC = () => {
  const [trackerData, setTrackerData] = useState<VendorTrackerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedDecisionId, setActiveScreen } = useStore();

  useEffect(() => {
    getVendorTracker()
      .then((data) => setTrackerData(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-12 space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="h-8 w-1/3 rounded bg-slate-200 shimmer" />
        <div className="h-64 rounded bg-slate-200 shimmer" />
      </div>
    );
  }

  // Formatting currency
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const overdueReviews = trackerData?.upcomingReviews?.filter(u => u.daysRemaining < 0) || [];
  const activeReviews = trackerData?.upcomingReviews?.filter(u => u.daysRemaining >= 0) || [];

  return (
    <div className="space-y-8 animate-fade-in py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-dark font-serif">Vendor & Procurement Tracker</h1>
        <p className="text-slate-400 text-sm">Auditing recurring contract choices, evaluations, and re-negotiation timeline calendars.</p>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total evaluated vendors */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-navy-dark/5 text-navy-dark rounded-xl shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-navy-dark font-serif">{trackerData?.vendorsEvaluatedCount || 0}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Vendors Evaluated</div>
          </div>
        </div>

        {/* Total spend */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-electric/10 text-electric rounded-xl shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-navy-dark font-serif">
              {formatUSD(trackerData?.totalAnnualSpend || 0)}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Tracked Annual Spend</div>
          </div>
        </div>

        {/* Overdue alerts */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-navy-dark font-serif">{overdueReviews.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Contracts Overdue Review</div>
          </div>
        </div>
      </div>

      {/* Main Vendor Contract Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Table View */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden self-start">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-navy-dark text-base font-serif">Enterprise Procurement Records</h3>
            <p className="text-xs text-slate-400">Full audit trail of selected vendor solutions.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="px-5 py-3">Vendor / Choice</th>
                  <th className="px-5 py-3">Annual Cost</th>
                  <th className="px-5 py-3">Renewal Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trackerData?.upcomingReviews?.map((item) => (
                  <tr key={item.decisionId} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 font-bold text-navy-dark">
                      <div className="font-semibold text-slate-700">{item.vendorName}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{item.decisionId}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{formatUSD(item.cost)}</td>
                    <td className="px-5 py-4 font-medium text-slate-500">{item.renewalDate}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDecisionId(item.decisionId);
                          setActiveScreen('detail');
                        }}
                        className="px-2.5 py-1.5 rounded border border-slate-200 hover:border-electric hover:text-electric text-[10px] font-bold uppercase transition-colors inline-flex items-center gap-0.5"
                      >
                        Audit
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Upcoming Reviews Calendar Widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 self-start">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-navy-dark text-base font-serif">Renewal Review Pipeline</h3>
            <p className="text-xs text-slate-400">Contracts flagged for active re-litigation or renegotiation.</p>
          </div>

          <div className="space-y-4">
            {/* Overdue Items */}
            {overdueReviews.map((item) => (
              <div key={item.decisionId} className="p-3 border border-red-200 bg-red-50/30 rounded-xl space-y-2 text-xs relative animate-fade-in">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-800 uppercase text-[9px] bg-red-100 px-2 py-0.5 rounded">Overdue Review</span>
                  <span className="text-[10px] text-red-700 font-bold">{Math.abs(item.daysRemaining)} days ago</span>
                </div>
                <h5 className="font-bold text-navy-dark">{item.vendorName} Contract</h5>
                <div className="text-slate-500">Decision index requires review. Lapsed on {item.renewalDate}.</div>
              </div>
            ))}

            {/* Impending Items */}
            {activeReviews.map((item) => (
              <div key={item.decisionId} className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl space-y-2 text-xs relative animate-fade-in">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-500 uppercase text-[9px] bg-slate-100 px-2 py-0.5 rounded">Renewal Upcoming</span>
                  <span className="text-[10px] text-slate-600 font-semibold">{item.daysRemaining} days left</span>
                </div>
                <h5 className="font-bold text-navy-dark">{item.vendorName} Contract</h5>
                <div className="text-slate-500">Evaluated renewal occurs on {item.renewalDate}. Review pricing sheets.</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
