using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AI_Decision_Memory.Application;
using AI_Decision_Memory.Domain;

namespace AI_Decision_Memory.Infrastructure;

public class SimulatedDecisionAIService : ISimulatedDecisionAI
{
    private readonly IDecisionRepository _repository;
    private readonly Random _random = new();

    private static readonly HashSet<string> GreetingKeywords = new(StringComparer.OrdinalIgnoreCase)
    {
        "hello", "hi", "hey", "thanks", "thank", "ok", "test", "who", "are", "you", "good", "morning", "afternoon", "evening", "howdy"
    };

    public SimulatedDecisionAIService(IDecisionRepository repository)
    {
        _repository = repository;
    }

    public async Task<DecisionAIResponse> AskAsync(string query, string? roleFilter = null)
    {
        // 1. Simulate network/LLM latency (800ms to 1500ms)
        var delay = _random.Next(800, 1500);
        await Task.Delay(delay);

        // Intent 4: Genuinely broken/empty input
        if (string.IsNullOrWhiteSpace(query))
        {
            return new DecisionAIResponse
            {
                Answer = "I couldn't process that — try rephrasing your question.",
                IsSuccess = false,
                Intent = 4
            };
        }

        // Clean query to remove punctuation and retrieve tokens
        var cleanQuery = Regex.Replace(query.ToLower(), @"[^\w\s]", "");
        var queryTokens = cleanQuery.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToList();

        if (queryTokens.Count == 0)
        {
            return new DecisionAIResponse
            {
                Answer = "I couldn't process that — try rephrasing your question.",
                IsSuccess = false,
                Intent = 4
            };
        }

        // Load seed decisions
        var decisions = _repository.GetAll().ToList();

        // Build seed vocabulary
        var seedVocabulary = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var d in decisions)
        {
            var textToTokenize = $"{d.Title} {d.Summary} {string.Join(" ", d.Tags)} {d.Department}";
            var cleanText = Regex.Replace(textToTokenize.ToLower(), @"[^\w\s]", "");
            var tokens = cleanText.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            foreach (var t in tokens)
            {
                seedVocabulary.Add(t);
            }
        }

        // 2. Classify Intent
        int classifiedIntent = 0; // Default matches
        string customAnswer = string.Empty;

        // Word count <= 2
        if (queryTokens.Count <= 2)
        {
            bool isGreeting = queryTokens.Any(t => GreetingKeywords.Contains(t));
            if (isGreeting)
            {
                classifiedIntent = 1; // Greeting / Chitchat
                customAnswer = "Hey! I'm your Decision Memory copilot. Ask me why a decision was made — e.g. 'Why did we choose microservices?' or 'Why did we drop dark mode?'";
            }
            else
            {
                // Check if it matches any tag or title directly
                bool directMatch = decisions.Any(d => 
                    d.Id.Equals(cleanQuery, StringComparison.OrdinalIgnoreCase) ||
                    d.Tags.Any(tag => tag.Equals(cleanQuery, StringComparison.OrdinalIgnoreCase)) ||
                    d.Title.Contains(cleanQuery, StringComparison.OrdinalIgnoreCase)
                );
                
                if (!directMatch)
                {
                    classifiedIntent = 2; // Vague / too short
                    customAnswer = "Can you tell me a bit more? For example: 'Why did we choose Snowflake over Redshift?' or try one of the Popular Queries below.";
                }
            }
        }
        else // Word count >= 3
        {
            // Evaluate vocabulary overlap
            int overlapCount = queryTokens.Count(t => seedVocabulary.Contains(t));
            if (overlapCount == 0)
            {
                classifiedIntent = 2; // Vague / no matchable vocabulary
                customAnswer = "Can you tell me a bit more? For example: 'Why did we choose Snowflake over Redshift?' or try one of the Popular Queries below.";
            }
        }

        // Render response if Intent 1 or 2 is matched
        if (classifiedIntent == 1)
        {
            return new DecisionAIResponse
            {
                Answer = customAnswer,
                IsSuccess = true,
                Intent = 1
            };
        }
        if (classifiedIntent == 2)
        {
            return new DecisionAIResponse
            {
                Answer = customAnswer,
                IsSuccess = true,
                Intent = 2
            };
        }

        // Apply role filter scoping if provided
        if (!string.IsNullOrEmpty(roleFilter))
        {
            decisions = decisions.Where(d => 
                d.RelevantForRoles.Any(r => r.Equals(roleFilter, StringComparison.OrdinalIgnoreCase))).ToList();
        }

