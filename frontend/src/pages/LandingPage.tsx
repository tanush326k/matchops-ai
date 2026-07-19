import React, { useState } from "react";
import { Shield, Users, Trophy, UserCheck, ShieldAlert, Activity, HeartHandshake, Sparkles, LogIn } from "lucide-react";
import type { Role, Language } from "../types";

interface LandingPageProps {
  onLogin: (role: Role, language: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<Role>("Fan");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("English");
  const [credential, setCredential] = useState("");

  const getRoleIcon = (roleName: Role) => {
    switch (roleName) {
      case "Fan":
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case "Volunteer":
        return <Users className="w-5 h-5 text-emerald-400" />;
      case "Security":
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case "Organizer":
        return <UserCheck className="w-5 h-5 text-sky-400" />;
    }
  };

  const getRoleAccent = (roleName: Role) => {
    switch (roleName) {
      case "Fan":
        return {
          border: "border-amber-500/10",
          activeBorder: "border-amber-500/40",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.08)]",
          text: "text-amber-400",
          bg: "bg-amber-500/5",
          ring: "focus-within:ring-amber-500/30"
        };
      case "Volunteer":
        return {
          border: "border-emerald-500/10",
          activeBorder: "border-emerald-500/40",
          glow: "shadow-[0_0_20px_rgba(16,185,129,0.08)]",
          text: "text-emerald-400",
          bg: "bg-emerald-500/5",
          ring: "focus-within:ring-emerald-500/30"
        };
      case "Security":
        return {
          border: "border-rose-500/10",
          activeBorder: "border-rose-500/40",
          glow: "shadow-[0_0_20px_rgba(244,63,94,0.08)]",
          text: "text-rose-400",
          bg: "bg-rose-500/5",
          ring: "focus-within:ring-rose-500/30"
        };
      case "Organizer":
        return {
          border: "border-sky-500/10",
          activeBorder: "border-sky-500/40",
          glow: "shadow-[0_0_20px_rgba(56,189,248,0.08)]",
          text: "text-sky-400",
          bg: "bg-sky-500/5",
          ring: "focus-within:ring-sky-500/30"
        };
    }
  };

  const getRoleDesc = (roleName: Role) => {
    switch (roleName) {
      case "Fan":
        return "Access MetLife Stadium queue times, step-free transit routing guides, and parking updates.";
      case "Volunteer":
        return "Manage real-time guest assistance checkpoints, checklists, and translation services.";
      case "Security":
        return "Monitor incident alerts, manage threat resolution dispatches, and review CCTV logs.";
      case "Organizer":
        return "Oversee executive KPI summaries, crowd simulations, resource allocations, and sustainability metrics.";
    }
  };

  const getRoleResponsibilities = (roleName: Role) => {
    switch (roleName) {
      case "Fan":
        return "Spectator Ingress • Concourse Wait Times • Parking Info";
      case "Volunteer":
        return "Guest Support Desk • Tasks • Language Translate";
      case "Security":
        return "Critical Dispatch • Camera Streams • Threat Mitigate";
      case "Organizer":
        return "Resource Allocate • Phase Simulate • Green Telemetry";
    }
  };

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    if (role === "Fan") setCredential("Guest Spectator");
    else if (role === "Volunteer") setCredential("VOL-4022");
    else if (role === "Security") setCredential("SEC-12");
    else if (role === "Organizer") setCredential("ORG-2026");
  };

  React.useEffect(() => {
    if (selectedRole === "Fan" && !credential) {
      setCredential("Guest Spectator");
    }
  }, [selectedRole, credential]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole, selectedLanguage);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 sm:px-6 md:px-8 py-8 relative overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-blue-500/30 selection:text-white">
      {/* Background soft lighting design */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] rounded-full bg-indigo-500/[0.02] blur-[150px] pointer-events-none"></div>

      {/* Top minimal header bar */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest font-display text-white">MATCHOPS <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">AI</span></span>
          <span className="text-[9px] uppercase font-mono tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400">v2.0 PRO</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/tanush326k/matchops-ai" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
            Repository Documentation
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto my-auto z-10 flex flex-col gap-10 items-center justify-center py-8 animate-fade-in">
        {/* Pitch / Title Block */}
        <div className="text-center max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            MetLife Stadium Operations Center
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-none font-display">
            The Grounded Stadium <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Copilot</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
            Next-generation operations dashboard using structured stadium telemetry. Custom views optimized for spectators, active volunteers, security dispatch, and venue organizers.
          </p>
        </div>

        {/* Feature Cards Showcase */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
          <div className="glass p-5 rounded-2xl border border-white/5 space-y-2 hover:border-blue-500/20 hover:bg-slate-900/10 transition-all duration-300">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-xs font-display">Live Ingress Telemetry</h4>
            <p className="text-slate-400 leading-relaxed text-[11px] font-medium">Real-time gate wait estimates, transit metrics, and sensor counts.</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/5 space-y-2 hover:border-emerald-500/20 hover:bg-slate-900/10 transition-all duration-300">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-xs font-display">Role-Based Workspaces</h4>
            <p className="text-slate-400 leading-relaxed text-[11px] font-medium">Isolated scopes, custom checklist logs, and specialized UI panels.</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/5 space-y-2 hover:border-purple-500/20 hover:bg-slate-900/10 transition-all duration-300">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-xs font-display">Reasoning Logs Timeline</h4>
            <p className="text-slate-400 leading-relaxed text-[11px] font-medium">Fully transparent 5-stage AI planner execution timelines.</p>
          </div>
        </section>

        {/* Auth Grid */}
        <section className="w-full glass rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 shadow-2xl border-white/5 relative overflow-hidden">
          
          {/* Left Column: Role Grid */}
          <div className="flex-[3] space-y-5">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-white font-display">Choose Workspace Profile</h2>
              <p className="text-[11px] text-slate-500 font-medium">Select a profile to customize telemetry scopes and authorization tags.</p>
            </div>
            
            <div role="radiogroup" aria-label="Operational roles" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(["Fan", "Volunteer", "Security", "Organizer"] as Role[]).map((r) => {
                const style = getRoleAccent(r);
                const isSelected = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleRoleChange(r)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3.5 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? `bg-slate-900/60 ${style.activeBorder} ${style.glow}`
                        : "bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`p-2 rounded-xl ${style.bg} border border-white/5`}>
                        {getRoleIcon(r)}
                      </span>
                      {isSelected && (
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border bg-white/5 ${style.text} font-mono`}>
                          Active Scope
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="font-extrabold text-xs text-white font-display">{r} Dashboard</div>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed font-medium">
                        {getRoleDesc(r)}
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-2 text-[8.5px] text-slate-500 font-mono tracking-tight uppercase font-bold">
                      {getRoleResponsibilities(r)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Credential Form Card */}
          <div className="flex-[2] flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 gap-6">
            <div className="space-y-1.5">
              <h3 className="text-sm font-extrabold text-white font-display">Identity Dispatch Verification</h3>
              <p className="text-[11px] text-slate-500 font-medium">Verify your credentials below to allocate secure session memory.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor="credential-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Access Badge ID / Username
                </label>
                <input
                  id="credential-input"
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  placeholder="Enter guest or staff ID..."
                  className="w-full px-3.5 py-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium placeholder-slate-700 transition-colors font-mono"
                  required
                />
              </div>

              <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 font-semibold space-y-1.5">
                <span className="text-slate-300 font-display font-bold">Badge Directory:</span>
                <ul className="list-none pl-0 mt-1 space-y-1 font-mono text-[9px]">
                  <li className="flex justify-between"><span>Fan:</span> <span className="text-amber-400">Guest Spectator</span></li>
                  <li className="flex justify-between"><span>Volunteer:</span> <span className="text-emerald-400">VOL-4022</span></li>
                  <li className="flex justify-between"><span>Security:</span> <span className="text-rose-400">SEC-12</span></li>
                  <li className="flex justify-between"><span>Organizer:</span> <span className="text-sky-400">ORG-2026</span></li>
                </ul>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="language-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Copilot Language System
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-900 transition-colors"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="French">Français (French)</option>
                  <option value="Arabic">العربية (Arabic)</option>
                  <option value="Portuguese">Português (Portuguese)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-display cursor-pointer mt-2"
              >
                <LogIn className="w-4 h-4" /> Access Workspace
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer minimal bar */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between z-10 py-4 border-t border-white/5 text-[10px] text-slate-500 font-mono-tech gap-2">
        <span>© 2026 MetLife Operations Control. Grounded AI using structured stadium telemetry.</span>
        <span>Secure Session Encryption • Active SSL Node</span>
      </footer>
    </div>
  );
};
