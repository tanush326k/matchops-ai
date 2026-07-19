import React from "react";
import { Video, ShieldAlert } from "lucide-react";

interface SecurityPanelProps {
  handleReportIncident: (e: React.FormEvent) => void;
  incTitle: string;
  setIncTitle: (val: string) => void;
  incDesc: string;
  setIncDesc: (val: string) => void;
  incLoc: string;
  setIncLoc: (val: string) => void;
  incZone: string;
  setIncZone: (val: string) => void;
  incPriority: string;
  setIncPriority: (val: string) => void;
  incSuccess: boolean;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({
  handleReportIncident,
  incTitle,
  setIncTitle,
  incDesc,
  setIncDesc,
  incLoc,
  setIncLoc,
  incZone,
  setIncZone,
  incPriority,
  setIncPriority,
  incSuccess
}) => {
  return (
    <div className="space-y-6">
      {/* CCTV Feed Matrix */}
      <div className="glass p-5 rounded-3xl border border-white/5 space-y-4 glow-card">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
          <Video className="w-4.5 h-4.5 text-rose-500" />
          Live Feed Matrix
        </h3>
        <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-500 font-mono text-center">
          <div className="aspect-[4/3] bg-slate-950 rounded-xl border border-white/5 flex flex-col justify-center items-center relative overflow-hidden">
            <span className="absolute top-1.5 left-1.5 text-rose-500 flex items-center gap-0.5 text-[7px] uppercase font-mono"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> LIVE</span>
            <span className="text-white text-[10px]">CAM-01</span>
          </div>
          <div className="aspect-[4/3] bg-slate-950 rounded-xl border border-white/5 flex flex-col justify-center items-center relative overflow-hidden">
            <span className="absolute top-1.5 left-1.5 text-rose-500 flex items-center gap-0.5 text-[7px] uppercase font-mono"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> LIVE</span>
            <span className="text-white text-[10px]">CAM-02</span>
          </div>
        </div>
      </div>

      {/* Report Incident Box for Security */}
      <div className="glass p-5 rounded-3xl border border-white/5 space-y-4 glow-card">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
          <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
          Dispatch Incident
        </h3>
        <form onSubmit={handleReportIncident} className="flex flex-col gap-3">
          <input
            type="text"
            value={incTitle}
            onChange={(e) => setIncTitle(e.target.value)}
            placeholder="Incident Title..."
            className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none placeholder-slate-700"
            required
          />
          <textarea
            value={incDesc}
            onChange={(e) => setIncDesc(e.target.value)}
            placeholder="Details & beacons description..."
            className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none h-16 resize-none placeholder-slate-700"
            required
          />
          <div className="flex gap-2">
            <select
              value={incLoc}
              onChange={(e) => setIncLoc(e.target.value)}
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white"
            >
              <option value="Gate A">Gate A</option>
              <option value="Gate B">Gate B</option>
              <option value="Gate C">Gate C</option>
              <option value="Gate D">Gate D</option>
            </select>
            <select
              value={incZone}
              onChange={(e) => setIncZone(e.target.value)}
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white"
            >
              <option value="Zone A">Zone A</option>
              <option value="Zone B">Zone B</option>
            </select>
          </div>
          <select
            value={incPriority}
            onChange={(e) => setIncPriority(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <button
            type="submit"
            className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-rose-950/20"
          >
            Dispatch Squad
          </button>
        </form>
        {incSuccess && <div className="text-emerald-400 text-[10px] font-bold">Incident logged & dispatched.</div>}
      </div>
    </div>
  );
};
