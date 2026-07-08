import { create } from 'zustand';

export type UserPersona = 'Employee' | 'Manager' | 'New Hire';

export interface SlackMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  attachments?: Array<{
    title: string;
    text: string;
    color: string;
  }>;
}

export interface IngestionSource {
  name: string;
  type: 'jira' | 'confluence' | 'slack' | 'email';
  connected: boolean;
  lastSync: string;
}

interface AppState {
  activeScreen: string; // 'ask-ai', 'dashboard', 'detail', 'capture', 'analytics', 'search', 'onboarding', 'contradictions', 'manual-capture', 'procurement', 'slack-bot', 'health', 'audit'
  selectedDecisionId: string | null; // For detail view
  userPersona: UserPersona;
  onboardingRole: string;
  onboardingCheckedDecisions: Record<string, string[]>; // Map role -> array of completed decision IDs
  slackThread: SlackMessage[];
  connectedSources: IngestionSource[];
  isIngesting: boolean;
  ingestedDecision: any | null;
  draftTitle: string; // Pre-filled title from query search miss
  
  // Actions
  setActiveScreen: (screen: string) => void;
  setSelectedDecisionId: (id: string | null) => void;
  setUserPersona: (persona: UserPersona) => void;
  setOnboardingRole: (role: string) => void;
  toggleOnboardingDecision: (role: string, decisionId: string) => void;
  addSlackMessage: (msg: SlackMessage) => void;
  toggleSource: (name: string) => void;
  setIngesting: (ingesting: boolean) => void;
  setIngestedDecision: (decision: any | null) => void;
  setDraftTitle: (title: string) => void;
}

export const useStore = create<AppState>((set) => ({
  activeScreen: 'ask-ai', // Default landing page
  selectedDecisionId: null,
  userPersona: 'Employee',
  onboardingRole: 'Backend Engineer',
  onboardingCheckedDecisions: {
    'Backend Engineer': ['DEC-001'],
    'Frontend Engineer': ['DEC-017'],
    'Payments Team': [],
    'DevOps Engineer': ['DEC-006'],
    'Manager': []
  },
  slackThread: [
    {
      id: 'msg-0',
      sender: 'bot',
      text: 'Hello! I am your AI Decision Memory Assistant. Ask me why we made specific choices. For example:\n`@DecisionMemory why did we choose microservices?` or `@DecisionMemory why did we drop dark mode?`',
      timestamp: '10:42 AM'
    }
  ],
  connectedSources: [
    { name: 'Jira Workspaces', type: 'jira', connected: true, lastSync: '10 mins ago' },
    { name: 'Confluence Wiki', type: 'confluence', connected: true, lastSync: '1 hour ago' },
    { name: 'Slack Channels', type: 'slack', connected: true, lastSync: 'Just now' },
    { name: 'Outlook / Gmail', type: 'email', connected: false, lastSync: 'Never' }
  ],
  isIngesting: false,
  ingestedDecision: null,
  draftTitle: '',

  setActiveScreen: (screen) => set({ activeScreen: screen }),
  setSelectedDecisionId: (id) => set({ selectedDecisionId: id }),
  setUserPersona: (persona) => set({ userPersona: persona }),
  setOnboardingRole: (role) => set({ onboardingRole: role }),
  toggleOnboardingDecision: (role, decisionId) => set((state) => {
    const list = state.onboardingCheckedDecisions[role] || [];
    const newList = list.includes(decisionId)
      ? list.filter(id => id !== decisionId)
      : [...list, decisionId];
    return {
      onboardingCheckedDecisions: {
        ...state.onboardingCheckedDecisions,
        [role]: newList
      }
    };
  }),
  addSlackMessage: (msg) => set((state) => ({ slackThread: [...state.slackThread, msg] })),
  toggleSource: (name) => set((state) => ({
    connectedSources: state.connectedSources.map(s => 
      s.name === name ? { ...s, connected: !s.connected, lastSync: !s.connected ? 'Just now' : 'Never' } : s
    )
  })),
  setIngesting: (ingesting) => set({ isIngesting: ingesting }),
  setIngestedDecision: (decision) => set({ ingestedDecision: decision }),
  setDraftTitle: (title) => set({ draftTitle: title })
}));
