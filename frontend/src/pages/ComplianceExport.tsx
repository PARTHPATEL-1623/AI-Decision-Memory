import React, { useState, useEffect } from 'react';
import { getDecisions, Decision } from '../api';
import { FileText, Download, Calendar, Folder, Tag, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ComplianceExport: React.FC = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [deptFilter, setDeptFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  useEffect(() => {
    getDecisions()
      .then((data) => {
        setDecisions(data);
        setFilteredDecisions(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filter calculations
  useEffect(() => {
    let list = [...decisions];
    
    if (deptFilter) {
      list = list.filter(d => d.department.toLowerCase() === deptFilter.toLowerCase());
    }

    if (tagFilter) {
      list = list.filter(d => d.tags.map(t => t.toLowerCase()).includes(tagFilter.toLowerCase()));
    }

    if (startDate) {
      const start = new Date(startDate).getTime();
      list = list.filter(d => new Date(d.dateDecided).getTime() >= start);
    }

    if (endDate) {
      const end = new Date(endDate).getTime();
      list = list.filter(d => new Date(d.dateDecided).getTime() <= end);
    }

    setFilteredDecisions(list);
  }, [deptFilter, tagFilter, startDate, endDate, decisions]);

  const handleExportCSV = () => {
    setIsExporting(true);
    setExportComplete(false);

    setTimeout(() => {
      // 1. Generate real CSV spreadsheet client-side
      const headers = ["ID", "Title", "Department", "DateDecided", "Summary", "Stakeholders", "Tags", "LinkedSources"];
      
      const rows = filteredDecisions.map(d => [
        d.id,
        `"${d.title.replace(/"/g, '""')}"`,
        d.department,
        d.dateDecided,
        `"${d.summary.replace(/"/g, '""')}"`,
        `"${d.stakeholders.map(s => `${s.name} (${s.role})`).join('; ')}"`,
        `"${d.tags.join(', ')}"`,
        `"${d.sources.join(', ')}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      // 2. Trigger browser download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `AI_Decision_Memory_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportComplete(true);
    }, 1200); // Add simulated packaging delay
  };

  const departments = ["Engineering", "Procurement", "HR", "Product", "Delivery", "Operations"];
  const tags = ["architecture", "backend", "scalability", "database", "infrastructure", "postgres", "monorepo", "devops", "benefits", "policy", "culture", "wfh", "caching", "performance", "procurement", "vendor", "analytics", "developer-tools", "product", "mobile", "frontend", "ui-ux", "payments", "compliance", "delivery", "roadmap", "mvp", "testing", "qa", "operations", "support", "crm"];

  return (
    <div className="space-y-8 animate-fade-in py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-dark font-serif">Compliance & Audit Export</h1>
        <p className="text-slate-400 text-sm">Generate verifiable historical decision trails for regulators, M&A due diligence, and legal reviews.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Filter panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 self-start">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-navy-dark text-base font-serif">Audit Filter Options</h3>
            <p className="text-[11px] text-slate-400 mt-1">Configure parameters to narrow the export trail.</p>
          </div>

          <div className="space-y-4">
            
            {/* Department */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5" /> Department
              </label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full text-xs"
              >
                <option value="">All Departments</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Tag */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Tag Scope
              </label>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-full text-xs"
              >
                <option value="">All Tags</option>
                {tags.map(t => (
                  <option key={t} value={t}>#{t}</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <button
              onClick={handleExportCSV}
              disabled={isExporting || filteredDecisions.length === 0}
              className="w-full py-3 rounded-xl bg-navy-dark hover:bg-navy-medium text-white font-semibold text-xs flex justify-center items-center gap-2 shadow disabled:bg-slate-200"
            >
              {isExporting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate Audit CSV
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Audit Preview List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-navy-dark text-base font-serif">Export Payload Preview</h3>
              <p className="text-xs text-slate-400">Reviewing {filteredDecisions.length} mapped decisions matching parameters.</p>
            </div>
            <span className="text-[10px] bg-navy-dark/5 text-navy-dark font-bold px-2 py-0.5 rounded tracking-wide uppercase select-none">
              Secured Index
            </span>
          </div>

          {exportComplete && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Spreadsheet generated and downloaded successfully! Packaging completed.</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="h-20 bg-slate-200 rounded-xl shimmer" />
              ))}
            </div>
          ) : filteredDecisions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-slate-400">No decisions match chosen criteria. Broaden filter bounds.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {filteredDecisions.map((d) => (
                <div key={d.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl text-xs space-y-1.5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="text-navy-dark font-bold">{d.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 uppercase text-[10px]">{d.department}</span>
                    </div>
                    <span className="text-slate-400">{d.dateDecided}</span>
                  </div>
                  <h5 className="font-bold text-slate-700">{d.title}</h5>
                  <p className="text-slate-500 leading-relaxed font-sans line-clamp-2">{d.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
