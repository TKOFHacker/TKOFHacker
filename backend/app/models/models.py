from datetime import datetime, timezone
import enum
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, 
    ForeignKey, Enum, JSON, Index
)
from sqlalchemy.orm import relationship
from app.database.session import Base

def utcnow():
    return datetime.now(timezone.utc)

class UserRole(str, enum.Enum):
    BENEFICIARY = "beneficiary"
    ADMIN = "admin"
    EMPLOYER = "employer"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone = Column(String(32), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(128), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.BENEFICIARY, nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    preferred_language = Column(String(8), default="en") # en, ta, hi
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    
    beneficiary = relationship("Beneficiary", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    aadhaar_masked = Column(String(16), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(32), nullable=True)
    phone_masked = Column(String(32), nullable=True)
    location_state = Column(String(64), index=True, default="Tamil Nadu")
    location_district = Column(String(64), index=True, default="Thanjavur")
    location_village = Column(String(128), nullable=True)
    pincode = Column(String(10), nullable=True)
    is_profile_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    
    user = relationship("User", back_populates="beneficiary")
    profile = relationship("BeneficiaryProfile", back_populates="beneficiary", uselist=False, cascade="all, delete-orphan")
    skills = relationship("BeneficiarySkill", back_populates="beneficiary", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="beneficiary", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="beneficiary", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="beneficiary", cascade="all, delete-orphan")
    enrollments = relationship("TrainingEnrollment", back_populates="beneficiary", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="beneficiary", cascade="all, delete-orphan")
    roadmaps = relationship("LivelihoodRoadmap", back_populates="beneficiary", cascade="all, delete-orphan")
    voice_calls = relationship("VoiceCall", back_populates="beneficiary")

class BeneficiaryProfile(Base):
    __tablename__ = "beneficiary_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id", ondelete="CASCADE"), unique=True, nullable=False)
    education_level = Column(String(64), default="12th")
    education_detail = Column(String(255), nullable=True)
    current_occupation = Column(String(128), default="Farmer")
    years_experience = Column(Float, default=0.0)
    current_income_range = Column(String(64), nullable=True)
    target_career = Column(String(128), default="Electrician")
    interests_json = Column(JSON, default=list) # e.g. ["Electrical work", "Self employment"]
    entrepreneurship_interest = Column(Boolean, default=True)
    training_interest = Column(Boolean, default=True)
    device_type = Column(String(32), default="Feature Phone / Web") # feature_phone, smartphone, ivr
    extracted_profile_raw = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    
    beneficiary = relationship("Beneficiary", back_populates="profile")

class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(32), unique=True, index=True)
    name = Column(String(128), nullable=False)
    level_order = Column(Integer, default=1)

class Occupation(Base):
    __tablename__ = "occupations"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(32), unique=True, index=True)
    name = Column(String(128), nullable=False)
    sector = Column(String(64), index=True)
    demand_level = Column(String(32), default="Medium")

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), unique=True, index=True, nullable=False)
    category = Column(String(64), index=True, default="Technical")
    description = Column(Text, nullable=True)

class BeneficiarySkill(Base):
    __tablename__ = "beneficiary_skills"
    
    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(128), nullable=False, index=True)
    skill_category = Column(String(64), default="Technical")
    skill_level = Column(String(32), default="Intermediate") # Beginner, Intermediate, Advanced
    years_experience = Column(Float, default=1.0)
    ai_confidence = Column(Float, default=0.85) # e.g. 0.87 for 87%
    verified_by_assessment = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)
    
    beneficiary = relationship("Beneficiary", back_populates="skills")

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id", ondelete="CASCADE"), nullable=False)
    channel = Column(String(32), default="voice_web") # voice_web, chat_web, ivr_phone
    status = Column(String(32), default="in_progress") # in_progress, completed, failed
    current_step = Column(String(64), default="name")
    language = Column(String(8), default="ta")
    audio_recordings_count = Column(Integer, default=0)
    ai_extracted_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    beneficiary = relationship("Beneficiary", back_populates="assessments")
    messages = relationship("AssessmentMessage", back_populates="assessment", cascade="all, delete-orphan")

class AssessmentMessage(Base):
    __tablename__ = "assessment_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(16), nullable=False) # ai, user
    message_text = Column(Text, nullable=False)
    audio_url = Column(String(255), nullable=True)
    question_key = Column(String(64), nullable=True)
    intent_detected = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=utcnow)
    
    assessment = relationship("Assessment", back_populates="messages")

