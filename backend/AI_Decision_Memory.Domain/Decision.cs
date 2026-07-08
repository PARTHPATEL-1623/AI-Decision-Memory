using System;
using System.Collections.Generic;

namespace AI_Decision_Memory.Domain;

public class Decision
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime DateDecided { get; set; }
    public string Summary { get; set; } = string.Empty;
    public List<Alternative> AlternativesConsidered { get; set; } = new();
    public List<Stakeholder> Stakeholders { get; set; } = new();
    public List<string> Sources { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public string? ContradictedBy { get; set; }
    public List<string> RelevantForRoles { get; set; } = new();
    
    // Optional vendor procurement details
    public decimal? VendorCost { get; set; }
    public DateTime? ContractRenewalDate { get; set; }

    // Graph visualizer additions
    public List<LinkedEntity> LinkedEntities { get; set; } = new();

    // Traceability timeline additions
    public List<LifecycleEvent> LifecycleEvents { get; set; } = new();
}
