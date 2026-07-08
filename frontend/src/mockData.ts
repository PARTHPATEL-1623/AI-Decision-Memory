export interface Alternative {
  option: string;
  rejectedBecause: string;
}

export interface Stakeholder {
  name: string;
  role: string;
}

export interface LinkedEntity {
  type: string;
  name: string;
}

export interface LifecycleEvent {
  type: string;
  label: string;
  date: string;
  author: string;
  priority: string;
  source: string;
}

export interface Decision {
  id: string;
  title: string;
  department: string;
  dateDecided: string;
  summary: string;
  alternativesConsidered: Alternative[];
  stakeholders: Stakeholder[];
  sources: string[];
  tags: string[];
  contradictedBy: string | null;
  relevantForRoles: string[];
  vendorCost?: number | null;
  contractRenewalDate?: string | null;
  linkedEntities?: LinkedEntity[];
  lifecycleEvents?: LifecycleEvent[];
}

export const MOCK_DECISIONS: Decision[] = [
  {
    id: "DEC-001",
    title: "Adopt Microservices Architecture for Order System",
    department: "Engineering",
    dateDecided: "2025-03-12",
    summary: "Chose microservices over monolith to support independent scaling of order/payment modules.",
    alternativesConsidered: [
      { option: "Monolith", rejectedBecause: "Scaling bottleneck under peak load" },
      { option: "Serverless functions", rejectedBecause: "Cold-start latency unacceptable for checkout" }
    ],
    stakeholders: [
      { name: "Riya Shah", role: "Tech Lead" },
      { name: "Aman Verma", role: "CTO" }
    ],
    sources: ["Jira DECN-102", "Confluence: Architecture RFC v3", "Meeting: 12 Mar Design Review"],
    tags: ["architecture", "backend", "scalability"],
    contradictedBy: null,
    relevantForRoles: ["Backend Engineer", "Payments Team", "Platform Team"]
  },
  {
    id: "DEC-002",
    title: "Standardize on PostgreSQL for Application Databases",
    department: "Engineering",
    dateDecided: "2025-02-14",
    summary: "Selected PostgreSQL as the primary RDBMS instead of MySQL due to advanced JSONB indexing capabilities.",
    alternativesConsidered: [
      { option: "MySQL", rejectedBecause: "Poorer performance on complex query nesting and dynamic JSON documents" },
      { option: "MongoDB", rejectedBecause: "ACID compliance and relation integrity are absolute requirements for core accounting" }
    ],
    stakeholders: [
      { name: "Rohan Das", role: "Principal DBA" },
      { name: "Aman Verma", role: "CTO" }
    ],
    sources: ["Confluence: Database Standardisation RFC", "Meeting: Tech Committee Minutes Feb-14"],
    tags: ["database", "infrastructure", "postgres"],
    contradictedBy: null,
    relevantForRoles: ["Backend Engineer", "Database Administrator"]
  },
  {
    id: "DEC-003",
    title: "Adopt Monorepo for Frontend Portals",
    department: "Engineering",
    dateDecided: "2025-01-10",
    summary: "Consolidated all 4 web portals into a single monorepo to simplify shared library dependency management.",
    alternativesConsidered: [
      { option: "Polyrepo (Individual Repos)", rejectedBecause: "Constant version mismatches and high package maintenance overhead" }
    ],
    stakeholders: [
      { name: "Nisha Patel", role: "Frontend Lead" },
      { name: "Vikram Rao", role: "VP of Engineering" }
    ],
    sources: ["Jira FE-402", "Confluence: Frontend Repository Strategy"],
    tags: ["frontend", "monorepo", "devops"],
    contradictedBy: "DEC-014",
    relevantForRoles: ["Frontend Engineer", "Platform Team"]
  },
  {
    id: "DEC-004",
    title: "Standardize on 25 Days Annual Paid Leave",
    department: "HR",
    dateDecided: "2025-02-01",
    summary: "Aligned global benefits by instituting a baseline of 25 days paid vacation for all full-time employees.",
    alternativesConsidered: [
      { option: "Unlimited Paid Time Off (PTO)", rejectedBecause: "Leads to employees taking less leave on average, causing higher burnout rates" }
    ],
    stakeholders: [
      { name: "Sonia Sen", role: "HR Director" },
      { name: "Aman Verma", role: "CTO" }
    ],
    sources: ["Email from Sonia Sen: Benefits Update", "Confluence: Leave Policy Handbook"],
    tags: ["benefits", "policy", "culture"],
    contradictedBy: null,
    relevantForRoles: ["New Hire", "Manager"]
  },
  {
    id: "DEC-005",
    title: "Permit Unlimited Work-From-Home Policy",
    department: "HR",
    dateDecided: "2025-04-15",
    summary: "Adopted a 100% remote-first configuration to support cross-border recruiting and reduce physical lease costs.",
    alternativesConsidered: [
      { option: "Hybrid (3 days in office)", rejectedBecause: "Restricts geographical talent pool and requires expensive long-term lease retention" }
    ],
    stakeholders: [
      { name: "Sonia Sen", role: "HR Director" },
      { name: "Aman Verma", role: "CTO" }
    ],
    sources: ["Confluence: Remote Work Policy", "Board Meeting Slides: Q1 Real Estate Optimization"],
    tags: ["wfh", "remote", "policy"],
    contradictedBy: "DEC-018",
    relevantForRoles: ["New Hire", "Manager"]
  },
  {
    id: "DEC-006",
    title: "Migrate Legacy Services to AWS ECS (Fargate)",
    department: "Engineering",
    dateDecided: "2025-06-20",
    summary: "Moved core services from standalone EC2 VMs to AWS ECS with Fargate for containerization and automated scaling.",
    alternativesConsidered: [
      { option: "Kubernetes (EKS)", rejectedBecause: "High operational overhead and complexity, exceeding the bandwidth of our small DevOps squad" },
      { option: "EC2 Auto-scaling groups", rejectedBecause: "Slow scaling responses during traffic bursts; does not resolve containerization goals" }
    ],
    stakeholders: [
      { name: "Kabir Bose", role: "DevOps Lead" },
      { name: "Vikram Rao", role: "VP of Engineering" }
    ],
    sources: ["RFC 181: Container Deployment", "DevOps backlog item DEVOPS-990"],
    tags: ["cloud", "aws", "infrastructure", "devops"],
    contradictedBy: null,
    relevantForRoles: ["DevOps Engineer", "Backend Engineer", "Platform Team"]
  },
  {
    id: "DEC-007",
    title: "Implement Redis for Session and API Caching",
    department: "Engineering",
    dateDecided: "2025-07-15",
    summary: "Introduced Redis cluster caching to decrease read load on PostgreSQL databases and optimize customer login speeds.",
    alternativesConsidered: [
      { option: "In-memory Memcached", rejectedBecause: "Memcached lacks data persistence and fails to support high availability replication out-of-the-box" }
    ],
    stakeholders: [
      { name: "Riya Shah", role: "Tech Lead" },
      { name: "Rohan Das", role: "Principal DBA" }
    ],
    sources: ["Jira INFR-330", "Meeting: Cache Layer Design Review"],
    tags: ["caching", "database", "performance"],
    contradictedBy: null,
    relevantForRoles: ["Backend Engineer", "Platform Team"]
  },
  {
    id: "DEC-008",
    title: "Select Snowflake as Data Warehousing Provider",
    department: "Procurement",
    dateDecided: "2025-08-01",
    summary: "Contracted Snowflake for multi-cluster analytics warehousing due to separate storage/compute billing models.",
    alternativesConsidered: [
      { option: "Amazon Redshift", rejectedBecause: "Requires continuous cluster scaling, meaning compute costs pile up during idle storage periods" }
    ],
    stakeholders: [
      { name: "Meera Nair", role: "Head of Procurement" },
      { name: "Sanjay Kapoor", role: "VP of Analytics" }
    ],
    sources: ["Snowflake Master Services Agreement v1", "RFP Analysis: Enterprise Data Warehouse"],
    tags: ["procurement", "vendor", "analytics", "data-warehouse"],
    contradictedBy: null,
    relevantForRoles: ["Data Analyst", "Data Engineer", "Procurement Specialist"],
    vendorCost: 120000,
    contractRenewalDate: "2026-08-01"
  },
  {
    id: "DEC-009",
    title: "Renew GitHub Enterprise Contract",
    department: "Procurement",
    dateDecided: "2025-05-10",
    summary: "Renewed GitHub Enterprise licensing for 250 seats to preserve existing repository codebases and action scripts.",
    alternativesConsidered: [
      { option: "GitLab SaaS Migration", rejectedBecause: "Migration estimates exceeded 6 months of developer work and carried high training cost risks" }
    ],
    stakeholders: [
      { name: "Meera Nair", role: "Head of Procurement" },
      { name: "Vikram Rao", role: "VP of Engineering" }
    ],
    sources: ["GitHub Renewal Quotation #GH-99810", "Dev Tools Audit May 2025"],
    tags: ["procurement", "vendor", "developer-tools"],
    contradictedBy: null,
    relevantForRoles: ["DevOps Engineer", "Frontend Engineer", "Backend Engineer", "Procurement Specialist"],
    vendorCost: 45000,
    contractRenewalDate: "2026-05-10"
  },
  {
    id: "DEC-010",
    title: "Procure Auth0 for Identity Management",
    department: "Procurement",
    dateDecided: "2025-10-12",
    summary: "Outsourced custom auth logic to Auth0 to expedite feature shipping and achieve immediate SOC2 authentication compliance.",
    alternativesConsidered: [
      { option: "In-house OAuth Server", rejectedBecause: "Developing, testing, and securing custom OAuth, MFA, and SAML endpoints takes 4+ months of senior security engineering" }
    ],
    stakeholders: [
      { name: "Meera Nair", role: "Head of Procurement" },
      { name: "Aman Verma", role: "CTO" }
    ],
    sources: ["Auth0 Enterprise Subscription Agreement", "Security Architecture Review: Auth0 integration"],
    tags: ["procurement", "vendor", "security", "auth"],
    contradictedBy: null,
    relevantForRoles: ["Backend Engineer", "Security Analyst", "Product Manager"],
    vendorCost: 35000,
    contractRenewalDate: "2026-10-12"
  },
  {
    id: "DEC-011",
    title: "Reject Native Mobile App in favor of PWA",
    department: "Product",
    dateDecided: "2025-11-05",
    summary: "Deferred React Native project and prioritised Progressive Web App (PWA) to cover both iOS/Android with one core team.",
    alternativesConsidered: [
      { option: "React Native App", rejectedBecause: "Would require hiring two dedicated mobile developers and double QA overhead, extending time-to-market by 9 months" }
    ],
    stakeholders: [
      { name: "Karan Johar", role: "Product Director" },
      { name: "Nisha Patel", role: "Frontend Lead" }
    ],
    sources: ["Product Roadmap Strategy RFC", "Meeting: Mobile vs PWA Tradeoffs"],
    tags: ["product", "mobile", "frontend"],
    contradictedBy: null,
    relevantForRoles: ["Frontend Engineer", "Product Manager", "UI/UX Designer"]
  },
  {
    id: "DEC-012",
    title: "Decline Dark Mode support in v2.0 Release",
    department: "Product",
    dateDecided: "2025-12-01",
    summary: "Postponed Dark Mode UI development to v3.0, prioritizing performance enhancements and core user dashboard features.",
    alternativesConsidered: [
      { option: "Include Dark Mode", rejectedBecause: "Requires refactoring hardcoded color constants across 120 legacy files, delaying the release by 4 weeks" }
    ],
    stakeholders: [
      { name: "Karan Johar", role: "Product Director" },
      { name: "Nisha Patel", role: "Frontend Lead" }
    ],
    sources: ["Jira PRD-882", "Meeting: Scope Deficit Review"],
    tags: ["product", "ui-ux", "frontend"],
    contradictedBy: null,
    relevantForRoles: ["Frontend Engineer", "Product Manager", "UI/UX Designer"]
  },
  {
    id: "DEC-013",
    title: "Reject Cryptocurrency Payment Integration",
    department: "Product",
    dateDecided: "2025-09-18",
    summary: "Declined proposals to support Bitcoin/Ethereum checkout options due to severe accounting compliance and volatility risks.",
    alternativesConsidered: [
      { option: "Add Crypto Checkout", rejectedBecause: "Unstable transaction values, high network processing fees, and strict global tax auditing complications" }
    ],
    stakeholders: [
      { name: "Karan Johar", role: "Product Director" },
      { name: "Aman Verma", role: "CTO" }
    ],
    sources: ["Risk Assessment Report: Crypto Payments", "Legal Counsel Advisory Briefing"],
    tags: ["product", "payments", "compliance"],
    contradictedBy: null,
    relevantForRoles: ["Payments Team", "Product Manager", "Backend Engineer"]
  },
  {
    id: "DEC-014",
    title: "Migrate Portals to Polyrepo Model",
    department: "Engineering",
    dateDecided: "2026-05-20",
    summary: "Split frontend portals back into individual repositories because build times in the monorepo exceeded 45 minutes, throttling productivity.",
    alternativesConsidered: [
      { option: "Optimize Monorepo Tools", rejectedBecause: "Invested 3 weeks in Turborepo/Nx configurations, but legacy dependency graphs prevented successful cache caching" }
    ],
    stakeholders: [
      { name: "Nisha Patel", role: "Frontend Lead" },
      { name: "Kabir Bose", role: "DevOps Lead" },
      { name: "Vikram Rao", role: "VP of Engineering" }
    ],
    sources: ["Jira FE-990", "Confluence: Polyrepo Migration Plan", "Post-Mortem: Monorepo Build Throttling"],
    tags: ["frontend", "monorepo", "devops"],
    contradictedBy: "DEC-003",
    relevantForRoles: ["Frontend Engineer", "Platform Team", "DevOps Engineer"]
  },
  {
    id: "DEC-015",
    title: "Defer Loyalty Program Launch to Q4",
    department: "Delivery",
    dateDecided: "2025-10-20",
    summary: "Pushed the launch date of customer loyalty tiers to Q4 to accommodate major compliance revisions in region EU-West.",
    alternativesConsidered: [
      { option: "Launch on Time (Q3)", rejectedBecause: "Risking €100k+ in potential regulatory non-compliance fines from un-audited ledger policies" }
    ],
    stakeholders: [
      { name: "Arjun Mehta", role: "Delivery Head" },
      { name: "Karan Johar", role: "Product Director" }
    ],
    sources: ["Delivery Risk Registry Q3", "Regulatory Audit Findings: Loyalty Rules"],
    tags: ["delivery", "loyalty", "compliance", "roadmap"],
    contradictedBy: null,
    relevantForRoles: ["Product Manager", "Payments Team", "Manager"]
  },
  {
    id: "DEC-016",
    title: "Reduce MVP Scope: Remove Multi-Currency Support",
    department: "Delivery",
    dateDecided: "2025-08-15",
    summary: "Excluded multi-currency processing from core checkout release to meet hard launching deadline of November 1st.",
    alternativesConsidered: [
      { option: "Delay Launch", rejectedBecause: "Missing black Friday and winter holiday commercial windows entirely" }
    ],
    stakeholders: [
      { name: "Arjun Mehta", role: "Delivery Head" },
      { name: "Aman Verma", role: "CTO" }
    ],
    sources: ["MVP Scope Agreement Document", "Steering Committee slides Aug-15"],
    tags: ["delivery", "mvp", "scope", "payments"],
    contradictedBy: null,
    relevantForRoles: ["Payments Team", "Product Manager", "Backend Engineer"]
  },
  {
    id: "DEC-017",
    title: "Adopt Tailwind CSS for Design Framework",
    department: "Engineering",
    dateDecided: "2025-01-15",
    summary: "Standardized all future frontend application styling on Tailwind CSS utility framework to replace custom SASS boilerplate.",
    alternativesConsidered: [
      { option: "Custom CSS Modules", rejectedBecause: "Design system drift across projects remains high, and developers spend hours writing bespoke responsive variables" },
      { option: "Bootstrap", rejectedBecause: "Visual style is highly restrictive and results in a dated, heavy boilerplate signature" }
    ],
    stakeholders: [
      { name: "Nisha Patel", role: "Frontend Lead" },
      { name: "UI/UX Designer", role: "Lead Designer" }
    ],
    sources: ["CSS Architecture Audit", "Frontend Team Meeting Jan-15"],
    tags: ["frontend", "css", "tailwind"],
    contradictedBy: null,
    relevantForRoles: ["Frontend Engineer", "UI/UX Designer"]
  },
  {
    id: "DEC-018",
    title: "Mandate Hybrid Office Schedule (3 Days Weekly)",
    department: "HR",
    dateDecided: "2026-02-10",
    summary: "Required all staff within 30 miles of headquarters to work from the office Tuesday through Thursday to rebuild team cohesion.",
    alternativesConsidered: [
      { option: "Retain 100% remote", rejectedBecause: "Cross-team communication velocity decreased significantly, and onboarding new junior hires became less efficient" }
    ],
    stakeholders: [
      { name: "Sonia Sen", role: "HR Director" },
      { name: "Aman Verma", role: "CTO" }
    ],
    sources: ["Executive Mandate Memo: Hybrid Work", "Employee Engagement Survey Analysis 2025"],
    tags: ["wfh", "hybrid", "policy", "culture"],
    contradictedBy: "DEC-005",
    relevantForRoles: ["New Hire", "Manager"]
  },
  {
    id: "DEC-019",
    title: "Standardize on Cypress for E2E Testing",
    department: "Engineering",
    dateDecided: "2025-04-28",
    summary: "Adopted Cypress as the standard framework for automated end-to-end user path testing across portals.",
    alternativesConsidered: [
      { option: "Selenium WebDriver", rejectedBecause: "Slower execution speeds and high flake ratios due to complex browser driver configurations" },
      { option: "Playwright", rejectedBecause: "Cypress had better existing tooling knowledge in our QA squad at that specific time" }
    ],
    stakeholders: [
      { name: "Nisha Patel", role: "Frontend Lead" },
      { name: "Rajesh Gupta", role: "QA Automation Lead" }
    ],
    sources: ["QA Framework Comparison matrix", "E2E Setup guidelines doc"],
    tags: ["testing", "frontend", "qa"],
    contradictedBy: null,
    relevantForRoles: ["Frontend Engineer", "QA Automation Engineer"]
  },
  {
    id: "DEC-020",
    title: "Outsource Level 1 Support to TechAssist Ltd",
    department: "Operations",
    dateDecided: "2025-08-12",
    summary: "Outsourced general level 1 tier support ticketing to TechAssist to free internal engineers for core product feature tasks.",
    alternativesConsidered: [
      { option: "Hire In-House Support Team", rejectedBecause: "Requires recruiting overhead and 40% higher operational payroll than outsourced contract agencies" }
    ],
    stakeholders: [
      { name: "Aditya Rao", role: "VP of Operations" },
      { name: "Vikram Rao", role: "VP of Engineering" }
    ],
    sources: ["Operations SLA Agreement", "Level 1 Support outsourcing costing sheet"],
    tags: ["operations", "support", "outsourcing"],
    contradictedBy: null,
    relevantForRoles: ["Manager", "Customer Success Representative"]
  },
  {
    id: "DEC-021",
    title: "Decline Salesforce CRM Migration",
    department: "Operations",
    dateDecided: "2025-05-30",
    summary: "Chose to remain on HubSpot CRM for customer management instead of migrating to Salesforce for the next 18 months.",
    alternativesConsidered: [
      { option: "Migrate to Salesforce Enterprise", rejectedBecause: "Implementation quoted at $250k initial onboarding and requires a dedicated Salesforce administrator, exceeding HubSpot utility metrics" }
    ],
    stakeholders: [
      { name: "Aditya Rao", role: "VP of Operations" },
      { name: "Meera Nair", role: "Head of Procurement" }
    ],
    sources: ["HubSpot vs Salesforce Assessment Report", "Procurement Committee Decision Brief"],
    tags: ["procurement", "crm", "operations"],
    contradictedBy: null,
    relevantForRoles: ["Procurement Specialist", "Sales Operations Lead"]
  },
  {
    id: "DEC-022",
    title: "Select Datadog for APM and Observability",
    department: "Procurement",
    dateDecided: "2025-03-01",
    summary: "Procured Datadog APM and Log Management for real-time monitoring of Kubernetes and ECS containers.",
    alternativesConsidered: [
      { option: "New Relic", rejectedBecause: "Datadog integrates better with our AWS ECS metadata pipelines and logs collection" },
      { option: "Prometheus/Grafana open-source hosting", rejectedBecause: "Self-hosting requires 1 full-time DevOps engineer's daily support, offsetting standard licensing costs" }
    ],
    stakeholders: [
      { name: "Kabir Bose", role: "DevOps Lead" },
      { name: "Meera Nair", role: "Head of Procurement" }
    ],
    sources: ["Datadog Enterprise Quotation #DD-901", "Infrastructure Monitoring Review"],
    tags: ["procurement", "vendor", "monitoring", "devops"],
    contradictedBy: null,
    relevantForRoles: ["DevOps Engineer", "Backend Engineer", "Procurement Specialist"],
    vendorCost: 85000,
    contractRenewalDate: "2026-03-01"
  }
];

