import React from "react";
import { Navigation, Trophy, Trash2 } from "lucide-react";

interface FanPanelProps {
  filteredRestrooms: [string, any][];
  filteredConcessions: any[];
  sustainability: Record<string, any> | null;
}

export const FanPanel: React.FC<FanPanelProps> = ({
  filteredRestrooms,
  filteredConcessions,
  sustainability
}) => {
  return (
    <div className="space-y-6">
      {/* Routing Card */}
      <div className="glass p-5 rounded-3xl border border-white/5 space-y-4 glow-card">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
          <Navigation className="w-4.5 h-4.5 text-amber-500" />
          Transit Advisory Scope
        </h3>
        <div className="flex flex-col gap-3 font-semibold text-xs text-slate-400">
          <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 space-y-1.5">
            <span className="text-[8.5px] text-slate-500 uppercase tracking-wider font-mono font-bold block">Entry Gate</span>
            <div className="flex justify-between items-center text-white">
              <span>Gate C (Accessible)</span>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] border border-emerald-500/20 font-mono">5m wait</span>
            </div>
          </div>
          
          <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 space-y-1.5">
            <span className="text-[8.5px] text-slate-500 uppercase tracking-wider font-mono font-bold block">Accessible Restrooms</span>
            <div className="space-y-1">
              {filteredRestrooms.slice(0, 2).map(([rName, rData]: any) => (
                <div key={rName} className="flex justify-between items-center text-slate-300">
                  <span>{rName}</span>
                  <span className="text-white font-mono font-bold text-[10px]">{rData.wait_time_minutes}m wait</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Concession Stand Congestion */}
      {filteredConcessions.length > 0 && (
        <div className="glass p-5 rounded-3xl border border-white/5 space-y-4 glow-card">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
            <Trophy className="w-4.5 h-4.5 text-amber-500" />
            Concessions Telemetry
          </h3>
          <div className="flex flex-col gap-2">
            {filteredConcessions.slice(0, 3).map((conc) => (
              <div key={conc.name} className="p-3 bg-slate-950 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">{conc.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">{conc.section}</span>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                  conc.wait_time_minutes > 15
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}>
                  {conc.wait_time_minutes}m wait
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sustainability Diversion Info */}
      <div className="glass p-5 rounded-3xl border border-white/5 border-l-4 border-l-emerald-500 glow-card space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-2 font-mono">
          <Trash2 className="w-4 h-4" />
          Green Rewards
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-semibold">
          Sort your beverage containers at any Concourse Eco-Hub Bins. Deposits unlock 15% discount badges at the MetLife Merch Depot.
        </p>
        <div className="text-[9.5px] text-slate-500 bg-slate-950 p-2.5 rounded-xl border border-white/5 font-mono">
          Metric: {sustainability?.waste_diversion_percent ? `${sustainability.waste_diversion_percent}%` : "84%"} waste diverted today.
        </div>
      </div>
    </div>
  );
};
