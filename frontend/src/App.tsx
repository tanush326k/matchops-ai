import { useState, useEffect } from "react";
import type { Role, Language } from "./types";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { Onboarding } from "./components/Onboarding";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>("Fan");
  const [language, setLanguage] = useState<Language>("English");
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Theme and accessibility variables
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("matchops-theme") || "dark");
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(() => localStorage.getItem("matchops-access") === "true");
  const [largeTextMode, setLargeTextMode] = useState<boolean>(() => localStorage.getItem("matchops-largetext") === "true");
  const [highContrastMode, setHighContrastMode] = useState<boolean>(() => localStorage.getItem("matchops-contrast") === "true");

  // Sync settings to localStorage and update body CSS classes
  useEffect(() => {
    localStorage.setItem("matchops-theme", theme);
    const bodyClass = document.body.classList;
    
    if (theme === "light") {
      bodyClass.add("light-theme");
    } else {
      bodyClass.remove("light-theme");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("matchops-access", String(accessibilityMode));
  }, [accessibilityMode]);

  useEffect(() => {
    localStorage.setItem("matchops-largetext", String(largeTextMode));
    const bodyClass = document.body.classList;
    if (largeTextMode) {
      bodyClass.add("large-text-theme");
    } else {
      bodyClass.remove("large-text-theme");
    }
  }, [largeTextMode]);

  useEffect(() => {
    localStorage.setItem("matchops-contrast", String(highContrastMode));
    const bodyClass = document.body.classList;
    if (highContrastMode) {
      bodyClass.add("high-contrast-theme");
    } else {
      bodyClass.remove("high-contrast-theme");
    }
  }, [highContrastMode]);

  const handleLogin = (selectedRole: Role, selectedLang: Language) => {
    setRole(selectedRole);
    setLanguage(selectedLang);
    setIsAuthenticated(true);
    
    // Check if role has already seen onboarding in this session
    const hasSeen = sessionStorage.getItem(`matchops-onboarding-${selectedRole}`);
    if (hasSeen !== "true") {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowOnboarding(false);
  };

  return (
    <>
      {!isAuthenticated ? (
        <LandingPage onLogin={handleLogin} />
      ) : (
        <>
          <Dashboard
            role={role}
            language={language}
            onLogout={handleLogout}
            theme={theme}
            setTheme={setTheme}
            accessibilityMode={accessibilityMode}
            setAccessibilityMode={setAccessibilityMode}
            largeTextMode={largeTextMode}
            setLargeTextMode={setLargeTextMode}
            highContrastMode={highContrastMode}
            setHighContrastMode={setHighContrastMode}
          />
          {showOnboarding && (
            <Onboarding
              role={role}
              onClose={() => {
                sessionStorage.setItem(`matchops-onboarding-${role}`, "true");
                setShowOnboarding(false);
              }}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;
