import React, { useState } from "react";
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
    if (selectedGate === gateName) return "var(--primary)";
    const data = crowdData[gateName];
    if (!data) return "var(--text-muted)";
    if (data.congestion === "High") return "var(--danger)";
    if (data.congestion === "Medium") return "var(--warning)";
    return "var(--secondary)";
  };

  return (
    <div className="glass p-6 rounded-2xl glow-card h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold tracking-wide">Stadium Telemetry & Heatmap</h3>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Low
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> High
            </span>
            {accessibilityMode && (
              <span className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded bg-yellow-400 inline-block text-[10px] text-black text-center font-bold">♿</span> Access Route
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Interactive map of MetLife Stadium. Hover over gates and zones to check queue wait times. Click a gate to prioritize it in the AI Copilot.
        </p>
      </div>

      <div className="flex-1 flex justify-center items-center py-4 relative min-h-[300px]">
        <svg viewBox="0 0 500 500" className="w-full max-w-[420px] h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
          {/* Defs for gradients */}
          <defs>
            <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#101b35" stopOpacity="0.8" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Concourse Ring */}
          <circle
            cx="250"
            cy="250"
            r="220"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="2"
            strokeDasharray="4 8"
          />

          {/* Transportation Links */}
          {/* Meadowlands Metro Connector */}
          <path
            d="M 50 250 L 120 250"
            stroke={accessibilityMode ? "#facc15" : "var(--border-color)"}
            strokeWidth={accessibilityMode ? "4" : "2"}
            strokeDasharray={accessibilityMode ? "none" : "5 5"}
            className={accessibilityMode ? "animate-pulse" : ""}
          />
          <circle cx="50" cy="250" r="10" fill="var(--info)" />
          <text x="35" y="232" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">Meadowlands Metro</text>

          {/* General Parking Connector (Lot B) */}
          <path
            d="M 250 450 L 250 380"
            stroke="var(--border-color)"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          <rect x="220" y="440" width="60" height="20" rx="4" fill="var(--bg-card)" stroke="var(--border-color)" />
          <text x="232" y="454" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">Lot B (42%)</text>

          {/* Stadium Shell */}
          <rect
            x="120"
            y="120"
            width="260"
            height="260"
            rx="130"
            fill="url(#fieldGrad)"
            stroke="var(--border-color)"
            strokeWidth="4"
          />

          {/* Pitch / Field of Play */}
          <rect
            x="200"
            y="180"
            width="100"
            height="140"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
          />
          <circle cx="250" cy="250" r="25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          <line x1="200" y1="250" x2="300" y2="250" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

          {/* Seating Sections (Interactive Zones) */}
          {/* Zone A (North East - Block 114) */}
          <path
            d="M 250 120 A 130 130 0 0 1 380 250 L 330 250 A 80 80 0 0 0 250 170 Z"
            fill={hoveredSection === "Zone A" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.02)"}
            stroke={hasActiveIncident("Zone A") ? "var(--danger)" : "var(--border-color)"}
            strokeWidth={hasActiveIncident("Zone A") ? "3" : "1.5"}
            onMouseEnter={() => setHoveredSection("Zone A")}
            onMouseLeave={() => setHoveredSection(null)}
            className="cursor-pointer transition-all duration-200"
            style={{ filter: hasActiveIncident("Zone A") ? "url(#glow)" : "none" }}
          />

          {/* Zone B (South East - Block 220) */}
          <path
            d="M 380 250 A 130 130 0 0 1 250 380 L 250 330 A 80 80 0 0 0 330 250 Z"
            fill={hoveredSection === "Zone B" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.02)"}
            stroke="var(--border-color)"
            strokeWidth="1.5"
            onMouseEnter={() => setHoveredSection("Zone B")}
            onMouseLeave={() => setHoveredSection(null)}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Gate A (Top Left) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedGate(selectedGate === "Gate A" ? null : "Gate A")}
            onMouseEnter={() => setHoveredSection("Gate A")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <circle
              cx="160"
              cy="160"
              r="18"
              fill="var(--bg-app)"
              stroke={getGateColor("Gate A")}
              strokeWidth={selectedGate === "Gate A" ? "4" : "2"}
            />
            <text x="154" y="164" fill="var(--text-primary)" fontSize="11" fontWeight="bold">A</text>
          </g>

          {/* Gate B (Top Right) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedGate(selectedGate === "Gate B" ? null : "Gate B")}
            onMouseEnter={() => setHoveredSection("Gate B")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <circle
              cx="340"
              cy="160"
              r="18"
              fill="var(--bg-app)"
              stroke={getGateColor("Gate B")}
              strokeWidth={selectedGate === "Gate B" ? "4" : "2"}
            />
            <text x="334" y="164" fill="var(--text-primary)" fontSize="11" fontWeight="bold">B</text>
          </g>

          {/* Gate C (Bottom Right - Accessible Gate) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedGate(selectedGate === "Gate C" ? null : "Gate C")}
            onMouseEnter={() => setHoveredSection("Gate C")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Draw a yellow glowing outer boundary if accessibility is active to guide the user */}
            {accessibilityMode && (
              <circle
                cx="340"
                cy="340"
                r="24"
                fill="none"
                stroke="#facc15"
                strokeWidth="2"
                className="animate-ping"
              />
            )}
            <circle
              cx="340"
              cy="340"
              r="18"
              fill="var(--bg-app)"
              stroke={accessibilityMode ? "#facc15" : getGateColor("Gate C")}
              strokeWidth={selectedGate === "Gate C" ? "4" : "2"}
            />
            <text x="334" y="344" fill={accessibilityMode ? "#facc15" : "var(--text-primary)"} fontSize="11" fontWeight="bold">♿</text>
          </g>

          {/* Gate D (Bottom Left) */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedGate(selectedGate === "Gate D" ? null : "Gate D")}
            onMouseEnter={() => setHoveredSection("Gate D")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <circle
              cx="160"
              cy="340"
              r="18"
              fill="var(--bg-app)"
              stroke={getGateColor("Gate D")}
              strokeWidth={selectedGate === "Gate D" ? "4" : "2"}
            />
            <text x="154" y="344" fill="var(--text-primary)" fontSize="11" fontWeight="bold">D</text>
          </g>

          {/* Active Incident Beacon (Flashing alert near Block 114) */}
          {hasActiveIncident("Zone A") && (
            <g className="pointer-events-none">
              <circle cx="330" cy="180" r="15" fill="var(--danger)" opacity="0.3" className="animate-ping" />
              <circle cx="330" cy="180" r="6" fill="var(--danger)" />
              <text x="340" y="184" fill="var(--danger)" fontSize="9" fontWeight="extrabold">INCIDENT</text>
            </g>
          )}

          {/* Seating labels */}
          <text x="235" y="145" fill="var(--text-muted)" fontSize="9">BLOCK 101</text>
          <text x="300" y="210" fill="var(--text-muted)" fontSize="9">BLOCK 114</text>
          <text x="235" y="360" fill="var(--text-muted)" fontSize="9">BLOCK 220</text>
          <text x="145" y="255" fill="var(--text-muted)" fontSize="9">BLOCK 315</text>
        </svg>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 text-sm">
        {hoveredSection ? (
          <div>
            <strong className="text-white">{hoveredSection}</strong>
            {crowdData[hoveredSection] ? (
              <div className="flex gap-4 mt-1 text-xs">
                <span>Wait: <strong className="text-white">{crowdData[hoveredSection].wait_time_minutes} min</strong></span>
                <span>Status: <strong className="text-white">{crowdData[hoveredSection].congestion} Congestion</strong></span>
              </div>
            ) : hoveredSection === "Zone A" ? (
              <div className="mt-1 text-xs text-red-400">
                {hasActiveIncident("Zone A") ? "⚠️ High priority medical incident reported in concourse" : "Status: Active spectator flow"}
              </div>
            ) : (
              <div className="mt-1 text-xs text-gray-400">Stable operations area</div>
            )}
          </div>
        ) : selectedGate ? (
          <div>
            Selected: <strong className="text-blue-400">{selectedGate}</strong>
            <div className="flex gap-4 mt-1 text-xs">
              <span>Wait time: <strong className="text-white">{crowdData[selectedGate]?.wait_time_minutes} min</strong></span>
              <span>Accessibility: <strong className="text-white">{crowdData[selectedGate]?.accessibility_friendly ? "Yes" : "Stairs Only"}</strong></span>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-xs text-center py-1">
            No gate/zone selected. Hover or click stadium elements to analyze details.
          </div>
        )}
      </div>
    </div>
  );
};
