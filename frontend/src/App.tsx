import React from 'react';
import { useStore, UserPersona } from './store';

// Import Pages
import { Dashboard } from './pages/Dashboard';
import { AskAI } from './pages/AskAI';
import { DecisionDetail } from './pages/DecisionDetail';
import { CaptureSimulator } from './pages/CaptureSimulator';
import { Analytics } from './pages/Analytics';
import { SearchBrowse } from './pages/SearchBrowse';
import { OnboardingCopilot } from './pages/OnboardingCopilot';
import { ContradictionDetector } from './pages/ContradictionDetector';
import { ManualCaptureForm } from './pages/ManualCaptureForm';
import { VendorTracker } from './pages/VendorTracker';
import { SlackSimulator } from './pages/SlackSimulator';
import { DepartmentHealth } from './pages/DepartmentHealth';
import { ComplianceExport } from './pages/ComplianceExport';
import { DecisionMap } from './pages/DecisionMap';
import { TraceabilityTimeline } from './pages/TraceabilityTimeline';

// Import Icons
import {
  Brain,
  Search,
  LayoutDashboard,
  Sparkles,
  LineChart,
  FileText,
  BookOpen,
  AlertTriangle,
  FolderPlus,
  DollarSign,
  MessageSquare,
  Activity,
  Download,
  ShieldCheck,
  UserCheck,
  Network,
  GitFork
} from 'lucide-react';

export default function App() {
  const { activeScreen, setActiveScreen, userPersona, setUserPersona, onboardingRole } = useStore();

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'ask-ai':
        return <AskAI />;
      case 'detail':
        return <DecisionDetail />;
      case 'capture':
        return <CaptureSimulator />;
      case 'analytics':
        return <Analytics />;
      case 'search':
        return <SearchBrowse />;
      case 'onboarding':
        return <OnboardingCopilot />;
      case 'contradictions':
        return <ContradictionDetector />;
      case 'manual-capture':
        return <ManualCaptureForm />;
      case 'procurement':
        return <VendorTracker />;
      case 'slack-bot':
        return <SlackSimulator />;
      case 'health':
        return <DepartmentHealth />;
      case 'audit':
        return <ComplianceExport />;
      case 'decision-map':
        return <DecisionMap />;
      case 'timeline-trace':
        return <TraceabilityTimeline />;
      default:
        return <AskAI />;
    }
  };

  const navGroups = [
    {
      title: "Query & Retrieve",
      items: [
        { id: "ask-ai", name: "Ask AI Assistant", icon: Brain },
        { id: "decision-map", name: "Decision Intelligence Map", icon: Network },
        { id: "search", name: "Browse Decisions", icon: Search }
      ]
    },
    {
      title: "Operational Feeds",
      items: [
        { id: "dashboard", name: "Executive Dashboard", icon: LayoutDashboard },
        { id: "contradictions", name: "Drift & Reversals", icon: AlertTriangle },
        { id: "procurement", name: "Procurement Tracker", icon: DollarSign },
        { id: "timeline-trace", name: "Traceability Timeline", icon: GitFork }
      ]
    },
    {
      title: "Ingestion Systems",
      items: [
        { id: "capture", name: "Parsing Simulator", icon: Sparkles },
        { id: "manual-capture", name: "Manual Capture", icon: FolderPlus }
      ]
    },
    {
      title: "Integrations & Use Cases",
      items: [
        { id: "onboarding", name: "Onboarding Copilot", icon: BookOpen },
        { id: "slack-bot", name: "Slack Bot Simulator", icon: MessageSquare }
      ]
    },
    {
      title: "Compliance & Metrics",
      items: [
        { id: "analytics", name: "Timeline & Charts", icon: LineChart },
        { id: "health", name: "Department Scorecard", icon: Activity },
        { id: "audit", name: "Compliance Export", icon: Download }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION - Deep Navy */}
      <aside className="w-64 bg-[#1E2A5E] border-r border-[#2B3A8C]/30 text-[#CBD5E1] flex flex-col shrink-0 select-none">
        
        {/* Brand Banner */}
        <div className="p-5 border-b border-[#2B3A8C]/50 flex items-center gap-3">
          <div className="p-2 bg-electric rounded-xl shadow-md text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm font-serif tracking-tight">Decision Memory</h1>
            <p className="text-[10px] text-slate-400">Rysun Ideathon 2025</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow overflow-y-auto p-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <h5 className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400 pl-3">
                {group.title}
              </h5>
              
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeScreen === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveScreen(item.id)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                        isActive 
                          ? 'bg-electric text-white shadow-md' 
                          : 'hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Credit Tag */}
        <div className="p-4 border-t border-[#2B3A8C]/50 bg-[#121518]/15 text-[10px] text-center text-slate-400">
          Mock-Data Simulation Build
        </div>
      </aside>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        
        {/* GLOBAL HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-navy-dark text-sm font-serif">
              {activeScreen === 'detail' ? 'Decision Record View' : 'Enterprise RAG Environment'}
            </h2>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-slate-400 text-xs font-semibold capitalize">
              {activeScreen.replace('-', ' ')}
            </span>
          </div>

          {/* Global Demo Persona Status & Switcher */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            {userPersona === 'New Hire' && (
              <span className="bg-electric/10 text-electric px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Scope: {onboardingRole}
              </span>
            )}
            
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span>Persona: <span className="font-bold text-navy-dark">{userPersona}</span></span>
              
              <select
                value={userPersona}
                onChange={(e) => setUserPersona(e.target.value as UserPersona)}
                className="ml-1 bg-transparent border-0 p-0 text-xs font-bold text-electric cursor-pointer focus:ring-0"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="New Hire">New Hire</option>
              </select>
            </div>
          </div>
        </header>

        {/* Dynamic page renderer */}
        <div className="flex-grow overflow-y-auto bg-slate-50/50 p-6 md:p-8">
          {renderActiveScreen()}
        </div>

      </main>

    </div>
  );
}
