import React, { useState, useEffect } from "react";
import { LogOut, Sun, Moon, Users, Trophy, UserCheck, Accessibility, Trash2, Send, Clock, Activity, Navigation, RefreshCw, BarChart2, ShieldAlert, Menu, TrendingUp, TrendingDown, Cpu, Shield, Wifi } from "lucide-react";
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
      printErrorScenario(err);
    }
  };

  const printErrorScenario = (err: any) => {
    console.error("Failed to trigger scenario", err);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Submit Incident (Security / Volunteer)
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

  // Resolve Incident (Security / Organizer)
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

  // Reallocate Volunteers (Organizer)
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
      case "Fan": return <Trophy className="w-5 h-5 text-amber-400" />;
      case "Volunteer": return <Users className="w-5 h-5 text-emerald-400" />;
      case "Security": return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case "Organizer": return <UserCheck className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#070b13] text-gray-100 overflow-hidden w-screen">
      {/* PERSISTENT COLLAPSIBLE SIDEBAR */}
      <aside 
        className={`glass border-r border-white/5 transition-all duration-300 flex flex-col justify-between shrink-0 z-30 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col">
          {/* Sidebar Brand Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/5 h-16 shrink-0">
            {sidebarOpen && (
              <h1 className="text-base font-black tracking-wider text-white">
                MATCHOPS <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">AI</span>
              </h1>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all focus-ring"
              aria-label={sidebarOpen ? "Collapse navigation" : "Expand navigation"}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Active Profile Info */}
          <div className={`p-4 border-b border-white/5 ${sidebarOpen ? "" : "text-center"}`}>
            {sidebarOpen ? (
              <div className="p-3.5 bg-black/45 border border-white/5 rounded-2xl text-xs">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Authenticated Badge</span>
                <strong className="text-white flex items-center gap-1.5 mb-1.5">
                  {getRoleHeaderIcon()}
                  {role} Operator
                </strong>
                <div className="text-[10px] text-gray-400 font-mono select-all">Badge: {role === "Fan" ? "Guest Spectator" : (role === "Volunteer" ? "VOL-4022" : (role === "Security" ? "SEC-12" : "ORG-2026"))}</div>
              </div>
            ) : (
              <div className="inline-block p-2 rounded-xl bg-white/5 text-gray-300">
                {getRoleHeaderIcon()}
              </div>
            )}
          </div>

          {/* Navigation Links list */}
          <nav className="p-3 flex flex-col gap-1 text-xs font-semibold">
            <button 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 text-blue-400 border border-blue-500/20"
              title="Dashboard Overview"
            >
              <Activity className="w-4 h-4" />
              {sidebarOpen && <span>Overview</span>}
            </button>
            
            <button 
              onClick={handleRefresh}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left"
              title="Sync Sensors"
            >
              <RefreshCw className="w-4 h-4" />
              {sidebarOpen && <span>Sync Sensors</span>}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          {sidebarOpen && (
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
              Copilot: {language}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2.5 rounded-xl bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 text-red-400 font-bold text-xs flex items-center gap-3 transition-colors focus-ring"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Exit Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Workspace Top Header Bar */}
        <header className="glass px-6 h-16 border-b border-white/5 flex items-center justify-between sticky top-0 z-20 shrink-0">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-gray-400 shrink-0">
            <span className="hover:text-white transition-colors cursor-pointer">MatchOps AI</span>
            <span>&gt;</span>
            <span className="text-white flex items-center gap-1.5 mr-2">
              {getRoleHeaderIcon()}
              {role} Dashboard
            </span>
            {simulationState && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-[9px] font-bold text-blue-300">
                Phase: {simulationState.phase}
              </span>
            )}
          </nav>

          {/* Global Search Box */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs xl:max-w-md mx-4 bg-black/45 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus-within:border-blue-500 transition-colors">
            <span className="shrink-0 text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Search gates, facilities, incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="text-gray-400 hover:text-white font-bold"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Actions (Theme, Accessibility dropdown) */}
          <div className="flex items-center gap-3">
            {/* Accessibility configuration dropdown menu */}
            <div className="relative group">
              <button
                title="Accessibility Config"
                className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                  accessibilityMode || largeTextMode || highContrastMode
                    ? "bg-yellow-950/40 border-yellow-500 text-yellow-400"
                    : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                <Accessibility className="w-4 h-4" />
                <span className="hidden md:inline">Accessibility</span>
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-[#0d1321] border border-white/10 rounded-2xl p-4 shadow-2xl hidden group-hover:block hover:block">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Accessibility Panel</h4>
                <div className="flex flex-col gap-3">
                  {/* Wheelchair routing toggle */}
                  <label className="flex items-center justify-between cursor-pointer text-xs">
                    <span>Wheelchair-Friendly Paths</span>
                    <input
                      type="checkbox"
                      checked={accessibilityMode}
                      onChange={(e) => setAccessibilityMode(e.target.checked)}
                      className="accent-blue-500 rounded"
                    />
                  </label>
                  {/* Large Text Size toggle */}
                  <label className="flex items-center justify-between cursor-pointer text-xs">
                    <span>Large Text Size Mode</span>
                    <input
                      type="checkbox"
                      checked={largeTextMode}
                      onChange={(e) => setLargeTextMode(e.target.checked)}
                      className="accent-blue-500 rounded"
                    />
                  </label>
                  {/* High Contrast Mode Toggle */}
                  <label className="flex items-center justify-between cursor-pointer text-xs">
                    <span>High Contrast Theme</span>
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
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Proactive Insights Scrolling Marquee */}
        {proactiveInsights.length > 0 && (
          <div className="bg-blue-950/20 border-b border-blue-900/30 px-6 py-2 overflow-hidden whitespace-nowrap text-xs text-blue-400 font-semibold flex items-center gap-3.5 relative shrink-0">
            <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[9px] tracking-wide uppercase shrink-0 animate-pulse">Proactive Alert</span>
            <div className="inline-block animate-marquee pl-[100%] hover:pause-marquee select-none">
              {proactiveInsights.join("   •   ")}
            </div>
          </div>
        )}

        {/* Main Dash Grid */}
        <main className="flex-1 p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 overflow-hidden">
        {/* Col 1: Interactive SVG Stadium Map */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <StadiumMap
            selectedGate={selectedGate}
            setSelectedGate={setSelectedGate}
            accessibilityMode={accessibilityMode}
            incidents={incidents}
            crowdData={crowdData}
          />

          {/* Quick Stadium Match Status Card */}
          <div className="glass p-5 rounded-2xl glow-card flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1">Active Fixture Today</div>
              <h4 className="text-lg font-bold text-white">
                {matches.find(m => m.status === "Upcoming")?.teams || "Mexico vs Argentina"}
              </h4>
              <div className="text-xs text-gray-400 flex items-center gap-3.5 mt-1">
                <span>MetLife Stadium</span>
                <span>•</span>
                <span>Kickoff {matches.find(m => m.status === "Upcoming")?.time || "20:00"}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-950 border border-blue-900 text-blue-400 text-xs font-bold uppercase">
              {matches.find(m => m.status === "Upcoming")?.stage || "Quarterfinal"}
            </span>
          </div>
        </div>

        {/* Col 2: AI Copilot and reasoning timelines */}
        <div className="xl:col-span-1 flex flex-col">
          <CopilotPanel
            role={role}
            language={language}
            selectedGate={selectedGate}
            accessibilityMode={accessibilityMode}
            onQueryProcessed={setActiveCopilotResponse}
            activeResponse={activeCopilotResponse}
          />
        </div>

        {/* Col 3: Role-Specific Operational Workspaces */}
        <div className="xl:col-span-1 flex flex-col gap-6 overflow-y-auto pr-1">
          {/* FAN OPERATIONS WORKSPACE */}
          {role === "Fan" && (
            <div className="flex flex-col gap-6">
              <div className="glass p-6 rounded-2xl glow-card">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-amber-400" />
                  Your Transit & Routing Plan
                </h3>

                <div className="flex flex-col gap-4 text-xs">
                  {/* Gate Card */}
                  <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Entry Gate Guidance</span>
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-white text-sm">Gate C (Accessibility Gate)</strong>
                        <div className="text-gray-400 mt-0.5">Lowest queue delay (5m wait time)</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">
                        Fluid
                      </span>
                    </div>
                  </div>

                  {/* Restroom Card */}
                  <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2">Fastest Accessible Restrooms</span>
                    <div className="flex flex-col gap-2">
                      {filteredRestrooms.slice(0, 2).map(([rName, rData]: any) => (
                        <div key={rName} className="flex justify-between items-center text-xs">
                          <span className="text-gray-300 font-medium">{rName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rData.congestion === 'High' ? 'bg-red-950 text-red-400' : (rData.congestion === 'Medium' ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400')
                          }`}>
                            {rData.wait_time_minutes}m wait
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Concessions Card */}
                  <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2">Concession Queue Times</span>
                    <div className="flex flex-col gap-2">
                      {filteredConcessions.slice(0, 3).map(c => (
                        <div key={c.id} className="flex justify-between items-center text-xs">
                          <span className="text-gray-300">{c.name} ({c.section})</span>
                          <span className="text-white font-bold">{c.wait_time_minutes}m</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transport Card */}
                  <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2">Metro & Parking Advisory</span>
                    {transport.metro ? (
                      <div className="flex flex-col gap-2 text-xs">
                        <div className="flex justify-between items-center">
                          <div>
                            <strong className="text-white">{transport.metro.station}</strong>
                            <div className="text-gray-400 text-[10px]">{transport.metro.recommended_for}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold">
                            {transport.metro.frequency_minutes}m frequency
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-2">
                          <div>
                            <strong className="text-white">Rideshare {transport.rideshare.zone}</strong>
                            <div className="text-gray-400 text-[10px]">Pricing: {transport.rideshare.surge_pricing}</div>
                          </div>
                          <span className="text-gray-300 font-bold">{transport.rideshare.average_wait_minutes}m wait</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">Loading transport advisory...</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sustainability incentive widget for fans */}
              <div className="glass p-6 rounded-2xl glow-card border-l-4 border-l-emerald-500">
                <h4 className="text-sm font-bold uppercase text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4" />
                  Green Matchday Rewards
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  Sort your beverage containers at any **Eco-Hub Bin** on Concourse Level 1. Scanned compost/recycle deposits unlock 15% discounts at merchandise stores!
                </p>
                <div className="text-[10px] text-gray-400 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg">
                  💡 <strong>Did you know?</strong> 84% of stadium waste is diverted from landfills today!
                </div>
              </div>
            </div>
          )}

          {/* VOLUNTEER WORKSPACE */}
          {role === "Volunteer" && (
            <div className="flex flex-col gap-6">
              {/* Assignment Card */}
              <div className="glass p-6 rounded-2xl glow-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block mb-1">Active Assignment</span>
                    <h3 className="text-lg font-bold text-white">Zone B (Gates C/D)</h3>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Shift hours: 16:00 - 22:30
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-900 text-emerald-400 text-xs font-bold uppercase">
                    On Duty
                  </span>
                </div>

                {/* Task Checklist */}
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shift Checklist</h4>
                <div className="flex flex-col gap-2 text-xs">
                  <label className="flex items-center gap-2.5 p-2.5 bg-black/40 border border-white/5 rounded-xl cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                    <span className="line-through text-gray-500">Confirm accessibility gates C/D are clear of barriers</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-2.5 bg-black/40 border border-white/5 rounded-xl cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                    <span className="line-through text-gray-500">Distribute waste diversion pamphlets to fans</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-2.5 bg-black/40 border border-white/5 rounded-xl cursor-pointer">
                    <input type="checkbox" className="rounded accent-emerald-500" />
                    <span>Redirect Gate A foot traffic to Gate B (turnstile scan delay active)</span>
                  </label>
                </div>
              </div>

              {/* Report incident directly */}
              <div className="glass p-6 rounded-2xl glow-card">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-300">
                  Quick-Report Stadium Incident
                </h3>
                <form onSubmit={handleReportIncident} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Short Title (e.g. Broken turnstile scanner)"
                    value={incTitle}
                    onChange={(e) => setIncTitle(e.target.value)}
                    className="px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <textarea
                    placeholder="Provide description..."
                    rows={2}
                    value={incDesc}
                    onChange={(e) => setIncDesc(e.target.value)}
                    className="px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                    required
                  ></textarea>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={incLoc}
                      onChange={(e) => setIncLoc(e.target.value)}
                      className="px-2.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white cursor-pointer"
                    >
                      <option value="Gate A">Gate A</option>
                      <option value="Gate B">Gate B</option>
                      <option value="Gate C">Gate C</option>
                      <option value="Block 114">Block 114</option>
                      <option value="Section 102">Section 102</option>
                    </select>
                    <select
                      value={incZone}
                      onChange={(e) => setIncZone(e.target.value)}
                      className="px-2.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white cursor-pointer"
                    >
                      <option value="Zone A">Zone A</option>
                      <option value="Zone B">Zone B</option>
                      <option value="Level 1 Concourse">L1 Concourse</option>
                    </select>
                    <select
                      value={incPriority}
                      onChange={(e) => setIncPriority(e.target.value)}
                      className="px-2.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white cursor-pointer"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  {incSuccess && (
                    <div className="text-xs text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-xl text-center">
                      Report submitted to Venue Security
                    </div>
                  )}
                  <button
                    type="submit"
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Report
                  </button>
                </form>
              </div>

              {/* Translation Tool Widget */}
              <div className="glass p-6 rounded-2xl glow-card">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-300">
                  Multilingual Fan Help Tool
                </h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type English phrase (e.g. where are the restrooms?)"
                    value={transInput}
                    onChange={(e) => setTransInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  />
                  <select
                    value={transLang}
                    onChange={(e) => setTransLang(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl px-2 text-xs text-white cursor-pointer"
                  >
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Portuguese">Portuguese</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleTranslate}
                  className="w-full py-1.5 bg-blue-600/40 hover:bg-blue-500/50 border border-blue-500/30 text-blue-300 font-bold rounded-xl text-xs transition-colors"
                >
                  Translate Phrase
                </button>
                {transOutput && (
                  <div className="mt-2.5 p-3 bg-black/40 border border-white/5 rounded-xl text-xs text-emerald-400 leading-relaxed font-semibold">
                    {transOutput}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECURITY STAFF WORKSPACE */}
          {role === "Security" && (
            <div className="flex flex-col gap-6">
              {/* CCTV grid simulator */}
              <div className="glass p-6 rounded-2xl glow-card">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-red-500" />
                  Live CCTV Sensor Matrix
                </h3>
                <div className="grid grid-cols-2 gap-2 text-center text-[10px] text-gray-400 font-bold font-mono">
                  <div className="aspect-[4/3] bg-black border border-white/5 rounded-xl flex flex-col justify-center items-center relative overflow-hidden">
                    <span className="absolute top-2 left-2 text-emerald-500 animate-pulse">● LIVE</span>
                    <span>CAM-01: GATE A</span>
                    <span className="text-[8px] text-red-400 mt-1">Scanner Queue Peak</span>
                  </div>
                  <div className="aspect-[4/3] bg-black border border-white/5 rounded-xl flex flex-col justify-center items-center relative overflow-hidden">
                    <span className="absolute top-2 left-2 text-emerald-500 animate-pulse">● LIVE</span>
                    <span>CAM-02: METRO HUB</span>
                  </div>
                  <div className="aspect-[4/3] bg-black border border-white/5 rounded-xl flex flex-col justify-center items-center relative overflow-hidden">
                    <span className="absolute top-2 left-2 text-emerald-500 animate-pulse">● LIVE</span>
                    <span>CAM-03: BLOCK 114</span>
                    <span className="text-[8px] text-red-400 mt-1">Emergency dispatch active</span>
                  </div>
                  <div className="aspect-[4/3] bg-black border border-white/5 rounded-xl flex flex-col justify-center items-center relative overflow-hidden">
                    <span className="absolute top-2 left-2 text-emerald-500 animate-pulse">● LIVE</span>
                    <span>CAM-04: CONCOURSE L1</span>
                  </div>
                </div>
              </div>

              {/* Incidents management board */}
              <div className="glass p-6 rounded-2xl glow-card">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-300">
                  Active Incidents Command
                </h3>
                <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
                  {filteredIncidents.filter(i => i.status === "Active").map((inc) => (
                    <div key={inc.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-white text-xs">{inc.title}</strong>
                          <div className="text-[10px] text-gray-400 mt-0.5">{inc.location} • {inc.zone}</div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          inc.priority === "High" ? "bg-red-950 text-red-400" : "bg-amber-950 text-amber-400"
                        }`}>
                          {inc.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed">
                        {inc.description}
                      </p>
                      <button
                        onClick={() => handleResolveIncident(inc.id)}
                        className="self-end px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-950 text-emerald-400 font-bold text-[10px] rounded-lg transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispatch Form */}
              <div className="glass p-6 rounded-2xl glow-card">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-300">
                  Dispatch New Incident
                </h3>
                <form onSubmit={handleReportIncident} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Incident Title..."
                    value={incTitle}
                    onChange={(e) => setIncTitle(e.target.value)}
                    className="px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <textarea
                    placeholder="Incident details..."
                    rows={2}
                    value={incDesc}
                    onChange={(e) => setIncDesc(e.target.value)}
                    className="px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                    required
                  ></textarea>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={incLoc}
                      onChange={(e) => setIncLoc(e.target.value)}
                      className="px-2.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white cursor-pointer"
                    >
                      <option value="Gate A">Gate A</option>
                      <option value="Gate B">Gate B</option>
                      <option value="Gate C">Gate C</option>
                      <option value="Block 114">Block 114</option>
                      <option value="Section 102">Section 102</option>
                    </select>
                    <select
                      value={incZone}
                      onChange={(e) => setIncZone(e.target.value)}
                      className="px-2.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white cursor-pointer"
                    >
                      <option value="Zone A">Zone A</option>
                      <option value="Zone B">Zone B</option>
                      <option value="Level 1 Concourse">L1 Concourse</option>
                    </select>
                    <select
                      value={incPriority}
                      onChange={(e) => setIncPriority(e.target.value)}
                      className="px-2.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  {incSuccess && (
                    <div className="text-xs text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-xl text-center">
                      Incident dispatched successfully
                    </div>
                  )}
                  <button
                    type="submit"
                    className="py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/20"
                  >
                    <Send className="w-3.5 h-3.5" /> Dispatch Security
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ORGANIZER OPERATIONS WORKSPACE */}
          {role === "Organizer" && (
            <div className="flex flex-col gap-6">
              
              {/* Demo Mode Scenario Selectors */}
              <div className="glass p-5 rounded-2xl glow-card flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-500/80 animate-pulse" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Live Demo Mode Scenarios
                  </h4>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal">
                  Instantly switch simulation phases to update sensor streams and verify proactive routing recommendations.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 mt-1.5">
                  {[
                    { phase: "Pre-match", label: "Pre-Match" },
                    { phase: "Entry Rush", label: "Entry Rush" },
                    { phase: "Kickoff", label: "Kickoff" },
                    { phase: "Halftime", label: "Halftime" },
                    { phase: "Second Half", label: "2nd Half" },
                    { phase: "Final Whistle", label: "Full Time" },
                    { phase: "Exit Rush", label: "Exit Rush" },
                    { phase: "Stadium Closed", label: "Closed" },
                    { phase: "Emergency Scenario", label: "🚨 Emergency" },
                    { phase: "Heavy Crowd", label: "👥 Crowd Peak" },
                    { phase: "Transport Delay", label: "🚇 Transit Delay" },
                    { phase: "Accessibility Surge", label: "♿ Access Surge" }
                  ].map((scen) => {
                    const isActive = simulationState?.phase === scen.phase;
                    return (
                      <button
                        key={scen.phase}
                        onClick={() => handleTriggerScenario(scen.phase)}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          isActive
                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-950/40"
                            : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {scen.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Organizer Executive Health & Operations Dashboard KPIs */}
              {simulationState?.kpis && (
                <div className="glass p-6 rounded-2xl glow-card flex flex-col gap-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.08)]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-bold tracking-wide text-white">
                      Operational KPIs
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(simulationState.kpis).map(([key, kpi]: [string, any]) => {
                      const statusBorder = kpi.status === "critical"
                        ? "border-l-4 border-l-red-500 bg-red-950/10"
                        : (kpi.status === "warning" ? "border-l-4 border-l-yellow-500 bg-yellow-950/10" : "border-l-4 border-l-emerald-500 bg-emerald-950/10");
                      
                      const trendIcon = kpi.trend === "up" 
                        ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> 
                        : (kpi.trend === "down" ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> : <Clock className="w-3.5 h-3.5 text-gray-400" />);
                      
                      const formattedName = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");

                      return (
                        <div key={key} className={`p-3 border border-white/5 rounded-r-xl flex flex-col gap-1.5 hover:border-white/10 transition-all ${statusBorder}`}>
                          <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                            <span>{formattedName}</span>
                            <div className="flex items-center gap-1">
                              {trendIcon}
                              <span className={kpi.trend === "up" ? "text-emerald-400" : (kpi.trend === "down" ? "text-red-400" : "text-gray-400")}>
                                {kpi.trend}
                              </span>
                            </div>
                          </div>
                          <div className="text-lg font-black text-white">{kpi.score}</div>
                          <p className="text-[10px] text-gray-300 leading-normal font-semibold">{kpi.explanation}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Copilot diagnostics & Health Panel */}
              {diagnostics && (
                <div className="glass p-5 rounded-2xl glow-card flex flex-col gap-3">
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-emerald-500/80 animate-pulse" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      MatchOps AI Health Diagnostics
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-[9.5px] font-semibold text-gray-400 font-mono">
                    <div className="p-2 bg-black/45 border border-white/5 rounded-lg">
                      Gemini availability: <strong className={diagnostics.gemini_availability === "Available" ? "text-emerald-400" : "text-red-400"}>{diagnostics.gemini_availability}</strong>
                    </div>
                    <div className="p-2 bg-black/45 border border-white/5 rounded-lg">
                      Fallback status: <strong className={diagnostics.fallback_status === "Active" ? "text-yellow-400 animate-pulse" : "text-gray-400"}>{diagnostics.fallback_status}</strong>
                    </div>
                    <div className="p-2 bg-black/45 border border-white/5 rounded-lg col-span-2">
                      Average response time: <strong className="text-white">{diagnostics.average_response_time_ms}ms</strong>
                    </div>
                    <div className="p-2 bg-black/45 border border-white/5 rounded-lg">
                      Session memory: <strong className="text-white">{diagnostics.session_memory_status}</strong>
                    </div>
                    <div className="p-2 bg-black/45 border border-white/5 rounded-lg">
                      Confidence logic: <strong className="text-white">{diagnostics.confidence_distribution}</strong>
                    </div>
                    <div className="p-2 bg-black/45 border border-white/5 rounded-lg col-span-2">
                      Schema validation: <strong className="text-emerald-400">{diagnostics.prompt_validation_status}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Sustainability widget */}
              <div className="glass p-6 rounded-2xl glow-card">
                <div className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-400 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-emerald-500/80" />
                  <span>Sustainability Telemetry</span>
                </div>
                <div className="flex flex-col gap-4 text-xs">
                  <div>
                    <div className="flex justify-between items-center text-gray-300 font-bold mb-1">
                      <span>Solar Array Grid Offset</span>
                      <span className="text-emerald-400">{sustainability.energy_offset_percent}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sustainability.energy_offset_percent}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-gray-300 font-bold mb-1">
                      <span>Landfill Diversion Rate</span>
                      <span className="text-emerald-400">{sustainability.waste_diverted_percent}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sustainability.waste_diverted_percent}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 bg-black/40 p-2.5 rounded-xl border border-white/5 font-semibold">
                    <div>Water Saved: <strong>{sustainability.water_used_gallons} gal</strong></div>
                    <div>CO2 Saved: <strong>{sustainability.carbon_saved_tons} tons</strong></div>
                  </div>
                </div>
              </div>

              {/* Volunteer Allocation reallocator tool */}
              <div className="glass p-6 rounded-2xl glow-card">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-400">
                  Staff Resource Reallocation
                </h4>
                
                <div className="flex flex-col gap-2.5 mb-4 text-xs font-semibold">
                  {volunteers.allocations && Object.entries(volunteers.allocations).map(([zName, count]: any) => (
                    <div key={zName} className="flex justify-between items-center p-2 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-gray-400">{zName}</span>
                      <span className="text-white bg-blue-950 px-2 py-0.5 border border-blue-900 rounded font-bold">{count} Staff</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleReallocate} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">From Zone</label>
                    <select
                      value={reallocFrom}
                      onChange={(e) => setReallocFrom(e.target.value)}
                      className="px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white cursor-pointer focus:outline-none"
                    >
                      <option value="Zone A (Gates A/B)">Zone A (Gates A/B)</option>
                      <option value="Zone B (Gates C/D)">Zone B (Gates C/D)</option>
                      <option value="Level 1 Concourse">Level 1 Concourse</option>
                      <option value="Transport Hubs">Transport Hubs</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">To Zone</label>
                    <select
                      value={reallocTo}
                      onChange={(e) => setReallocTo(e.target.value)}
                      className="px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white cursor-pointer focus:outline-none"
                    >
                      <option value="Zone A (Gates A/B)">Zone A (Gates A/B)</option>
                      <option value="Zone B (Gates C/D)">Zone B (Gates C/D)</option>
                      <option value="Level 1 Concourse">Level 1 Concourse</option>
                      <option value="Transport Hubs">Transport Hubs</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Quantity (Staff)</label>
                    <input
                      type="number"
                      value={reallocCount}
                      onChange={(e) => setReallocCount(parseInt(e.target.value) || 0)}
                      className="px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                      min={1}
                    />
                  </div>
                  {reallocMsg && (
                    <div className="text-xs text-center font-bold bg-white/5 border border-white/10 p-2 rounded-xl">
                      {reallocMsg}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Reallocate Staff
                  </button>
                </form>
              </div>

              {/* Live Operations Timeline */}
              <div className="glass p-6 rounded-2xl glow-card flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Live Operations Timeline
                  </h4>
                  {simulationState && (
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Score: {matches.find(m => m.id === "match-02")?.score || "N/A"}
                    </span>
                  )}
                </div>

                {/* Timeline categories tag filters */}
                <div className="flex flex-wrap gap-1 border-b border-white/5 pb-3">
                  {["All", "Match Phase", "Incident", "Transport", "Staffing", "AI Recommendation"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedTimelineCategory(cat)}
                      className={`px-2 py-1 rounded-full text-[9px] font-bold border transition-all ${
                        selectedTimelineCategory === cat
                          ? "bg-blue-600/35 border-blue-500 text-blue-300"
                          : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Chronological events list */}
                <div className="flex flex-col gap-4 text-xs text-gray-300 max-h-[300px] overflow-y-auto pr-1">
                  {timelineEvents
                    .filter((evt) => selectedTimelineCategory === "All" || evt.category === selectedTimelineCategory)
                    .filter((evt) => {
                      if (!searchQuery) return true;
                      return (
                        evt.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        evt.category.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                    })
                    .slice()
                    .reverse() // Display newest first
                    .map((evt) => {
                      const dotColor = evt.severity === "High" || evt.severity === "Critical"
                        ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                        : (evt.severity === "Medium" ? "bg-amber-500" : "bg-blue-500");
                      
                      const formattedTime = new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                      return (
                        <div key={evt.id} className="relative pl-6 border-l border-white/10 ml-2">
                          <span className={`absolute -left-[5.5px] top-1 w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                          <div className="text-[10px] text-gray-500 font-bold flex justify-between">
                            <span>{evt.category}</span>
                            <span>{formattedTime}</span>
                          </div>
                          <p className="text-[11px] text-gray-200 mt-0.5 leading-relaxed font-semibold">{evt.message}</p>
                        </div>
                      );
                    })}
                  {timelineEvents.length === 0 && (
                    <div className="text-gray-500 text-center py-4">No logged operations events.</div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
};
