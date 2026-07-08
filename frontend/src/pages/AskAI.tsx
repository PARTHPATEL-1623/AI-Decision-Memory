import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { askAI, AIResponse } from '../api';
import { Search, Brain, Users, FileText, Calendar, ArrowRight, CornerDownRight, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

const SUGGESTED_QUERIES = [
  "Why did we choose microservices?",
  "Why did we drop dark mode?",
  "Why did we select Snowflake?",
  "Why do we have a hybrid work schedule?"
];

export const AskAI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const { setSelectedDecisionId, setActiveScreen, onboardingRole, userPersona, setDraftTitle } = useStore();

  // Rotate search bar placeholder every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SUGGESTED_QUERIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResponse(null);

    // If we are in new hire mode, pass role filter context
    const roleFilter = userPersona === 'New Hire' ? onboardingRole : undefined;
    
    try {
      const data = await askAI(query, roleFilter);
      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (q: string) => {
    setQuery(q);
    // Autofire search
    setIsSearching(true);
    setResponse(null);
    const roleFilter = userPersona === 'New Hire' ? onboardingRole : undefined;
    askAI(q, roleFilter).then((data) => {
      setResponse(data);
      setIsSearching(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 text-electric text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Rysun Ideathon 2025 Pitch Demo
        </div>
        <h1 className="text-5xl font-bold font-serif text-navy-dark leading-tight">
          Never lose the <span className="text-electric italic">"why"</span> behind a decision again.
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Ask our semantic memory repository why architectures were selected, features were rejected, or policies were drafted.
        </p>
      </div>

      {/* Main Search Input */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-electric transition-colors">
          <Search className="w-6 h-6" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Try: "${SUGGESTED_QUERIES[placeholderIndex]}"`}
          className="w-full text-lg pl-14 pr-32 py-5 rounded-2xl border border-slate-200 bg-white shadow-xl hover:border-slate-300 focus:ring-4 focus:ring-electric/15 focus:border-electric transition-all"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-3 inset-y-3 px-6 rounded-xl bg-navy-dark hover:bg-navy-medium text-white font-medium flex items-center gap-2 shadow-md hover:shadow-lg disabled:bg-slate-300"
        >
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Ask AI
            </>
          )}
        </button>
      </form>

      {/* Pre-canned suggestions tags */}
      <div className="flex flex-wrap justify-center items-center gap-2.5 text-sm text-slate-400">
        <span>Popular queries:</span>
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestionClick(q)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-electric hover:text-electric shadow-sm hover:shadow transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Thinking Shimmer Loader */}
      {isSearching && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-electric animate-bounce" />
            <span className="font-semibold text-navy-dark text-sm">DecisionMemory engine reasoning...</span>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded shimmer" />
            <div className="h-4 w-5/6 rounded shimmer" />
            <div className="h-4 w-1/2 rounded shimmer" />
          </div>
        </div>
      )}

      {/* AI Structured Answer Card */}
      {response && (
        <div className="w-full">
          {/* INTENT 0: Successful Decision RAG Match */}
          {response.intent === 0 && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-6 transition-all duration-300 animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-electric/10 text-electric">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-dark text-lg font-serif">Simulated AI Grounded Synthesis</h3>
                    <p className="text-xs text-slate-400">Verified in corporate knowledge documents</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  100% Grounded (No Hallucinations)
                </span>
              </div>

              <div className="text-slate-700 leading-relaxed text-base border-l-4 border-electric pl-4 py-1">
                {response.answer.replace(/\{([^}]+)\}/g, '$1')}
              </div>

              {response.reasoning.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-navy-dark text-sm flex items-center gap-1.5">
                    <CornerDownRight className="w-4 h-4 text-electric" />
                    Key Reasoning & Rejection Analysis
                  </h4>
                  <ul className="pl-6 space-y-2 text-sm text-slate-600 list-disc">
                    {response.reasoning.map((r, idx) => (
                      <li key={idx} className="leading-relaxed">{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-700">Date Decided</div>
                    <div>{response.dateDecided}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-700">Audit Trail Sources</div>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {response.sources.map((s, idx) => (
                        <span key={idx} className="bg-navy-dark/10 text-navy-dark px-1.5 py-0.5 rounded text-[10px] font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-700">Decision Owners</div>
                    <div className="truncate max-w-[180px]">{response.stakeholders.join(', ')}</div>
                  </div>
                </div>
              </div>

              {response.matchedDecisionId && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDecisionId(response.matchedDecisionId);
                      setActiveScreen('detail');
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric hover:text-navy-medium"
                  >
                    View full decision record
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* INTENT 1 & 2: Conversational Greeter / Clarification Response */}
          {(response.intent === 1 || response.intent === 2) && (
            <div className="p-6 rounded-2xl bg-white border border-electric/30 shadow-xl space-y-4 transition-all duration-300 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-electric/10 text-electric rounded-xl">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-dark text-sm font-serif">
                    {response.intent === 1 ? "Copilot Conversational Assist" : "Clarification Prompt"}
                  </h3>
                  <p className="text-[10px] text-slate-400">Interactive helper assistance</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-electric pl-4 py-0.5">
                {response.answer}
              </p>
            </div>
          )}

          {/* INTENT 3: Matchable but Not Found */}
          {response.intent === 3 && (
            <div className="p-6 rounded-2xl bg-white border border-amber-200 shadow-xl space-y-5 transition-all duration-300 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-dark text-base font-serif">No matching decision found</h3>
                  <p className="text-xs text-slate-400">Item not catalogued in system repository</p>
                </div>
              </div>
              
              <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-amber-400 pl-4 py-0.5">
                {response.answer}
              </p>

              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setDraftTitle(query);
                    setActiveScreen('manual-capture');
                  }}
                  className="px-4 py-2 rounded-lg bg-navy-dark text-white hover:bg-navy-medium text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                >
                  Log this decision now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* INTENT 4: Broken/gibberish input */}
          {response.intent === 4 && (
            <div className="p-6 rounded-2xl bg-white border border-red-200 shadow-xl space-y-4 transition-all duration-300 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 text-red-500 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-dark text-sm font-serif">Invalid Query</h3>
                  <p className="text-[10px] text-slate-400">Input validation constraint</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-red-400 pl-4 py-0.5">
                {response.answer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
