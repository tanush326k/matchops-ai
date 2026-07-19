import React from "react";
import type { Role } from "../../types";
import { FanPanel } from "./FanPanel";
import { VolunteerPanel } from "./VolunteerPanel";
import { SecurityPanel } from "./SecurityPanel";
import { OrganizerPanel } from "./OrganizerPanel";

interface RolePanelProps {
  role: Role;
  // Fan props
  filteredRestrooms: [string, any][];
  filteredConcessions: any[];
  sustainability: Record<string, any> | null;
  // Volunteer translation props
  transInput: string;
  setTransInput: (val: string) => void;
  transOutput: string;
  transLang: string;
  setTransLang: (val: string) => void;
  handleTranslate: () => void;
  // Incident submission props (used by Volunteer & Security)
  handleReportIncident: (e: React.FormEvent) => void;
  incTitle: string;
  setIncTitle: (val: string) => void;
  incDesc: string;
  setIncDesc: (val: string) => void;
  incLoc: string;
  setIncLoc: (val: string) => void;
  incZone: string;
  setIncZone: (val: string) => void;
  incPriority: string;
  setIncPriority: (val: string) => void;
  incSuccess: boolean;
  // Organizer props
  handleTriggerScenario: (scenario: string) => void;
  handleReallocate: (e: React.FormEvent) => void;
  reallocFrom: string;
  setReallocFrom: (val: string) => void;
  reallocTo: string;
  setReallocTo: (val: string) => void;
  reallocCount: number;
  setReallocCount: (val: number) => void;
  reallocMsg: string;
}

export const RolePanel: React.FC<RolePanelProps> = ({
  role,
  filteredRestrooms,
  filteredConcessions,
  sustainability,
  transInput,
  setTransInput,
  transOutput,
  transLang,
  setTransLang,
  handleTranslate,
  handleReportIncident,
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
  handleTriggerScenario,
  handleReallocate,
  reallocFrom,
  setReallocFrom,
  reallocTo,
  setReallocTo,
  reallocCount,
  setReallocCount,
  reallocMsg
}) => {
  switch (role) {
    case "Fan":
      return (
        <FanPanel
          filteredRestrooms={filteredRestrooms}
          filteredConcessions={filteredConcessions}
          sustainability={sustainability}
        />
      );
    case "Volunteer":
      return (
        <VolunteerPanel
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
        />
      );
    case "Security":
      return (
        <SecurityPanel
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
        />
      );
    case "Organizer":
      return (
        <OrganizerPanel
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
      );
    default:
      return null;
  }
};
