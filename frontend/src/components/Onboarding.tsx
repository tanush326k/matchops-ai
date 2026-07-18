import React, { useState } from "react";
import { Brain, Database, Sparkles, ChevronRight, ChevronLeft, X } from "lucide-react";

interface OnboardingProps {
  role: string;
  onClose: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ role, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "What the AI Copilot Can Do",
      icon: <Sparkles className="w-12 h-12 text-blue-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            MatchOps AI operates as an intelligent venue copilot, providing personalized capabilities based on your active role <strong className="text-white">({role})</strong>:
          </p>
          <ul className="list-disc pl-5 text-xs text-gray-400 space-y-2 leading-relaxed">
            <li><strong>Fans:</strong> Smart step-free gate routing, transit schedules, and concession waits.</li>
            <li><strong>Volunteers:</strong> Real-time task checklist updates, shifts, and foreign translation assistance.</li>
            <li><strong>Security:</strong> Live incident dispatching, threat telemetry monitoring, and crowd diversion planning.</li>
            <li><strong>Organizers:</strong> Macro resource reallocation, operations logging, and green stadium analytics.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Real-time Grounded Datasets Ingested",
      icon: <Database className="w-12 h-12 text-emerald-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            To prevent hallucinations, the Copilot is grounded strictly in live MetLife Stadium telemetry:
          </p>
          <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-400">
            <div className="p-3 bg-black/35 rounded-xl border border-white/5">
              <strong className="text-white block mb-0.5">🏟️ Gate Sensors</strong>
              Live counts and wait times updated every 60s.
            </div>
            <div className="p-3 bg-black/35 rounded-xl border border-white/5">
              <strong className="text-white block mb-0.5">🚨 Security Feeds</strong>
              Active incidents reported by volunteers and venue staff.
            </div>
            <div className="p-3 bg-black/35 rounded-xl border border-white/5">
              <strong className="text-white block mb-0.5">🚇 Transit Logs</strong>
              Meadowlands Metro arrivals, shuttle buses, and parking levels.
            </div>
            <div className="p-3 bg-black/35 rounded-xl border border-white/5">
              <strong className="text-white block mb-0.5">☀️ Green Telemetry</strong>
              Active water saving stats and solar clean energy logs.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "How Recommendations Are Generated",
      icon: <Brain className="w-12 h-12 text-purple-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            Rather than performing a basic search, your queries flow through a multi-stage **AI Reasoning Orchestration**:
          </p>
          <div className="flex flex-col gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-900/50 text-blue-300 flex items-center justify-center font-bold">1</span>
              <span><strong>Intent Classifier:</strong> Evaluates the core subject of your query.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-900/50 text-emerald-300 flex items-center justify-center font-bold">2</span>
              <span><strong>Role Guardrails:</strong> Protects operations and enforces permission limits.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-900/50 text-purple-300 flex items-center justify-center font-bold">3</span>
              <span><strong>Context Aggregator:</strong> Prepares concrete telemetry parameters.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-900/50 text-amber-300 flex items-center justify-center font-bold">4</span>
              <span><strong>Decision Planner:</strong> Inject safety-based routing adjustments.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-900/50 text-cyan-300 flex items-center justify-center font-bold">5</span>
              <span><strong>Gemini Schema Check:</strong> Validates structured action cards.</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="w-full max-w-lg bg-[#0e1320] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative animate-fade-in"
      >
        {/* Close Button / Skip */}
        <button
          onClick={onClose}
          aria-label="Close guide"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors focus-ring"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Header */}
        <div className="flex flex-col items-center text-center mt-4">
          <div className="mb-4 p-4 rounded-2xl bg-white/5">
            {steps[currentStep].icon}
          </div>
          <h2 id="onboarding-title" className="text-2xl font-black text-white mb-4">
            {steps[currentStep].title}
          </h2>
        </div>

        {/* Step Body */}
        <div className="my-4 min-h-[180px]">
          {steps[currentStep].content}
        </div>

        {/* Slide indicator dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                currentStep === idx ? "bg-blue-500 w-5" : "bg-white/10"
              }`}
            ></span>
          ))}
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors focus-ring px-3 py-2 rounded-xl"
          >
            Skip Guide
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-white rounded-xl flex items-center gap-1 transition-colors focus-ring"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl flex items-center gap-1 transition-colors focus-ring"
            >
              {currentStep === steps.length - 1 ? "Start Copilot" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
