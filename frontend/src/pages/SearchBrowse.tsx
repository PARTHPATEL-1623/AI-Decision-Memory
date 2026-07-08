import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { getDecisions, Decision } from '../api';
import { Search, Grid, List, Filter, Calendar, FolderOpen, Tag, UserCheck, Eye } from 'lucide-react';

export const SearchBrowse: React.FC = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  
  // Search & Filter state
  const [searchVal, setSearchVal] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [stakeholderFilter, setStakeholderFilter] = useState('');

  const { setSelectedDecisionId, setActiveScreen } = useStore();

  const loadData = () => {
    setLoading(true);
    getDecisions({
      search: searchVal,
      department: deptFilter,
      tag: tagFilter,
      stakeholder: stakeholderFilter
    }).then((data) => {
      setDecisions(data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [searchVal, deptFilter, tagFilter, stakeholderFilter]);

  // Extract all unique tags and departments for filters from the fully seeded list
  const departments = ["Engineering", "Procurement", "HR", "Product", "Delivery", "Operations"];
  const tags = ["architecture", "backend", "scalability", "database", "infrastructure", "postgres", "monorepo", "devops", "benefits", "policy", "culture", "wfh", "caching", "performance", "procurement", "vendor", "analytics", "developer-tools", "product", "mobile", "frontend", "ui-ux", "payments", "compliance", "delivery", "roadmap", "mvp", "testing", "qa", "operations", "support", "crm"];

  return (
    <div className="space-y-6 animate-fade-in py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-dark font-serif">Browse Decisions</h1>
          <p className="text-slate-400 text-sm">Full index search and filtration of organizational records.</p>
        </div>

        {/* View mode toggle */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm shrink-0">
          <button
            onClick={() => setViewMode('card')}
            className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-navy-dark text-white' : 'text-slate-400 hover:text-slate-600'}`}
            title="Card View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-navy-dark text-white' : 'text-slate-400 hover:text-slate-600'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Text search */}
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search keyword, title, ID..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <FolderOpen className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm appearance-none bg-white"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div className="relative">
            <Tag className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm appearance-none bg-white"
            >
              <option value="">All Tags</option>
              {tags.map(t => (
                <option key={t} value={t}>#{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stakeholder input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          <div className="relative col-span-1 md:col-span-2">
            <UserCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by Stakeholder name..."
              value={stakeholderFilter}
              onChange={(e) => setStakeholderFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          <div className="col-span-2 flex items-center justify-end">
            <button
              onClick={() => {
                setSearchVal('');
                setDeptFilter('');
                setTagFilter('');
                setStakeholderFilter('');
              }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table Results Rendering */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-5 bg-white border border-slate-100 rounded-xl space-y-3 shimmer">
              <div className="h-5 w-1/3 rounded bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : decisions.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-400 text-sm">No decisions found matching the specified filters.</p>
        </div>
      ) : viewMode === 'card' ? (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {decisions.map(d => (
            <div
              key={d.id}
              onClick={() => {
                setSelectedDecisionId(d.id);
                setActiveScreen('detail');
              }}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between group animate-fade-in"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-navy-dark text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                      {d.id}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                      {d.department}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{d.dateDecided}</span>
                </div>

                <h3 className="font-bold text-navy-dark font-serif text-base group-hover:text-electric transition-colors">
                  {d.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {d.summary}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1.5">
                    {d.stakeholders.slice(0, 3).map((st, idx) => (
                      <div
                        key={idx}
                        title={st.name}
                        className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase shrink-0"
                      >
                        {st.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                  {d.stakeholders.length > 3 && (
                    <span className="text-[9px] text-slate-400">+{d.stakeholders.length - 3}</span>
                  )}
                </div>

                <span className="text-[10px] font-bold text-electric flex items-center gap-0.5">
                  View Record
                  <Eye className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Stakeholders</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {decisions.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-navy-dark">{d.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 max-w-xs truncate">{d.title}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                        {d.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">{d.dateDecided}</td>
                    <td className="px-6 py-4">
                      {d.stakeholders.map(s => s.name.split(' ')[0]).join(', ')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDecisionId(d.id);
                          setActiveScreen('detail');
                        }}
                        className="px-3 py-1 rounded bg-electric/10 text-electric hover:bg-electric hover:text-white font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        View
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
