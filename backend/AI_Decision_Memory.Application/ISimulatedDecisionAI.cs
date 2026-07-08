using System.Threading.Tasks;

namespace AI_Decision_Memory.Application;

public interface ISimulatedDecisionAI
{
    Task<DecisionAIResponse> AskAsync(string query, string? roleFilter = null);
}
