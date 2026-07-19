import React from "react";
import { Ambulance, Shield, Truck, MapPin, Timer } from "lucide-react";



interface TeamStatus {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  status: "ready" | "deployed" | "standby";
}

const statusStyles = {
  ready: { dot: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/5 border-emerald-500/10" },
  deployed: { dot: "bg-amber-500 animate-pulse", text: "text-amber-400", bg: "bg-amber-500/5 border-amber-500/10" },
  standby: { dot: "bg-blue-500", text: "text-blue-400", bg: "bg-blue-500/5 border-blue-500/10" },
};

const TEAMS: TeamStatus[] = [
  {
    label: "Medical Units",
    value: "6 / 8",
    detail: "2 deployed · Sector 114",
    icon: <Ambulance className="w-3.5 h-3.5" />,
    status: "deployed",
  },
  {
    label: "Security Teams",
    value: "24 Active",
    detail: "All perimeters staffed",
    icon: <Shield className="w-3.5 h-3.5" />,
    status: "ready",
  },
  {
    label: "Emergency Vehicles",
    value: "4 Positioned",
    detail: "Gate A, B, D access",
    icon: <Truck className="w-3.5 h-3.5" />,
    status: "ready",
  },
  {
    label: "Evacuation Routes",
    value: "8 / 8 Open",
    detail: "All corridors unobstructed",
    icon: <MapPin className="w-3.5 h-3.5" />,
    status: "ready",
  },
];

export const EmergencyReadiness = React.memo(() => {
  const avgResponseTime = "4.2 min";
  const overallReady = TEAMS.filter(t => t.status !== "ready").length === 0;

  return (
    <div className="glass rounded-3xl border border-white/5 p-4 glow-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-white font-display">Emergency Readiness</h3>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
              Response Infrastructure
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[9px] font-bold font-mono uppercase tracking-widest ${
          overallReady
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${overallReady ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
          {overallReady ? "All Ready" : "Active"}
        </div>
      </div>

      {/* Team Status Grid */}
      <div className="grid grid-cols-2 gap-2">
        {TEAMS.map((team) => {
          const s = statusStyles[team.status];
          return (
            <div key={team.label} className={`p-2.5 rounded-2xl border ${s.bg} space-y-1`}>
              <div className={`flex items-center gap-1.5 ${s.text}`}>
                {team.icon}
                <span className="text-[9px] font-bold uppercase tracking-widest font-mono truncate">{team.label}</span>
              </div>
              <div className="text-white text-xs font-bold font-display">{team.value}</div>
              <div className="text-[9px] text-slate-500 font-mono leading-tight">{team.detail}</div>
            </div>
          );
        })}
      </div>

      {/* Response Time Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
          <Timer className="w-3 h-3 text-slate-600" />
          Est. Response Time
        </div>
        <span className="text-xs font-black text-white font-mono">{avgResponseTime}</span>
      </div>
    </div>
  );
});
