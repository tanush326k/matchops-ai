import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  LogOut, Sun, Moon, Users, Trophy, UserCheck, Accessibility, Trash2, Clock, 
  Activity, Navigation, RefreshCw, ShieldAlert, Menu, TrendingUp, 
  Cpu, Wifi, Search, Sliders, ChevronDown, CheckSquare, MessageSquare, Video
} from "lucide-react";
import type { Role, Language, Incident, AIResponse, Match, SimulationState, TimelineEvent, DiagnosticsState } from "../types";
import { StadiumMap } from "../components/StadiumMap";
import { CopilotPanel } from "../components/CopilotPanel";
import { MetricCard } from "../components/ui/MetricCard";
import { GlassCard } from "../components/ui/GlassCard";
import { DataTable } from "../components/ui/DataTable";
import { StatusBadge } from "../components/ui/StatusBadge";
import { EventHeroBanner } from "../components/ui/EventHeroBanner";
import { OpsTimeline } from "../components/ui/OpsTimeline";
import { EmergencyReadiness } from "../components/ui/EmergencyReadiness";
import { WeatherIntelligence } from "../components/ui/WeatherIntelligence";
import { GeminiOpsFeed } from "../components/ui/GeminiOpsFeed";

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

  // Local clock state
  const [currentTime, setCurrentTime] = useState("");

  // Sidebar collapsible state
  const [navGroupOpen, setNavGroupOpen] = useState({
    workspace: true,
    utilities: true
  });

  // Memoized filters — only recompute when data or query changes
  const filteredConcessions = useMemo(() =>
    concessions.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.section.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [concessions, searchQuery]
  );

  const filteredRestrooms = useMemo(() =>
    Object.entries(restrooms).filter(([rName]) =>
      rName.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [restrooms, searchQuery]
  );

  // Selector for map interactions
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
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

  // Memoized static sparkline data — never recreated
  const attendanceSparkline = useMemo(() => [{v: 62000}, {v: 64500}, {v: 72000}, {v: 78500}, {v: 82300}], []);
  const waitTimeSparkline = useMemo(() => [{v: 14}, {v: 24}, {v: 35}, {v: 28}, {v: 12}], []);
  const energyOffsetSparkline = useMemo(() => [{v: 12}, {v: 18}, {v: 24}, {v: 28}, {v: 32}], []);

  const handleLogout = useCallback(async () => {
    const sid = sessionStorage.getItem("matchops_session_id");
    if (sid) {
      try {
        await fetch("http://localhost:8000/api/copilot/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sid })
        });
      } catch {
        // silent — logout proceeds regardless
      }
      sessionStorage.removeItem("matchops_session_id");
    }
    onLogout();
  }, [onLogout]);

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

  // Single self-contained polling effect — avoids double-fetch on mount
  // Uses a ref so fetchData closure always has latest abort signal
  const fetchData = useCallback(async (signal?: AbortSignal) => {
    try {
      const [matchesRes, crowdRes, concRes, restRes, sustRes, incRes, volRes, simRes, diagRes, timeRes, insRes] =
        await Promise.all([
          fetch("http://localhost:8000/api/matches", { signal }),
          fetch("http://localhost:8000/api/crowd", { signal }),
          fetch("http://localhost:8000/api/concessions", { signal }),
          fetch("http://localhost:8000/api/restrooms", { signal }),
          fetch("http://localhost:8000/api/sustainability", { signal }),
          fetch("http://localhost:8000/api/incidents", { signal }),
          fetch("http://localhost:8000/api/volunteers", { signal }),
          fetch("http://localhost:8000/api/simulation", { signal }),
          fetch("http://localhost:8000/api/diagnostics", { signal }),
          fetch("http://localhost:8000/api/simulation/timeline", { signal }),
          fetch("http://localhost:8000/api/simulation/insights", { signal }),
        ]);
      // Batch all state updates so React flushes them in one render
      if (matchesRes.ok) setMatches(await matchesRes.json());
      if (crowdRes.ok) setCrowdData(await crowdRes.json());
      if (concRes.ok) setConcessions(await concRes.json());
      if (restRes.ok) setRestrooms(await restRes.json());
      if (sustRes.ok) setSustainability(await sustRes.json());
      if (incRes.ok) setIncidents(await incRes.json());
      if (volRes.ok) setVolunteers(await volRes.json());
      if (simRes.ok) setSimulationState(await simRes.json());
      if (diagRes.ok) setDiagnostics(await diagRes.json());
      if (timeRes.ok) setTimelineEvents(await timeRes.json());
      if (insRes.ok) setProactiveInsights(await insRes.json());
    } catch {
      // AbortError on cleanup — silently ignored
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    const interval = setInterval(() => fetchData(controller.signal), 5000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [fetchData]);

  const handleTriggerScenario = useCallback(async (scenario: string) => {
    try {
      await fetch("http://localhost:8000/api/simulation/phase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: scenario })
      });
      fetchData();
    } catch {
      // silent
    }
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Submit Incident
  const handleReportIncident = useCallback(async (e: React.FormEvent) => {
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
        fetchData();
      }
    } catch {
      // silent
    }
  }, [incTitle, incDesc, incLoc, incZone, incPriority, role, fetchData]);

  // Resolve Incident
  const handleResolveIncident = useCallback(async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/incidents/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" })
      });
      if (res.ok) fetchData();
    } catch {
      // silent
    }
  }, [fetchData]);

  // Reallocate Volunteers
  const handleReallocate = useCallback(async (e: React.FormEvent) => {
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
        fetchData();
      } else {
        setReallocMsg(`Error: ${data.detail}`);
        setTimeout(() => setReallocMsg(""), 3000);
      }
    } catch {
      // silent
    }
  }, [reallocFrom, reallocTo, reallocCount, fetchData]);

  // Translate widget local logic
  const handleTranslate = useCallback(() => {
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
  }, [transInput, transLang, selectedGate]);

  const getRoleHeaderIcon = useCallback(() => {
    switch (role) {
      case "Fan": return <Trophy className="w-4 h-4 text-amber-400" />;
      case "Volunteer": return <Users className="w-4 h-4 text-emerald-400" />;
      case "Security": return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "Organizer": return <UserCheck className="w-4 h-4 text-sky-400" />;
    }
  }, [role]);

  // Memoized KPI values — recomputed only when underlying data changes
  const activeIncidentCount = useMemo(() => incidents.filter(i => i.status === "Active").length, [incidents]);
  const liveAttendance = useMemo(() => volunteers.active_count ? (82300 + volunteers.active_count) : 82300, [volunteers.active_count]);

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

        {/* Event Hero Banner — live match context */}
        <EventHeroBanner
          matches={matches}
          attendance={liveAttendance}
          simulationPhase={simulationState?.phase || null}
          currentTime={currentTime}
          aiStatus="Live"
        />

        {/* Dashboard Main Grid Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Executive KPIs Row — 6 metric cards */}
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            
            <MetricCard 
              title="Live Attendance"
              value={liveAttendance.toLocaleString()}
              subtitle="Spectators in venue"
              trend="up"
              trendValue="+12%"
              sparklineData={attendanceSparkline}
              sparklineColor="#10b981"
              icon={<Users className="w-4 h-4" />}
            />

            <MetricCard 
              title="Venue Capacity"
              value="96.8%"
              subtitle="MetLife seat load"
              trend="neutral"
              trendValue="STABLE"
              icon={<Activity className="w-4 h-4" />}
            />

            <MetricCard 
              title="Avg Ingress Wait"
              value="12 Min"
              subtitle="Bottleneck avg"
              trend="down"
              trendValue="-18%"
              sparklineData={waitTimeSparkline}
              sparklineColor="#3b82f6"
              icon={<Clock className="w-4 h-4" />}
            />

            <MetricCard 
              title="Solar Offset"
              value={sustainability?.solar_offset_percent ? `${sustainability.solar_offset_percent}%` : "32%"}
              subtitle="Renewable index"
              trend="up"
              trendValue="+4.2%"
              sparklineData={energyOffsetSparkline}
              sparklineColor="#10b981"
              icon={<TrendingUp className="w-4 h-4" />}
            />

            <MetricCard
              title="Active Incidents"
              value={activeIncidentCount.toString()}
              subtitle="Open dispatch queue"
              trend={activeIncidentCount > 3 ? "up" : "down"}
              trendValue={activeIncidentCount > 3 ? "HIGH" : "NOMINAL"}
              icon={<ShieldAlert className="w-4 h-4" />}
            />

            <MetricCard
              title="AI Confidence"
              value={`${simulationState?.kpis?.ai_confidence?.score ?? "91"}%`}
              subtitle="Gemini decision quality"
              trend="up"
              trendValue="+3%"
              icon={<Cpu className="w-4 h-4" />}
            />

          </section>

          {/* Main Hero Area: Stadium Map and Copilot */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            
            {/* Hero Interactive Map (2/3 width) — taller for Mission Control feel */}
            <div className="xl:col-span-2 h-[720px] flex flex-col">
              <StadiumMap
                selectedGate={selectedGate}
                setSelectedGate={setSelectedGate}
                accessibilityMode={accessibilityMode}
                incidents={incidents}
                crowdData={crowdData}
              />
            </div>

            {/* AI Grounded Copilot (1/3 width) */}
            <div className="xl:col-span-1 h-[720px] flex flex-col">
              <CopilotPanel
                role={role}
                language={language}
                selectedGate={selectedGate}
                accessibilityMode={accessibilityMode}
                onQueryProcessed={setActiveCopilotResponse}
                activeResponse={activeCopilotResponse}
              />
            </div>
          </section>

          {/* Secondary Control Area: Role Widgets & Tables */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            
            {/* Col 1: Role-Specific Control Center Widgets (Span 1) */}
            <div className="xl:col-span-1 flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              
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

              {/* Always-visible: Weather + Emergency Readiness for all roles */}
              <WeatherIntelligence />
              <EmergencyReadiness />

            </div>

            {/* Col 2 & 3: OpsTimeline + Incidents + GeminiOpsFeed (Span 2) */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              
              {/* Live Ops Timeline — always visible, with fallback data */}
              <div className="h-80">
                <OpsTimeline
                  events={timelineEvents}
                  selectedCategory={selectedTimelineCategory}
                  setSelectedCategory={setSelectedTimelineCategory}
                />
              </div>

              {/* Incidents Log Enterprise SaaS Table */}
              <GlassCard className="flex flex-col flex-1 min-h-[300px]">
                <div className="mb-4 space-y-1">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-mono flex items-center gap-2">
                    <ShieldAlert className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
                    Live Operational Incident Dispatch
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Chronological dispatch queue logged matching active sensor anomalies.</p>
                </div>

                <div className="flex-1 h-full min-h-0">
                  <DataTable 
                    columns={[
                      { key: "title", header: "Incident Title" },
                      { key: "zone", header: "Zone" },
                      { key: "location", header: "Location" },
                      { 
                        key: "priority", 
                        header: "Priority",
                        render: (row) => <StatusBadge status={row.priority} />
                      },
                      { 
                        key: "status", 
                        header: "Status",
                        render: (row) => <StatusBadge status={row.status} />
                      },
                      ...(role !== "Fan" ? [{
                        key: "actions",
                        header: "Actions",
                        render: (row: Incident) => (
                          row.status === "Active" ? (
                            <button
                              onClick={() => handleResolveIncident(row.id)}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-lg transition-colors cursor-pointer font-mono"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-slate-500 text-[10px] font-mono">RESOLVED</span>
                          )
                        )
                      }] : [])
                    ]}
                    data={incidents}
                    searchPlaceholder="Search incidents, locations, zones..."
                    itemsPerPage={4}
                  />
                </div>
              </GlassCard>

              {/* Gemini Operations Feed — AI insights */}
              <div className="h-[480px]">
                <GeminiOpsFeed />
              </div>

            </div>
          </section>

        </main>
      </div>
    </div>
  );
};
