export type Role = "Fan" | "Volunteer" | "Security" | "Organizer";

export type Language = "English" | "Spanish" | "French" | "Arabic" | "Portuguese";

export type Theme = "light" | "dark";

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  zone: string;
  reporter: string;
  status: "Active" | "Resolved";
  priority: "Low" | "Medium" | "High";
  assigned_staff: number;
  created_at: string;
}

export interface AIRecommendation {
  action: string;
  detail: string;
  priority: "Low" | "Medium" | "High";
  supporting_data?: string[];
  assumptions?: string[];
  suggested_actions?: string[];
  warnings?: string[];
  confidence_score?: number;
}

export interface ReasoningTimeline {
  intent_analysis: string;
  role_detection: string;
  context_builder: string;
  decision_planner: string;
  grounded_prompt: string;
  detected_intents?: string[];
  role?: string;
  context_sources?: string[];
  decision_rules?: string[];
  confidence_score?: number;
  confidence_reason?: string;
  reasoning_summary?: string;
  final_recommendation?: string;
}

export interface MultiStepPlan {
  problem: string;
  assessment: string;
  recommended_actions: string[];
  expected_impact: string;
  monitoring_advice: string;
}

export interface AIResponse {
  summary: string;
  recommendations: AIRecommendation[];
  reasoning: ReasoningTimeline;
  priority: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  warnings: string[];
  next_actions: string[];
  confidence_reason?: string;
  missing_information?: string[];
  assumptions?: string[];
  multi_step_plan?: MultiStepPlan | null;
}

export interface Match {
  id: string;
  teams: string;
  stage: string;
  date: string;
  time: string;
  attendance: number;
  status: "Completed" | "Upcoming" | "In-Progress";
  score: string | null;
}
export interface TimelineEvent {
  id: string;
  timestamp: string;
  category: "Match Phase" | "Incident" | "Transport" | "Staffing" | "Accessibility" | "AI Recommendation";
  message: string;
  severity: "Info" | "Low" | "Medium" | "High" | "Critical";
}

export interface KPIState {
  score: string;
  trend: "up" | "down" | "stable";
  status: "nominal" | "warning" | "critical";
  explanation: string;
}

export interface SimulationState {
  phase: string;
  auto_progress: boolean;
  telemetry_freshness: string;
  kpis: Record<string, KPIState>;
}

export interface DiagnosticsState {
  gemini_availability: string;
  fallback_status: string;
  average_response_time_ms: number;
  session_memory_status: string;
  confidence_distribution: string;
  telemetry_freshness: string;
  prompt_validation_status: string;
}
