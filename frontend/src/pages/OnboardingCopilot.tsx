import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { getDecisions, askAI, Decision } from '../api';
import { BookOpen, User, CheckCircle2, MessageSquare, Send, Award, Users2, Eye, Sparkles } from 'lucide-react';

const ONBOARDING_ROLES = [
  "Backend Engineer",
  "Frontend Engineer",
  "DevOps Engineer",
  "Payments Team",
  "Manager"
];

const MOCK_NEW_HIRES = [
  { name: "Tanmay Bhat", role: "Backend Engineer", progress: 2, total: 5, status: "Active" },
  { name: "Aishwarya Rai", role: "Frontend Engineer", progress: 4, total: 4, status: "Completed" },
  { name: "Kunal Shah", role: "DevOps Engineer", progress: 0, total: 3, status: "Not Started" }
];

export const OnboardingCopilot: React.FC = () => {
  const { 
    onboardingRole, 
    setOnboardingRole, 
    onboardingCheckedDecisions, 
    toggleOnboardingDecision, 
    setSelectedDecisionId, 
    setActiveScreen, 
    userPersona 
  } = useStore();

  const [packDecisions, setPackDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  // Buddy chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'buddy', text: string }>>([
    { sender: 'buddy', text: "Hey! I am your Onboarding Buddy AI. Ask me anything about our architecture or guidelines, and I will answer strictly based on our logged decisions!" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch decisions that have relevantForRoles matching onboardingRole
    getDecisions({ role: onboardingRole })
      .then((data) => {
        setPackDecisions(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [onboardingRole]);

  const handleBuddySend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Pass the onboarding role as a filter so the AI answers within the scope of this new hire's team context
      const reply = await askAI(userText, onboardingRole);
      setChatMessages(prev => [...prev, { sender: 'buddy', text: reply.answer.replace(/\{([^}]+)\}/g, '$1') }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'buddy', text: "Sorry, I had an error querying the decision repository." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const checkedList = onboardingCheckedDecisions[onboardingRole] || [];
  const completedCount = packDecisions.filter(d => checkedList.includes(d.id)).length;
  const totalCount = packDecisions.length;
  const pctComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-dark font-serif">Onboarding Copilot</h1>
          <p className="text-slate-400 text-sm">Empowering new hires to understand system history without weeks of documentation excavation.</p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500 uppercase">My Target Role:</span>
          <select
            value={onboardingRole}
            onChange={(e) => setOnboardingRole(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-navy-dark focus:ring-electric"
          >
            {ONBOARDING_ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Day 1 Context Pack & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Tracker Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-bold text-navy-dark font-serif text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-electric" />
                Day 1 Context Pack: {onboardingRole}
              </h3>
              <p className="text-xs text-slate-400">
                Recommended readings detailing high-level decision records essential for your role.
              </p>
            </div>

            {/* Circular progress simulated bar */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xl font-bold text-navy-dark font-serif">{completedCount} of {totalCount}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">decisions reviewed</div>
              </div>
              <div className="relative w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-sm text-electric font-mono">
                <div className="absolute inset-0 rounded-full border-4 border-electric border-t-transparent animate-spin-slow opacity-15" />
                {pctComplete}%
              </div>
            </div>
          </div>

          {/* Reading List Cards */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="p-5 bg-white border border-slate-100 rounded-xl space-y-3 shimmer" />
              ))}
            </div>
          ) : packDecisions.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-100 rounded-xl">
              <p className="text-slate-400 text-sm">No specific decisions catalogued for this role context.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {packDecisions.map((d, index) => {
                const isChecked = checkedList.includes(d.id);
                return (
                  <div
                    key={d.id}
                    className={`p-5 border rounded-xl bg-white transition-all shadow-sm flex items-start gap-4 hover:border-slate-300 relative group ${
                      isChecked ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-200'
                    }`}
                  >
                    {/* Number Badge */}
                    <div className="w-7 h-7 bg-navy-dark/5 text-navy-dark rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">
                      #{index + 1}
                    </div>

                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-navy-dark text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                            {d.id}
                          </span>
                          <span className="text-slate-400 text-[10px]">{d.dateDecided}</span>
                        </div>

                        {/* Checkbox action */}
                        <button
                          onClick={() => toggleOnboardingDecision(onboardingRole, d.id)}
                          className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded transition-colors ${
                            isChecked 
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isChecked ? 'Reviewed' : 'Mark Reviewed'}
                        </button>
                      </div>

                      <h4 className="font-bold text-navy-dark font-serif text-base">{d.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed pr-8">{d.summary}</p>
                      
                      <div className="flex justify-between items-center pt-2">
                        <button
                          onClick={() => {
                            setSelectedDecisionId(d.id);
                            setActiveScreen('detail');
                          }}
                          className="text-[11px] text-electric hover:text-navy-medium font-bold flex items-center gap-1"
                        >
                          View Full Record
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Buddy Chat & Manager View */}
        <div className="space-y-6">
          
          {/* Onboarding Buddy AI Mini-chat */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden flex flex-col h-[400px]">
            {/* Header */}
            <div className="bg-navy-dark text-white px-4 py-3.5 flex items-center gap-2">
              <div className="p-1 bg-electric/25 rounded text-electric">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm font-serif">Onboarding Buddy AI</h4>
                <p className="text-[10px] text-slate-300">Scoped to: {onboardingRole}</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 flex-grow overflow-y-auto space-y-3 text-xs bg-slate-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl p-3 shadow-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-electric text-white rounded-br-none' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-xl p-3 text-slate-400 flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-electric animate-spin" />
                    Searching team memory...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleBuddySend} className="p-2 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about guidelines or tools..."
                className="flex-grow text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-electric"
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="p-1.5 rounded-lg bg-navy-dark text-white hover:bg-navy-medium shadow disabled:bg-slate-200 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Manager View Scorecard */}
          {userPersona === 'Manager' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                <h4 className="font-bold text-navy-dark text-sm font-serif flex items-center gap-2">
                  <Users2 className="w-4.5 h-4.5 text-slate-400" />
                  Manager's Onboarding Audit
                </h4>
                <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-bold uppercase text-slate-500">Manager Mode</span>
              </div>

              <div className="space-y-3">
                {MOCK_NEW_HIRES.map((hire, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2.5 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-700">{hire.name}</div>
                      <div className="text-[10px] text-slate-400">{hire.role}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-700">{hire.progress} of {hire.total} read</div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        hire.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {hire.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