class SkillGap(Base):
    __tablename__ = "skill_gaps"
    
    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id", ondelete="CASCADE"), nullable=False)
    target_career = Column(String(128), nullable=False)
    current_skills_json = Column(JSON, default=list)
    missing_skills_json = Column(JSON, default=list)
    gap_score = Column(Float, default=35.0) # percentage or scale
    recommended_training_ids_json = Column(JSON, default=list)
    created_at = Column(DateTime, default=utcnow)
    
    beneficiary = relationship("Beneficiary", back_populates="skill_gaps")

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), index=True, nullable=False)
    company_name = Column(String(128), nullable=False)
    sector = Column(String(64), index=True, default="Electrical & Electronics")
    location_district = Column(String(64), index=True, default="Thanjavur")
    location_state = Column(String(64), default="Tamil Nadu")
    salary_range = Column(String(64), default="₹15,000 - ₹22,000 / month")
    experience_required = Column(String(64), default="0-2 years")
    education_required = Column(String(64), default="10th / 12th / ITI")
    description = Column(Text, nullable=False)
    vacancies = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)
    
    skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job")

class JobSkill(Base):
    __tablename__ = "job_skills"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(128), nullable=False)
    is_mandatory = Column(Boolean, default=True)
    
    job = relationship("Job", back_populates="skills")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(32), default="submitted") # submitted, under_review, shortlisted, rejected, hired
    match_score = Column(Float, default=85.0)
    applied_at = Column(DateTime, default=utcnow)
    
    beneficiary = relationship("Beneficiary", back_populates="applications")
    job = relationship("Job", back_populates="applications")

class TrainingProgram(Base):
    __tablename__ = "training_programs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), index=True, nullable=False)
    provider_name = Column(String(128), nullable=False) # e.g. PMKK, ITI Thanjavur, NSDC Partner
    sector = Column(String(64), index=True, default="Electrical")
    duration = Column(String(64), default="3 Months (300 Hours)")
    mode = Column(String(32), default="Hybrid / In-Person")
    cost = Column(String(32), default="Free (Govt. Sponsored)")
    location = Column(String(128), default="Thanjavur, Tamil Nadu")
    certification = Column(String(128), default="NSDC Level 4 Electrician Certification")
    stipend = Column(String(64), default="₹1,500/month stipend provided")
    description = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)
    
    skills = relationship("TrainingSkill", back_populates="training_program", cascade="all, delete-orphan")
    enrollments = relationship("TrainingEnrollment", back_populates="training_program")

