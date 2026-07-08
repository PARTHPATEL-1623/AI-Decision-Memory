using System.Collections.Generic;
using AI_Decision_Memory.Domain;

namespace AI_Decision_Memory.Application;

public interface IDecisionRepository
{
    IEnumerable<Decision> GetAll();
    Decision? GetById(string id);
    void Add(Decision decision);
    void Update(Decision decision);
}
