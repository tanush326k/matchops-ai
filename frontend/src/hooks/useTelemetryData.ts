import { useState, useEffect, useCallback } from "react";
import type { Match, Incident, SimulationState, DiagnosticsState, TimelineEvent } from "../types";
import { API_BASE } from "../config/api";

export const useTelemetryData = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [crowdData, setCrowdData] = useState<Record<string, any>>({});
  const [concessions, setConcessions] = useState<any[]>([]);
  const [restrooms, setRestrooms] = useState<Record<string, any>>({});
  const [sustainability, setSustainability] = useState<Record<string, any>>({});
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [volunteers, setVolunteers] = useState<Record<string, any>>({});
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsState | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [proactiveInsights, setProactiveInsights] = useState<string[]>([]);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    try {
      const urls = [
        "matches", "crowd", "concessions", "restrooms",
        "sustainability", "incidents", "volunteers",
        "simulation", "diagnostics", "simulation/timeline", "simulation/insights"
      ];
      
      const responses = await Promise.all(
        urls.map(url =>
          fetch(`${API_BASE}/api/${url}`, { signal }).catch(() => null)
        )
      );

      const data = await Promise.all(
        responses.map(async res => {
          if (res && res.ok) {
            try {
              return await res.json();
            } catch {
              return null;
            }
          }
          return null;
        })
      );

      // Map responses back to states
      if (data[0] !== null) setMatches(data[0]);
      if (data[1] !== null) setCrowdData(data[1]);
      if (data[2] !== null) setConcessions(data[2]);
      if (data[3] !== null) setRestrooms(data[3]);
      if (data[4] !== null) setSustainability(data[4]);
      if (data[5] !== null) setIncidents(data[5]);
      if (data[6] !== null) setVolunteers(data[6]);
      if (data[7] !== null) setSimulationState(data[7]);
      if (data[8] !== null) setDiagnostics(data[8]);
      if (data[9] !== null) setTimelineEvents(data[9]);
      if (data[10] !== null) setProactiveInsights(data[10]);
    } catch {
      // AbortError or standard network failure handled gracefully
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
      const res = await fetch(`${API_BASE}/api/simulation/phase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: scenario })
      });
      if (res.ok) {
        fetchData();
      }
    } catch {
      // silent fallback
    }
  }, [fetchData]);

  return {
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
    fetchData: () => fetchData(),
    handleTriggerScenario
  };
};
