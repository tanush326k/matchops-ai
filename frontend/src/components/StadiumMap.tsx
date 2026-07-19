import React, { useState } from "react";
import { Info, Map, AlertCircle } from "lucide-react";
import type { Incident } from "../types";

interface StadiumMapProps {
  selectedGate: string | null;
  setSelectedGate: (gate: string | null) => void;
  accessibilityMode: boolean;
  incidents: Incident[];
  crowdData: Record<string, { count: number; wait_time_minutes: number; congestion: string; accessibility_friendly: boolean }>;
}

export const StadiumMap: React.FC<StadiumMapProps> = ({
  selectedGate,
  setSelectedGate,
  accessibilityMode,
  incidents,
  crowdData
}) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Check if an incident is active in a zone/location
  const hasActiveIncident = (zoneName: string) => {
    return incidents.some(inc => inc.zone === zoneName && inc.status === "Active");
  };

  const getGateColor = (gateName: string) => {
    if (selectedGate === gateName) return "#3b82f6"; // Primary blue glow
    const data = crowdData[gateName];
    if (!data) return "#475569"; // slate-600
    if (data.congestion === "High") return "#f43f5e"; // rose-500
    if (data.congestion === "Medium") return "#f59e0b"; // amber-500
    return "#10b981"; // emerald-500
  };

  return (
    <div className="glass p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden glow-card flex flex-col justify-between gap-6 h-full font-sans">
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl shadow-sm">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wide text-white font-display">Stadium Heatmap</h3>
              <p className="text-[10px] text-slate-500 font-semibold font-mono uppercase tracking-wider">Live Sensor Streams</p>
            </div>
          </div>

          {/* Map Legends */}
          <div className="flex flex-wrap gap-2 text-[9px] font-bold text-slate-500 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Fluid
            </span>
            <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Moderate
            </span>
            <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Crowded
            </span>
            {accessibilityMode && (
              <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/20 font-bold">
                ♿ ACCESSIBLE
              </span>
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Interactive SVG telemetry mapping. Click gates to focus AI context routing queries, or hover elements to query real-time congestion sensors.
        </p>
      </div>

      {/* SVG Map Section */}
      <div className="flex-grow flex justify-center items-center py-6 relative min-h-[340px]">
        <svg viewBox="0 0 500 500" className="w-full max-w-[400px] h-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]">
          {/* Defs for gradients & filters */}
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
          </defs>

          {/* Outer Grid Assist Ring */}
          <circle
            cx="250"
            cy="250"
            r="230"
            fill="none"
            stroke="rgba(255,255,255,0.02)"
            strokeWidth="1.5"
            strokeDasharray="4 12"
          />

          <circle
            cx="250"
            cy="250"
            r="200"
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            strokeDasharray="8 6"
          />

          {/* Transportation Nodes */}
          {/* Metro path */}
          <path
            d="M 40 250 L 120 250"
            stroke={accessibilityMode ? "#3b82f6" : "rgba(255,255,255,0.04)"}
            strokeWidth={accessibilityMode ? "4" : "2"}
            strokeDasharray={accessibilityMode ? "none" : "6 6"}
            className={accessibilityMode ? "animate-pulse" : ""}
          />
          <circle cx="40" cy="250" r="10" fill="#3b82f6" className="animate-pulse" />
          <text x="25" y="232" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace" letterSpacing="1">METRO HUB</text>

          {/* Parking connector */}
          <path
            d="M 250 460 L 250 380"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <rect x="210" y="445" width="80" height="22" rx="8" fill="#090d16" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
          <text x="220" y="459" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">LOT B (42%)</text>

          {/* Stadium Outer Shell */}
          <rect
            x="115"
            y="115"
            width="270"
            height="270"
            rx="135"
            fill="url(#fieldGrad)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="3.5"
          />

          {/* Ground Pitch */}
          <rect
            x="195"
            y="175"
            width="110"
            height="150"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <circle cx="250" cy="250" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <line x1="195" y1="250" x2="305" y2="250" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />

          {/* Seating Sectors Heatmap */}
          {/* Zone A (North East - Block 114) */}
          <path
            d="M 250 115 A 135 135 0 0 1 385 250 L 330 250 A 80 80 0 0 0 250 170 Z"
            fill={hoveredSection === "Zone A" ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.01)"}
            stroke={hasActiveIncident("Zone A") ? "#f43f5e" : "rgba(255,255,255,0.05)"}
            strokeWidth={hasActiveIncident("Zone A") ? "3" : "1.5"}
            onMouseEnter={() => setHoveredSection("Zone A")}
            onMouseLeave={() => setHoveredSection(null)}
            className="cursor-pointer transition-all duration-300"
            style={{ filter: hasActiveIncident("Zone A") ? "url(#mapGlow)" : "none" }}
          />

          {/* Zone B (South East - Block 220) */}
          <path
            d="M 385 250 A 135 135 0 0 1 250 385 L 250 330 A 80 80 0 0 0 330 250 Z"
            fill={hoveredSection === "Zone B" ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.01)"}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1.5"
            onMouseEnter={() => setHoveredSection("Zone B")}
            onMouseLeave={() => setHoveredSection(null)}
            className="cursor-pointer transition-all duration-300"
          />

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
            <circle
              cx="155"
              cy="155"
              r="17"
              fill="#060913"
              stroke={getGateColor("Gate A")}
              strokeWidth={selectedGate === "Gate A" ? "3" : "1.5"}
              className="transition-all hover:scale-105"
            />
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
            <circle
              cx="345"
              cy="155"
              r="17"
              fill="#060913"
              stroke={getGateColor("Gate B")}
              strokeWidth={selectedGate === "Gate B" ? "3" : "1.5"}
              className="transition-all hover:scale-105"
            />
            <text x="340" y="159" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="sans-serif">B</text>
          </g>

          {/* Gate C (Bottom Right - Accessible Gate) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedGate(selectedGate === "Gate C" ? null : "Gate C")}
            onMouseEnter={() => setHoveredSection("Gate C")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {accessibilityMode && (
              <circle
                cx="345"
                cy="345"
                r="24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                className="animate-ping"
              />
            )}
            <circle
              cx="345"
              cy="345"
              r="17"
              fill="#060913"
              stroke={accessibilityMode ? "#3b82f6" : getGateColor("Gate C")}
              strokeWidth={selectedGate === "Gate C" ? "3" : "1.5"}
              className="transition-all hover:scale-105"
            />
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
            <circle
              cx="155"
              cy="345"
              r="17"
              fill="#060913"
              stroke={getGateColor("Gate D")}
              strokeWidth={selectedGate === "Gate D" ? "3" : "1.5"}
              className="transition-all hover:scale-105"
            />
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

          {/* Map labels */}
          <text x="228" y="142" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace">BLOCK 101</text>
          <text x="300" y="208" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace">BLOCK 114</text>
          <text x="228" y="365" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace">BLOCK 220</text>
          <text x="140" y="258" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace">BLOCK 315</text>
        </svg>
      </div>

      {/* Details Status Panel */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 text-xs font-semibold">
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
              <span>Sensor wait time: <strong className="text-white">{crowdData[selectedGate]?.wait_time_minutes} min</strong></span>
              <span>Accessibility status: <strong className="text-white">{crowdData[selectedGate]?.accessibility_friendly ? "Grounded (Ramps)" : "Stairs Only"}</strong></span>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 text-center py-1 flex items-center justify-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-600" />
            <span>Hover/Click stadium elements to inspect details.</span>
          </div>
        )}
      </div>
    </div>
  );
};
