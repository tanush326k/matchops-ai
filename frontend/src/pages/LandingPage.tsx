import React, { useState } from "react";
import { Shield, Users, Trophy, UserCheck, ShieldAlert, Globe, Activity, HeartHandshake, Sparkles } from "lucide-react";
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
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case "Volunteer":
        return <Users className="w-6 h-6 text-emerald-400" />;
      case "Security":
        return <ShieldAlert className="w-6 h-6 text-red-400" />;
      case "Organizer":
        return <UserCheck className="w-6 h-6 text-blue-400" />;
    }
  };

  const getRoleAccent = (roleName: Role) => {
    switch (roleName) {
      case "Fan":
        return {
          border: "border-amber-500/20",
          activeBorder: "border-amber-500",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
          text: "text-amber-400",
          bg: "bg-amber-950/10"
        };
      case "Volunteer":
        return {
          border: "border-emerald-500/20",
          activeBorder: "border-emerald-500",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
          text: "text-emerald-400",
          bg: "bg-emerald-950/10"
        };
      case "Security":
        return {
          border: "border-red-500/20",
          activeBorder: "border-red-500",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
          text: "text-red-400",
          bg: "bg-red-950/10"
        };
      case "Organizer":
        return {
          border: "border-blue-500/20",
          activeBorder: "border-blue-500",
          glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
          text: "text-blue-400",
          bg: "bg-blue-950/10"
        };
    }
  };

  const getRoleDesc = (roleName: Role) => {
    switch (roleName) {
      case "Fan":
        return "Navigate MetLife Stadium safely, check queue wait times, find transit, and travel step-free.";
      case "Volunteer":
        return "Receive zone allocations, review tasks, manage translations, and report incidents.";
      case "Security":
        return "Monitor live threat telemetry, report active stadium incidents, and manage mitigation pathways.";
      case "Organizer":
        return "Oversee operations timelines, view sustainability dashboards, and coordinate resources.";
    }
  };

  const getRoleResponsibilities = (roleName: Role) => {
    switch (roleName) {
      case "Fan":
        return "Spectator Routing • Concession Queues • Parking Guidance";
      case "Volunteer":
        return "Fan Assistance • Checklist Task Logs • Translation Tools";
      case "Security":
        return "Safety Dispatch • CCTV Feeds • Threat Mitigations";
      case "Organizer":
        return "Resource Allocations • Event Logging • Green Analytics";
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
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden bg-[#070b13]">
      {/* Background glowing decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-950/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-950/20 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-5xl flex flex-col items-center z-10 animate-slide-up">
        {/* Brand Tagline Header */}
        <header className="text-center mb-10 flex flex-col items-center">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/40 border border-blue-900/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-5">
            <Shield className="w-3.5 h-3.5" />
            FIFA World Cup 2026 • Stadium Operations Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white leading-tight">
            MATCHOPS <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-sm sm:text-base leading-relaxed">
            The Intelligent Operations Copilot for FIFA World Cup 2026. Empowering fans, volunteers, security responders, and organizers with live sensor data integration and grounded AI planning logs.
          </p>
        </header>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10 text-xs">
          <div className="glass p-5 rounded-2xl flex gap-3.5 items-start">
            <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/30 text-blue-400 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Crowd & Incident Telemetry</h4>
              <p className="text-gray-400 leading-relaxed">Monitors stadium sensors, parking levels, and security beacons in real time.</p>
            </div>
          </div>
          <div className="glass p-5 rounded-2xl flex gap-3.5 items-start">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/30 text-emerald-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Role-Aware AI Assist</h4>
              <p className="text-gray-400 leading-relaxed">Customizes interfaces and filters security permissions for all stakeholders.</p>
            </div>
          </div>
          <div className="glass p-5 rounded-2xl flex gap-3.5 items-start">
            <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/30 text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Explanation Reasoning Logs</h4>
              <p className="text-gray-400 leading-relaxed">Visualizes intent classification, context aggregation, and rule planner steps.</p>
            </div>
          </div>
        </section>

        {/* Auth / Settings Card */}
        <main className="w-full glass rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row gap-8">
          {/* Left panel: Role selectors */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4 text-white">Select Operational Profile</h2>
              <div 
                role="radiogroup" 
                aria-label="Operational roles"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
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
                      className={`p-4.5 rounded-2xl border text-left flex flex-col gap-3 transition-all focus-ring ${
                        isSelected
                          ? `bg-white/5 ${style.activeBorder} ${style.glow}`
                          : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/8"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`p-2 rounded-xl ${style.bg}`}>
                          {getRoleIcon(r)}
                        </span>
                        {isSelected && (
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 ${style.text}`}>
                            Active
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <div className="font-bold text-sm text-white mb-1">{r} Profile</div>
                        <p className="text-[10.5px] text-gray-400 leading-relaxed line-clamp-2">
                          {getRoleDesc(r)}
                        </p>
                      </div>

                      <div className="border-t border-white/5 pt-2 text-[9px] text-gray-500 font-mono tracking-tight uppercase">
                        Responsibilities: {getRoleResponsibilities(r)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
              <label htmlFor="language-select" className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Copilot Language System
              </label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus-ring cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Spanish">Español (Spanish)</option>
                <option value="French">Français (French)</option>
                <option value="Arabic">العربية (Arabic)</option>
                <option value="Portuguese">Português (Portuguese)</option>
              </select>
            </div>
          </div>

          {/* Right panel: Credentials Form */}
          <div className="lg:w-80 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
            <h3 className="text-lg font-bold mb-4 text-white">Identity Access Badge</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="credential-input" className="text-xs font-semibold text-gray-400 block mb-1.5">
                  ID Badge Number / Username
                </label>
                <input
                  id="credential-input"
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  placeholder="Enter guest or staff ID..."
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs focus-ring text-white"
                  required
                />
              </div>

              <div className="text-[10px] text-gray-500 leading-relaxed bg-black/35 p-3.5 rounded-2xl border border-white/5">
                <strong>Simulated Access Code Checklist:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>Fan: <span className="text-gray-400">Guest Spectator</span></li>
                  <li>Volunteer: <span className="text-emerald-400">VOL-4022</span></li>
                  <li>Security: <span className="text-red-400">SEC-12</span></li>
                  <li>Organizer: <span className="text-blue-400">ORG-2026</span></li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/10 flex items-center justify-center gap-2 focus-ring text-xs"
              >
                Access Copilot Workspace
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
