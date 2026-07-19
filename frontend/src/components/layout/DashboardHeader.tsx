import React from "react";
import { 
  Clock, Search, Accessibility, Sun, Moon, Wifi, Trophy, Users, ShieldAlert, UserCheck 
} from "lucide-react";
import type { Role, SimulationState, DiagnosticsState } from "../../types";

interface DashboardHeaderProps {
  role: Role;
  simulationState: SimulationState | null;
  diagnostics: DiagnosticsState | null;
  currentTime: string;
  accessibilityMode: boolean;
  setAccessibilityMode: (a: boolean) => void;
  largeTextMode: boolean;
  setLargeTextMode: (l: boolean) => void;
  highContrastMode: boolean;
  setHighContrastMode: (h: boolean) => void;
  theme: string;
  setTheme: (t: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  role,
  simulationState,
  diagnostics,
  currentTime,
  accessibilityMode,
  setAccessibilityMode,
  largeTextMode,
  setLargeTextMode,
  highContrastMode,
  setHighContrastMode,
  theme,
  setTheme,
  searchQuery,
  setSearchQuery
}) => {
  const getRoleHeaderIcon = () => {
    switch (role) {
      case "Fan": return <Trophy className="w-4 h-4 text-amber-400" />;
      case "Volunteer": return <Users className="w-4 h-4 text-emerald-400" />;
      case "Security": return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "Organizer": return <UserCheck className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <header className="glass px-6 h-16 border-b border-white/5 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Breadcrumbs & Clock */}
      <div className="flex items-center gap-4 shrink-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="hover:text-white transition-colors cursor-pointer font-display">MatchOps AI</span>
          <span>&gt;</span>
          <span className="text-white flex items-center gap-1.5 mr-2 font-display">
            {getRoleHeaderIcon()}
            {role} Console
          </span>
        </nav>
        {/* Live Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/5 text-[10px] font-mono font-bold text-slate-400">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>UTC: {currentTime || "Loading..."}</span>
        </div>
        {/* Simulation Phase indicator */}
        {simulationState && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[9.5px] font-mono text-blue-400 font-bold">
            PHASE: {simulationState.phase}
          </div>
        )}
      </div>

      {/* Center search bar */}
      <div className="hidden lg:flex items-center gap-2.5 flex-1 max-w-md mx-6 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus-within:border-blue-500 transition-colors font-medium">
        <Search className="w-4 h-4 text-slate-600 shrink-0" />
        <input
          type="text"
          placeholder="Search gates, logs, concession stands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-white w-full placeholder-slate-600 text-xs"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
        )}
      </div>

      {/* Quick Config Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Connected status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-bold text-emerald-400 font-mono">
          <Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>{diagnostics?.gemini_availability === "Connected" ? "CONNECTED" : "CONNECTED"}</span>
        </div>

        {/* Accessibility dropdown trigger */}
        <div className="relative group">
          <button
            className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold cursor-pointer ${
              accessibilityMode || largeTextMode || highContrastMode
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Accessibility className="w-4 h-4" />
            <span className="hidden md:inline font-display">Accessibility</span>
          </button>
          <div className="absolute right-0 mt-2 w-64 bg-[#080d16] border border-white/10 rounded-2xl p-4 shadow-2xl hidden group-hover:block hover:block z-50 animate-fade-in text-slate-300 font-sans">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 font-mono">Accessibility Config</h4>
            <div className="flex flex-col gap-3 font-semibold text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Wheelchair Friendly Paths</span>
                <input
                  type="checkbox"
                  checked={accessibilityMode}
                  onChange={(e) => setAccessibilityMode(e.target.checked)}
                  className="accent-blue-500 rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Large Text Mode</span>
                <input
                  type="checkbox"
                  checked={largeTextMode}
                  onChange={(e) => setLargeTextMode(e.target.checked)}
                  className="accent-blue-500 rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>High Contrast Mode</span>
                <input
                  type="checkbox"
                  checked={highContrastMode}
                  onChange={(e) => setHighContrastMode(e.target.checked)}
                  className="accent-blue-500 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Theme switcher */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