// Dynamically populate connected graph nodes and timeline events for frontend simulation consistency
MOCK_DECISIONS.forEach(d => {
  d.linkedEntities = [];
  d.lifecycleEvents = [];

  // Add stakeholders
  d.stakeholders.forEach(s => {
    d.linkedEntities.push({ type: 'stakeholder', name: s.name });
  });

  // Add sources
  d.sources.forEach(src => {
    d.linkedEntities.push({ type: 'source', name: src });
  });

  // Add system/component node based on tags and title keywords
  let primarySystem = d.department === "Procurement" ? "Finance System" : "Core Platform";
  if (d.tags.includes("monorepo") || d.tags.includes("polyrepo")) primarySystem = "Frontend Portals";
  else if (d.tags.includes("postgres") || d.tags.includes("database")) primarySystem = "Application Database";
  else if (d.tags.includes("microservices") || d.tags.includes("architecture")) primarySystem = "Order Service";
  else if (d.tags.includes("auth0") || d.tags.includes("security")) primarySystem = "Identity Provider";
  else if (d.tags.includes("snowflake") || d.tags.includes("analytics")) primarySystem = "Snowflake Warehouse";
  else if (d.tags.includes("wfh") || d.tags.includes("hybrid")) primarySystem = "HR Directory";
  else if (d.tags.includes("cypress") || d.tags.includes("testing")) primarySystem = "CI/CD Pipeline";

  d.linkedEntities.push({ type: 'system', name: primarySystem });

  if (d.contradictedBy) {
    d.linkedEntities.push({ type: 'contradiction', name: d.contradictedBy });
  }

  // Populate timeline events
  const owner = d.stakeholders[0]?.name || "Aman Verma";
  const author2 = d.stakeholders[1]?.name || d.stakeholders[0]?.name || "Vikram Rao";
  const decDate = new Date(d.dateDecided);

  const subtractDays = (date: Date, days: number) => {
    const res = new Date(date);
    res.setDate(res.getDate() - days);
    return res.toISOString().split('T')[0];
  };

  const addDays = (date: Date, days: number) => {
    const res = new Date(date);
    res.setDate(res.getDate() + days);
    return res.toISOString().split('T')[0];
  };

  d.lifecycleEvents.push(
    {
      type: "trigger",
      label: `Initiated research: ${d.title}`,
      date: subtractDays(decDate, 25),
      author: owner,
      priority: d.vendorCost && d.vendorCost > 50000 ? "High" : "Medium",
      source: "Slack"
    },
    {
      type: "requirement",
      label: `Drafted proposal: ${d.title}`,
      date: subtractDays(decDate, 15),
      author: author2,
      priority: "High",
      source: "Confluence"
    },
    {
      type: "story",
      label: `Approved architecture review: ${d.id}`,
      date: d.dateDecided,
      author: owner,
      priority: "High",
      source: "Meeting"
    },
    {
      type: "development",
      label: "Sprint kicked off for integration",
      date: addDays(decDate, 5),
      author: author2,
      priority: "Medium",
      source: "Jira"
    },
    {
      type: "ship",
      label: "Shipped and deployed to production",
      date: addDays(decDate, 20),
      author: owner,
      priority: "Low",
      source: "Jira"
    }
  );
});

