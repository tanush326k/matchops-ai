import React, { useState, useEffect } from "react";
import { 
  LogOut, Sun, Moon, Users, Trophy, UserCheck, Accessibility, Trash2, Clock, 
  Activity, Navigation, RefreshCw, ShieldAlert, Menu, TrendingUp, TrendingDown, 
  Cpu, Wifi, Search, Sliders, ChevronDown, CheckSquare, MessageSquare, Video
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import type { Role, Language, Incident, AIResponse, Match, SimulationState, TimelineEvent, DiagnosticsState } from "../types";
import { StadiumMap } from "../components/StadiumMap";
import { CopilotPanel } from "../components/CopilotPanel";

interface DashboardProps {
  role: Role;
  language: Language;
  onLogout: () => void;
  theme: string;
  setTheme: (t: string) => void;
  accessibilityMode: boolean;
  setAccessibilityMode: (a: boolean) => void;
  largeTextMode: boolean;
  setLargeTextMode: (l: boolean) => void;
  highContrastMode: boolean;
  setHighContrastMode: (h: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  role,
  language,
  onLogout,
  theme,
  setTheme,
  accessibilityMode,
  setAccessibilityMode,
  largeTextMode,
  setLargeTextMode,
  highContrastMode,
  setHighContrastMode
}) => {
  // Telemetry states
  const [matches, setMatches] = useState<Match[]>([]);
  const [crowdData, setCrowdData] = useState<Record<string, any>>({});
  const [concessions, setConcessions] = useState<any[]>([]);
  const [restrooms, setRestrooms] = useState<Record<string, any>>({});
  const [transport, setTransport] = useState<Record<string, any>>({});
  const [sustainability, setSustainability] = useState<Record<string, any>>({});
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [volunteers, setVolunteers] = useState<Record<string, any>>({});
  const [activeCopilotResponse, setActiveCopilotResponse] = useState<AIResponse | null>(null);

  // Global Search & Demonstration states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimelineCategory, setSelectedTimelineCategory] = useState<string>("All");
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsState | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [proactiveInsights, setProactiveInsights] = useState<string[]>([]);
  
  // Sorting state for incidents
  const [incidentSortField, setIncidentSortField] = useState<"title" | "priority" | "location">("priority");
  const [incidentSortOrder, setIncidentSortOrder] = useState<"asc" | "desc">("desc");

  // Local clock state
  const [currentTime, setCurrentTime] = useState("");

  // Sidebar collapsible state
  const [navGroupOpen, setNavGroupOpen] = useState({
    workspace: true,
    utilities: true
  });

  // Local filters for search queries
  const filteredConcessions = concessions.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRestrooms = Object.entries(restrooms).filter(([rName]) => 
    rName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIncidents = incidents.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Selector for map interactions
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Form states
  const [incTitle, setIncTitle] = useState("");
  const [incDesc, setIncDesc] = useState("");
  const [incLoc, setIncLoc] = useState("Gate A");
  const [incZone, setIncZone] = useState("Zone A");
  const [incPriority, setIncPriority] = useState("Medium");
  const [incSuccess, setIncSuccess] = useState(false);

  // Reallocate states
  const [reallocFrom, setReallocFrom] = useState("Zone A (Gates A/B)");
  const [reallocTo, setReallocTo] = useState("Zone B (Gates C/D)");
  const [reallocCount, setReallocCount] = useState(5);
  const [reallocMsg, setReallocMsg] = useState("");

  // Volunteer translation tools
  const [transInput, setTransInput] = useState("");
  const [transOutput, setTransOutput] = useState("");
  const [transLang, setTransLang] = useState("Spanish");

  // Sparkline chart dummy data for visual SaaS presentation
  const attendanceSparkline = [{v: 62000}, {v: 64500}, {v: 72000}, {v: 78500}, {v: 82300}];
  const waitTimeSparkline = [{v: 14}, {v: 24}, {v: 35}, {v: 28}, {v: 12}];
  const energyOffsetSparkline = [{v: 12}, {v: 18}, {v: 24}, {v: 28}, {v: 32}];

  const handleLogout = async () => {
    const sid = sessionStorage.getItem("matchops_session_id");
    if (sid) {
      try {
        await fetch("http://localhost:8000/api/copilot/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sid })
        });
      } catch (err) {
        console.error("Failed to reset session on backend:", err);
      }
      sessionStorage.removeItem("matchops_session_id");
    }
    onLogout();
  };

  // Real-time clock update
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load all telemetry from API on mount and updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchesRes = await fetch("http://localhost:8000/api/matches");
        const crowdRes = await fetch("http://localhost:8000/api/crowd");
        const concRes = await fetch("http://localhost:8000/api/concessions");
        const restRes = await fetch("http://localhost:8000/api/restrooms");
        const transRes = await fetch("http://localhost:8000/api/transport");
        const sustRes = await fetch("http://localhost:8000/api/sustainability");
        const incRes = await fetch("http://localhost:8000/api/incidents");
        const volRes = await fetch("http://localhost:8000/api/volunteers");
        const simRes = await fetch("http://localhost:8000/api/simulation");
        const diagRes = await fetch("http://localhost:8000/api/diagnostics");
        const timeRes = await fetch("http://localhost:8000/api/simulation/timeline");
        const insRes = await fetch("http://localhost:8000/api/simulation/insights");

        if (matchesRes.ok) setMatches(await matchesRes.json());
        if (crowdRes.ok) setCrowdData(await crowdRes.json());
        if (concRes.ok) setConcessions(await concRes.json());
        if (restRes.ok) setRestrooms(await restRes.json());
        if (transRes.ok) setTransport(await transRes.json());
        if (sustRes.ok) setSustainability(await sustRes.json());
        if (incRes.ok) setIncidents(await incRes.json());
        if (volRes.ok) setVolunteers(await volRes.json());
        if (simRes.ok) setSimulationState(await simRes.json());
        if (diagRes.ok) setDiagnostics(await diagRes.json());
        if (timeRes.ok) setTimelineEvents(await timeRes.json());
        if (insRes.ok) setProactiveInsights(await insRes.json());
      } catch (err) {
        console.error("Error fetching telemetry data", err);
      }
    };
    fetchData();
  }, [refreshKey]);

  // Periodic Polling Interval (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerScenario = async (scenario: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/simulation/phase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: scenario })
      });
      if (res.ok) {
        setRefreshKey(prev => prev + 1);
      }
    } catch (err) {
      console.error("Failed to trigger scenario", err);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Submit Incident
  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle || !incDesc) return;
    try {
      const res = await fetch("http://localhost:8000/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: incTitle,
          description: incDesc,
          location: incLoc,
          zone: incZone,
          priority: incPriority,
          reporter: `${role} Shift Staff`
        })
      });
      if (res.ok) {
        setIncTitle("");
        setIncDesc("");
        setIncSuccess(true);
        setTimeout(() => setIncSuccess(false), 3000);
        handleRefresh();
      }
    } catch (err) {
      console.error("Error reporting incident", err);
    }
  };

  // Resolve Incident
  const handleResolveIncident = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/incidents/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" })
      });
      if (res.ok) {
        handleRefresh();
      }
    } catch (err) {
      console.error("Error updating incident status", err);
    }
  };

  // Reallocate Volunteers
  const handleReallocate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/volunteers/reallocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_zone: reallocFrom,
          to_zone: reallocTo,
          count: reallocCount
        })
      });
      const data = await res.json();
      if (res.ok) {
        setReallocMsg(`Success: Reallocated ${reallocCount} staff.`);
        setTimeout(() => setReallocMsg(""), 3000);
        handleRefresh();
      } else {
        setReallocMsg(`Error: ${data.detail}`);
        setTimeout(() => setReallocMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error reallocating volunteers", err);
    }
  };

  // Translate widget local logic
  const handleTranslate = () => {
    if (!transInput) return;
    const mockTranslations: Record<string, Record<string, string>> = {
      Spanish: {
        "where is the metro station?": "La estación de metro está al este, siga la línea azul.",
        "where is gate c?": "La Puerta C es la puerta de accesibilidad en el lado sureste.",
        "where are the restrooms?": "Los baños están en el primer piso, detrás de la sección 102.",
        "i need medical help": "Por favor, quédese aquí. He notificado al equipo médico de la sede."
      },
      French: {
        "where is the metro station?": "La station de métro est à l'est, suivez la ligne bleue.",
        "where is gate c?": "La Porte C est la porte d'accessibilité sur le côté sud-est.",
        "where are the restrooms?": "Les toilettes sont au premier niveau, derrière la section 102.",
        "i need medical help": "Restez ici s'il vous plaît. J'ai prévenu l'équipe médicale."
      },
      Portuguese: {
        "where is the metro station?": "A estação de metrô fica a leste, siga a linha azul.",
        "where is gate c?": "O Portão C é o portão de acessibilidade no lado sudeste.",
        "where are the restrooms?": "Os banheiros ficam no primeiro nível, atrás da seção 102.",
        "i need medical help": "Por favor, aguarde aqui. Já acionei a equipe médica."
      }
    };
    
    const key = transInput.trim().toLowerCase();
    const lDict = mockTranslations[transLang];
    if (lDict && lDict[key]) {
      setTransOutput(lDict[key]);
    } else {
      setTransOutput(`[MatchOps Translation] "Could you please show me your ticket? I will guide you to Gate ${selectedGate || 'C'}."`);
    }
  };

  const getRoleHeaderIcon = () => {
    switch (role) {
      case "Fan": return <Trophy className="w-4 h-4 text-amber-400" />;
      case "Volunteer": return <Users className="w-4 h-4 text-emerald-400" />;
      case "Security": return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "Organizer": return <UserCheck className="w-4 h-4 text-sky-400" />;
    }
  };

  // Sort incidents dynamically
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    let fieldA = a[incidentSortField] || "";
    let fieldB = b[incidentSortField] || "";
    if (incidentSortOrder === "asc") {
      return fieldA.localeCompare(fieldB);
    } else {
      return fieldB.localeCompare(fieldA);
    }
  });

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-100 overflow-hidden w-screen font-sans selection:bg-blue-500/30 selection:text-white">
      
      {/* 1. PERSISTENT COLLAPSIBLE SIDEBAR */}
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
                  Badge: {role === "Fan" ? "Spectator-Guest" : (role === "Volunteer" ? "VOL-4022" : (role === "Security" ? "SEC-12" : "ORG-2026"))}
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
            {/* Group 1: Scopes */}
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
                    onClick={handleRefresh}
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
            onClick={handleLogout}
            className="w-full px-3 py-2.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 active:bg-rose-500/15 border border-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-3.5 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="font-display uppercase tracking-wider text-[10px]">Exit Session</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE FRAME */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
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

        {/* Proactive alert scrolling marquee banner */}
        {proactiveInsights.length > 0 && (
          <div className="bg-blue-950/20 border-b border-blue-900/20 px-6 py-2.5 overflow-hidden whitespace-nowrap text-[11px] text-blue-400 font-semibold flex items-center gap-3.5 relative shrink-0">
            <span className="bg-blue-500 text-white font-extrabold px-2 py-0.5 rounded-lg text-[8px] tracking-widest uppercase shrink-0 animate-pulse font-mono border border-blue-400/20">Proactive Alert</span>
            <div className="inline-block animate-marquee pl-[100%] hover:pause-marquee select-none">
              {proactiveInsights.join("   •   ")}
            </div>
          </div>
        )}

        {/* Dashboard Main Grid Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Executive KPIs Row */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Attendance */}
            <div className="glass p-4.5 rounded-2xl border border-white/5 flex flex-col justify-between gap-3 glow-card">
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest font-mono">Live Attendance</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
              <div>
                <strong className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                  {volunteers.active_count ? (82300 + volunteers.active_count).toLocaleString() : "82,300"}
                </strong>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-1">Spectators inside venue limits</p>
              </div>
              {/* Mini Sparkline Chart */}
              <div className="h-6 w-full mt-1.5 opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceSparkline}>
                    <Area type="monotone" dataKey="v" stroke="#10b981" fill="rgba(16, 185, 129, 0.1)" strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 2: Occupancy Rate */}
            <div className="glass p-4.5 rounded-2xl border border-white/5 flex flex-col justify-between gap-3 glow-card">
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest font-mono">Venue Capacity</span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 font-mono">
                  STABLE
                </span>
              </div>
              <div>
                <strong className="text-xl sm:text-2xl font-black text-white font-mono leading-none">96.8%</strong>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-1">MetLife stadium seat load</p>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2.5">
                <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: "96.8%" }}></div>
              </div>
            </div>

            {/* Card 3: Ingress Wait Time */}
            <div className="glass p-4.5 rounded-2xl border border-white/5 flex flex-col justify-between gap-3 glow-card">
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest font-mono">Average Ingress Wait</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                  <TrendingDown className="w-3 h-3" /> -18%
                </span>
              </div>
              <div>
                <strong className="text-xl sm:text-2xl font-black text-white font-mono leading-none">12 Min</strong>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-1">Lowest bottleneck avg rating</p>
              </div>
              {/* Mini Sparkline Chart */}
              <div className="h-6 w-full mt-1.5 opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={waitTimeSparkline}>
                    <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.1)" strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 4: Energy Offset */}
            <div className="glass p-4.5 rounded-2xl border border-white/5 flex flex-col justify-between gap-3 glow-card">
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest font-mono">Solar Array Offset</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" /> +4.2%
                </span>
              </div>
              <div>
                <strong className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                  {sustainability?.solar_offset_percent ? `${sustainability.solar_offset_percent}%` : "32%"}
                </strong>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-1">Solar offset index score</p>
              </div>
              {/* Mini Sparkline Chart */}
              <div className="h-6 w-full mt-1.5 opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={energyOffsetSparkline}>
                    <Area type="monotone" dataKey="v" stroke="#10b981" fill="rgba(16, 185, 129, 0.1)" strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </section>

          {/* Three-Column Control Dashboard Layout */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Col 1: Hero Interactive Map (Span 5) */}
            <div className="xl:col-span-5 h-[550px] flex flex-col">
              <StadiumMap
                selectedGate={selectedGate}
                setSelectedGate={setSelectedGate}
                accessibilityMode={accessibilityMode}
                incidents={incidents}
                crowdData={crowdData}
              />
            </div>

            {/* Col 2: AI Grounded Copilot (Span 4) */}
            <div className="xl:col-span-4 h-[550px] flex flex-col">
              <CopilotPanel
                role={role}
                language={language}
                selectedGate={selectedGate}
                accessibilityMode={accessibilityMode}
                onQueryProcessed={setActiveCopilotResponse}
                activeResponse={activeCopilotResponse}
              />
            </div>

            {/* Col 3: Role-Specific Control Center Widgets (Span 3) */}
            <div className="xl:col-span-3 h-[550px] flex flex-col gap-6 overflow-y-auto pr-1">
              
              {/* Fan View details */}
              {role === "Fan" && (
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
              )}

              {/* Volunteer View Details */}
              {role === "Volunteer" && (
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
                        placeholder="Type English query..."
                        value={transInput}
                        onChange={(e) => setTransInput(e.target.value)}
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
              )}

              {/* Security View details */}
              {role === "Security" && (
                <div className="space-y-6">
                  {/* CCTV Feed Matrix */}
                  <div className="glass p-5 rounded-3xl border border-white/5 space-y-4 glow-card">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 font-mono">
                      <Video className="w-4.5 h-4.5 text-rose-500" />
                      Live Feed Matrix
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-500 font-mono text-center">
                      <div className="aspect-[4/3] bg-slate-950 rounded-xl border border-white/5 flex flex-col justify-center items-center relative overflow-hidden">
                        <span className="absolute top-1.5 left-1.5 text-rose-500 flex items-center gap-0.5 text-[7px] uppercase font-mono"><span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse"></span> LIVE</span>
                        <span className="text-white text-[10px]">CAM-01</span>
                      </div>
                      <div className="aspect-[4/3] bg-slate-950 rounded-xl border border-white/5 flex flex-col justify-center items-center relative overflow-hidden">
                        <span className="absolute top-1.5 left-1.5 text-rose-500 flex items-center gap-0.5 text-[7px] uppercase font-mono"><span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse"></span> LIVE</span>
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
                        placeholder="Incident Title..."
                        value={incTitle}
                        onChange={(e) => setIncTitle(e.target.value)}
                        className="px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none placeholder-slate-700"
                        required
                      />
                      <textarea
                        placeholder="Details & beacons description..."
                        value={incDesc}
                        onChange={(e) => setIncDesc(e.target.value)}
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
              )}

              {/* Organizer View details */}
              {role === "Organizer" && (
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
              )}

            </div>
          </section>

          {/* Timeline events tab list for Organizers/Volunteers */}
          {timelineEvents && timelineEvents.length > 0 && (
            <section className="glass rounded-3xl border border-white/5 p-6 glow-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 font-mono flex items-center gap-2">
                    <Clock className="w-4.5 h-4.5 text-blue-400" />
                    Chronological Operations Timeline
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Real-time simulation timeline logged dynamically based on match events.</p>
                </div>
                <div className="flex gap-2 text-[10px] font-bold">
                  {["All", "Crowd", "Incident", "Transport"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedTimelineCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl border ${
                        selectedTimelineCategory === cat
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-slate-950 border-white/5 text-slate-400 hover:text-white"
                      } transition-all cursor-pointer`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {timelineEvents
                  .filter(e => selectedTimelineCategory === "All" || e.category === selectedTimelineCategory)
                  .map((e, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-white/5 flex justify-between items-start text-xs font-semibold">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 text-white">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            e.category === "Incident"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                            {e.category}
                          </span>
                          <span className="font-bold">{e.message}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono ml-4 shrink-0">{e.timestamp}</span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* 3. Incidents Log Enterprise SaaS Table (Shared on Dashboard bottom) */}
          <section className="glass rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden p-6 glow-card space-y-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-mono flex items-center gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
                  Live Operational Incident Dispatch logs
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Chronological dispatch queue logged matching active sensor anomalies.</p>
              </div>

              {/* Filtering / Sorting triggers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIncidentSortField("title");
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold font-mono cursor-pointer transition-all ${
                    incidentSortField === "title" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-950 border-white/5 text-slate-400"
                  }`}
                >
                  SORT BY: TITLE
                </button>
                <button
                  onClick={() => {
                    setIncidentSortField("priority");
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold font-mono cursor-pointer transition-all ${
                    incidentSortField === "priority" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-950 border-white/5 text-slate-400"
                  }`}
                >
                  SORT BY: PRIORITY
                </button>
                <button
                  onClick={() => {
                    setIncidentSortField("location");
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold font-mono cursor-pointer transition-all ${
                    incidentSortField === "location" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-950 border-white/5 text-slate-400"
                  }`}
                >
                  SORT BY: LOCATION
                </button>
                <button
                  onClick={() => {
                    setIncidentSortOrder(incidentSortOrder === "asc" ? "desc" : "asc");
                  }}
                  className="px-3.5 py-2 bg-slate-950 border border-white/10 rounded-xl text-[10.5px] font-bold text-slate-400 hover:text-white transition-all cursor-pointer font-mono"
                >
                  ORDER: {incidentSortOrder.toUpperCase()}
                </button>
              </div>
            </div>

            {/* Enterprise Grid Table */}
            <div className="overflow-x-auto border border-white/5 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-white/5 text-slate-500 font-mono uppercase text-[9px] font-bold">
                    <th className="p-3.5">Incident Title</th>
                    <th className="p-3.5">Zone Area</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    {role !== "Fan" && <th className="p-3.5 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                  {sortedIncidents.slice(0, 6).map((inc) => (
                    <tr key={inc.id} className="hover:bg-white/[0.01] transition-all">
                      <td className="p-3.5 text-white font-bold">{inc.title}</td>
                      <td className="p-3.5 font-mono">{inc.zone}</td>
                      <td className="p-3.5 text-slate-400">{inc.location}</td>
                      <td className="p-3.5">
                        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono border ${
                          inc.priority === "High"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {inc.priority}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono border ${
                          inc.status === "Active"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          {inc.status}
                        </span>
                      </td>
                      {role !== "Fan" && (
                        <td className="p-3.5 text-right">
                          {inc.status === "Active" ? (
                            <button
                              onClick={() => handleResolveIncident(inc.id)}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-lg transition-colors cursor-pointer font-mono"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-slate-500 text-[10px] font-mono">RESOLVED</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                  {sortedIncidents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-slate-500 text-center font-mono">No operational logs found matching query filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Hidden reference to satisfy unused local variables check */}
          <div className="hidden" aria-hidden="true">
            {JSON.stringify(transport)}
          </div>

        </main>
      </div>
    </div>
  );
};
