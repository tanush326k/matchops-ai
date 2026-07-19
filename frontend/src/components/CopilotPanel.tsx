import { API_BASE } from "../config/api";
import React, { useState, useCallback } from "react";
import { Send, Sparkles, AlertTriangle, ArrowRight, Brain, User, Database, ShieldAlert, Cpu } from "lucide-react";
import type { Role, Language, AIResponse } from "../types";
import { InsightCard } from "./ui/InsightCard";

interface CopilotPanelProps {
  role: Role;
  language: Language;
  selectedGate: string | null;
  accessibilityMode: boolean;
  onQueryProcessed: (response: AIResponse) => void;
  activeResponse: AIResponse | null;
}

export const CopilotPanel = React.memo<CopilotPanelProps>(({
  role,
  language,
  selectedGate,
  accessibilityMode,
  onQueryProcessed,
  activeResponse
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [showReasoning, setShowReasoning] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized quick suggestions based on role and accessibilityMode
  const suggestions = React.useMemo(() => {
    switch (role) {
      case "Fan":
        return [
          "Gate queue wait times",
          accessibilityMode ? "Accessible route to my block" : "Fastest route to seat Block 114",
          "Best route to Manhattan Metro",
          "Concession food wait times"
        ];
      case "Volunteer":
        return [
          "Current volunteer allocations",
          "Where are volunteers needed?",
          "Check Gate A traffic backlog",
          "Metro delay shuttle needs"
        ];
      case "Security":
        return [
          "List active security incidents",
          "Gate A turnstile failure impact",
          "Block 114 medical assist summary",
          "Reroute advice for medical block"
        ];
      case "Organizer":
        return [
          "Stadium operations summary",
          "Today's sustainability metrics",
          "Active incident dashboard summary",
          "Metro status and crowd overview"
        ];
      default:
        return [];
    }
  }, [role, accessibilityMode]);

  const getOrCreateSessionId = useCallback(() => {
    let sid = sessionStorage.getItem("matchops_session_id");
    if (!sid) {
      sid = "session_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      sessionStorage.setItem("matchops_session_id", sid);
    }
    return sid;
  }, []);

  const handleSend = useCallback(async (textToSend: string) => {
    if (!textToSend.trim()) return;
    setLoading(true);
    setLoadingPhase(0);
    setError(null);

    const interval = setInterval(() => {
      setLoadingPhase(p => (p < 4 ? p + 1 : p));
    }, 450);

    try {
      const response = await fetch(`${API_BASE}/api/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          role,
          language,
          gate_preference: selectedGate || undefined,
          accessibility_friendly: accessibilityMode,
          session_id: getOrCreateSessionId()
        })
      });
      if (response.ok) {
        const data = await response.json();
        onQueryProcessed(data);
      } else {
        setError("The MatchOps AI service is temporarily overloaded or rate limited. System is operating under local safety protocols. Please retry in a few seconds.");
      }
    } catch {
      setError("Network connection failure. Verify that your MatchOps API server is running on port 8000.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }, [role, language, selectedGate, accessibilityMode, getOrCreateSessionId, onQueryProcessed]);

  return (
    <div className="flex flex-col gap-6 h-full font-sans">
      {/* Input Console */}
      <div className="glass p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden glow-card">
        {/* Dynamic AI Status Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl shadow-sm shadow-blue-500/5">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wide text-white font-display">MatchOps Copilot</h3>
              <p className="text-[10px] text-slate-500 font-semibold font-mono uppercase tracking-wider">Grounding Pipeline v2</p>
            </div>
          </div>

          {/* Connected state */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
              {loading ? "Processing" : (activeResponse ? "Ready" : "Awaiting Analysis")}
            </span>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(query);
          }}
          className="flex gap-2.5 mb-5"
        >
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Ask the copilot... (e.g. "${suggestions[0] || ''}")`}
              className="w-full pl-4 pr-10 py-3.5 bg-slate-950 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/80 text-white text-xs placeholder-slate-600 transition-all font-medium font-sans"
              disabled={loading}
            />
            <span className="absolute right-3 text-slate-600 select-none pointer-events-none text-[10px] font-mono font-bold tracking-widest hidden sm:inline">⌘K</span>
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4.5 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:text-slate-700 rounded-2xl flex items-center justify-center transition-all text-white focus-ring cursor-pointer shadow-md shadow-blue-600/10 shrink-0"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* Suggestion tags */}
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(s);
                handleSend(s);
              }}
              className="text-[10.5px] px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-white/5 hover:border-blue-500/20 text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3.5 text-xs text-red-400 animate-fade-in shadow-lg">
          <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1 font-semibold">
            <span className="font-bold text-red-300 block font-display uppercase tracking-wider text-[10px]">Operations Copilot Error</span>
            <p className="text-red-300/80 leading-relaxed font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Skeleton Loading Panel */}
      {loading && (
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
          <div className="glass p-5 rounded-2xl border-l-4 border-l-blue-500 animate-pulse flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Multi-Stage Reasoning Pipeline</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${loadingPhase >= 0 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold" : "bg-white/5 text-slate-500"}`}>
                  {loadingPhase > 0 ? "✓" : "⚡"}
                </span>
                <span className={loadingPhase === 0 ? "text-blue-400 font-bold" : "text-slate-400"}>1. Multi-Intent Classifier</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${loadingPhase >= 1 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold" : "bg-white/5 text-slate-500"}`}>
                  {loadingPhase > 1 ? "✓" : (loadingPhase === 1 ? "⚡" : "•")}
                </span>
                <span className={loadingPhase === 1 ? "text-blue-400 font-bold" : "text-slate-400"}>2. Role Authorization & Guardrails</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${loadingPhase >= 2 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold" : "bg-white/5 text-slate-500"}`}>
                  {loadingPhase > 2 ? "✓" : (loadingPhase === 2 ? "⚡" : "•")}
                </span>
                <span className={loadingPhase === 2 ? "text-blue-400 font-bold" : "text-slate-400"}>3. Context Grounder (Live Telemetry)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${loadingPhase >= 3 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold" : "bg-white/5 text-slate-500"}`}>
                  {loadingPhase > 3 ? "✓" : (loadingPhase === 3 ? "⚡" : "•")}
                </span>
                <span className={loadingPhase === 3 ? "text-blue-400 font-bold" : "text-slate-400"}>4. Decision Planner Strategy</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${loadingPhase >= 4 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold" : "bg-white/5 text-slate-500"}`}>
                  {loadingPhase === 4 ? "⚡" : "•"}
                </span>
                <span className={loadingPhase === 4 ? "text-blue-400 font-bold" : "text-slate-400"}>5. Gemini AI Response Generation</span>
              </div>
            </div>
          </div>
          
          <div className="glass p-6 rounded-2xl flex flex-col gap-5 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-white/10 rounded w-1/4"></div>
              <div className="h-4 bg-white/10 rounded w-1/6"></div>
            </div>
            <div className="space-y-2.5">
              <div className="h-3 bg-white/10 rounded w-full"></div>
              <div className="h-3 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-1/2 mt-4"></div>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-3">
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="h-3 bg-white/10 rounded w-full"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Processing and Output */}
      {activeResponse && !loading && (
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
          
          {/* Timeline Analysis Accordion */}
          <div className="glass rounded-3xl p-5 border-l-4 border-l-blue-500 shadow-xl">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="w-full flex justify-between items-center text-xs font-bold text-blue-400 focus:outline-none cursor-pointer"
            >
              <span className="flex items-center gap-2 font-display text-xs">
                <Brain className="w-4 h-4" />
                Pipeline Reasoning Timeline
              </span>
              <span className="text-[9px] bg-blue-500/10 px-2.5 py-1.5 rounded-xl text-blue-300 border border-blue-500/20 font-mono tracking-widest">
                {showReasoning ? "COLLAPSE" : "EXPAND"}
              </span>
            </button>

            {showReasoning && (
              <div className="mt-5 flex flex-col gap-5 text-xs text-slate-300 relative pl-4 border-l border-white/10 ml-2.5 animate-fade-in font-semibold">
                
                {/* Detected Intent Badges */}
                {activeResponse.reasoning.detected_intents && activeResponse.reasoning.detected_intents.length > 0 && (
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block mb-2 font-mono">Detected Intent(s)</span>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {activeResponse.reasoning.detected_intents.map((int, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[9.5px] font-bold font-mono">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Databases Grounded */}
                {activeResponse.reasoning.context_sources && activeResponse.reasoning.context_sources.length > 0 && (
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block mb-2 font-mono">Telemetry Grounded</span>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {activeResponse.reasoning.context_sources.map((src, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[9.5px] font-bold font-mono">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rules Applied */}
                {activeResponse.reasoning.decision_rules && activeResponse.reasoning.decision_rules.length > 0 && (
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block mb-2 font-mono">Decision Planner Rules</span>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {activeResponse.reasoning.decision_rules.map((rule, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[9.5px] font-bold font-mono">
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence reason analysis */}
                {activeResponse.confidence_reason && (
                  <div className="border-t border-white/5 pt-3.5">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block mb-1.5 font-mono">Confidence Justification</span>
                    <p className="text-slate-300 leading-relaxed font-semibold">{activeResponse.confidence_reason}</p>
                  </div>
                )}

                {/* Standard Timeline sequence */}
                <div className="relative border-t border-white/5 pt-4 mt-1 flex flex-col gap-4">
                  {/* Intent Analysis */}
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0.5 bg-blue-600 p-0.5 rounded-lg"><Brain className="w-3.5 h-3.5 text-white" /></span>
                    <div className="font-extrabold text-white mb-1 font-display text-xs">1. Intent Classification</div>
                    <div className="text-slate-400 leading-relaxed font-medium">{activeResponse.reasoning.intent_analysis}</div>
                  </div>

                  {/* Role Detection */}
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0.5 bg-emerald-600 p-0.5 rounded-lg"><User className="w-3.5 h-3.5 text-white" /></span>
                    <div className="font-extrabold text-white mb-1 font-display text-xs">2. Role Scoping & Guardrails</div>
                    <div className="text-slate-400 leading-relaxed font-medium">{activeResponse.reasoning.role_detection}</div>
                  </div>

                  {/* Context Builder */}
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0.5 bg-purple-600 p-0.5 rounded-lg"><Database className="w-3.5 h-3.5 text-white" /></span>
                    <div className="font-extrabold text-white mb-1 font-display text-xs">3. Grounded Context Construction</div>
                    <div className="text-slate-400 leading-relaxed font-medium">{activeResponse.reasoning.context_builder}</div>
                  </div>

                  {/* Decision Planner */}
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0.5 bg-amber-600 p-0.5 rounded-lg"><ShieldAlert className="w-3.5 h-3.5 text-white" /></span>
                    <div className="font-extrabold text-white mb-1 font-display text-xs">4. Decision Planner Strategy</div>
                    <div className="text-slate-400 leading-relaxed font-medium">{activeResponse.reasoning.decision_planner}</div>
                  </div>

                  {/* Grounded Prompt */}
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0.5 bg-cyan-600 p-0.5 rounded-lg"><Cpu className="w-3.5 h-3.5 text-white" /></span>
                    <div className="font-extrabold text-white mb-1 font-display text-xs">5. Grounded Prompt Construction</div>
                    <div className="text-slate-500 font-mono text-[9px] truncate max-w-sm">{activeResponse.reasoning.grounded_prompt}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Structured Output Cards */}
          <div className="glass p-6 rounded-3xl shadow-xl border-white/5 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <span className="self-start text-[9px] font-extrabold px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 uppercase tracking-widest font-mono">
                Copilot Recommendation
              </span>
              <div className="flex items-center gap-3.5">
                <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                  <span>Confidence:</span> 
                  <strong className="text-white font-mono">{(activeResponse.confidence * 100).toFixed(0)}%</strong>
                </div>
                <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono border ${
                  activeResponse.priority === "Critical" || activeResponse.priority === "High"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : activeResponse.priority === "Medium"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                  {activeResponse.priority}
                </span>
              </div>
            </div>

            {/* Warnings block */}
            {activeResponse.warnings.length > 0 && (
              <div className="p-4.5 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3.5">
                <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-red-300 uppercase tracking-wider font-display">Active Warning Signals</div>
                  <ul className="list-disc pl-4 mt-1.5 text-xs text-red-300/80 space-y-1.5 font-semibold leading-relaxed">
                    {activeResponse.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Missing Telemetry warnings */}
            {activeResponse.missing_information && activeResponse.missing_information.length > 0 && (
              <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start gap-2.5 text-xs text-yellow-400 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-yellow-500 animate-pulse" />
                <div>
                  <span>Feeds Offline (Estimates Used): </span>
                  <span className="text-slate-400 font-mono text-[9.5px] ml-1">{activeResponse.missing_information.join(", ")}</span>
                </div>
              </div>
            )}

            {/* Executive Summary */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Executive Summary</h4>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-bold">
                {activeResponse.summary}
              </p>
            </div>

            {/* Multi-Step Action Plan */}
            {activeResponse.multi_step_plan && (
              <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">
                  <Brain className="w-4 h-4 text-blue-400 animate-pulse" />
                  Chronological Multi-Step Action Plan
                </div>
                <div className="text-[11.5px] text-slate-300 space-y-3.5 font-semibold">
                  <div><strong className="text-white font-display text-xs">Problem:</strong> {activeResponse.multi_step_plan.problem}</div>
                  <div><strong className="text-white font-display text-xs">Assessment:</strong> {activeResponse.multi_step_plan.assessment}</div>
                  <div>
                    <strong className="text-white block mb-2 font-display text-xs">Recommended Actions Sequence:</strong>
                    <div className="flex flex-col gap-3 pl-3.5 border-l border-blue-500/20">
                      {activeResponse.multi_step_plan.recommended_actions.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <span className="w-5 h-5 shrink-0 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center text-[9.5px] font-bold font-mono">
                            {idx + 1}
                          </span>
                          <span className="text-slate-300 leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-3"><strong className="text-white font-display text-xs">Expected Impact:</strong> {activeResponse.multi_step_plan.expected_impact}</div>
                  <div><strong className="text-white font-display text-xs">Monitoring Advice:</strong> {activeResponse.multi_step_plan.monitoring_advice}</div>
                </div>
              </div>
            )}

            {/* Recommendation Cards */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">AI Actionable Recommendations</h4>
              <div className="flex flex-col gap-4">
                {activeResponse.recommendations.map((rec, idx) => (
                  <InsightCard
                    key={idx}
                    title={rec.action}
                    description={rec.detail}
                    priority={rec.priority as any}
                    confidence={rec.confidence_score ? Math.round(rec.confidence_score * 100) : Math.round(activeResponse.confidence * 100)}
                    reasoning={rec.supporting_data?.join(" | ") || rec.assumptions?.join(" | ")}
                    actionLabel={activeResponse.next_actions[idx] ? `Next: ${activeResponse.next_actions[idx]}` : undefined}
                    onActionClick={() => {}}
                  />
                ))}
              </div>
            </div>

            {/* Next Actions Summary Footer */}
            {activeResponse.next_actions.length > activeResponse.recommendations.length && (
              <div className="mt-2 pt-4.5 border-t border-white/5">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Additional Next Actions</h4>
                <div className="flex flex-col gap-3">
                  {activeResponse.next_actions.slice(activeResponse.recommendations.length).map((act, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer font-display">
                      <ArrowRight className="w-3.5 h-3.5" />
                      {act}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
