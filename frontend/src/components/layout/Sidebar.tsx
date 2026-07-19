import React, { useState } from "react";
import { 
  LogOut, Users, Trophy, UserCheck, ShieldAlert, Menu, Activity, RefreshCw, ChevronDown 
} from "lucide-react";
import type { Role, Language, Match } from "../../types";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  role: Role;
  language: Language;
  onLogout: () => void;
  onRefresh: () => void;
  matches: Match[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  role,
  language,
  onLogout,
  onRefresh,
  matches
}) => {
  const [navGroupOpen, setNavGroupOpen] = useState({
    workspace: true,
    utilities: true
  });

  const getRoleHeaderIcon = () => {
    switch (role) {
      case "Fan": return <Trophy className="w-4 h-4 text-amber-400" />;
      case "Volunteer": return <Users className="w-4 h-4 text-emerald-400" />;
      case "Security": return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "Organizer": return <UserCheck className="w-4 h-4 text-sky-400" />;
    }
  };

  const getBadgeText = () => {
    return role === "Fan" ? "Spectator-Guest" : (role === "Volunteer" ? "VOL-4022" : (role === "Security" ? "SEC-12" : "ORG-2026"));
  };

  return (
    <aside 
      className={`glass border-r border-white/5 transition-all duration-300 flex flex-col justify-between shrink-0 z-30 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5 h-16 shrink-0">
          {sidebarOpen ? (
            <h1 className="text-xs font-black tracking-widest text-white font-display">
              MATCHOPS <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-black">AI</span>
            </h1>
          ) : (
            <span className="text-[10px] font-black text-blue-400 mx-auto">MO</span>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Active Profile Info */}
        <div className={`p-4 border-b border-white/5 ${sidebarOpen ? "" : "flex justify-center"}`}>
          {sidebarOpen ? (
            <div className="p-3 bg-slate-950/80 border border-white/5 rounded-2xl text-[11px] space-y-1.5 w-full">
              <span className="text-[8.5px] text-slate-500 uppercase font-extrabold tracking-widest block font-mono">Authenticated Scope</span>
              <strong className="text-white flex items-center gap-2 font-display text-xs">
                {getRoleHeaderIcon()}
                {role} Operator
              </strong>
              <div className="text-[9.5px] text-slate-400 font-mono select-all bg-slate-900/60 px-2 py-1 rounded border border-white/5">
                Badge: {getBadgeText()}
              </div>
            </div>
          ) : (
            <div className="inline-block p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-slate-300">
              {getRoleHeaderIcon()}
            </div>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="p-3 space-y-4">
          {/* Group 1: Workspaces */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div 
                onClick={() => setNavGroupOpen({ ...navGroupOpen, workspace: !navGroupOpen.workspace })}
                className="flex items-center justify-between px-2.5 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono cursor-pointer hover:text-white"
              >
                <span>Workspaces</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${navGroupOpen.workspace ? "" : "rotate-180"}`} />
              </div>
            )}
            {navGroupOpen.workspace && (
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-xs cursor-pointer text-left font-display">
                  <Activity className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span>Overview</span>}
                </button>
                {sidebarOpen && matches && matches.length > 0 && (
                  <div className="px-3 py-2.5 bg-slate-950/40 rounded-xl border border-white/5 space-y-1 mt-2 text-[10px] text-slate-400">
                    <span className="text-[8px] text-slate-500 uppercase font-mono block">Current Fixture</span>
                    <div className="font-bold text-white truncate">{matches[0].teams}</div>
                    <div className="font-mono text-[9px] text-slate-500">Kickoff: {matches[0].time}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Group 2: Utilities */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div 
                onClick={() => setNavGroupOpen({ ...navGroupOpen, utilities: !navGroupOpen.utilities })}
                className="flex items-center justify-between px-2.5 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono cursor-pointer hover:text-white"
              >
                <span>Control Console</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${navGroupOpen.utilities ? "" : "rotate-180"}`} />
              </div>
            )}
            {navGroupOpen.utilities && (
              <div className="space-y-1">
                <button 
                  onClick={onRefresh}
                  className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold cursor-pointer text-left font-display"
                >
                  <RefreshCw className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span>Sync Sensors</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-3">
        {sidebarOpen && (
          <div className="text-[8.5px] text-slate-500 font-bold uppercase tracking-widest font-mono">
            Locale: {language}
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full px-3 py-2.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 active:bg-rose-500/15 border border-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-3.5 transition-all cursor-pointer animate-fade-in"
          title="Exit Session"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {sidebarOpen && <span className="font-display uppercase tracking-wider text-[10px]">Exit Session</span>}
        </button>
      </div>
    </aside>
  );
};
