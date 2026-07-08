import { MOCK_DECISIONS, Decision, Alternative, Stakeholder } from './mockData';
export type { Decision, Alternative, Stakeholder };

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5111/api';

// In-memory frontend database copy for session adjustments
let clientDecisions: Decision[] = [...MOCK_DECISIONS];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface AIResponse {
  answer: string;
  reasoning: string[];
  stakeholders: string[];
  dateDecided: string;
  sources: string[];
  matchedDecisionId: string | null;
  isSuccess: boolean;
  intent: number; // 0 = Success, 1 = Greeting, 2 = Vague, 3 = NotFound, 4 = Error
}

export interface SlackResponse {
  text: string;
  attachments: Array<{
    title: string;
    text: string;
    color: string;
  }>;
  username: string;
  iconEmoji: string;
}

export interface ContradictionPair {
  newerDecision: Decision;
  olderDecision: Decision;
  isResolved: boolean;
}

export interface VendorReviewItem {
  decisionId: string;
  vendorName: string;
  cost: number;
  renewalDate: string;
  daysRemaining: number;
  status: string;
}

export interface VendorTrackerResult {
  vendorsEvaluatedCount: number;
  totalAnnualSpend: number;
  upcomingReviews: VendorReviewItem[];
}

export interface DepartmentScorecard {
  departmentName: string;
  decisionsCount: number;
  fullReasoningPercentage: number;
  contradictionCount: number;
  avgTimeToAnswerMs: number;
  healthStatus: string;
}

export interface DepartmentHealthReport {
  overallComplianceScore: number;
  totalDecisionsCatalogued: number;
  departmentScorecards: DepartmentScorecard[];
}

// 1. Get all decisions
export async function getDecisions(filters?: {
  search?: string;
  department?: string;
  tag?: string;
  role?: string;
  stakeholder?: string;
}): Promise<Decision[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.role) params.append('role', filters.role);

    const res = await fetch(`${BASE_URL}/decisions?${params.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline. Using client-side simulation.");
  }

  // Client fallback
  let list = [...clientDecisions];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(d => d.title.toLowerCase().includes(s) || d.summary.toLowerCase().includes(s) || d.id.toLowerCase().includes(s));
  }
  if (filters?.department) {
    list = list.filter(d => d.department.toLowerCase() === filters.department?.toLowerCase());
  }
  if (filters?.tag) {
    list = list.filter(d => d.tags.map(t => t.toLowerCase()).includes(filters.tag!.toLowerCase()));
  }
  if (filters?.role) {
    list = list.filter(d => d.relevantForRoles.map(r => r.toLowerCase()).includes(filters.role!.toLowerCase()));
  }
  if (filters?.stakeholder) {
    list = list.filter(d => d.stakeholders.some(s => s.name.toLowerCase().includes(filters.stakeholder!.toLowerCase())));
  }
  return list.sort((a, b) => new Date(b.dateDecided).getTime() - new Date(a.dateDecided).getTime());
}

// 2. Get single decision by ID
export async function getDecisionById(id: string): Promise<Decision | null> {
  try {
    const res = await fetch(`${BASE_URL}/decisions/${id}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline. Using client-side simulation.");
  }
  return clientDecisions.find(d => d.id.toLowerCase() === id.toLowerCase()) || null;
}

