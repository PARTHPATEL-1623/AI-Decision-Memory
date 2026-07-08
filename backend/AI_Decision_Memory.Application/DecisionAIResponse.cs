using System.Collections.Generic;

namespace AI_Decision_Memory.Application;

public class DecisionAIResponse
{
    public string Answer { get; set; } = string.Empty;
    public List<string> Reasoning { get; set; } = new();
    public List<string> Stakeholders { get; set; } = new();
    public string DateDecided { get; set; } = string.Empty;
    public List<string> Sources { get; set; } = new();
    public string? MatchedDecisionId { get; set; }
    public bool IsSuccess { get; set; }
    public int Intent { get; set; } // 0 = Success, 1 = Greeting, 2 = Vague, 3 = NotFound, 4 = Error
}
