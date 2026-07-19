import { API_BASE } from "../config/api";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Users, Clock, Activity, ShieldAlert, TrendingUp, Cpu } from "lucide-react";
import type { Role, Language, Incident, AIResponse } from "../types";

// Layout components
import { Sidebar } from "../components/layout/Sidebar";
import { DashboardHeader } from "../components/layout/DashboardHeader";

// Widgets & UI elements
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
import { RolePanel } from "../components/widgets/RolePanel";

// Custom Hooks
import { useTelemetryData } from "../hooks/useTelemetryData";
import { useIncidentManager } from "../hooks/useIncidentManager";
import { useVolunteerTranslator } from "../hooks/useVolunteerTranslator";

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
  // Telemetry Hook
  const {
    matches,
    crowdData,
    concessions,
    restrooms,
    sustainability,
    incidents,
    volunteers,
    simulationState,
    diagnostics,
    timelineEvents,
    proactiveInsights,
    fetchData,
    handleTriggerScenario
  } = useTelemetryData();

  // Selected Gate & Sidebar State
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Incident Manager Hook
  const {
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
    incSuccess,
    handleReportIncident,
    handleResolveIncident
  } = useIncidentManager(role, fetchData);

  // Volunteer Translator Hook
  const {
    transInput,
    setTransInput,
    transOutput,
    transLang,
    setTransLang,
    handleTranslate
  } = useVolunteerTranslator(selectedGate);

  // Reallocate staff local states
  const [reallocFrom, setReallocFrom] = useState("Zone A (Gates A/B)");
  const [reallocTo, setReallocTo] = useState("Zone B (Gates C/D)");
  const [reallocCount, setReallocCount] = useState(5);
  const [reallocMsg, setReallocMsg] = useState("");

  // Copilot Caching state
  const [activeCopilotResponse, setActiveCopilotResponse] = useState<AIResponse | null>(null);

  // Filters and Categories states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimelineCategory, setSelectedTimelineCategory] = useState<string>("All");

  // Local clock state
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = useCallback(async () => {
    const sid = sessionStorage.getItem("matchops_session_id");
    if (sid) {
      try {
        await fetch(`${API_BASE}/api/copilot/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sid })
        });
      } catch {
        // silent
      }
      sessionStorage.removeItem("matchops_session_id");
    }
    onLogout();
  }, [onLogout]);

  // Reallocate Volunteers
  const handleReallocate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/volunteers/reallocate`, {
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

  // Memoized filters
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

  // Memoized static sparklines
  const attendanceSparkline = useMemo(() => [{v: 62000}, {v: 64500}, {v: 72000}, {v: 78500}, {v: 82300}], []);
  const waitTimeSparkline = useMemo(() => [{v: 14}, {v: 24}, {v: 35}, {v: 28}, {v: 12}], []);
  const energyOffsetSparkline = useMemo(() => [{v: 12}, {v: 18}, {v: 24}, {v: 28}, {v: 32}], []);

  const activeIncidentCount = useMemo(() => incidents.filter(i => i.status === "Active").length, [incidents]);
  const liveAttendance = useMemo(() => volunteers.active_count ? (82300 + volunteers.active_count) : 82300, [volunteers.active_count]);

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-100 overflow-hidden w-screen font-sans selection:bg-blue-500/30 selection:text-white">
      {/* 1. Collapsible Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role={role}
        language={language}
        onLogout={handleLogout}
        onRefresh={fetchData}
        matches={matches}
      />

      {/* 2. Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <DashboardHeader
          role={role}
          simulationState={simulationState}
          diagnostics={diagnostics}
          currentTime={currentTime}
          accessibilityMode={accessibilityMode}
          setAccessibilityMode={setAccessibilityMode}
          largeTextMode={largeTextMode}
          setLargeTextMode={setLargeTextMode}
          highContrastMode={highContrastMode}
          setHighContrastMode={setHighContrastMode}
          theme={theme}
          setTheme={setTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Proactive alert scrolling marquee banner */}
        {proactiveInsights.length > 0 && (
          <div className="bg-blue-950/20 border-b border-blue-900/20 px-6 py-2.5 overflow-hidden whitespace-nowrap text-[11px] text-blue-400 font-semibold flex items-center gap-3.5 relative shrink-0">
            <span className="bg-blue-500 text-white font-extrabold px-2 py-0.5 rounded-lg text-[8px] tracking-widest uppercase shrink-0 animate-pulse font-mono border border-blue-400/20">Proactive Alert</span>
            <div className="inline-block animate-marquee pl-[100%] hover:pause-marquee select-none">
              {proactiveInsights.join("   •   ")}
            </div>
          </div>
        )}

        {/* Event Hero Banner */}
        <EventHeroBanner
          matches={matches}
          attendance={liveAttendance}
          simulationPhase={simulationState?.phase || null}
          currentTime={currentTime}
          aiStatus="Live"
        />

        {/* Dashboard Main Grid Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Executive KPIs */}
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

          {/* Main Hero Area */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <div className="xl:col-span-2 h-[720px] flex flex-col">
              <StadiumMap
                selectedGate={selectedGate}
                setSelectedGate={setSelectedGate}
                accessibilityMode={accessibilityMode}
                incidents={incidents}
                crowdData={crowdData}
              />
            </div>
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
            {/* Col 1: Role-Specific Control Widget */}
            <div className="xl:col-span-1 flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <RolePanel
                role={role}
                filteredRestrooms={filteredRestrooms}
                filteredConcessions={filteredConcessions}
                sustainability={sustainability}
                transInput={transInput}
                setTransInput={setTransInput}
                transOutput={transOutput}
                transLang={transLang}
                setTransLang={setTransLang}
                handleTranslate={handleTranslate}
                handleReportIncident={handleReportIncident}
                incTitle={incTitle}
                setIncTitle={setIncTitle}
                incDesc={incDesc}
                setIncDesc={setIncDesc}
                incLoc={incLoc}
                setIncLoc={setIncLoc}
                incZone={incZone}
                setIncZone={setIncZone}
                incPriority={incPriority}
                setIncPriority={setIncPriority}
                incSuccess={incSuccess}
                handleTriggerScenario={handleTriggerScenario}
                handleReallocate={handleReallocate}
                reallocFrom={reallocFrom}
                setReallocFrom={setReallocFrom}
                reallocTo={reallocTo}
                setReallocTo={setReallocTo}
                reallocCount={reallocCount}
                setReallocCount={setReallocCount}
                reallocMsg={reallocMsg}
              />
              <WeatherIntelligence />
              <EmergencyReadiness />
            </div>

            {/* Col 2 & 3: OpsTimeline + Incidents + GeminiOpsFeed */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              <div className="h-80">
                <OpsTimeline
                  events={timelineEvents}
                  selectedCategory={selectedTimelineCategory}
                  setSelectedCategory={setSelectedTimelineCategory}
                />
              </div>

              {/* Incidents Table */}
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

              {/* Gemini Operations Feed */}
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
