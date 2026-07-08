using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AI_Decision_Memory.Application;

namespace AI_Decision_Memory.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly ISimulatedDecisionAI _aiService;

    public AIController(ISimulatedDecisionAI aiService)
    {
        _aiService = aiService;
    }

    // 1. General AI Query
    [HttpPost("ask")]
    public async Task<ActionResult<DecisionAIResponse>> Ask([FromBody] AskRequest request)
    {
        if (string.IsNullOrEmpty(request.Query))
        {
            return BadRequest(new { message = "Query text is required." });
        }

        var response = await _aiService.AskAsync(request.Query, request.RoleFilter);
        return Ok(response);
    }

    // 2. Slack Integration Simulation
    [HttpPost("slack")]
    public async Task<ActionResult<SlackResponse>> SlackMessage([FromBody] SlackRequest request)
    {
        if (string.IsNullOrEmpty(request.Text))
        {
            return BadRequest(new { message = "Message text is required." });
        }

        // Clean user mention from message: e.g. "@DecisionMemory why did we..." -> "why did we..."
        var query = request.Text.Replace("@DecisionMemory", "").Replace("@decisionmemory", "").Trim();

        var aiResponse = await _aiService.AskAsync(query, request.RoleContext);

        // Build a formatted Slack thread payload
        var attachments = new List<SlackAttachment>();
        
        if (aiResponse.IsSuccess && aiResponse.Reasoning.Count > 0)
        {
            var reasoningBlock = string.Join("\n• ", aiResponse.Reasoning);
            attachments.Add(new SlackAttachment
            {
                Title = "Key Reasoning & Alternatives Considered",
                Text = "• " + reasoningBlock,
                Color = "#3B5BFF" // Electric Blue Accent
            });

            if (aiResponse.Sources.Count > 0)
            {
                attachments.Add(new SlackAttachment
                {
                    Title = "Sources & Verifiable Audit Trail",
                    Text = string.Join(", ", aiResponse.Sources),
                    Color = "#1E2A5E" // Navy
                });
            }

            attachments.Add(new SlackAttachment
            {
                Title = "Stakeholders Involved",
                Text = string.Join(" | ", aiResponse.Stakeholders),
                Color = "#718096"
            });
        }

        return Ok(new SlackResponse
        {
            Text = $"*@DecisionMemory* Bot Response:\n{aiResponse.Answer}",
            Attachments = attachments,
            Username = "DecisionMemory",
            IconEmoji = ":brain:"
        });
    }
}

public class AskRequest
{
    public string Query { get; set; } = string.Empty;
    public string? RoleFilter { get; set; }
}

public class SlackRequest
{
    public string User { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string? RoleContext { get; set; }
}

public class SlackAttachment
{
    public string Title { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

public class SlackResponse
{
    public string Text { get; set; } = string.Empty;
    public List<SlackAttachment> Attachments { get; set; } = new();
    public string Username { get; set; } = string.Empty;
    public string IconEmoji { get; set; } = string.Empty;
}
