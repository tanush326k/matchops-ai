import React from "react";
import { Cpu, Sliders } from "lucide-react";

interface OrganizerPanelProps {
  handleTriggerScenario: (scenario: string) => void;
  handleReallocate: (e: React.FormEvent) => void;
  reallocFrom: string;
  setReallocFrom: (val: string) => void;
  reallocTo: string;
  setReallocTo: (val: string) => void;
  reallocCount: number;
  setReallocCount: (val: number) => void;
  reallocMsg: string;
}

export const OrganizerPanel: React.FC<OrganizerPanelProps> = ({
  handleTriggerScenario,
  handleReallocate,
  reallocFrom,
  setReallocFrom,
  reallocTo,
  setReallocTo,
  reallocCount,
  setReallocCount,
  reallocMsg
}) => {
  return (
    <div className="space-y-6">
      {/* Demo scenario selection block */}
      <div className="glass p-5 rounded-3xl border border-white/5 space-y-4 glow-card">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
          <Cpu className="w-4.5 h-4.5 text-blue-400" />
          Demo Scenarios
        </h3>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
          {[
            { phase: "Pre-match", label: "Pre-Match" },
            { phase: "Entry Rush", label: "Entry Rush" },
            { phase: "Kickoff", label: "Kickoff" },
            { phase: "🚨 Emergency", label: "Emergency" }
          ].map((scen) => (
            <button
              key={scen.phase}
              type="button"
              onClick={() => handleTriggerScenario(scen.phase)}
              className="px-2.5 py-2.5 rounded-xl border border-white/5 bg-slate-950 text-slate-400 hover:text-white hover:border-blue-500/20 transition-all cursor-pointer text-center"
            >
              {scen.label}
            </button>
          ))}
        </div>
      </div>

      {/* Volunteer Reallocations form */}
      <div className="glass p-5 rounded-3xl border border-white/5 space-y-4 glow-card">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
          <Sliders className="w-4.5 h-4.5 text-blue-400" />
          Reallocate Staff
        </h3>
        <form onSubmit={handleReallocate} className="flex flex-col gap-3">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono text-slate-500 font-bold block">From Zone</label>
            <select
              value={reallocFrom}
              onChange={(e) => setReallocFrom(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
            >
              <option value="Zone A (Gates A/B)">Zone A (Gates A/B)</option>
              <option value="Zone B (Gates C/D)">Zone B (Gates C/D)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono text-slate-500 font-bold block">To Zone</label>
            <select
              value={reallocTo}
              onChange={(e) => setReallocTo(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
            >
              <option value="Zone A (Gates A/B)">Zone A (Gates A/B)</option>
              <option value="Zone B (Gates C/D)">Zone B (Gates C/D)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Staff Count ({reallocCount})</label>
            <input
              type="range"
              min="1"
              max="25"
              value={reallocCount}
              onChange={(e) => setReallocCount(parseInt(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
          >
            Reallocate Staff
          </button>
        </form>
        {reallocMsg && <div className="text-emerald-400 text-[10px] font-bold">{reallocMsg}</div>}
      </div>
    </div>
  );
};