// 3. Create a decision
export async function createDecision(decision: Omit<Decision, 'id'>): Promise<Decision> {
  try {
    const res = await fetch(`${BASE_URL}/decisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decision)
    });
    if (res.ok) {
      const newD = await res.json();
      // Keep client-side list in sync
      if (!clientDecisions.some(d => d.id === newD.id)) {
        clientDecisions.push(newD);
      }
      return newD;
    }
  } catch (e) {
    console.warn("Backend API offline. Using client-side simulation.");
  }

  // Client fallback
  const nextIndex = clientDecisions.length + 1;
  const newDecision: Decision = {
    ...decision,
    id: `DEC-${String(nextIndex).padStart(3, '0')}`,
    dateDecided: decision.dateDecided || new Date().toISOString().split('T')[0]
  };
  clientDecisions.push(newDecision);
  return newDecision;
}

// 4. Suggest tags and department (AI helper)
export async function suggestDecisionFields(description: string): Promise<{
  department: string;
  tags: string[];
  relevantForRoles: string[];
}> {
  try {
    const res = await fetch(`${BASE_URL}/decisions/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline. Using client-side simulation.");
  }

  // Client fallback
  const text = description.toLowerCase();
  let department = 'Engineering';
  const tags: string[] = [];
  const relevantForRoles: string[] = [];

  if (text.includes("cost") || text.includes("procure") || text.includes("vendor") || text.includes("license") || text.includes("contract") || text.includes("buy")) {
    department = 'Procurement';
    tags.push("procurement", "vendor", "finance");
    relevantForRoles.push("Procurement Specialist", "Manager");
  } else if (text.includes("hire") || text.includes("leave") || text.includes("vacation") || text.includes("pto") || text.includes("remote") || text.includes("wfh") || text.includes("office") || text.includes("hybrid") || text.includes("policy")) {
    department = 'HR';
    tags.push("policy", "culture", "benefits");
    relevantForRoles.push("New Hire", "Manager", "HR Team");
  } else if (text.includes("feature") || text.includes("dark mode") || text.includes("ui") || text.includes("ux") || text.includes("design") || text.includes("app")) {
    department = 'Product';
    tags.push("product", "frontend", "ui-ux");
    relevantForRoles.push("Frontend Engineer", "Product Manager", "UI/UX Designer");
  } else if (text.includes("sprint") || text.includes("mvp") || text.includes("scope") || text.includes("delay") || text.includes("launch")) {
    department = 'Delivery';
    tags.push("delivery", "roadmap", "mvp");
    relevantForRoles.push("Product Manager", "Manager");
  } else {
    tags.push("architecture", "infrastructure");
    relevantForRoles.push("Backend Engineer", "Platform Team");
  }

  if (text.includes("database") || text.includes("postgres")) tags.push("database");
  if (text.includes("microservices")) tags.push("architecture");
  if (text.includes("cloud") || text.includes("aws")) tags.push("infrastructure");
  if (text.includes("testing") || text.includes("cypress")) tags.push("testing");

  return {
    department,
    tags: Array.from(new Set(tags)),
    relevantForRoles: Array.from(new Set(relevantForRoles))
  };
}

// 5. Get Contradictions
export async function getContradictions(): Promise<ContradictionPair[]> {
  try {
    const res = await fetch(`${BASE_URL}/decisions/contradictions`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline. Using client-side simulation.");
  }

  // Client fallback
  const pairs: ContradictionPair[] = [];
  clientDecisions.forEach(d => {
    if (d.contradictedBy) {
      const orig = clientDecisions.find(o => o.id.toLowerCase() === d.contradictedBy?.toLowerCase());
      if (orig) {
        const newer = new Date(d.dateDecided) > new Date(orig.dateDecided) ? d : orig;
        const older = new Date(d.dateDecided) > new Date(orig.dateDecided) ? orig : d;

        if (!pairs.some(p => p.newerDecision.id === newer.id && p.olderDecision.id === older.id)) {
          pairs.push({
            newerDecision: newer,
            olderDecision: older,
            isResolved: false
          });
        }
      }
    }
  });
  return pairs;
}

// 6. Get Vendor Tracker
export async function getVendorTracker(): Promise<VendorTrackerResult> {
  try {
    const res = await fetch(`${BASE_URL}/decisions/vendor-tracker`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline. Using client-side simulation.");
  }

  // Client fallback (Simulated Date: 2026-07-08)
  const simulatedCurrent = new Date("2026-07-08");
  const vendorDecisions = clientDecisions.filter(d => d.department === "Procurement" || d.vendorCost !== undefined);
  const reviews: VendorReviewItem[] = [];
  let totalSpend = 0;

  vendorDecisions.forEach(d => {
    if (d.vendorCost) {
      totalSpend += d.vendorCost;
    }

    if (d.contractRenewalDate) {
      const renewal = new Date(d.contractRenewalDate);
      const diffTime = renewal.getTime() - simulatedCurrent.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let status = "Active";

      if (diffDays < 0) {
        status = "Overdue / Action Required";
      } else if (diffDays <= 30) {
        status = "Renewal Imminent (under 30 days)";
      } else if (diffDays <= 90) {
        status = "Renewal Approaching (under 90 days)";
      }

      reviews.push({
        decisionId: d.id,
        vendorName: d.title.replace("Select ", "").replace("Procure ", "").replace("Renew ", "").replace(" Contract", ""),
        cost: d.vendorCost || 0,
        renewalDate: d.contractRenewalDate,
        daysRemaining: diffDays,
        status
      });
    }
  });

  return {
    vendorsEvaluatedCount: vendorDecisions.length,
    totalAnnualSpend: totalSpend,
    upcomingReviews: reviews.sort((a, b) => a.daysRemaining - b.daysRemaining)
  };
}

// 7. Get Health Report
export async function getHealthReport(): Promise<DepartmentHealthReport> {
  try {
    const res = await fetch(`${BASE_URL}/decisions/health`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline. Using client-side simulation.");
  }

  // Client fallback
  const depts = ["Engineering", "Procurement", "HR", "Product", "Delivery", "Operations"];
  const scorecards: DepartmentScorecard[] = [];

  depts.forEach((dept, i) => {
    const deptDecs = clientDecisions.filter(d => d.department.toLowerCase() === dept.toLowerCase());
    if (deptDecs.length === 0) return;

    const fullCount = deptDecs.filter(d => d.alternativesConsidered.length > 0 && d.sources.length > 0).length;
    const pct = (fullCount / deptDecs.length) * 100;
    const contradictions = deptDecs.filter(d => d.contradictedBy !== null).length;

    let status = "Good";
    if (pct < 50 || contradictions > 1) status = "Critical";
    else if (pct < 75 || contradictions > 0) status = "At Risk";

    scorecards.push({
      departmentName: dept,
      decisionsCount: deptDecs.length,
      fullReasoningPercentage: Math.round(pct * 10) / 10,
      contradictionCount: contradictions,
      avgTimeToAnswerMs: 900 + (i * 45) + (nextRandomInt(-100, 150)),
      healthStatus: status
    });
  });

  const overall = scorecards.length > 0
    ? Math.round((scorecards.reduce((sum, s) => sum + s.fullReasoningPercentage, 0) / scorecards.length) * 10) / 10
    : 100;

  return {
    overallComplianceScore: overall,
    totalDecisionsCatalogued: clientDecisions.length,
    departmentScorecards: scorecards
  };
}

// 8. General AI Query
// 8. General AI Query
export function classifyIntent(query: string, seedVocabulary: Set<string>): { intent: number; message: string } {
  // Intent 4: Empty / gibberish
  if (!query || !query.trim()) {
    return {
      intent: 4,
      message: "I couldn't process that — try rephrasing your question."
    };
  }

  const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, "");
  const queryTokens = cleanQuery.split(' ').filter(t => t);

  if (queryTokens.length === 0) {
    return {
      intent: 4,
      message: "I couldn't process that — try rephrasing your question."
    };
  }

  const greetingKeywords = ["hello", "hi", "hey", "thanks", "thank", "ok", "test", "who", "are", "you", "good", "morning", "afternoon", "evening", "howdy"];

  if (queryTokens.length <= 2) {
    const isGreeting = queryTokens.some(t => greetingKeywords.includes(t));
    if (isGreeting) {
      return {
        intent: 1,
        message: "Hey! I'm your Decision Memory copilot. Ask me why a decision was made — e.g. 'Why did we choose microservices?' or 'Why did we drop dark mode?'"
      };
    } else {
      // Check direct match
      const directMatch = clientDecisions.some(d => 
        d.id.toLowerCase() === cleanQuery ||
        d.tags.map(t => t.toLowerCase()).includes(cleanQuery) ||
        d.title.toLowerCase().includes(cleanQuery)
      );
      if (!directMatch) {
        return {
          intent: 2,
          message: "Can you tell me a bit more? For example: 'Why did we choose Snowflake over Redshift?' or try one of the Popular Queries below."
        };
      }
    }
  } else {
    // Check overlap
    const overlapCount = queryTokens.filter(t => seedVocabulary.has(t)).length;
    if (overlapCount === 0) {
      return {
        intent: 2,
        message: "Can you tell me a bit more? For example: 'Why did we choose Snowflake over Redshift?' or try one of the Popular Queries below."
      };
    }
  }

  return {
    intent: 0,
    message: ""
  };
}

export async function askAI(query: string, roleFilter?: string): Promise<AIResponse> {
  try {
    const res = await fetch(`${BASE_URL}/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, roleFilter })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline. Using client-side simulation.");
  }

  // Client fallback with simulated AI latency
  await delay(800 + Math.random() * 700);

  // Build seed vocabulary
  const seedVocabulary = new Set<string>();
  clientDecisions.forEach(d => {
    const text = `${d.title} ${d.summary} ${d.tags.join(" ")} ${d.department}`.toLowerCase().replace(/[^\w\s]/g, "");
    text.split(' ').filter(t => t).forEach(token => seedVocabulary.add(token));
  });

  const classification = classifyIntent(query, seedVocabulary);
  if (classification.intent !== 0) {
    return {
      answer: classification.message,
      reasoning: [],
      stakeholders: [],
      dateDecided: "",
      sources: [],
      matchedDecisionId: null,
      isSuccess: classification.intent === 1 || classification.intent === 2,
      intent: classification.intent
    };
  }

  const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, "");
  const queryTokens = cleanQuery.split(' ').filter(t => t);

  // Scoped list
  let list = [...clientDecisions];
  if (roleFilter) {
    list = list.filter(d => d.relevantForRoles.map(r => r.toLowerCase()).includes(roleFilter.toLowerCase()));
  }

  const stopWords = ["why", "did", "we", "choose", "what", "is", "about", "the", "for", "to", "a", "an", "on", "of", "decision", "decisions"];
  let tokens = queryTokens.filter(t => !stopWords.includes(t));
  if (tokens.length === 0) tokens = queryTokens;

  let bestMatch: Decision | null = null;
  let bestScore = 0;

  list.forEach(d => {
    let score = 0;
    if (query.toLowerCase().includes(d.id.toLowerCase())) score += 100;

    tokens.forEach(token => {
      if (d.title.toLowerCase().includes(token)) score += 15;
      if (d.tags.map(t => t.toLowerCase()).includes(token)) score += 10;
      if (d.summary.toLowerCase().includes(token)) score += 5;
      if (d.alternativesConsidered.some(a => a.option.toLowerCase().includes(token) || a.rejectedBecause.toLowerCase().includes(token))) score += 3;
    });

    if (query.toLowerCase().includes("microservices") && d.id === "DEC-001") score += 200;
    if (query.toLowerCase().includes("dark mode") && d.id === "DEC-012") score += 200;
    if ((query.toLowerCase().includes("monorepo") || query.toLowerCase().includes("polyrepo")) && d.id === "DEC-014") score += 200;
    if ((query.toLowerCase().includes("remote") || query.toLowerCase().includes("wfh") || query.toLowerCase().includes("hybrid")) && d.id === "DEC-018") score += 200;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = d;
    }
  });

  if (bestMatch && bestScore > 0) {
    const reasoning: string[] = [bestMatch.summary];
    bestMatch.alternativesConsidered.forEach(alt => {
      reasoning.push(`Rejected Option: '${alt.option}' because: ${alt.rejectedBecause}.`);
    });

    let warningNotes = "";
    if (bestMatch.contradictedBy) {
      const succ = clientDecisions.find(s => s.id === bestMatch!.contradictedBy);
      if (succ) {
        warningNotes = ` [NOTE: This decision was superseded by a later policy or decision: '${succ.title}' (${succ.id}) on ${succ.dateDecided}]`;
      }
    }

    return {
      answer: `Grounded Answer from ${bestMatch.id}:${warningNotes} We decided to '${bestMatch.title}' on ${formatDateString(bestMatch.dateDecided)}. Key context: {${bestMatch.summary}}`,
      reasoning,
      stakeholders: bestMatch.stakeholders.map(s => `${s.name} (${s.role})`),
      dateDecided: bestMatch.dateDecided,
      sources: bestMatch.sources,
      matchedDecisionId: bestMatch.id,
      isSuccess: true,
      intent: 0
    };
  }

  return {
    answer: `I couldn't find a recorded decision about '${query}'. It may not have been captured yet — try 'microservices', 'dark mode', 'hybrid work', or 'monorepo', or use Manual Decision Capture (Screen 9) to log it now.`,
    reasoning: [],
    stakeholders: [],
    dateDecided: "",
    sources: [],
    matchedDecisionId: null,
    isSuccess: false,
    intent: 3
  };
}

// 9. Slack message simulation
export async function slackAI(text: string, roleContext?: string): Promise<SlackResponse> {
  try {
    const res = await fetch(`${BASE_URL}/ai/slack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, roleContext })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline. Using client-side simulation.");
  }

  // Client fallback
  const query = text.replace(/@DecisionMemory/gi, "").trim();
  const aiResponse = await askAI(query, roleContext);

  const attachments: any[] = [];
  if (aiResponse.isSuccess && aiResponse.reasoning.length > 0) {
    attachments.push({
      title: "Key Reasoning & Alternatives Considered",
      text: aiResponse.reasoning.map(r => `• ${r}`).join('\n'),
      color: "#3B5BFF"
    });
    if (aiResponse.sources.length > 0) {
      attachments.push({
        title: "Sources & Verifiable Audit Trail",
        text: aiResponse.sources.join(', '),
        color: "#1E2A5E"
      });
    }
    attachments.push({
      title: "Stakeholders Involved",
      text: aiResponse.stakeholders.join(' | '),
      color: "#718096"
    });
  }

  return {
    text: `*@DecisionMemory* Bot Response:\n{${aiResponse.answer}}`,
    attachments,
    username: "DecisionMemory",
    iconEmoji: ":brain:"
  };
}

// Internal helpers
function nextRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function formatDateString(dateStr: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}
