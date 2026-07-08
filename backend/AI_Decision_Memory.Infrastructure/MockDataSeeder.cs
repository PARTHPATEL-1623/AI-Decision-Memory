using System;
using System.Collections.Generic;
using AI_Decision_Memory.Domain;

namespace AI_Decision_Memory.Infrastructure;

public static class MockDataSeeder
{
    public static List<Decision> SeedDecisions()
    {
        var list = new List<Decision>
        {
            new()
            {
                Id = "DEC-001",
                Title = "Adopt Microservices Architecture for Order System",
                Department = "Engineering",
                DateDecided = new DateTime(2025, 3, 12),
                Summary = "Chose microservices over monolith to support independent scaling of order/payment modules.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Monolith", RejectedBecause = "Scaling bottleneck under peak load" },
                    new() { Option = "Serverless functions", RejectedBecause = "Cold-start latency unacceptable for checkout" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Riya Shah", Role = "Tech Lead" },
                    new() { Name = "Aman Verma", Role = "CTO" }
                },
                Sources = new List<string> { "Jira DECN-102", "Confluence: Architecture RFC v3", "Meeting: 12 Mar Design Review" },
                Tags = new List<string> { "architecture", "backend", "scalability" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Backend Engineer", "Payments Team", "Platform Team" }
            },
            new()
            {
                Id = "DEC-002",
                Title = "Standardize on PostgreSQL for Application Databases",
                Department = "Engineering",
                DateDecided = new DateTime(2025, 2, 14),
                Summary = "Selected PostgreSQL as the primary RDBMS instead of MySQL due to advanced JSONB indexing capabilities.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "MySQL", RejectedBecause = "Poorer performance on complex query nesting and dynamic JSON documents" },
                    new() { Option = "MongoDB", RejectedBecause = "ACID compliance and relation integrity are absolute requirements for core accounting" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Rohan Das", Role = "Principal DBA" },
                    new() { Name = "Aman Verma", Role = "CTO" }
                },
                Sources = new List<string> { "Confluence: Database Standardisation RFC", "Meeting: Tech Committee Minutes Feb-14" },
                Tags = new List<string> { "database", "infrastructure", "postgres" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Backend Engineer", "Database Administrator" }
            },
            new()
            {
                Id = "DEC-003",
                Title = "Adopt Monorepo for Frontend Portals",
                Department = "Engineering",
                DateDecided = new DateTime(2025, 1, 10),
                Summary = "Consolidated all 4 web portals into a single monorepo to simplify shared library dependency management.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Polyrepo (Individual Repos)", RejectedBecause = "Constant version mismatches and high package maintenance overhead" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Nisha Patel", Role = "Frontend Lead" },
                    new() { Name = "Vikram Rao", Role = "VP of Engineering" }
                },
                Sources = new List<string> { "Jira FE-402", "Confluence: Frontend Repository Strategy" },
                Tags = new List<string> { "frontend", "monorepo", "devops" },
                ContradictedBy = "DEC-014", // Contradicted/Superseded by DEC-014 later
                RelevantForRoles = new List<string> { "Frontend Engineer", "Platform Team" }
            },
            new()
            {
                Id = "DEC-004",
                Title = "Standardize on 25 Days Annual Paid Leave",
                Department = "HR",
                DateDecided = new DateTime(2025, 2, 1),
                Summary = "Aligned global benefits by instituting a baseline of 25 days paid vacation for all full-time employees.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Unlimited Paid Time Off (PTO)", RejectedBecause = "Leads to employees taking less leave on average, causing higher burnout rates" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Sonia Sen", Role = "HR Director" },
                    new() { Name = "Aman Verma", Role = "CTO" }
                },
                Sources = new List<string> { "Email from Sonia Sen: Benefits Update", "Confluence: Leave Policy Handbook" },
                Tags = new List<string> { "benefits", "policy", "culture" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "New Hire", "Manager" }
            },
            new()
            {
                Id = "DEC-005",
                Title = "Permit Unlimited Work-From-Home Policy",
                Department = "HR",
                DateDecided = new DateTime(2025, 4, 15),
                Summary = "Adopted a 100% remote-first configuration to support cross-border recruiting and reduce physical lease costs.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Hybrid (3 days in office)", RejectedBecause = "Restricts geographical talent pool and requires expensive long-term lease retention" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Sonia Sen", Role = "HR Director" },
                    new() { Name = "Aman Verma", Role = "CTO" }
                },
                Sources = new List<string> { "Confluence: Remote Work Policy", "Board Meeting Slides: Q1 Real Estate Optimization" },
                Tags = new List<string> { "wfh", "remote", "policy" },
                ContradictedBy = "DEC-018", // Contradicted by Hybrid return policy
                RelevantForRoles = new List<string> { "New Hire", "Manager" }
            },
            new()
            {
                Id = "DEC-006",
                Title = "Migrate Legacy Services to AWS ECS (Fargate)",
                Department = "Engineering",
                DateDecided = new DateTime(2025, 6, 20),
                Summary = "Moved core services from standalone EC2 VMs to AWS ECS with Fargate for containerization and automated scaling.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Kubernetes (EKS)", RejectedBecause = "High operational overhead and complexity, exceeding the bandwidth of our small DevOps squad" },
                    new() { Option = "EC2 Auto-scaling groups", RejectedBecause = "Slow scaling responses during traffic bursts; does not resolve containerization goals" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Kabir Bose", Role = "DevOps Lead" },
                    new() { Name = "Vikram Rao", Role = "VP of Engineering" }
                },
                Sources = new List<string> { "RFC 181: Container Deployment", "DevOps backlog item DEVOPS-990" },
                Tags = new List<string> { "cloud", "aws", "infrastructure", "devops" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "DevOps Engineer", "Backend Engineer", "Platform Team" }
            },
            new()
            {
                Id = "DEC-007",
                Title = "Implement Redis for Session and API Caching",
                Department = "Engineering",
                DateDecided = new DateTime(2025, 7, 15),
                Summary = "Introduced Redis cluster caching to decrease read load on PostgreSQL databases and optimize customer login speeds.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "In-memory Memcached", RejectedBecause = "Memcached lacks data persistence and fails to support high availability replication out-of-the-box" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Riya Shah", Role = "Tech Lead" },
                    new() { Name = "Rohan Das", Role = "Principal DBA" }
                },
                Sources = new List<string> { "Jira INFR-330", "Meeting: Cache Layer Design Review" },
                Tags = new List<string> { "caching", "database", "performance" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Backend Engineer", "Platform Team" }
            },
            new()
            {
                Id = "DEC-008",
                Title = "Select Snowflake as Data Warehousing Provider",
                Department = "Procurement",
                DateDecided = new DateTime(2025, 8, 1),
                Summary = "Contracted Snowflake for multi-cluster analytics warehousing due to separate storage/compute billing models.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Amazon Redshift", RejectedBecause = "Requires continuous cluster scaling, meaning compute costs pile up during idle storage periods" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Meera Nair", Role = "Head of Procurement" },
                    new() { Name = "Sanjay Kapoor", Role = "VP of Analytics" }
                },
                Sources = new List<string> { "Snowflake Master Services Agreement v1", "RFP Analysis: Enterprise Data Warehouse" },
                Tags = new List<string> { "procurement", "vendor", "analytics", "data-warehouse" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Data Analyst", "Data Engineer", "Procurement Specialist" },
                VendorCost = 120000m,
                ContractRenewalDate = new DateTime(2026, 8, 1) // Critical: Renewal is very close (August 1, 2026 vs current date July 2026)
            },
            new()
            {
                Id = "DEC-009",
                Title = "Renew GitHub Enterprise Contract",
                Department = "Procurement",
                DateDecided = new DateTime(2025, 5, 10),
                Summary = "Renewed GitHub Enterprise licensing for 250 seats to preserve existing repository codebases and action scripts.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "GitLab SaaS Migration", RejectedBecause = "Migration estimates exceeded 6 months of developer work and carried high training cost risks" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Meera Nair", Role = "Head of Procurement" },
                    new() { Name = "Vikram Rao", Role = "VP of Engineering" }
                },
                Sources = new List<string> { "GitHub Renewal Quotation #GH-99810", "Dev Tools Audit May 2025" },
                Tags = new List<string> { "procurement", "vendor", "developer-tools" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "DevOps Engineer", "Frontend Engineer", "Backend Engineer", "Procurement Specialist" },
                VendorCost = 45000m,
                ContractRenewalDate = new DateTime(2026, 5, 10) // Critical: Already Expired (May 2026 vs current date July 2026)
            },
            new()
            {
                Id = "DEC-010",
                Title = "Procure Auth0 for Identity Management",
                Department = "Procurement",
                DateDecided = new DateTime(2025, 10, 12),
                Summary = "Outsourced custom auth logic to Auth0 to expedite feature shipping and achieve immediate SOC2 authentication compliance.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "In-house OAuth Server", RejectedBecause = "Developing, testing, and securing custom OAuth, MFA, and SAML endpoints takes 4+ months of senior security engineering" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Meera Nair", Role = "Head of Procurement" },
                    new() { Name = "Aman Verma", Role = "CTO" }
                },
                Sources = new List<string> { "Auth0 Enterprise Subscription Agreement", "Security Architecture Review: Auth0 integration" },
                Tags = new List<string> { "procurement", "vendor", "security", "auth" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Backend Engineer", "Security Analyst", "Product Manager" },
                VendorCost = 35000m,
                ContractRenewalDate = new DateTime(2026, 10, 12) // Upcoming review in Oct 2026
            },
            new()
            {
                Id = "DEC-011",
                Title = "Reject Native Mobile App in favor of PWA",
                Department = "Product",
                DateDecided = new DateTime(2025, 11, 5),
                Summary = "Deferred React Native project and prioritised Progressive Web App (PWA) to cover both iOS/Android with one core team.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "React Native App", RejectedBecause = "Would require hiring two dedicated mobile developers and double QA overhead, extending time-to-market by 9 months" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Karan Johar", Role = "Product Director" },
                    new() { Name = "Nisha Patel", Role = "Frontend Lead" }
                },
                Sources = new List<string> { "Product Roadmap Strategy RFC", "Meeting: Mobile vs PWA Tradeoffs" },
                Tags = new List<string> { "product", "mobile", "frontend" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Frontend Engineer", "Product Manager", "UI/UX Designer" }
            },
            new()
            {
                Id = "DEC-012",
                Title = "Decline Dark Mode support in v2.0 Release",
                Department = "Product",
                DateDecided = new DateTime(2025, 12, 1),
                Summary = "Postponed Dark Mode UI development to v3.0, prioritizing performance enhancements and core user dashboard features.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Include Dark Mode", RejectedBecause = "Requires refactoring hardcoded color constants across 120 legacy files, delaying the release by 4 weeks" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Karan Johar", Role = "Product Director" },
                    new() { Name = "Nisha Patel", Role = "Frontend Lead" }
                },
                Sources = new List<string> { "Jira PRD-882", "Meeting: Scope Deficit Review" },
                Tags = new List<string> { "product", "ui-ux", "frontend" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Frontend Engineer", "Product Manager", "UI/UX Designer" }
            },
            new()
            {
                Id = "DEC-013",
                Title = "Reject Cryptocurrency Payment Integration",
                Department = "Product",
                DateDecided = new DateTime(2025, 9, 18),
                Summary = "Declined proposals to support Bitcoin/Ethereum checkout options due to severe accounting compliance and volatility risks.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Add Crypto Checkout", RejectedBecause = "Unstable transaction values, high network processing fees, and strict global tax auditing complications" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Karan Johar", Role = "Product Director" },
                    new() { Name = "Aman Verma", Role = "CTO" }
                },
                Sources = new List<string> { "Risk Assessment Report: Crypto Payments", "Legal Counsel Advisory Briefing" },
                Tags = new List<string> { "product", "payments", "compliance" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Payments Team", "Product Manager", "Backend Engineer" }
            },
            new()
            {
                Id = "DEC-014",
                Title = "Migrate Portals to Polyrepo Model",
                Department = "Engineering",
                DateDecided = new DateTime(2026, 5, 20),
                Summary = "Split frontend portals back into individual repositories because build times in the monorepo exceeded 45 minutes, throttling productivity.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Optimize Monorepo Tools", RejectedBecause = "Invested 3 weeks in Turborepo/Nx configurations, but legacy dependency graphs prevented successful cache caching" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Nisha Patel", Role = "Frontend Lead" },
                    new() { Name = "Kabir Bose", Role = "DevOps Lead" },
                    new() { Name = "Vikram Rao", Role = "VP of Engineering" }
                },
                Sources = new List<string> { "Jira FE-990", "Confluence: Polyrepo Migration Plan", "Post-Mortem: Monorepo Build Throttling" },
                Tags = new List<string> { "frontend", "monorepo", "devops" },
                ContradictedBy = "DEC-003", // Highlights reversal of DEC-003
                RelevantForRoles = new List<string> { "Frontend Engineer", "Platform Team", "DevOps Engineer" }
            },
            new()
            {
                Id = "DEC-015",
                Title = "Defer Loyalty Program Launch to Q4",
                Department = "Delivery",
                DateDecided = new DateTime(2025, 10, 20),
                Summary = "Pushed the launch date of customer loyalty tiers to Q4 to accommodate major compliance revisions in region EU-West.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Launch on Time (Q3)", RejectedBecause = "Risking €100k+ in potential regulatory non-compliance fines from un-audited ledger policies" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Arjun Mehta", Role = "Delivery Head" },
                    new() { Name = "Karan Johar", Role = "Product Director" }
                },
                Sources = new List<string> { "Delivery Risk Registry Q3", "Regulatory Audit Findings: Loyalty Rules" },
                Tags = new List<string> { "delivery", "loyalty", "compliance", "roadmap" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Product Manager", "Payments Team", "Manager" }
            },
            new()
            {
                Id = "DEC-016",
                Title = "Reduce MVP Scope: Remove Multi-Currency Support",
                Department = "Delivery",
                DateDecided = new DateTime(2025, 8, 15),
                Summary = "Excluded multi-currency processing from core checkout release to meet hard launching deadline of November 1st.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Delay Launch", RejectedBecause = "Missing black Friday and winter holiday commercial windows entirely" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Arjun Mehta", Role = "Delivery Head" },
                    new() { Name = "Aman Verma", Role = "CTO" }
                },
                Sources = new List<string> { "MVP Scope Agreement Document", "Steering Committee slides Aug-15" },
                Tags = new List<string> { "delivery", "mvp", "scope", "payments" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Payments Team", "Product Manager", "Backend Engineer" }
            },
            new()
            {
                Id = "DEC-017",
                Title = "Adopt Tailwind CSS for Design Framework",
                Department = "Engineering",
                DateDecided = new DateTime(2025, 1, 15),
                Summary = "Standardized all future frontend application styling on Tailwind CSS utility framework to replace custom SASS boilerplate.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Custom CSS Modules", RejectedBecause = "Design system drift across projects remains high, and developers spend hours writing bespoke responsive variables" },
                    new() { Option = "Bootstrap", RejectedBecause = "Visual style is highly restrictive and results in a dated, heavy boilerplate signature" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Nisha Patel", Role = "Frontend Lead" },
                    new() { Name = "UI/UX Designer", Role = "Lead Designer" }
                },
                Sources = new List<string> { "CSS Architecture Audit", "Frontend Team Meeting Jan-15" },
                Tags = new List<string> { "frontend", "css", "tailwind" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Frontend Engineer", "UI/UX Designer" }
            },
            new()
            {
                Id = "DEC-018",
                Title = "Mandate Hybrid Office Schedule (3 Days Weekly)",
                Department = "HR",
                DateDecided = new DateTime(2026, 2, 10),
                Summary = "Required all staff within 30 miles of headquarters to work from the office Tuesday through Thursday to rebuild team cohesion.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Retain 100% remote", RejectedBecause = "Cross-team communication velocity decreased significantly, and onboarding new junior hires became less efficient" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Sonia Sen", Role = "HR Director" },
                    new() { Name = "Aman Verma", Role = "CTO" }
                },
                Sources = new List<string> { "Executive Mandate Memo: Hybrid Work", "Employee Engagement Survey Analysis 2025" },
                Tags = new List<string> { "wfh", "hybrid", "policy", "culture" },
                ContradictedBy = "DEC-005", // Reverses WFH policy DEC-005
                RelevantForRoles = new List<string> { "New Hire", "Manager" }
            },
            new()
            {
                Id = "DEC-019",
                Title = "Standardize on Cypress for E2E Testing",
                Department = "Engineering",
                DateDecided = new DateTime(2025, 4, 28),
                Summary = "Adopted Cypress as the standard framework for automated end-to-end user path testing across portals.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Selenium WebDriver", RejectedBecause = "Slower execution speeds and high flake ratios due to complex browser driver configurations" },
                    new() { Option = "Playwright", RejectedBecause = "Cypress had better existing tooling knowledge in our QA squad at that specific time" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Nisha Patel", Role = "Frontend Lead" },
                    new() { Name = "Rajesh Gupta", Role = "QA Automation Lead" }
                },
                Sources = new List<string> { "QA Framework Comparison matrix", "E2E Setup guidelines doc" },
                Tags = new List<string> { "testing", "frontend", "qa" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Frontend Engineer", "QA Automation Engineer" }
            },
            new()
            {
                Id = "DEC-020",
                Title = "Outsource Level 1 Support to TechAssist Ltd",
                Department = "Operations",
                DateDecided = new DateTime(2025, 8, 12),
                Summary = "Outsourced general level 1 tier support ticketing to TechAssist to free internal engineers for core product feature tasks.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Hire In-House Support Team", RejectedBecause = "Requires recruiting overhead and 40% higher operational payroll than outsourced contract agencies" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Aditya Rao", Role = "VP of Operations" },
                    new() { Name = "Vikram Rao", Role = "VP of Engineering" }
                },
                Sources = new List<string> { "Operations SLA Agreement", "Level 1 Support outsourcing costing sheet" },
                Tags = new List<string> { "operations", "support", "outsourcing" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Manager", "Customer Success Representative" }
            },
            new()
            {
                Id = "DEC-021",
                Title = "Decline Salesforce CRM Migration",
                Department = "Operations",
                DateDecided = new DateTime(2025, 5, 30),
                Summary = "Chose to remain on HubSpot CRM for customer management instead of migrating to Salesforce for the next 18 months.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "Migrate to Salesforce Enterprise", RejectedBecause = "Implementation quoted at $250k initial onboarding and requires a dedicated Salesforce administrator, exceeding HubSpot utility metrics" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Aditya Rao", Role = "VP of Operations" },
                    new() { Name = "Meera Nair", Role = "Head of Procurement" }
                },
                Sources = new List<string> { "HubSpot vs Salesforce Assessment Report", "Procurement Committee Decision Brief" },
                Tags = new List<string> { "procurement", "crm", "operations" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "Procurement Specialist", "Sales Operations Lead" }
            },
            new()
            {
                Id = "DEC-022",
                Title = "Select Datadog for APM and Observability",
                Department = "Procurement",
                DateDecided = new DateTime(2025, 3, 1),
                Summary = "Procured Datadog APM and Log Management for real-time monitoring of Kubernetes and ECS containers.",
                AlternativesConsidered = new List<Alternative>
                {
                    new() { Option = "New Relic", RejectedBecause = "Datadog integrates better with our AWS ECS metadata pipelines and logs collection" },
                    new() { Option = "Prometheus/Grafana open-source hosting", RejectedBecause = "Self-hosting requires 1 full-time DevOps engineer's daily support, offsetting standard licensing costs" }
                },
                Stakeholders = new List<Stakeholder>
                {
                    new() { Name = "Kabir Bose", Role = "DevOps Lead" },
                    new() { Name = "Meera Nair", Role = "Head of Procurement" }
                },
                Sources = new List<string> { "Datadog Enterprise Quotation #DD-901", "Infrastructure Monitoring Review" },
                Tags = new List<string> { "procurement", "vendor", "monitoring", "devops" },
                ContradictedBy = null,
                RelevantForRoles = new List<string> { "DevOps Engineer", "Backend Engineer", "Procurement Specialist" },
                VendorCost = 85000m,
                ContractRenewalDate = new DateTime(2026, 3, 1) // Critical: Already Expired (March 2026 vs current date July 2026)
            }
        };

        foreach (var d in list)
        {
            // Add stakeholders to LinkedEntities
            foreach (var s in d.Stakeholders)
            {
                d.LinkedEntities.Add(new LinkedEntity { Type = "stakeholder", Name = s.Name });
            }

            // Add sources to LinkedEntities
            foreach (var src in d.Sources)
            {
                d.LinkedEntities.Add(new LinkedEntity { Type = "source", Name = src });
            }

            // Add systems/components based on tags & keywords
            string primarySystem = d.Department == "Procurement" ? "Finance System" : "Core Platform";
            if (d.Tags.Contains("monorepo") || d.Tags.Contains("polyrepo")) primarySystem = "Frontend Portals";
            else if (d.Tags.Contains("postgres") || d.Tags.Contains("database")) primarySystem = "Application Database";
            else if (d.Tags.Contains("microservices") || d.Tags.Contains("architecture")) primarySystem = "Order Service";
            else if (d.Tags.Contains("auth0") || d.Tags.Contains("security")) primarySystem = "Identity Provider";
            else if (d.Tags.Contains("snowflake") || d.Tags.Contains("analytics")) primarySystem = "Snowflake Warehouse";
            else if (d.Tags.Contains("wfh") || d.Tags.Contains("hybrid")) primarySystem = "HR Directory";
            else if (d.Tags.Contains("cypress") || d.Tags.Contains("testing")) primarySystem = "CI/CD Pipeline";

            d.LinkedEntities.Add(new LinkedEntity { Type = "system", Name = primarySystem });

            // Add contradiction link if applicable
            if (!string.IsNullOrEmpty(d.ContradictedBy))
            {
                d.LinkedEntities.Add(new LinkedEntity { Type = "contradiction", Name = d.ContradictedBy });
            }

            // Populate lifecycle events
            var owner = d.Stakeholders.FirstOrDefault()?.Name ?? "Aman Verma";
            var author2 = d.Stakeholders.LastOrDefault()?.Name ?? "Vikram Rao";

            d.LifecycleEvents.Add(new LifecycleEvent
            {
                Type = "trigger",
                Label = $"Initiated research: {d.Title}",
                Date = d.DateDecided.AddDays(-25).ToString("yyyy-MM-dd"),
                Author = owner,
                Priority = d.VendorCost.HasValue && d.VendorCost.Value > 50000 ? "High" : "Medium",
                Source = "Slack"
            });

            d.LifecycleEvents.Add(new LifecycleEvent
            {
                Type = "requirement",
                Label = $"Drafted proposal: {d.Title}",
                Date = d.DateDecided.AddDays(-15).ToString("yyyy-MM-dd"),
                Author = author2,
                Priority = "High",
                Source = "Confluence"
            });

            d.LifecycleEvents.Add(new LifecycleEvent
            {
                Type = "story",
                Label = $"Approved architecture review: {d.Id}",
                Date = d.DateDecided.ToString("yyyy-MM-dd"),
                Author = owner,
                Priority = "High",
                Source = "Meeting"
            });

            d.LifecycleEvents.Add(new LifecycleEvent
            {
                Type = "development",
                Label = $"Sprint kicked off for integration",
                Date = d.DateDecided.AddDays(5).ToString("yyyy-MM-dd"),
                Author = author2,
                Priority = "Medium",
                Source = "Jira"
            });

            d.LifecycleEvents.Add(new LifecycleEvent
            {
                Type = "ship",
                Label = $"Shipped and deployed to production",
                Date = d.DateDecided.AddDays(20).ToString("yyyy-MM-dd"),
                Author = owner,
                Priority = "Low",
                Source = "Jira"
            });
        }

        return list;
    }
}
