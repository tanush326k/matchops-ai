import React, { useState, useCallback } from "react";
import type { Role } from "../types";
import { API_BASE } from "../config/api";

export const useIncidentManager = (role: Role, refreshData: () => void) => {
  const [incTitle, setIncTitle] = useState("");
  const [incDesc, setIncDesc] = useState("");
  const [incLoc, setIncLoc] = useState("Gate A");
  const [incZone, setIncZone] = useState("Zone A");
  const [incPriority, setIncPriority] = useState("Medium");
  const [incSuccess, setIncSuccess] = useState(false);

  const handleReportIncident = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle || !incDesc) return;
    try {
      const res = await fetch(`${API_BASE}/api/incidents`, {
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
        refreshData();
      }
    } catch {
      // silent fallback
    }
  }, [incTitle, incDesc, incLoc, incZone, incPriority, role, refreshData]);

  const handleResolveIncident = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" })
      });
      if (res.ok) {
        refreshData();
      }
    } catch {
      // silent fallback
    }
  }, [refreshData]);

  return {
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
  };
};