class TrainingSkill(Base):
    __tablename__ = "training_skills"
    
    id = Column(Integer, primary_key=True, index=True)
    training_id = Column(Integer, ForeignKey("training_programs.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(128), nullable=False)
    
    training_program = relationship("TrainingProgram", back_populates="skills")

class TrainingEnrollment(Base):
    __tablename__ = "training_enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id", ondelete="CASCADE"), nullable=False)
    training_id = Column(Integer, ForeignKey("training_programs.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(32), default="enrolled") # enrolled, ongoing, completed, certified
    progress_percent = Column(Integer, default=0)
    enrolled_at = Column(DateTime, default=utcnow)
    
    beneficiary = relationship("Beneficiary", back_populates="enrollments")
    training_program = relationship("TrainingProgram", back_populates="enrollments")

class GovernmentScheme(Base):
    __tablename__ = "government_schemes"
    
    id = Column(Integer, primary_key=True, index=True)
    scheme_name = Column(String(255), nullable=False, index=True)
    ministry = Column(String(255), default="Ministry of MSME / Skill Development")
    category = Column(String(64), index=True, default="Financial Assistance / Subsidy")
    subsidy_amount = Column(String(128), default="Up to 35% subsidy on project loan up to ₹25 Lakhs")
    eligibility_criteria = Column(Text, nullable=False)
    benefits = Column(Text, nullable=False)
    required_documents_json = Column(JSON, default=list)
    application_portal_url = Column(String(255), default="https://www.kviconline.gov.in/pmegpep/")
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utcnow)

class SchemeEligibility(Base):
    __tablename__ = "scheme_eligibility"
    
    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id", ondelete="CASCADE"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("government_schemes.id", ondelete="CASCADE"), nullable=False)
    is_eligible = Column(Boolean, default=True)
    match_reasons_json = Column(JSON, default=list)
    status = Column(String(32), default="eligible") # eligible, applied, approved

class SelfEmploymentIdea(Base):
    __tablename__ = "self_employment_ideas"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    sector = Column(String(64), index=True, default="Electrical Services")
    estimated_investment = Column(String(64), default="₹25,000 - ₹50,000")
    potential_monthly_income = Column(String(64), default="₹20,000 - ₹35,000")
    required_skills_json = Column(JSON, default=list)
    tools_needed_json = Column(JSON, default=list)
    linked_scheme_name = Column(String(128), default="PMEGP / Mudra Loan")
    roadmap_summary = Column(Text, nullable=False)
    description = Column(Text, nullable=False)

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id", ondelete="CASCADE"), nullable=False)
    recommendation_type = Column(String(32), nullable=False) # job, training, scheme, self_employment
    title = Column(String(128), nullable=False)
    confidence_score = Column(Float, default=90.0)
    match_reasons_json = Column(JSON, default=list)
    item_id = Column(Integer, nullable=True) # referenced job/training/scheme id
    payload_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    
    beneficiary = relationship("Beneficiary", back_populates="recommendations")

class LivelihoodRoadmap(Base):
    __tablename__ = "livelihood_roadmaps"
    
    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id", ondelete="CASCADE"), nullable=False)
    goal_title = Column(String(128), nullable=False, default="Become a Certified Electrician & Electrical Contractor")
    target_timeframe = Column(String(64), default="6 Months")
    total_steps = Column(Integer, default=6)
    completed_steps = Column(Integer, default=1)
    status = Column(String(32), default="active") # active, completed
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    
    beneficiary = relationship("Beneficiary", back_populates="roadmaps")
    steps = relationship("RoadmapStep", back_populates="roadmap", cascade="all, delete-orphan", order_by="RoadmapStep.step_order")

class RoadmapStep(Base):
    __tablename__ = "roadmap_steps"
    
    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("livelihood_roadmaps.id", ondelete="CASCADE"), nullable=False)
    step_order = Column(Integer, nullable=False)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    expected_duration = Column(String(64), default="3-4 weeks")
    action_type = Column(String(32), default="training") # training, certification, job_application, loan_application, business_launch
    action_reference_id = Column(Integer, nullable=True)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    
    roadmap = relationship("LivelihoodRoadmap", back_populates="steps")

class VoiceCall(Base):
    __tablename__ = "voice_calls"
    
    id = Column(Integer, primary_key=True, index=True)
    call_sid = Column(String(64), unique=True, index=True, nullable=False)
    caller_phone = Column(String(32), nullable=False, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id", ondelete="SET NULL"), nullable=True)
    provider = Column(String(32), default="MockVoiceProvider") # Twilio, Exotel, MockVoiceProvider
    direction = Column(String(16), default="inbound") # inbound, outbound
    language = Column(String(8), default="ta")
    duration_seconds = Column(Integer, default=120)
    status = Column(String(32), default="completed") # ringing, in_progress, completed, failed
    transcript_summary = Column(Text, nullable=True)
    sentiment = Column(String(32), default="Positive")
    recording_url = Column(String(255), nullable=True)
    extracted_profile_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    
    beneficiary = relationship("Beneficiary", back_populates="voice_calls")
    sessions = relationship("VoiceSession", back_populates="call", cascade="all, delete-orphan")

class VoiceSession(Base):
    __tablename__ = "voice_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    call_id = Column(Integer, ForeignKey("voice_calls.id", ondelete="CASCADE"), nullable=False)
    state = Column(String(64), default="welcome") # welcome, lang_select, ask_name, ask_education, ask_occupation, ask_skills, ask_interests, recommendations, farewell
    turn_count = Column(Integer, default=0)
    context_data = Column(JSON, default=dict) # accumulated answers
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    
    call = relationship("VoiceCall", back_populates="sessions")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(128), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(32), default="scheme_alert") # scheme_alert, job_match, training_update, call_summary
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)
    
    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(64), nullable=False)
    resource = Column(String(64), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=utcnow)
    
    user = relationship("User", back_populates="audit_logs")
