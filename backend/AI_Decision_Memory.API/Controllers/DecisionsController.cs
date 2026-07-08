using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using AI_Decision_Memory.Application;
using AI_Decision_Memory.Domain;

namespace AI_Decision_Memory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DecisionsController : ControllerBase
{
    private readonly IDecisionRepository _repository;

    public DecisionsController(IDecisionRepository repository)
    {
        _repository = repository;
    }

    // 1. Get all decisions (with filters)
    [HttpGet]
    public ActionResult<IEnumerable<Decision>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? department,
        [FromQuery] string? tag,
        [FromQuery] string? stakeholder,
        [FromQuery] string? role)
    {
        var decisions = _repository.GetAll();

        if (!string.IsNullOrEmpty(search))
        {
            decisions = decisions.Where(d => 
                d.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                d.Summary.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                d.Id.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(department))
        {
            decisions = decisions.Where(d => d.Department.Equals(department, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(tag))
        {
            decisions = decisions.Where(d => d.Tags.Any(t => t.Equals(tag, StringComparison.OrdinalIgnoreCase)));
        }

        if (!string.IsNullOrEmpty(stakeholder))
        {
            decisions = decisions.Where(d => d.Stakeholders.Any(s => s.Name.Contains(stakeholder, StringComparison.OrdinalIgnoreCase)));
        }

        if (!string.IsNullOrEmpty(role))
        {
            decisions = decisions.Where(d => d.RelevantForRoles.Any(r => r.Equals(role, StringComparison.OrdinalIgnoreCase)));
        }

        return Ok(decisions.OrderByDescending(d => d.DateDecided));
    }

    // 2. Get single decision by ID
    [HttpGet("{id}")]
    public ActionResult<Decision> GetById(string id)
    {
        var decision = _repository.GetById(id);
        if (decision == null)
        {
            return NotFound(new { message = $"Decision with ID {id} not found." });
        }
        return Ok(decision);
    }

    // 3. Create a decision manually
    [HttpPost]
    public ActionResult<Decision> Create([FromBody] Decision decision)
    {
        if (string.IsNullOrEmpty(decision.Title) || string.IsNullOrEmpty(decision.Summary))
        {
            return BadRequest(new { message = "Title and Summary are required." });
        }

        decision.DateDecided = decision.DateDecided == default ? DateTime.UtcNow : decision.DateDecided;
        decision.AlternativesConsidered ??= new List<Alternative>();
        decision.Stakeholders ??= new List<Stakeholder>();
        decision.Sources ??= new List<string>();
        decision.Tags ??= new List<string>();
        decision.RelevantForRoles ??= new List<string>();

        _repository.Add(decision);

        return CreatedAtAction(nameof(GetById), new { id = decision.Id }, decision);
    }

    // 4. Suggest tags and department based on description (AI assist helper)
    [HttpPost("suggest")]
    public ActionResult<SuggestionResponse> Suggest([FromBody] SuggestionRequest request)
    {
        if (string.IsNullOrEmpty(request.Description))
        {
            return BadRequest(new { message = "Description is required." });
        }

        var text = request.Description.ToLower();
        string department = "Engineering";
        var tags = new List<string>();
        var relevantRoles = new List<string>();

        if (text.Contains("cost") || text.Contains("procure") || text.Contains("vendor") || text.Contains("license") || text.Contains("contract") || text.Contains("buy") || text.Contains("purchase"))
        {
            department = "Procurement";
            tags.AddRange(new[] { "procurement", "vendor", "finance" });
            relevantRoles.AddRange(new[] { "Procurement Specialist", "Manager" });
        }
        else if (text.Contains("hire") || text.Contains("leave") || text.Contains("vacation") || text.Contains("pto") || text.Contains("remote") || text.Contains("wfh") || text.Contains("office") || text.Contains("hybrid") || text.Contains("policy"))
        {
            department = "HR";
            tags.AddRange(new[] { "policy", "culture", "benefits" });
            relevantRoles.AddRange(new[] { "New Hire", "Manager", "HR Team" });
        }
        else if (text.Contains("feature") || text.Contains("dark mode") || text.Contains("ui") || text.Contains("ux") || text.Contains("design") || text.Contains("user experience") || text.Contains("product"))
        {
            department = "Product";
            tags.AddRange(new[] { "product", "frontend", "ui-ux" });
            relevantRoles.AddRange(new[] { "Frontend Engineer", "Product Manager", "UI/UX Designer" });
        }
        else if (text.Contains("sprint") || text.Contains("mvp") || text.Contains("scope") || text.Contains("delay") || text.Contains("launch") || text.Contains("timeline"))
        {
            department = "Delivery";
            tags.AddRange(new[] { "delivery", "roadmap", "mvp" });
            relevantRoles.AddRange(new[] { "Product Manager", "Manager" });
        }
        else
        {
            // Default Engineering tags
            tags.AddRange(new[] { "architecture", "infrastructure" });
            relevantRoles.AddRange(new[] { "Backend Engineer", "Platform Team" });
        }

        // Standard tags matching terms
        if (text.Contains("database") || text.Contains("postgres") || text.Contains("sql")) tags.Add("database");
        if (text.Contains("microservices") || text.Contains("monolith")) tags.Add("architecture");
        if (text.Contains("cloud") || text.Contains("aws") || text.Contains("docker")) tags.Add("infrastructure");
        if (text.Contains("test") || text.Contains("cypress") || text.Contains("qa")) tags.Add("testing");

        return Ok(new SuggestionResponse
        {
            Department = department,
            Tags = tags.Distinct().ToList(),
            RelevantForRoles = relevantRoles.Distinct().ToList()
        });
    }

    // 5. Get contradiction and policy drift feed
    [HttpGet("contradictions")]
    public ActionResult<IEnumerable<ContradictionPair>> GetContradictions()
    {
        var decisions = _repository.GetAll().ToList();
        var pairs = new List<ContradictionPair>();

        foreach (var decision in decisions)
        {
            if (!string.IsNullOrEmpty(decision.ContradictedBy))
            {
                var original = decisions.FirstOrDefault(d => d.Id.Equals(decision.ContradictedBy, StringComparison.OrdinalIgnoreCase));
                if (original != null)
                {
                    // Map the pair (Note: decision is the newer one reversing the older 'original' one)
                    // We want to avoid duplicates, let's keep it sorted by date
                    var newer = decision.DateDecided > original.DateDecided ? decision : original;
                    var older = decision.DateDecided > original.DateDecided ? original : decision;

                    if (!pairs.Any(p => p.NewerDecision.Id == newer.Id && p.OlderDecision.Id == older.Id))
                    {
                        pairs.Add(new ContradictionPair
                        {
                            NewerDecision = newer,
                            OlderDecision = older,
                            IsResolved = false // Default status
                        });
                    }
                }
            }
        }

        return Ok(pairs);
    }

    // 6. Vendor & Procurement Tracker Endpoint
    [HttpGet("vendor-tracker")]
    public ActionResult<VendorTrackerResult> GetVendorTracker()
    {
        var decisions = _repository.GetAll()
            .Where(d => d.Department.Equals("Procurement", StringComparison.OrdinalIgnoreCase) || d.VendorCost.HasValue)
            .ToList();

        var upcomingReviews = new List<VendorReviewItem>();
        var totalSpend = 0m;

        // Current date in system context: 2026-07-08
        var simulatedCurrentDate = new DateTime(2026, 7, 8);

        foreach (var d in decisions)
        {
            if (d.VendorCost.HasValue)
            {
                totalSpend += d.VendorCost.Value;
            }

            if (d.ContractRenewalDate.HasValue)
            {
                var renewal = d.ContractRenewalDate.Value;
                var daysUntilRenewal = (renewal - simulatedCurrentDate).Days;
                string status = "Active";

                if (daysUntilRenewal < 0)
                {
                    status = "Overdue / Action Required";
                }
                else if (daysUntilRenewal <= 30)
                {
                    status = "Renewal Imminent (under 30 days)";
                }
                else if (daysUntilRenewal <= 90)
                {
                    status = "Renewal Approaching (under 90 days)";
                }

                upcomingReviews.Add(new VendorReviewItem
                {
                    DecisionId = d.Id,
                    VendorName = d.Title.Replace("Select ", "").Replace("Procure ", "").Replace("Renew ", "").Replace(" Contract", ""),
                    Cost = d.VendorCost ?? 0m,
                    RenewalDate = renewal,
                    DaysRemaining = daysUntilRenewal,
                    Status = status
                });
            }
        }

        return Ok(new VendorTrackerResult
        {
            VendorsEvaluatedCount = decisions.Count,
            TotalAnnualSpend = totalSpend,
            UpcomingReviews = upcomingReviews.OrderBy(u => u.DaysRemaining).ToList()
        });
    }

    // 7. Team / Department Decision Health Scorecard
    [HttpGet("health")]
    public ActionResult<DepartmentHealthReport> GetHealthReport()
    {
        var decisions = _repository.GetAll().ToList();
        var departments = new[] { "Engineering", "Procurement", "HR", "Product", "Delivery", "Operations" };
        var scorecards = new List<DepartmentScorecard>();

        foreach (var dept in departments)
        {
            var deptDecisions = decisions.Where(d => d.Department.Equals(dept, StringComparison.OrdinalIgnoreCase)).ToList();
            if (deptDecisions.Count == 0) continue;

            // Score details: Decision is fully documented if it has alternatives considered AND sources listed
            var fullReasoningCount = deptDecisions.Count(d => d.AlternativesConsidered.Count > 0 && d.Sources.Count > 0);
            var pctReasoning = (double)fullReasoningCount / deptDecisions.Count * 100;

            // Simple contradiction count per department
            var contradictions = deptDecisions.Count(d => !string.IsNullOrEmpty(d.ContradictedBy));

            // Documentation Health Traffic Light Status
            string status = "Good";
            if (pctReasoning < 50 || contradictions > 1) status = "Critical";
            else if (pctReasoning < 75 || contradictions > 0) status = "At Risk";

            scorecards.Add(new DepartmentScorecard
            {
                DepartmentName = dept,
                DecisionsCount = deptDecisions.Count,
                FullReasoningPercentage = Math.Round(pctReasoning, 1),
                ContradictionCount = contradictions,
                AvgTimeToAnswerMs = 950 + (new Random().Next(-150, 200)), // simulated metrics
                HealthStatus = status
            });
        }

        return Ok(new DepartmentHealthReport
        {
            OverallComplianceScore = Math.Round(scorecards.Average(s => s.FullReasoningPercentage), 1),
            TotalDecisionsCatalogued = decisions.Count,
            DepartmentScorecards = scorecards
        });
    }
}

// Request/Response models

public class SuggestionRequest
{
    public string Description { get; set; } = string.Empty;
}

public class SuggestionResponse
{
    public string Department { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public List<string> RelevantForRoles { get; set; } = new();
}

public class ContradictionPair
{
    public Decision NewerDecision { get; set; } = new();
    public Decision OlderDecision { get; set; } = new();
    public bool IsResolved { get; set; }
}

public class VendorReviewItem
{
    public string DecisionId { get; set; } = string.Empty;
    public string VendorName { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public DateTime RenewalDate { get; set; }
    public int DaysRemaining { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class VendorTrackerResult
{
    public int VendorsEvaluatedCount { get; set; }
    public decimal TotalAnnualSpend { get; set; }
    public List<VendorReviewItem> UpcomingReviews { get; set; } = new();
}

public class DepartmentScorecard
{
    public string DepartmentName { get; set; } = string.Empty;
    public int DecisionsCount { get; set; }
    public double FullReasoningPercentage { get; set; }
    public int ContradictionCount { get; set; }
    public int AvgTimeToAnswerMs { get; set; }
    public string HealthStatus { get; set; } = string.Empty; // Good, At Risk, Critical
}

public class DepartmentHealthReport
{
    public double OverallComplianceScore { get; set; }
    public int TotalDecisionsCatalogued { get; set; }
    public List<DepartmentScorecard> DepartmentScorecards { get; set; } = new();
}
