import React, { useState } from "react";
import { Zap, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";

interface GeminiInsight {
  id: string;
  timestamp: string;
  category: string;
  summary: string;
  reasoning: string;
  confidence: number;
  predicted_impact: string;
  priority: "Low" | "Medium" | "High" | "Critical";
}

interface GeminiOpsFeedProps {
  insights?: GeminiInsight[];
}

const FALLBACK_INSIGHTS: GeminiInsight[] = [
  {
    id: "g1",
    timestamp: "06:44:12",
    category: "Crowd Flow",
    summary: "Gate D queue will exceed capacity threshold in ~8 minutes based on ingress velocity.",
    reasoning: "Sensor data shows Gate D processed 340 entrants/min vs baseline 280. At this rate, the safe queue depth of 600 will be breached by 06:52.",
    confidence: 91,
    predicted_impact: "~1,200 fans affected · +6 min average wait",
    priority: "High",
  },
  {
    id: "g2",
    timestamp: "06:38:05",
    category: "Resource Optimisation",
    summary: "Zone A volunteer staffing is 28% above requirement. Recommend reallocation to Zone B.",
    reasoning: "Zone A crowd density has stabilised at 74% capacity. Zone B shows 91% crowd density with 3 fewer staff than the event threshold requires.",
    confidence: 87,
    predicted_impact: "Zone B wait time −4 min · Zero operational risk",
    priority: "Medium",
  },
  {
    id: "g3",
    timestamp: "06:30:18",
    category: "Transport",
    summary: "NJ Transit bus delay will increase parking lot congestion — pre-emptive signage advised.",
    reasoning: "Historical NJ Transit delay patterns indicate 22% of attendees will reroute via personal vehicles within 25 min of bus delays. Lot B is at 78% capacity.",
    confidence: 78,
    predicted_impact: "Lot B overflow risk · Recommend signage to Lot C",
    priority: "Medium",
  },
  {
    id: "g4",
    timestamp: "06:22:44",
    category: "Sustainability",
    summary: "Solar output at 34% offset. EV charging station load should be deferred until post-match.",
    reasoning: "Current solar generation is meeting 34% of stadium demand. EV charging adds 18 kWh load. Deferring until grid rates drop post-match saves ~$420.",
    confidence: 95,
    predicted_impact: "~$420 operational savings · Carbon neutral window extended",
    priority: "Low",
  },
];

const priorityStyle = {
  Critical: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", bar: "bg-rose-500" },
  High: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", bar: "bg-orange-500" },
  Medium: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", bar: "bg-amber-500" },
  Low: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-500" },
};

const InsightRow = React.memo<{ insight: GeminiInsight }>(({ insight }) => {
  const [expanded, setExpanded] = useState(false);
  const p = priorityStyle[insight.priority];

  return (
    <div className={`rounded-2xl border ${p.border} ${p.bg} overflow-hidden transition-all`}>
      <button
        className="w-full p-3 text-left flex items-start gap-3 cursor-pointer hover:brightness-110 transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Confidence Bar */}
        <div className="flex flex-col items-center gap-1 shrink-0 w-8">
          <span className={`text-[10px] font-black font-mono ${p.text}`}>{insight.confidence}%</span>
          <div className="w-1 h-10 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className={`absolute bottom-0 left-0 w-full ${p.bar} rounded-full transition-all`}
              style={{ height: `${insight.confidence}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[8px] font-bold uppercase tracking-widest font-mono ${p.text}`}>
              {insight.category}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[9px] text-slate-500 font-mono">{insight.timestamp}</span>
              {expanded ? (
                <ChevronUp className="w-3 h-3 text-slate-500" />
              ) : (
                <ChevronDown className="w-3 h-3 text-slate-500" />
              )}
            </div>
          </div>
          <p className="text-[11px] font-semibold text-slate-200 leading-snug">{insight.summary}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <TrendingUp className="w-3 h-3 text-slate-500" />
            <span className="text-[9px] text-slate-500 font-mono">{insight.predicted_impact}</span>
          </div>
        </div>
      </button>

      {/* Expanded Reasoning */}
      {expanded && (
        <div className="px-3 pb-3 animate-fade-in">
          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-white/5 text-[10px] text-slate-400 font-medium leading-relaxed">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600 font-mono block mb-1">Reasoning</span>
            {insight.reasoning}
          </div>
        </div>
      )}
    </div>
  );
});

export const GeminiOpsFeed = React.memo<GeminiOpsFeedProps>(({ insights }) => {
  const displayInsights = (insights && insights.length > 0) ? insights : FALLBACK_INSIGHTS;

  return (
    <div className="glass rounded-3xl border border-white/5 flex flex-col h-full glow-card">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-white font-display">Gemini Operations Feed</h3>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
              {displayInsights.length} AI insights · Live reasoning
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[9px] font-bold text-violet-400 font-mono">
          <Zap className="w-2.5 h-2.5 animate-pulse" />
          GEMINI
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {displayInsights.map((insight) => (
          <InsightRow key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
});
