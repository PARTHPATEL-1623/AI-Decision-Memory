import React, { useState } from 'react';
import { useStore } from '../store';
import { createDecision } from '../api';
import { Radio, Database, RefreshCw, Layers, CheckCircle2, AlertCircle, FileText, Share2, Sparkles, Terminal } from 'lucide-react';

const MOCK_TRANSCRIPT = `[10:14 AM] Aman Verma (CTO): "Okay, we need to finalize our CI/CD runner migration. Our current self-hosted Jenkins server is constantly going down, and DevOps is spending 15 hours a week maintaining the VM builds."

[10:15 AM] Kabir Bose (DevOps Lead): "Agreed. I investigated GitHub Actions hosted runners vs self-hosted runners. Hosted runners are 100% managed by GitHub, giving us zero VM maintenance overhead, though they cost slightly more."

[10:17 AM] Vikram Rao (VP of Engineering): "Our main concern is build security and secrets. If we move to GitHub Actions, we can integrate OIDC with AWS to avoid storing static AWS credentials in repository secrets. That is a massive security upgrade."

[10:19 AM] Aman Verma (CTO): "Excellent. Let's standardize on GitHub Actions hosted runners and retire the Jenkins VMs. Kabir, start the migration next week. Vikram, audit the OIDC roles. Let's document this decision. Source: Meeting Oct-14 CICD Review."`;

