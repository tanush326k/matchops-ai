import React, { useState } from "react";
import { Send, Sparkles, AlertTriangle, CheckCircle, ArrowRight, Brain, User, Database, ShieldAlert, Cpu } from "lucide-react";
import type { Role, Language, AIResponse } from "../types";

interface CopilotPanelProps {
  role: Role;
  language: Language;
  selectedGate: string | null;
  accessibilityMode: boolean;
  onQueryProcessed: (response: AIResponse) => void;
  activeResponse: AIResponse | null;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  role,
  language,
  selectedGate,
  accessibilityMode,
  onQueryProcessed,
  activeResponse
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReasoning, setShowReasoning] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick suggestions based on role
  const getSuggestions = () => {
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
  };

  const getOrCreateSessionId = () => {
    let sid = sessionStorage.getItem("matchops_session_id");
    if (!sid) {
      sid = "session_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      sessionStorage.setItem("matchops_session_id", sid);
    }
    return sid;
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/copilot", {
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
    } catch (err) {
      setError("Network connection failure. Verify that your MatchOps API server is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Input Console */}
      <div className="glass p-6 rounded-2xl glow-card">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-blue-400 w-5 h-5 animate-pulse" />
          <h3 className="text-xl font-bold tracking-wide">MatchOps AI Copilot</h3>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(query);
          }}
          className="flex gap-2 mb-4"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask the copilot... (e.g. "${getSuggestions()[0]}")`}
            className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-white text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl flex items-center justify-center transition-colors text-white"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Send className="w-4 h-4" />}
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {getSuggestions().map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(s);
                handleSend(s);
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/5 hover:border-white/15 text-gray-300 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
          <AlertTriangle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-red-300 block mb-0.5">Operations Copilot Offline</span>
            {error}
          </div>
        </div>
      )}

      {/* Skeleton Loading Panel */}
      {loading && (
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
          <div className="glass p-5 rounded-2xl border-l-4 border-l-blue-500 animate-pulse flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-white/10 rounded w-1/3"></div>
              <div className="h-6 bg-white/10 rounded-full w-16"></div>
            </div>
            <div className="space-y-2 mt-2">
              <div className="h-3 bg-white/10 rounded w-full"></div>
              <div className="h-3 bg-white/10 rounded w-5/6"></div>
              <div className="h-3 bg-white/10 rounded w-2/3"></div>
            </div>
          </div>
          
          <div className="glass p-6 rounded-2xl glow-card flex flex-col gap-5 animate-pulse">
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
          <div className="glass rounded-2xl p-5 border-l-4 border-l-blue-500">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="w-full flex justify-between items-center text-sm font-semibold text-blue-400 focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Reasoning & Pipeline Telemetry
              </span>
              <span className="text-xs bg-blue-950 px-2.5 py-1 rounded-full text-blue-300 border border-blue-800">
                {showReasoning ? "Hide Steps" : "Show Steps"}
              </span>
            </button>

            {showReasoning && (
              <div className="mt-4 flex flex-col gap-4 text-xs text-gray-300 relative pl-4 border-l border-white/10 ml-2">
                
                {/* Detected Intent Badges */}
                {activeResponse.reasoning.detected_intents && activeResponse.reasoning.detected_intents.length > 0 && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Detected Intent(s)</span>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {activeResponse.reasoning.detected_intents.map((int, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 text-[9px] font-bold">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Databases Grounded */}
                {activeResponse.reasoning.context_sources && activeResponse.reasoning.context_sources.length > 0 && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Context Sources Accessed</span>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {activeResponse.reasoning.context_sources.map((src, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rules Applied */}
                {activeResponse.reasoning.decision_rules && activeResponse.reasoning.decision_rules.length > 0 && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Planner Rules Applied</span>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {activeResponse.reasoning.decision_rules.map((rule, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[9px] font-bold">
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence reason analysis */}
                {activeResponse.confidence_reason && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Confidence Scorer Analysis</span>
                    <p className="text-gray-300 leading-normal text-[11px] font-medium">{activeResponse.confidence_reason}</p>
                  </div>
                )}

                {/* Standard Timeline sequence */}
                <div className="relative border-t border-white/5 pt-3 mt-1 flex flex-col gap-3">
                  {/* Intent Analysis */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0 bg-blue-600 p-0.5 rounded-full"><Brain className="w-3 h-3 text-white" /></span>
                    <div className="font-semibold text-white">1. Intent Analysis</div>
                    <div className="text-gray-400 mt-0.5">{activeResponse.reasoning.intent_analysis}</div>
                  </div>

                  {/* Role Detection */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0 bg-emerald-600 p-0.5 rounded-full"><User className="w-3 h-3 text-white" /></span>
                    <div className="font-semibold text-white">2. Role Detection & Guardrails</div>
                    <div className="text-gray-400 mt-0.5">{activeResponse.reasoning.role_detection}</div>
                  </div>

                  {/* Context Builder */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0 bg-purple-600 p-0.5 rounded-full"><Database className="w-3 h-3 text-white" /></span>
                    <div className="font-semibold text-white">3. Grounded Context Construction</div>
                    <div className="text-gray-400 mt-0.5">{activeResponse.reasoning.context_builder}</div>
                  </div>

                  {/* Decision Planner */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0 bg-amber-600 p-0.5 rounded-full"><ShieldAlert className="w-3 h-3 text-white" /></span>
                    <div className="font-semibold text-white">4. Decision Planner & Safety Rules</div>
                    <div className="text-gray-400 mt-0.5">{activeResponse.reasoning.decision_planner}</div>
                  </div>

                  {/* Grounded Prompt */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0 bg-cyan-600 p-0.5 rounded-full"><Cpu className="w-3 h-3 text-white" /></span>
                    <div className="font-semibold text-white">5. Grounded Prompt Prompting</div>
                    <div className="text-gray-400 mt-0.5 font-mono text-[10px] truncate max-w-md">{activeResponse.reasoning.grounded_prompt}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Structured Output Cards */}
          <div className="glass p-6 rounded-2xl glow-card flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold px-3 py-1 rounded bg-blue-950 border border-blue-800 text-blue-400 uppercase tracking-wider">
                Copilot Decision Recommendation
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">Confidence: {(activeResponse.confidence * 100).toFixed(0)}%</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  activeResponse.priority === "Critical" || activeResponse.priority === "High"
                    ? "bg-red-950 text-red-400 border border-red-800"
                    : activeResponse.priority === "Medium"
                    ? "bg-amber-950 text-amber-400 border border-amber-800"
                    : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                }`}>
                  {activeResponse.priority}
                </span>
              </div>
            </div>

            {/* Warnings block */}
            {activeResponse.warnings.length > 0 && (
              <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-red-300">Active Warning Signals</div>
                  <ul className="list-disc pl-4 mt-1 text-xs text-red-200/80 space-y-1">
                    {activeResponse.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Missing Telemetry warnings */}
            {activeResponse.missing_information && activeResponse.missing_information.length > 0 && (
              <div className="p-3 bg-yellow-950/40 border border-yellow-900/50 rounded-xl flex items-start gap-2 text-xs text-yellow-400 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-yellow-500" />
                <div>
                  <span>Feeds Offline (Estimates Used): </span>
                  <span className="text-gray-300 font-mono text-[10.5px] ml-1">{activeResponse.missing_information.join(", ")}</span>
                </div>
              </div>
            )}

            {/* Executive Summary */}
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Executive Summary</h4>
              <p className="text-base text-gray-100 leading-relaxed font-semibold">
                {activeResponse.summary}
              </p>
            </div>

            {/* Multi-Step Action Plan */}
            {activeResponse.multi_step_plan && (
              <div className="p-4 bg-blue-950/20 border border-blue-900/40 rounded-xl flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-blue-400 animate-pulse" />
                  Chronological Multi-Step Action Plan
                </div>
                <div className="text-[11px] text-gray-300">
                  <div className="mb-2"><strong className="text-white">Problem:</strong> {activeResponse.multi_step_plan.problem}</div>
                  <div className="mb-2"><strong className="text-white">Assessment:</strong> {activeResponse.multi_step_plan.assessment}</div>
                  <div className="mb-2">
                    <strong className="text-white block mb-1">Recommended Actions Sequence:</strong>
                    <div className="flex flex-col gap-2 pl-2 border-l border-blue-500/40">
                      {activeResponse.multi_step_plan.recommended_actions.map((step, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="w-5 h-5 shrink-0 bg-blue-900 text-blue-300 border border-blue-800 rounded-full flex items-center justify-center text-[9px] font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-[11.5px] leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-1"><strong className="text-white">Expected Impact:</strong> {activeResponse.multi_step_plan.expected_impact}</div>
                  <div><strong className="text-white">Monitoring Advice:</strong> {activeResponse.multi_step_plan.monitoring_advice}</div>
                </div>
              </div>
            )}

            {/* Recommendation Cards */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">AI Actionable Recommendations</h4>
              <div className="flex flex-col gap-4">
                {activeResponse.recommendations.map((rec, idx) => {
                  const borderAccent = rec.priority === "High" 
                    ? "border-l-4 border-l-red-500" 
                    : (rec.priority === "Medium" ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-emerald-500");
                  
                  return (
                    <div 
                      key={idx} 
                      className={`p-4 bg-black/35 border border-white/5 rounded-r-xl ${borderAccent} hover:border-white/10 transition-colors flex flex-col gap-3`}
                    >
                      {/* Summary Title & Priority */}
                      <div className="flex justify-between items-start gap-3">
                        <h5 className="font-bold text-white text-sm flex items-center gap-1.5 leading-snug">
                          <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                          {rec.action}
                        </h5>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                          rec.priority === "High"
                            ? "bg-red-950/80 text-red-400 border border-red-900/30"
                            : rec.priority === "Medium"
                            ? "bg-amber-950/80 text-amber-400 border border-amber-900/30"
                            : "bg-emerald-950/80 text-emerald-400 border border-emerald-900/30"
                        }`}>
                          {rec.priority}
                        </span>
                      </div>

                      {/* Reasoning Analysis */}
                      <div className="text-[11px] text-gray-300 leading-relaxed bg-white/5 p-2.5 rounded-lg border border-white/5 flex flex-col gap-2">
                        <div>
                          <strong className="text-gray-400 block text-[9px] uppercase tracking-wider mb-0.5">Reasoning Analysis</strong>
                          {rec.detail}
                        </div>
                        
                        {/* Supporting Data */}
                        {rec.supporting_data && rec.supporting_data.length > 0 && (
                          <div className="border-t border-white/5 pt-1.5 mt-0.5">
                            <strong className="text-gray-400 block text-[9px] uppercase tracking-wider mb-0.5">Supporting Data</strong>
                            <ul className="list-disc pl-3 text-[10px] text-gray-300 space-y-0.5">
                              {rec.supporting_data.map((sd, i) => (
                                <li key={i}>{sd}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Assumptions */}
                        {rec.assumptions && rec.assumptions.length > 0 && (
                          <div className="border-t border-white/5 pt-1.5">
                            <strong className="text-gray-400 block text-[9px] uppercase tracking-wider mb-0.5">Operational Assumptions</strong>
                            <ul className="list-disc pl-3 text-[10px] text-gray-300 space-y-0.5">
                              {rec.assumptions.map((asm, i) => (
                                <li key={i}>{asm}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Suggested Actions */}
                        {rec.suggested_actions && rec.suggested_actions.length > 0 && (
                          <div className="border-t border-white/5 pt-1.5">
                            <strong className="text-gray-400 block text-[9px] uppercase tracking-wider mb-0.5">Suggested Action Checklist</strong>
                            <ul className="list-decimal pl-3 text-[10px] text-gray-300 space-y-0.5">
                              {rec.suggested_actions.map((act, i) => (
                                <li key={i}>{act}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Confidence & Next Step */}
                      <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-2 mt-1">
                        <span className="text-gray-400">
                          Confidence Index: <strong className="text-white">{(rec.confidence_score ? rec.confidence_score * 100 : activeResponse.confidence * 100).toFixed(0)}%</strong>
                        </span>
                        {activeResponse.next_actions[idx] && (
                          <span className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer">
                            Next Step: {activeResponse.next_actions[idx]}
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Actions Summary Footer */}
            {activeResponse.next_actions.length > activeResponse.recommendations.length && (
              <div className="mt-2 pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Additional Next Actions</h4>
                <div className="flex flex-col gap-2">
                  {activeResponse.next_actions.slice(activeResponse.recommendations.length).map((act, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">
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
};
