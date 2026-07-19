import React, { useEffect, useState } from "react";
import { Shield, Zap, Users, Radio, Activity, ChevronRight } from "lucide-react";
import type { Match } from "../../types";

interface EventHeroBannerProps {
  matches: Match[];
  attendance: number;
  simulationPhase: string | null;
  currentTime: string;
  aiStatus: "Live" | "Offline" | "Degraded";
}

const phaseColors: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  "Pre-match": { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400" },
  "Entry Rush": { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", dot: "bg-orange-400" },
  "Kickoff": { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  "Half Time": { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
  "Emergency": { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", dot: "bg-rose-400" },
};

const defaultPhaseStyle = { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" };

export const EventHeroBanner = React.memo<EventHeroBannerProps>(({
  matches,
  attendance,
  simulationPhase,
  currentTime,
  aiStatus,
}) => {
  const [matchClock, setMatchClock] = useState(0);
  const activeMatch = matches.find(m => m.status === "In-Progress") || matches[0];
  const capacity = 85000;
  const occupancyPct = Math.round((attendance / capacity) * 100);
  const phase = simulationPhase || "Pre-match";
  const phaseStyle = phaseColors[phase] || defaultPhaseStyle;

  useEffect(() => {
    if (!activeMatch || activeMatch.status !== "In-Progress") return;
    const interval = setInterval(() => {
      setMatchClock(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, [activeMatch]);

  const formatMatchClock = () => {
    if (!activeMatch || activeMatch.status !== "In-Progress") return "--'";
    return `${matchClock}'`;
  };

  const healthScore = phase === "Emergency" ? "CRITICAL" : (phase === "Entry Rush" ? "WARNING" : "NOMINAL");
  const healthColor = healthScore === "CRITICAL" ? "text-rose-400 border-rose-500/30 bg-rose-500/5" 
    : healthScore === "WARNING" ? "text-amber-400 border-amber-500/30 bg-amber-500/5"
    : "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-950 border-b border-white/5 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
      
      {/* Left: Event Identity */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              FIFA World Cup 2026 · MetLife Stadium · Group Stage
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-sm font-black text-white font-display tracking-tight">
              {activeMatch ? activeMatch.teams : "Argentina vs France"}
            </span>
            {activeMatch?.score && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-lg font-black text-blue-400 font-mono tracking-widest">{activeMatch.score}</span>
              </>
            )}
            {activeMatch?.status === "In-Progress" && (
              <span className="text-xs font-bold text-emerald-400 font-mono animate-pulse">{formatMatchClock()}</span>
            )}
          </div>
        </div>

        {/* Match Phase Badge */}
        <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${phaseStyle.bg} ${phaseStyle.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${phaseStyle.dot} animate-pulse`} />
          <span className={`text-[9px] font-bold uppercase tracking-widest font-mono ${phaseStyle.text}`}>{phase}</span>
        </div>
      </div>

      {/* Right: Live Status Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Attendance */}
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/5">
            <Users className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-bold text-white font-mono">{attendance.toLocaleString()}</span>
            <span className="text-[9px] text-slate-500 font-mono">/ {capacity.toLocaleString()}</span>
          </div>
          {/* Occupancy bar */}
          <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000 rounded-full"
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
        </div>

        {/* Operational Health */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${healthColor} text-[9px] font-bold uppercase tracking-widest font-mono`}>
          <Activity className="w-3 h-3" />
          {healthScore}
        </div>

        {/* AI Status */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest font-mono ${
          aiStatus === "Live" 
            ? "bg-violet-500/10 border-violet-500/20 text-violet-400" 
            : "bg-slate-800 border-white/5 text-slate-400"
        }`}>
          <Zap className="w-3 h-3" />
          Gemini {aiStatus}
        </div>

        {/* Clock */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/5 text-[9px] font-mono font-bold text-slate-400">
          <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
          {currentTime || "--:--:--"}
        </div>

        {/* Breadcrumb arrow */}
        <ChevronRight className="w-3.5 h-3.5 text-slate-700 hidden lg:block" />
      </div>
    </div>
  );
});
