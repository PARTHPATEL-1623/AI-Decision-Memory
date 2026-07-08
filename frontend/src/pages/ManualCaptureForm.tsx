import React, { useState } from 'react';
import { useStore } from '../store';
import { createDecision, suggestDecisionFields } from '../api';
import { Plus, Trash2, Brain, Sparkles, FileText, CheckCircle2, ChevronRight, X, AlertCircle, RefreshCw } from 'lucide-react';

interface FormAlternative {
  option: string;
  rejectedBecause: string;
}

interface FormStakeholder {
  name: string;
  role: string;
}

export const ManualCaptureForm: React.FC = () => {
  const { setActiveScreen, setSelectedDecisionId, draftTitle, setDraftTitle } = useStore();

  const [title, setTitle] = useState('');

  React.useEffect(() => {
    if (draftTitle) {
      setTitle(draftTitle);
      setDraftTitle(''); // Clear draft title immediately
    }
  }, [draftTitle, setDraftTitle]);
  const [department, setDepartment] = useState('Engineering');
  const [dateDecided, setDateDecided] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [relevantForRoles, setRelevantForRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState('');
  
  // Repeatable rows
  const [alternatives, setAlternatives] = useState<FormAlternative[]>([
    { option: '', rejectedBecause: '' }
  ]);
  const [stakeholders, setStakeholders] = useState<FormStakeholder[]>([
    { name: '', role: '' }
  ]);
  const [sources, setSources] = useState<string[]>(['']);

  // UI state
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // AI Assist field suggestions
  const handleAIAssist = async () => {
    if (!description.trim()) {
      setErrorMsg("Please enter a description first to allow AI to suggest tags & department.");
      return;
    }
    
    setErrorMsg('');
    setIsSuggesting(true);
    try {
      const suggestions = await suggestDecisionFields(description);
      setDepartment(suggestions.department);
      setTags(suggestions.tags);
      setRelevantForRoles(suggestions.relevantForRoles);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAddAlternative = () => {
    setAlternatives([...alternatives, { option: '', rejectedBecause: '' }]);
  };

  const handleRemoveAlternative = (idx: number) => {
    setAlternatives(alternatives.filter((_, i) => i !== idx));
  };

  const handleAltChange = (idx: number, field: keyof FormAlternative, val: string) => {
    const updated = [...alternatives];
    updated[idx][field] = val;
    setAlternatives(updated);
  };

  const handleAddStakeholder = () => {
    setStakeholders([...stakeholders, { name: '', role: '' }]);
  };

  const handleRemoveStakeholder = (idx: number) => {
    setStakeholders(stakeholders.filter((_, i) => i !== idx));
  };

  const handleStakeholderChange = (idx: number, field: keyof FormStakeholder, val: string) => {
    const updated = [...stakeholders];
    updated[idx][field] = val;
    setStakeholders(updated);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddRole = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && roleInput.trim()) {
      e.preventDefault();
      if (!relevantForRoles.includes(roleInput.trim())) {
        setRelevantForRoles([...relevantForRoles, roleInput.trim()]);
      }
      setRoleInput('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setRelevantForRoles(relevantForRoles.filter(r => r !== role));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Title and Description/Summary are required fields.");
      return;
    }

    setErrorMsg('');
    setIsSaving(true);

    const cleanAlts = alternatives.filter(a => a.option.trim() && a.rejectedBecause.trim());
    const cleanStakeholders = stakeholders.filter(s => s.name.trim() && s.role.trim());
    const cleanSources = sources.filter(s => s.trim());

    const decisionPayload = {
      title,
      department,
      dateDecided,
      summary: description,
      alternativesConsidered: cleanAlts,
      stakeholders: cleanStakeholders,
      sources: cleanSources.length > 0 ? cleanSources : ["Manual Ingestion Capture"],
      tags,
      contradictedBy: null,
      relevantForRoles
    };

    try {
      const saved = await createDecision(decisionPayload);
      setSaveSuccess(saved);
      // Reset form
      setTitle('');
      setDescription('');
      setAlternatives([{ option: '', rejectedBecause: '' }]);
      setStakeholders([{ name: '', role: '' }]);
      setTags([]);
      setRelevantForRoles([]);
      setSources(['']);
    } catch (err) {
      setErrorMsg("Failed to save the decision. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-dark font-serif">Manual Capture Form</h1>
        <p className="text-slate-400 text-sm">Log an off-system or face-to-face team decision to ensure reasoning is never lost.</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-sm shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Dialog Banner */}
      {saveSuccess && (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <h3 className="font-bold text-navy-dark text-lg font-serif">Decision Successfully Saved</h3>
              <p className="text-xs text-slate-500">Record catalogued with index ID: <span className="font-bold text-emerald-700">{saveSuccess.id}</span></p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            The decision "{saveSuccess.title}" has been committed to memory. It is immediately active and retrievable via Ask AI or browse lists.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedDecisionId(saveSuccess.id);
                setActiveScreen('detail');
                setSaveSuccess(null);
              }}
              className="px-4 py-2 bg-navy-dark text-white rounded-lg hover:bg-navy-medium text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              View Record Details
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSaveSuccess(null)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Row 1: Title & Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col space-y-2">
            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Decision Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Adopt Vitest for Unit Testing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Date Decided</label>
            <input
              type="date"
              required
              value={dateDecided}
              onChange={(e) => setDateDecided(e.target.value)}
              className="w-full text-sm"
            />
          </div>
        </div>

        {/* Row 2: Description + AI Assist */}
        <div className="flex flex-col space-y-2 relative">
          <div className="flex justify-between items-center">
            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Description & Core Rationale *</label>
            <button
              type="button"
              onClick={handleAIAssist}
              disabled={isSuggesting}
              className="text-xs font-bold text-electric hover:text-navy-medium flex items-center gap-1 bg-electric/10 hover:bg-electric/15 px-3 py-1 rounded-lg"
            >
              {isSuggesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-3.5 h-3.5" />
                  AI-Assist Categorize
                </>
              )}
            </button>
          </div>
          <textarea
            required
            rows={4}
            placeholder="Type why this decision was made. What is the core problem and chosen resolution..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-200 p-4 focus:ring-2 focus:ring-electric/50"
          />
        </div>

        {/* Row 3: Department, Tags, Audience Roles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Department */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-sm appearance-none bg-white border border-slate-200"
            >
              <option value="Engineering">Engineering</option>
              <option value="Procurement">Procurement</option>
              <option value="HR">HR</option>
              <option value="Product">Product</option>
              <option value="Delivery">Delivery</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          {/* Tags */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Tags (Press Enter)</label>
            <input
              type="text"
              placeholder="e.g. testing, frontend"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full text-sm"
            />
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.map(t => (
                <span key={t} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)}>
                    <X className="w-2.5 h-2.5 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Audience Roles (Press Enter)</label>
            <input
              type="text"
              placeholder="e.g. Frontend Engineer"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={handleAddRole}
              className="w-full text-sm"
            />
            <div className="flex flex-wrap gap-1 mt-1">
              {relevantForRoles.map(r => (
                <span key={r} className="bg-electric/10 text-electric px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                  {r}
                  <button type="button" onClick={() => handleRemoveRole(r)}>
                    <X className="w-2.5 h-2.5 text-electric hover:text-navy-dark" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Repeatable Alternatives considered */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-navy-dark text-sm font-serif">Alternatives Considered (Optional)</h4>
            <button
              type="button"
              onClick={handleAddAlternative}
              className="text-xs font-semibold text-electric hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add alternative option
            </button>
          </div>

          <div className="space-y-3">
            {alternatives.map((alt, idx) => (
              <div key={idx} className="flex gap-4 items-start p-3 bg-slate-50 rounded-xl relative group">
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Alternative Option Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Jenkins hosted VMs"
                      value={alt.option}
                      onChange={(e) => handleAltChange(idx, 'option', e.target.value)}
                      className="bg-white border-slate-200 text-xs px-3 py-1.5 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Reason for Rejection</label>
                    <input
                      type="text"
                      placeholder="e.g. High maintenance VM downtime costs"
                      value={alt.rejectedBecause}
                      onChange={(e) => handleAltChange(idx, 'rejectedBecause', e.target.value)}
                      className="bg-white border-slate-200 text-xs px-3 py-1.5 rounded-lg"
                    />
                  </div>
                </div>

                {alternatives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAlternative(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded bg-white border border-slate-200 shadow-sm self-end"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 5: Repeatable Deciders/Stakeholders */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-navy-dark text-sm font-serif">Deciders & Sign-offs</h4>
            <button
              type="button"
              onClick={handleAddStakeholder}
              className="text-xs font-semibold text-electric hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add decider
            </button>
          </div>

          <div className="space-y-3">
            {stakeholders.map((s, idx) => (
              <div key={idx} className="flex gap-4 items-start p-3 bg-slate-50 rounded-xl relative group">
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Decider Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Aman Verma"
                      value={s.name}
                      onChange={(e) => handleStakeholderChange(idx, 'name', e.target.value)}
                      className="bg-white border-slate-200 text-xs px-3 py-1.5 rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Operational Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Tech Lead"
                      value={s.role}
                      onChange={(e) => handleStakeholderChange(idx, 'role', e.target.value)}
                      className="bg-white border-slate-200 text-xs px-3 py-1.5 rounded-lg"
                    />
                  </div>
                </div>

                {stakeholders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStakeholder(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded bg-white border border-slate-200 shadow-sm self-end"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit button bar */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-navy-dark hover:bg-navy-medium text-white font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:bg-slate-300"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Commit Decision to Memory
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
