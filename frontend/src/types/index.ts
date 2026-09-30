export type UserRole = 'beneficiary' | 'admin' | 'employer';
export type Language = 'en' | 'ta' | 'hi';

export interface User {
  id: number;
  full_name: string;
  phone: string;
  phone_masked?: string;
  email?: string;
  role: UserRole;
  preferred_language: Language;
  beneficiary_id?: number;
  district?: string;
  state?: string;
  is_profile_completed?: boolean;
}

export interface BeneficiarySkill {
  id: number;
  skill_name: string;
  skill_category: string;
  skill_level: string;
  years_experience: number;
  ai_confidence: number;
  verified_by_assessment: boolean;
}

export interface BeneficiaryProfile {
  id: number;
  name: string;
  phone_masked: string;
  age?: number;
  gender?: string;
  location: {
    state: string;
    district: string;
    village?: string;
    pincode?: string;
  };
  is_profile_completed: boolean;
  education: string;
  education_detail?: string;
  occupation: string;
  years_experience: number;
  target_career: string;
  interests: string[];
  income_range?: string;
  device_type?: string;
  skills: BeneficiarySkill[];
  extracted_profile_raw?: any;
}

export interface AssessmentMessage {
  id: number;
  sender: 'ai' | 'user';
  message_text: string;
  question_key?: string;
  created_at?: string;
}

export interface Assessment {
  id: number;
  beneficiary_id: number;
  channel: string;
  status: 'in_progress' | 'completed' | 'failed';
  current_step: string;
  language: Language;
  messages: AssessmentMessage[];
  ai_extracted_json?: any;
  created_at: string;
}

export interface SkillGapData {
  target_career: string;
  current_skills: string[];
  missing_skills: string[];
  gap_score: number;
  required_training: Array<{
    id: number;
    title: string;
    provider: string;
    duration: string;
  }>;
  career_readiness_level: string;
  next_step_action: string;
}

export interface RoadmapStep {
  id: number;
  step_order: number;
  title: string;
  description: string;
  expected_duration: string;
  action_type: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface LivelihoodRoadmap {
  id: number;
  beneficiary_id: number;
  goal_title: string;
  target_timeframe: string;
  total_steps: number;
  completed_steps: number;
  progress_percentage: number;
  status: string;
  steps: RoadmapStep[];
}

export interface Job {
  id: number;
  title: string;
  company_name: string;
  sector: string;
  location: string;
  location_district?: string;
  location_state?: string;
  salary_range: string;
  experience_required: string;
  education_required: string;
  vacancies: number;
  description: string;
  match_score?: number;
  match_reasons?: string[];
  skills?: string[];
}

export interface TrainingProgram {
  id: number;
  title: string;
  provider_name: string;
  sector: string;
  duration: string;
  mode: string;
  cost: string;
  location: string;
  certification: string;
  stipend: string;
  description: string;
  match_score?: number;
  match_reasons?: string[];
}

export interface GovernmentScheme {
  id: number;
  scheme_name: string;
  ministry: string;
  category: string;
  subsidy_amount: string;
  eligibility_criteria: string;
  benefits: string;
  required_documents: string[];
  application_portal_url: string;
  description: string;
  match_score?: number;
  match_reasons?: string[];
}

export interface SelfEmploymentIdea {
  id: number;
  title: string;
  sector: string;
  estimated_investment: string;
  potential_monthly_income: string;
  required_skills: string[];
  tools_needed: string[];
  linked_scheme_name: string;
  roadmap_summary: string;
  description: string;
  match_score?: number;
  match_reasons?: string[];
}

export interface VoiceCallLog {
  id: number;
  call_sid: string;
  caller_phone: string;
  beneficiary_name?: string;
  provider: string;
  direction: string;
  language: string;
  duration_seconds: number;
  status: string;
  transcript_summary?: string;
  sentiment: string;
  recording_url?: string;
  created_at: string;
}

export interface AdminDashboardData {
  cards: {
    total_beneficiaries: number;
    completed_assessments: number;
    voice_calls_count: number;
    job_matches_count: number;
    training_matches_count: number;
    scheme_matches_count: number;
  };
  district_distribution: Array<{ district: string; count: number; percentage: number }>;
  education_distribution: Array<{ level: string; count: number; percentage: number }>;
  skills_distribution: Array<{ skill: string; count: number; growth: string }>;
  employment_status: Array<{ status: string; count: number; color: string }>;
  training_demand: Array<{ sector: string; enrolled: number; capacity: number }>;
  voice_call_stats: Array<{ channel: string; calls: number; completed: number; avg_duration: string }>;
}
