using System.Collections.Generic;
using System.Linq;
using AI_Decision_Memory.Application;
using AI_Decision_Memory.Domain;

namespace AI_Decision_Memory.Infrastructure;

public class InMemoryDecisionRepository : IDecisionRepository
{
    private readonly List<Decision> _decisions;
    private readonly object _lock = new();

    public InMemoryDecisionRepository()
    {
        _decisions = MockDataSeeder.SeedDecisions();
    }

    public IEnumerable<Decision> GetAll()
    {
        lock (_lock)
        {
            return _decisions.ToList();
        }
    }

    public Decision? GetById(string id)
    {
        lock (_lock)
        {
            return _decisions.FirstOrDefault(d => d.Id.Equals(id, System.StringComparison.OrdinalIgnoreCase));
        }
    }

    public void Add(Decision decision)
    {
        lock (_lock)
        {
            if (string.IsNullOrEmpty(decision.Id))
            {
                var nextIndex = _decisions.Count + 1;
                decision.Id = $"DEC-{nextIndex:D3}";
            }
            _decisions.Add(decision);
        }
    }

    public void Update(Decision decision)
    {
        lock (_lock)
        {
            var index = _decisions.FindIndex(d => d.Id.Equals(decision.Id, System.StringComparison.OrdinalIgnoreCase));
            if (index >= 0)
            {
                _decisions[index] = decision;
            }
        }
    }
}
