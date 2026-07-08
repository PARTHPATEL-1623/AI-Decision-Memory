namespace AI_Decision_Memory.Domain;

public class LifecycleEvent
{
    public string Type { get; set; } = string.Empty; // trigger, requirement, story, development, implementation, ship
    public string Label { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty; // High, Medium, Low
    public string Source { get; set; } = string.Empty; // Email, Jira, Slack, Confluence, Meeting
}
