import React, { useState } from "react";
import { Info, Map, AlertCircle, Layers, Users, Shield, Ambulance, ParkingSquare, Navigation, Zap } from "lucide-react";
import type { Incident } from "../types";

type MapOverlay = "crowd" | "gates" | "security" | "medical" | "parking" | "emergency" | "ai";

interface StadiumMapProps {
  selectedGate: string | null;
  setSelectedGate: (gate: string | null) => void;
  accessibilityMode: boolean;
  incidents: Incident[];
  crowdData: Record<string, { count: number; wait_time_minutes: number; congestion: string; accessibility_friendly: boolean }>;
}

const OVERLAYS: { id: MapOverlay; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "crowd", label: "Crowd Density", icon: <Users className="w-3 h-3" />, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { id: "gates", label: "Gate Status", icon: <Map className="w-3 h-3" />, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { id: "security", label: "Security Zones", icon: <Shield className="w-3 h-3" />, color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
  { id: "medical", label: "Medical Posts", icon: <Ambulance className="w-3 h-3" />, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { id: "parking", label: "Parking", icon: <ParkingSquare className="w-3 h-3" />, color: "text-slate-400 border-white/10 bg-white/5" },
  { id: "emergency", label: "Evac Routes", icon: <Navigation className="w-3 h-3" />, color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
  { id: "ai", label: "AI Highlights", icon: <Zap className="w-3 h-3" />, color: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
];

export const StadiumMap = React.memo<StadiumMapProps>(({
  selectedGate,
  setSelectedGate,
  accessibilityMode,
  incidents,
  crowdData
}) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<MapOverlay>("crowd");

  const hasActiveIncident = (zoneName: string) => {
    return incidents.some(inc => inc.zone === zoneName && inc.status === "Active");
  };

  const getGateColor = (gateName: string) => {
    if (selectedGate === gateName) return "#3b82f6";
    const data = crowdData[gateName];
    if (!data) return "#475569";
    if (data.congestion === "High") return "#f43f5e";
    if (data.congestion === "Medium") return "#f59e0b";
    return "#10b981";
  };

  // Crowd heatmap fill for zones based on overlay
  const getZoneFill = (zone: string) => {
    if (activeOverlay === "crowd") {
      if (hasActiveIncident(zone)) return "rgba(244, 63, 94, 0.12)";
      return hoveredSection === zone ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.01)";
    }
    if (activeOverlay === "security") return "rgba(244, 63, 94, 0.06)";
    if (activeOverlay === "medical") return "rgba(251, 191, 36, 0.04)";
    if (activeOverlay === "emergency") return "rgba(249, 115, 22, 0.05)";
    if (activeOverlay === "ai") return "rgba(167, 139, 250, 0.08)";
    return hoveredSection === zone ? "rgba(59, 130, 246, 0.12)" : "rgba(255,255,255,0.01)";
  };

  const getZoneStroke = (zone: string) => {
    if (activeOverlay === "security") return "#f43f5e";
    if (activeOverlay === "medical") return "#f59e0b";
    if (activeOverlay === "emergency") return "#f97316";
    if (activeOverlay === "ai") return "#a78bfa";
    if (hasActiveIncident(zone)) return "#f43f5e";
    return "rgba(255,255,255,0.05)";
  };

  return (
    <div className="glass p-5 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden glow-card flex flex-col gap-4 h-full font-sans">
      {/* Header */}
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl shadow-sm">
              <Map className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wide text-white font-display">Stadium Operations Map</h3>
              <p className="text-[9.5px] text-slate-500 font-semibold font-mono uppercase tracking-wider">
                Live Sensor Streams · {incidents.filter(i => i.status === "Active").length} Active Incidents
              </p>
            </div>
          </div>
          {/* Live pulse */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-bold text-emerald-400 font-mono uppercase">Live</span>
          </div>
        </div>

        {/* Overlay Selector */}
        <div className="flex gap-1.5 flex-wrap">
          {OVERLAYS.map(ov => {
            const isActive = activeOverlay === ov.id;
            return (
              <button
                key={ov.id}
                onClick={() => setActiveOverlay(ov.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer font-mono ${
                  isActive
                    ? ov.color
                    : "bg-slate-950/60 text-slate-500 border-white/5 hover:text-white hover:border-white/10"
                }`}
              >
                {ov.icon}
                <span className="hidden sm:inline">{ov.label}</span>
              </button>
            );
          })}
        </div>

        {/* Legend row */}
        <div className="flex flex-wrap gap-2 text-[8.5px] font-bold text-slate-500 font-mono uppercase tracking-wider">
          {activeOverlay === "crowd" && (
            <>
              <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Fluid
              </span>
              <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Moderate
              </span>
              <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Crowded
              </span>
            </>
          )}
          {activeOverlay === "security" && (
            <span className="flex items-center gap-1 bg-rose-500/5 text-rose-400 px-2 py-0.5 rounded-lg border border-rose-500/20">
              <Shield className="w-2.5 h-2.5" /> Security perimeter active
            </span>
          )}
          {activeOverlay === "medical" && (
            <span className="flex items-center gap-1 bg-amber-500/5 text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/20">
              <Ambulance className="w-2.5 h-2.5" /> 4 medical posts active
            </span>
          )}
          {activeOverlay === "emergency" && (
            <span className="flex items-center gap-1 bg-orange-500/5 text-orange-400 px-2 py-0.5 rounded-lg border border-orange-500/20">
              <Navigation className="w-2.5 h-2.5" /> All evacuation routes open
            </span>
          )}
          {activeOverlay === "parking" && (
            <span className="flex items-center gap-1 bg-white/5 text-slate-400 px-2 py-0.5 rounded-lg border border-white/5">
              <ParkingSquare className="w-2.5 h-2.5" /> Lot B 78% · Lot C 44%
            </span>
          )}
          {activeOverlay === "ai" && (
            <span className="flex items-center gap-1 bg-violet-500/5 text-violet-400 px-2 py-0.5 rounded-lg border border-violet-500/20">
              <Zap className="w-2.5 h-2.5 animate-pulse" /> Gemini recommendations active
            </span>
          )}
          {activeOverlay === "gates" && (
            <span className="flex items-center gap-1 bg-emerald-500/5 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              <Map className="w-2.5 h-2.5" /> All gates open
            </span>
          )}
          {accessibilityMode && (
            <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-lg border border-blue-500/20">
              ♿ ACCESSIBLE MODE
            </span>
          )}
        </div>
      </div>

      {/* SVG Map Section */}
      <div className="flex-grow flex justify-center items-center relative min-h-[300px]">
        <svg viewBox="0 0 500 500" className="w-full max-w-[420px] h-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]">
          <defs>
            <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
            </radialGradient>
            <radialGradient id="activeGateGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
            <filter id="mapGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* AI highlight pulse filter */}
            <filter id="aiGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid rings */}
          <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" strokeDasharray="4 12" />
          <circle cx="250" cy="250" r="200" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="8 6" />

          {/* Transport connectors */}
          <path d="M 40 250 L 120 250" stroke={accessibilityMode ? "#3b82f6" : "rgba(255,255,255,0.04)"} strokeWidth={accessibilityMode ? "4" : "2"} strokeDasharray={accessibilityMode ? "none" : "6 6"} className={accessibilityMode ? "animate-pulse" : ""} />
          <circle cx="40" cy="250" r="10" fill={activeOverlay === "emergency" ? "#f97316" : "#3b82f6"} className="animate-pulse" />
          <text x="25" y="232" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace" letterSpacing="1">METRO HUB</text>

          {/* Parking lot connector */}
          <path d="M 250 460 L 250 380" stroke={activeOverlay === "parking" ? "rgba(148,163,184,0.3)" : "rgba(255,255,255,0.04)"} strokeWidth={activeOverlay === "parking" ? "3" : "2"} strokeDasharray="6 6" />
          <rect x="210" y="445" width="80" height="22" rx="8" fill={activeOverlay === "parking" ? "#1e293b" : "#090d16"} stroke={activeOverlay === "parking" ? "rgba(148,163,184,0.2)" : "rgba(255,255,255,0.05)"} strokeWidth="1.5" />
          <text x="218" y="459" fill={activeOverlay === "parking" ? "#94a3b8" : "#64748b"} fontSize="9" fontWeight="bold" fontFamily="monospace">LOT B (78%)</text>

          {/* Stadium outer shell */}
          <rect x="115" y="115" width="270" height="270" rx="135" fill="url(#fieldGrad)" stroke={activeOverlay === "security" ? "rgba(244,63,94,0.2)" : "rgba(255,255,255,0.06)"} strokeWidth={activeOverlay === "security" ? "4" : "3.5"} />

          {/* Ground pitch */}
          <rect x="195" y="175" width="110" height="150" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="4" />
          <circle cx="250" cy="250" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <line x1="195" y1="250" x2="305" y2="250" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />

          {/* Zone A (North East) */}
          <path
            d="M 250 115 A 135 135 0 0 1 385 250 L 330 250 A 80 80 0 0 0 250 170 Z"
            fill={getZoneFill("Zone A")}
            stroke={getZoneStroke("Zone A")}
            strokeWidth={hasActiveIncident("Zone A") ? "3" : "1.5"}
            onMouseEnter={() => setHoveredSection("Zone A")}
            onMouseLeave={() => setHoveredSection(null)}
            className="cursor-pointer transition-all duration-300"
            style={{ filter: (hasActiveIncident("Zone A") || activeOverlay === "ai") ? "url(#mapGlow)" : "none" }}
          />

          {/* Zone B (South East) */}
          <path
            d="M 385 250 A 135 135 0 0 1 250 385 L 250 330 A 80 80 0 0 0 330 250 Z"
            fill={getZoneFill("Zone B")}
            stroke={getZoneStroke("Zone B")}
            strokeWidth="1.5"
            onMouseEnter={() => setHoveredSection("Zone B")}
            onMouseLeave={() => setHoveredSection(null)}
            className="cursor-pointer transition-all duration-300"
          />

          {/* Zone C (South West) */}
          <path
            d="M 250 385 A 135 135 0 0 1 115 250 L 170 250 A 80 80 0 0 0 250 330 Z"
            fill={getZoneFill("Zone C")}
            stroke={getZoneStroke("Zone C")}
            strokeWidth="1.5"
            onMouseEnter={() => setHoveredSection("Zone C")}
            onMouseLeave={() => setHoveredSection(null)}
            className="cursor-pointer transition-all duration-300"
          />

          {/* Zone D (North West) */}
          <path
            d="M 115 250 A 135 135 0 0 1 250 115 L 250 170 A 80 80 0 0 0 170 250 Z"
            fill={getZoneFill("Zone D")}
            stroke={getZoneStroke("Zone D")}
            strokeWidth="1.5"
            onMouseEnter={() => setHoveredSection("Zone D")}
            onMouseLeave={() => setHoveredSection(null)}
            className="cursor-pointer transition-all duration-300"
          />

          {/* Medical post overlays */}
          {activeOverlay === "medical" && (
            <>
              <circle cx="300" cy="145" r="10" fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="295" y="149" fill="#f59e0b" fontSize="9" fontWeight="bold">+</text>
              <circle cx="380" cy="300" r="10" fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="375" y="304" fill="#f59e0b" fontSize="9" fontWeight="bold">+</text>
              <circle cx="195" cy="360" r="10" fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="190" y="364" fill="#f59e0b" fontSize="9" fontWeight="bold">+</text>
              <circle cx="130" cy="190" r="10" fill="rgba(251,191,36,0.15)" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="125" y="194" fill="#f59e0b" fontSize="9" fontWeight="bold">+</text>
            </>
          )}

          {/* Emergency route overlays */}
          {activeOverlay === "emergency" && (
            <>
              <path d="M 155 155 L 70 70" stroke="#f97316" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.7" />
              <path d="M 345 155 L 430 70" stroke="#f97316" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.7" />
              <path d="M 155 345 L 70 430" stroke="#f97316" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.7" />
              <path d="M 345 345 L 430 430" stroke="#f97316" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.7" />
              <text x="55" y="65" fill="#f97316" fontSize="8" fontWeight="bold" fontFamily="monospace">EVAC A</text>
              <text x="410" y="65" fill="#f97316" fontSize="8" fontWeight="bold" fontFamily="monospace">EVAC B</text>
            </>
          )}

          {/* AI highlights */}
          {activeOverlay === "ai" && (
            <>
              <circle cx="155" cy="155" r="28" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
              <text x="138" y="185" fill="#a78bfa" fontSize="8" fontWeight="bold" fontFamily="monospace">AI WATCH</text>
            </>
          )}

          {/* Gate A (Top Left) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedGate(selectedGate === "Gate A" ? null : "Gate A")}
            onMouseEnter={() => setHoveredSection("Gate A")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {selectedGate === "Gate A" && (
              <circle cx="155" cy="155" r="24" fill="none" stroke="#3b82f6" strokeWidth="1.5" className="animate-pulse" />
            )}
            <circle cx="155" cy="155" r="17" fill="#060913" stroke={getGateColor("Gate A")} strokeWidth={selectedGate === "Gate A" ? "3" : "1.5"} className="transition-all hover:scale-105" />
            <text x="150" y="159" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="sans-serif">A</text>
          </g>

          {/* Gate B (Top Right) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedGate(selectedGate === "Gate B" ? null : "Gate B")}
            onMouseEnter={() => setHoveredSection("Gate B")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {selectedGate === "Gate B" && (
              <circle cx="345" cy="155" r="24" fill="none" stroke="#3b82f6" strokeWidth="1.5" className="animate-pulse" />
            )}
            <circle cx="345" cy="155" r="17" fill="#060913" stroke={getGateColor("Gate B")} strokeWidth={selectedGate === "Gate B" ? "3" : "1.5"} className="transition-all hover:scale-105" />
            <text x="340" y="159" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="sans-serif">B</text>
          </g>

          {/* Gate C (Bottom Right — Accessible) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedGate(selectedGate === "Gate C" ? null : "Gate C")}
            onMouseEnter={() => setHoveredSection("Gate C")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {accessibilityMode && (
              <circle cx="345" cy="345" r="24" fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-ping" />
            )}
            <circle cx="345" cy="345" r="17" fill="#060913" stroke={accessibilityMode ? "#3b82f6" : getGateColor("Gate C")} strokeWidth={selectedGate === "Gate C" ? "3" : "1.5"} className="transition-all hover:scale-105" />
            <text x="339" y="349" fill={accessibilityMode ? "#3b82f6" : "#f8fafc"} fontSize="11" fontWeight="bold">♿</text>
          </g>

          {/* Gate D (Bottom Left) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedGate(selectedGate === "Gate D" ? null : "Gate D")}
            onMouseEnter={() => setHoveredSection("Gate D")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {selectedGate === "Gate D" && (
              <circle cx="155" cy="345" r="24" fill="none" stroke="#3b82f6" strokeWidth="1.5" className="animate-pulse" />
            )}
            <circle cx="155" cy="345" r="17" fill="#060913" stroke={getGateColor("Gate D")} strokeWidth={selectedGate === "Gate D" ? "3" : "1.5"} className="transition-all hover:scale-105" />
            <text x="150" y="349" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="sans-serif">D</text>
          </g>

          {/* Active Incident Beacon */}
          {hasActiveIncident("Zone A") && (
            <g className="pointer-events-none" style={{ filter: "url(#mapGlow)" }}>
              <circle cx="330" cy="180" r="14" fill="#f43f5e" opacity="0.4" className="animate-ping" />
              <circle cx="330" cy="180" r="6" fill="#f43f5e" />
              <text x="342" y="184" fill="#f43f5e" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="0.5">ALERT</text>
            </g>
          )}

          {/* Block labels */}
          <text x="228" y="142" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace">BLOCK 101</text>
          <text x="300" y="208" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace">BLOCK 114</text>
          <text x="228" y="365" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace">BLOCK 220</text>
          <text x="140" y="258" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace">BLOCK 315</text>
        </svg>
      </div>

      {/* Details Status Panel */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 text-xs font-semibold shrink-0">
        {hoveredSection ? (
          <div className="space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-1 text-slate-300">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <strong className="text-white font-display text-xs">{hoveredSection} Status</strong>
            </div>
            {crowdData[hoveredSection] ? (
              <div className="flex gap-4 text-slate-400 font-mono text-[10px]">
                <span>Wait time: <strong className="text-white">{crowdData[hoveredSection].wait_time_minutes} min</strong></span>
                <span>Congestion: <strong className="text-white">{crowdData[hoveredSection].congestion}</strong></span>
              </div>
            ) : hoveredSection === "Zone A" ? (
              <div className="text-rose-400 flex items-center gap-1.5">
                {hasActiveIncident("Zone A") ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    <span>Critical: Medical emergency at concession stand</span>
                  </>
                ) : (
                  <span>Status: Nominal spectator flow</span>
                )}
              </div>
            ) : (
              <div className="text-slate-400">Stable operations area</div>
            )}
          </div>
        ) : selectedGate ? (
          <div className="space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              Selected Gate: <strong className="text-blue-400 font-display text-xs">{selectedGate}</strong>
            </div>
            <div className="flex gap-4 text-slate-400 font-mono text-[10px]">
              <span>Wait time: <strong className="text-white">{crowdData[selectedGate]?.wait_time_minutes ?? "--"} min</strong></span>
              <span>Accessibility: <strong className="text-white">{crowdData[selectedGate]?.accessibility_friendly ? "Ramp Access" : "Stairs Only"}</strong></span>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 text-center py-0.5 flex items-center justify-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>Hover or click map elements to inspect. Use overlay buttons to switch views.</span>
          </div>
        )}
      </div>
    </div>
  );
});