        // 3. Search and scoring for Matchable queries
        var stopWords = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "why", "did", "we", "choose", "what", "is", "about", "the", "for", "to", "a", "an", "on", "of", "with", "how", "decision", "decisions"
        };
        var searchTokens = queryTokens.Where(t => !stopWords.Contains(t)).ToList();
        if (searchTokens.Count == 0) searchTokens = queryTokens;

        Decision? bestMatch = null;
        int bestScore = 0;

        foreach (var decision in decisions)
        {
            int score = 0;

            if (query.Contains(decision.Id, StringComparison.OrdinalIgnoreCase))
            {
                score += 100;
            }

            foreach (var token in searchTokens)
            {
                if (decision.Title.Contains(token, StringComparison.OrdinalIgnoreCase))
                {
                    score += 15;
                }
                if (decision.Tags.Any(tag => tag.Equals(token, StringComparison.OrdinalIgnoreCase)))
                {
                    score += 10;
                }
                if (decision.Summary.Contains(token, StringComparison.OrdinalIgnoreCase))
                {
                    score += 5;
                }
                if (decision.AlternativesConsidered.Any(alt => 
                    alt.Option.Contains(token, StringComparison.OrdinalIgnoreCase) || 
                    alt.RejectedBecause.Contains(token, StringComparison.OrdinalIgnoreCase)))
                {
                    score += 3;
                }
            }

            // Flagship Demo Overrides
            if (query.Contains("microservices", StringComparison.OrdinalIgnoreCase) && decision.Id == "DEC-001") score += 200;
            if (query.Contains("dark mode", StringComparison.OrdinalIgnoreCase) && decision.Id == "DEC-012") score += 200;
            if ((query.Contains("monorepo", StringComparison.OrdinalIgnoreCase) || query.Contains("polyrepo", StringComparison.OrdinalIgnoreCase)) && decision.Id == "DEC-014") score += 200;
            if ((query.Contains("remote", StringComparison.OrdinalIgnoreCase) || query.Contains("wfh", StringComparison.OrdinalIgnoreCase) || query.Contains("hybrid", StringComparison.OrdinalIgnoreCase)) && decision.Id == "DEC-018") score += 200;

            if (score > bestScore)
            {
                bestScore = score;
                bestMatch = decision;
            }
        }

        // Match found (Intent 0)
        if (bestMatch != null && bestScore > 0)
        {
            var reasoning = new List<string> { bestMatch.Summary };
            foreach (var alt in bestMatch.AlternativesConsidered)
            {
                reasoning.Add($"Rejected Option: '{alt.Option}' because: {alt.RejectedBecause}.");
            }

            string warningNotes = "";
            if (!string.IsNullOrEmpty(bestMatch.ContradictedBy))
            {
                var successor = decisions.FirstOrDefault(d => d.Id.Equals(bestMatch.ContradictedBy, StringComparison.OrdinalIgnoreCase));
                if (successor != null)
                {
                    warningNotes = $" [NOTE: This decision was superseded by a later policy or decision: '{successor.Title}' ({successor.Id}) on {successor.DateDecided:yyyy-MM-dd}]";
                }
            }

            return new DecisionAIResponse
            {
                Answer = $"Grounded Answer from {bestMatch.Id}:{warningNotes} We decided to '{bestMatch.Title}' on {bestMatch.DateDecided:MMMM d, yyyy}. Key context: {bestMatch.Summary}",
                Reasoning = reasoning,
                Stakeholders = bestMatch.Stakeholders.Select(s => $"{s.Name} ({s.Role})").ToList(),
                DateDecided = bestMatch.DateDecided.ToString("yyyy-MM-dd"),
                Sources = bestMatch.Sources,
                MatchedDecisionId = bestMatch.Id,
                IsSuccess = true,
                Intent = 0
            };
        }

        // Intent 3: Specific query, no match found in database
        return new DecisionAIResponse
        {
            Answer = $"I couldn't find a recorded decision about '{query}'. It may not have been captured yet — try 'microservices', 'dark mode', 'hybrid work', or 'monorepo', or use Manual Decision Capture (Screen 9) to log it now.",
            Reasoning = new List<string>(),
            Stakeholders = new List<string>(),
            DateDecided = string.Empty,
            Sources = new List<string>(),
            MatchedDecisionId = null,
            IsSuccess = false,
            Intent = 3
        };
    }
}