export const CaptureSimulator: React.FC = () => {
  const { connectedSources, toggleSource } = useStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [extractedDecision, setExtractedDecision] = useState<any | null>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setSimulationStep(1);
    setExtractedDecision(null);

    // Step 1: Scanning (800ms)
    await new Promise(r => setTimeout(r, 1000));
    setSimulationStep(2);

    // Step 2: Extracting Entities (1200ms)
    await new Promise(r => setTimeout(r, 1400));
    setSimulationStep(3);

    // Step 3: Auto-tagging & Department Assignment (1000ms)
    await new Promise(r => setTimeout(r, 1200));
    setSimulationStep(4);

    // Structure decision object
    const newDecision = {
      title: "Migrate Jenkins CI/CD to GitHub Actions",
      department: "Engineering",
      dateDecided: "2026-07-08",
      summary: "Decommissioned self-hosted Jenkins VMs in favor of GitHub Actions hosted runners to eliminate operational maintenance hours and leverage OIDC AWS authentication.",
      alternativesConsidered: [
        { option: "Self-Hosted GitLab Runners", rejectedBecause: "Requires maintaining a runner VM cluster, failing to solve the operational maintenance overhead bottleneck." }
      ],
      stakeholders: [
        { name: "Aman Verma", role: "CTO" },
        { name: "Kabir Bose", role: "DevOps Lead" },
        { name: "Vikram Rao", role: "VP of Engineering" }
      ],
      sources: ["Meeting: Oct-14 CICD Review", "Confluence: CI/CD Strategy RFC"],
      tags: ["devops", "ci-cd", "github", "infrastructure"],
      contradictedBy: null,
      relevantForRoles: ["DevOps Engineer", "Backend Engineer", "Platform Team"]
    };

    try {
      // Create and save to store/API
      const saved = await createDecision(newDecision);
      setExtractedDecision(saved);
    } catch (e) {
      // Fallback local save in case API fails
      setExtractedDecision({ ...newDecision, id: "DEC-023" });
    }

    setSimulationStep(5);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-8 animate-fade-in py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-dark font-serif">Capture & Ingestion Pipeline</h1>
        <p className="text-slate-400 text-sm">Demonstrates how raw data streams are parsed into decision memories automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Connected Sources Control Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 self-start">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-navy-dark text-base font-serif flex items-center gap-2">
              <Database className="w-5 h-5 text-electric" />
              Connected Knowledge Sources
            </h3>
            <p className="text-xs text-slate-400 mt-1">Select channels to scan for decisions.</p>
          </div>

          <div className="space-y-4">
            {connectedSources.map((src) => (
              <div key={src.name} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-700">{src.name}</div>
                  <div className="text-[10px] text-slate-400">Last Sync: {src.lastSync}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${src.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    {src.connected ? 'active' : 'paused'}
                  </span>
                  <input
                    type="checkbox"
                    checked={src.connected}
                    onChange={() => toggleSource(src.name)}
                    className="w-4 h-4 text-electric border-slate-300 focus:ring-electric rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle column: Live Transcript Box */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-navy-dark text-base font-serif flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Raw Input Transcript
            </h3>
            <span className="text-[10px] bg-electric/15 text-electric font-semibold uppercase px-2.5 py-1 rounded">Ingestion Demo</span>
          </div>

          {/* Transcript display */}
          <div className="relative border border-slate-100 rounded-xl p-4 bg-slate-900 text-slate-300 text-xs font-mono h-64 overflow-y-auto leading-relaxed shadow-inner">
            <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
              <Terminal className="w-3.5 h-3.5" />
              raw_logs_v1
            </div>

            {/* Ingestion Highlights during parsing */}
            <div className="space-y-3 pt-4">
              {simulationStep >= 2 ? (
                <>
                  <p><span className="text-slate-500">[10:14 AM]</span> <span className="text-electric font-bold bg-electric/10 px-1 rounded">Aman Verma (CTO):</span> "Okay, we need to finalize our CI/CD runner migration..."</p>
                  <p><span className="text-slate-500">[10:15 AM]</span> <span className="text-amber-400 font-bold bg-amber-400/10 px-1 rounded">Kabir Bose (DevOps Lead):</span> "Agreed. I investigated GitHub Actions hosted runners vs self-hosted..."</p>
                  <p><span className="text-slate-500">[10:17 AM]</span> <span className="text-emerald-400 font-bold bg-emerald-400/10 px-1 rounded">Vikram Rao (VP of Engineering):</span> "...OIDC with AWS to avoid storing static AWS credentials..."</p>
                  <p><span className="text-slate-500">[10:19 AM]</span> <span className="text-electric font-bold bg-electric/10 px-1 rounded">Aman Verma (CTO):</span> "...standardize on GitHub Actions hosted runners and retire Jenkins..."</p>
                </>
              ) : (
                MOCK_TRANSCRIPT.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              )}
            </div>
          </div>

          {/* Simulating Steps Console / Button */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-400">
              {isSimulating && (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-electric animate-spin" />
                  {simulationStep === 1 && "Connecting pipelines and scanning transcripts..."}
                  {simulationStep === 2 && "Parsing speech text & mapping entity links..."}
                  {simulationStep === 3 && "Evaluating choices & mapping alternatives considered..."}
                  {simulationStep === 4 && "Finalizing tags, roles & seeding record..."}
                </span>
              )}
              {!isSimulating && simulationStep === 5 && (
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Decision successfully mapped and structured!
                </span>
              )}
              {!isSimulating && simulationStep === 0 && (
                <span>Ready to execute parsing pipeline.</span>
              )}
            </div>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="px-6 py-3 rounded-xl bg-navy-dark hover:bg-navy-medium text-white font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:bg-slate-200"
            >
              <Sparkles className="w-4 h-4" />
              Simulate AI Ingestion
            </button>
          </div>
        </div>
      </div>

      {/* Render Extracted Structured Card */}
      {extractedDecision && (
        <div className="border border-slate-200 bg-white rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in">
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-electric text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                  {extractedDecision.id}
                </span>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {extractedDecision.department}
                </span>
              </div>
              <h3 className="text-xl font-bold font-serif text-navy-dark mt-1">
                {extractedDecision.title}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Parsed Just Now</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-bold text-slate-400">Structured Summary</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{extractedDecision.summary}</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-bold text-slate-400">Alternatives Filtered</h4>
                {extractedDecision.alternativesConsidered.map((alt: any, idx: number) => (
                  <div key={idx} className="bg-red-50/50 border border-red-50 p-3 rounded-lg text-xs">
                    <span className="font-bold text-red-800">Rejected Option: {alt.option}</span>
                    <p className="text-slate-500 mt-1">{alt.rejectedBecause}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-bold text-slate-400">Deciders / Stakeholders</h4>
                <div className="grid grid-cols-1 gap-2">
                  {extractedDecision.stakeholders.map((s: any, idx: number) => (
                    <div key={idx} className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg flex justify-between">
                      <span>{s.name}</span>
                      <span className="text-slate-400 font-normal">{s.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-bold text-slate-400">Auto-Generated Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {extractedDecision.tags.map((t: string) => (
                    <span key={t} className="bg-navy-dark/10 text-navy-dark font-medium text-[10px] px-2 py-0.5 rounded-full">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
