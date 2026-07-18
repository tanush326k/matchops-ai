from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class IncidentCreate(BaseModel):
    title: str
    description: str
    location: str
    zone: str
    reporter: str
    priority: str = "Medium"  # Low, Medium, High

class Incident(BaseModel):
    id: str
    title: str
    description: str
    location: str
    zone: str
    reporter: str
    status: str  # Active, Resolved
    priority: str
    assigned_staff: int
    created_at: str

class IncidentStatusUpdate(BaseModel):
    status: str

class ReallocateRequest(BaseModel):
    from_zone: str
    to_zone: str
    count: int

class AIQueryRequest(BaseModel):
    query: str
    role: str  # Fan, Volunteer, Security, Organizer
    language: str = "English"  # English, Spanish, French, Arabic, Portuguese
    gate_preference: Optional[str] = None
    accessibility_friendly: Optional[bool] = False
    session_id: Optional[str] = "default"

class ReasoningTimeline(BaseModel):
    # Compatibility fields
    intent_analysis: str = Field(description="Interpretation of user's query intent")
    role_detection: str = Field(description="Security constraints and personalization based on user role")
    context_builder: str = Field(description="Assembled grounded facts from stadium DB")
    decision_planner: str = Field(description="AI's logical planning and safety rules used")
    grounded_prompt: str = Field(description="Final query sent to LLM")
    # Upgraded fields
    detected_intents: List[str] = Field(default=[], description="Detected intents from query analysis")
    role: str = Field(default="", description="Evaluated role context")
    context_sources: List[str] = Field(default=[], description="Active database sources accessed")
    decision_rules: List[str] = Field(default=[], description="Rules applied in planning")
    confidence_score: float = Field(default=1.0, description="Confidence of system outcome")
    confidence_reason: str = Field(default="", description="Diagnostic breakdown of confidence")
    reasoning_summary: str = Field(default="", description="Executive reasoning overview")
    final_recommendation: str = Field(default="", description="Consolidated recommended path")

class AIRecommendation(BaseModel):
    action: str
    detail: str
    priority: str  # Low, Medium, High
    supporting_data: List[str] = Field(default=[])
    assumptions: List[str] = Field(default=[])
    suggested_actions: List[str] = Field(default=[])
    warnings: List[str] = Field(default=[])
    confidence_score: float = Field(default=1.0)

class MultiStepPlan(BaseModel):
    problem: str
    assessment: str
    recommended_actions: List[str]
    expected_impact: str
    monitoring_advice: str

class AIQueryResponse(BaseModel):
    summary: str
    recommendations: List[AIRecommendation]
    reasoning: ReasoningTimeline
    priority: str  # Low, Medium, High, Critical
    confidence: float  # 0.0 to 1.0
    confidence_reason: str = Field(default="Based on active database feeds.")
    missing_information: List[str] = Field(default=[])
    warnings: List[str]
    assumptions: List[str] = Field(default=[])
    next_actions: List[str]
    multi_step_plan: Optional[MultiStepPlan] = None
