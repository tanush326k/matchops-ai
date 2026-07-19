import React, { useEffect, useRef } from "react";
import {
  AlertTriangle, Zap, Users, Clock, Shield, Activity,
  Radio
} from "lucide-react";
import type { TimelineEvent } from "../../types";

interface OpsTimelineProps {
  events: TimelineEvent[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const CATEGORIES = ["All", "Incident", "AI Recommendation", "Transport", "Staffing", "Match Phase"];

const categoryMeta: Record<string, { icon: React.ReactNode; color: string; border: string }> = {
  "Incident": {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: "text-rose-400",
    border: "border-l-rose-500",
  },
  "AI Recommendation": {
    icon: <Zap className="w-3.5 h-3.5" />,
    color: "text-violet-400",
    border: "border-l-violet-500",
  },
  "Transport": {
    icon: <Radio className="w-3.5 h-3.5" />,
    color: "text-blue-400",
    border: "border-l-blue-500",
  },
  "Staffing": {
    icon: <Users className="w-3.5 h-3.5" />,
    color: "text-emerald-400",
    border: "border-l-emerald-500",
  },
  "Match Phase": {
    icon: <Activity className="w-3.5 h-3.5" />,
    color: "text-amber-400",
    border: "border-l-amber-500",
  },
  "Accessibility": {
    icon: <Shield className="w-3.5 h-3.5" />,
    color: "text-sky-400",
    border: "border-l-sky-500",
  },
};

const severityBg: Record<string, string> = {
  "Critical": "bg-rose-500/5",
  "High": "bg-orange-500/5",
  "Medium": "bg-amber-500/5",
  "Low": "bg-slate-900/40",
  "Info": "bg-slate-900/30",
};

const FALLBACK_EVENTS: TimelineEvent[] = [
  { id: "1", timestamp: "06:43:12", category: "Match Phase", message: "Kickoff confirmed — all gates operational", severity: "Info" },
  { id: "2", timestamp: "06:41:08", category: "AI Recommendation", message: "Gemini: Redirect Gate B overflow to Gate D — 3 min ETA reduction", severity: "Low" },
  { id: "3", timestamp: "06:38:55", category: "Incident", message: "Medical response dispatched to Section 114 — crowd crush risk", severity: "High" },
  { id: "4", timestamp: "06:36:30", category: "Transport", message: "NJ Transit Line 3 delayed — ETA +12 min. Security advised.", severity: "Medium" },
  { id: "5", timestamp: "06:34:00", category: "Staffing", message: "Zone A volunteer count normalised — 42 active staff on ground", severity: "Info" },
  { id: "6", timestamp: "06:31:44", category: "AI Recommendation", message: "Gemini: Concourse C congestion predicted at HT — pre-open auxiliary corridor", severity: "Medium" },
  { id: "7", timestamp: "06:28:10", category: "Match Phase", message: "Pre-Match phase initiated — gates open at T-90 minutes", severity: "Info" },
];

export const OpsTimeline = React.memo<OpsTimelineProps>(({ events, selectedCategory, setSelectedCategory }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayEvents = events.length > 0 ? events : FALLBACK_EVENTS;
  const filtered = React.useMemo(() => 
    displayEvents.filter(e => selectedCategory === "All" || e.category === selectedCategory),
    [displayEvents, selectedCategory]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events.length]);

  return (
    <div className="glass rounded-3xl border border-white/5 flex flex-col h-full glow-card">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white font-display tracking-wide">Live Ops Timeline</h3>
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                {filtered.length} events · Auto-updating
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Category filters */}
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer font-mono ${
                selectedCategory === cat
                  ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                  : "bg-slate-950/60 text-slate-500 border-white/5 hover:text-white hover:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-slate-600 text-xs font-mono">
            No events in this category
          </div>
        ) : (
          filtered.map((ev, idx) => {
            const meta = categoryMeta[ev.category] || categoryMeta["Match Phase"];
            const bg = severityBg[ev.severity] || "bg-slate-900/30";
            return (
              <div
                key={ev.id || idx}
                className={`flex gap-3 p-3 rounded-xl ${bg} border-l-2 ${meta.border} border border-white/[0.03] hover:border-white/8 transition-all animate-fade-in`}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                {/* Icon */}
                <div className={`mt-0.5 shrink-0 ${meta.color}`}>
                  {meta.icon}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-200 leading-snug">{ev.message}</span>
                    <span className="text-[9px] text-slate-600 font-mono shrink-0 pt-0.5">{ev.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-bold uppercase tracking-wider font-mono ${meta.color}`}>
                      {ev.category}
                    </span>
                    {ev.severity !== "Info" && (
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded font-mono ${
                        ev.severity === "Critical" || ev.severity === "High"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : ev.severity === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-800 text-slate-500 border border-white/5"
                      }`}>
                        {ev.severity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});
