import React from "react";
import { CheckSquare, MessageSquare, ShieldAlert } from "lucide-react";

interface VolunteerPanelProps {
  transInput: string;
  setTransInput: (val: string) => void;
  transOutput: string;
  transLang: string;
  setTransLang: (val: string) => void;
  handleTranslate: () => void;
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

export const VolunteerPanel: React.FC<VolunteerPanelProps> = ({
  transInput,
  setTransInput,
  transOutput,
  transLang,
  setTransLang,
  handleTranslate,
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
      {/* Task list checklists */}
      <div className="glass p-5 rounded-3xl border border-white/5 space-y-4 glow-card">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
          <CheckSquare className="w-4.5 h-4.5 text-emerald-500" />
          Zone Assignment Task Log
        </h3>
        <div className="flex flex-col gap-2 font-semibold text-xs text-slate-400">
          <label className="flex items-center gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-white/5 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded accent-emerald-500 cursor-pointer" />
            <span className="line-through text-slate-500 text-[11px]">Accessibility gate checks done</span>
          </label>
          <label className="flex items-center gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-white/5 cursor-pointer">
            <input type="checkbox" className="rounded accent-emerald-500 cursor-pointer" />
            <span className="text-slate-300 text-[11px]">Distribute waste catalogs</span>
          </label>
        </div>
      </div>

      {/* Multilingual tool details */}
      <div className="glass p-5 rounded-3xl border border-white/5 space-y-4 glow-card">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
          <MessageSquare className="w-4.5 h-4.5 text-blue-400" />
          Grounded Translate
        </h3>
        <div className="space-y-3.5">
          <input
            type="text"
            value={transInput}
            onChange={(e) => setTransInput(e.target.value)}
            placeholder="Type English query..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium placeholder-slate-700"
          />
          <div className="flex gap-2">
            <select
              value={transLang}
              onChange={(e) => setTransLang(e.target.value)}
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white cursor-pointer"
            >
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Portuguese">Portuguese</option>
            </select>
            <button
              onClick={handleTranslate}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Go
            </button>
          </div>
          {transOutput && (
            <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 text-[11px] text-emerald-400 font-bold leading-normal">
              {transOutput}
            </div>
          )}
        </div>
      </div>

      {/* Report Incident Box for Volunteers */}
      <div className="glass p-5 rounded-3xl border border-white/5 space-y-4 glow-card">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
          <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
          Report Incident
        </h3>
        <form onSubmit={handleReportIncident} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title..."
            value={incTitle}
            onChange={(e) => setIncTitle(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
            required
          />
          <textarea
            placeholder="Details..."
            value={incDesc}
            onChange={(e) => setIncDesc(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none h-16 resize-none"
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
            className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
          >
            File Report
          </button>
        </form>
        {incSuccess && <div className="text-emerald-400 text-[10px] font-bold">Report logged successfully.</div>}
      </div>
    </div>
  );
};
