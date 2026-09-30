from typing import Generic, TypeVar, Optional, List, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime

T = TypeVar("T")

class ErrorDetail(BaseModel):
    code: str
    details: Optional[Any] = None

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: str = "Request successful"
    error: Optional[ErrorDetail] = None

# --- AUTH SCHEMAS ---
class UserLogin(BaseModel):
    phone: str
    password: str

class UserRegister(BaseModel):
    phone: str
    password: str
    full_name: str
    role: str = "beneficiary" # beneficiary, admin, employer
    email: Optional[str] = None
    preferred_language: str = "en"
    # Optional profile fields during quick registration
    district: Optional[str] = "Thanjavur"
    state: Optional[str] = "Tamil Nadu"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfileRead(BaseModel):
    id: int
    full_name: str
    phone: str
    phone_masked: str
    email: Optional[str] = None
    role: str
    preferred_language: str
    beneficiary_id: Optional[int] = None
    district: Optional[str] = None
    state: Optional[str] = None
    is_profile_completed: bool = False

# --- BENEFICIARY PROFILE & SKILLS SCHEMAS ---
class ProfileExtractionInput(BaseModel):
    name: Optional[str] = None
    education: Optional[str] = "12th"
    occupation: Optional[str] = "Farmer"
    experience_years: Optional[float] = 3.0
    skills: List[str] = ["Farming", "Basic Electrical"]
    interests: List[str] = ["Electrical work", "Self employment"]
    target_career: Optional[str] = "Electrician"
    location: Dict[str, str] = {"state": "Tamil Nadu", "district": "Thanjavur"}
    language: str = "ta"
    income_range: Optional[str] = "₹8,000 - ₹12,000"
    entrepreneurship_interest: bool = True
    training_interest: bool = True

class BeneficiarySkillRead(BaseModel):
    id: int
    skill_name: str
    skill_category: str
    skill_level: str
    years_experience: float
    ai_confidence: float
    verified_by_assessment: bool

class BeneficiaryProfileUpdate(BaseModel):
    education_level: Optional[str] = None
    current_occupation: Optional[str] = None
    years_experience: Optional[float] = None
    target_career: Optional[str] = None
    interests: Optional[List[str]] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    preferred_language: Optional[str] = None

# --- ASSESSMENT SCHEMAS ---
class AssessmentStartRequest(BaseModel):
    beneficiary_id: Optional[int] = None
    channel: str = "voice_web" # voice_web, chat_web, ivr_phone
    language: str = "ta"

class AssessmentMessageSend(BaseModel):
    message_text: str
    question_key: Optional[str] = None
    audio_base64: Optional[str] = None

class AssessmentMessageRead(BaseModel):
    id: int
    sender: str
    message_text: str
    audio_url: Optional[str] = None
    question_key: Optional[str] = None
    created_at: datetime

class AssessmentDetailRead(BaseModel):
    id: int
    beneficiary_id: int
    channel: str
    status: str
    current_step: str
    language: str
    messages: List[AssessmentMessageRead]
    ai_extracted_json: Optional[Dict[str, Any]] = None
    created_at: datetime

# --- AI & SKILL GAP SCHEMAS ---
class SkillAnalysisRequest(BaseModel):
    beneficiary_id: Optional[int] = None
    raw_text: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None

class SkillGapAnalysisRequest(BaseModel):
    beneficiary_id: Optional[int] = None
    target_career: str = "Electrician"
    current_skills: Optional[List[str]] = None

class SkillGapResult(BaseModel):
    target_career: str
    current_skills: List[str]
    missing_skills: List[str]
    gap_score: float # e.g. 35.0%
    required_training: List[Dict[str, Any]]
    career_readiness_level: str # Foundation, Intermediate, Job-Ready
    next_step_action: str

# --- RECOMMENDATION SCHEMAS ---
class RecommendationsRequest(BaseModel):
    beneficiary_id: Optional[int] = None
    target_career: Optional[str] = None
    location_district: Optional[str] = None

class ComprehensiveRecommendations(BaseModel):
    beneficiary_id: int
    beneficiary_name: str
    target_career: str
    jobs: List[Dict[str, Any]]
    training_programs: List[Dict[str, Any]]
    government_schemes: List[Dict[str, Any]]
    self_employment_ideas: List[Dict[str, Any]]
    career_pathway: List[str]
    summary_insight: str

# --- ROADMAP SCHEMAS ---
class RoadmapGenerateRequest(BaseModel):
    beneficiary_id: int
    goal_title: Optional[str] = None

class RoadmapStepUpdate(BaseModel):
    is_completed: bool

class RoadmapStepRead(BaseModel):
    id: int
    step_order: int
    title: str
    description: str
    expected_duration: str
    action_type: str
    is_completed: bool
    completed_at: Optional[datetime] = None

class RoadmapRead(BaseModel):
    id: int
    beneficiary_id: int
    goal_title: str
    target_timeframe: str
    total_steps: int
    completed_steps: int
    status: str
    steps: List[RoadmapStepRead]

# --- VOICE / IVR SCHEMAS ---
class TwilioVoiceIncoming(BaseModel):
    CallSid: Optional[str] = "CA-SIMULATED-001"
    From: Optional[str] = "+919876543210"
    To: Optional[str] = "+9118005550199"
    Digits: Optional[str] = None
    SpeechResult: Optional[str] = None
    CallStatus: Optional[str] = "ringing"

class IVRInputRequest(BaseModel):
    call_sid: str
    user_input: str
    input_type: str = "speech" # speech, dtmf
    language: Optional[str] = None

class VoiceCallRead(BaseModel):
    id: int
    call_sid: str
    caller_phone: str
    beneficiary_name: Optional[str] = None
    provider: str
    direction: str
    language: str
    duration_seconds: int
    status: str
    transcript_summary: Optional[str] = None
    sentiment: str
    recording_url: Optional[str] = None
    created_at: datetime

# --- ADMIN DASHBOARD SCHEMAS ---
class AdminDashboardStats(BaseModel):
    total_beneficiaries: int
    completed_assessments: int
    voice_calls_count: int
    job_matches_count: int
    training_matches_count: int
    scheme_matches_count: int
    district_distribution: List[Dict[str, Any]]
    education_distribution: List[Dict[str, Any]]
    skills_distribution: List[Dict[str, Any]]
    employment_status: List[Dict[str, Any]]
    training_demand: List[Dict[str, Any]]
    voice_call_stats: List[Dict[str, Any]]
