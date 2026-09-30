from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Beneficiary, BeneficiarySkill, BeneficiaryProfile, SkillGap
from app.schemas.schemas import ApiResponse, SkillAnalysisRequest, SkillGapAnalysisRequest, RecommendationsRequest
from app.ai.llm_service import llm_service
from app.ai.recommendation_engine import recommendation_engine

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.post("/skill-analysis", response_model=ApiResponse[Dict[str, Any]])
def analyze_skills(req: SkillAnalysisRequest, db: Session = Depends(get_db)):
    """
    Performs AI skill mapping, assigning confidence score, category, and proficiency level.
    """
    skills_to_map = []
    if req.extracted_data and "skills" in req.extracted_data:
        skills_to_map = req.extracted_data["skills"]
    elif req.beneficiary_id:
        existing = db.query(BeneficiarySkill).filter(BeneficiarySkill.beneficiary_id == req.beneficiary_id).all()
        skills_to_map = [s.skill_name for s in existing]
    
    if not skills_to_map:
        skills_to_map = ["Basic Electrical", "Farming"]
        
    mapped = llm_service.map_skills(skills_to_map)
    return ApiResponse(
        success=True,
        data={"mapped_skills": mapped, "skills_count": len(mapped)},
        message="AI skill analysis completed"
    )

@router.post("/skill-gap", response_model=ApiResponse[Dict[str, Any]])
def analyze_skill_gap(req: SkillGapAnalysisRequest, db: Session = Depends(get_db)):
    """
    Compares Current Skills against Required Skills for the target career.
    """
    current_skills = req.current_skills or []
    if not current_skills and req.beneficiary_id:
        existing = db.query(BeneficiarySkill).filter(BeneficiarySkill.beneficiary_id == req.beneficiary_id).all()
        current_skills = [s.skill_name for s in existing]
        
    if not current_skills:
        current_skills = ["Basic Electrical", "Farming"]
        
    gap_result = llm_service.perform_skill_gap_analysis(current_skills, target_career=req.target_career)
    return ApiResponse(
        success=True,
        data=gap_result,
        message="Skill gap analysis completed"
    )

@router.post("/recommendations", response_model=ApiResponse[Dict[str, Any]])
def generate_ai_recommendations(req: RecommendationsRequest, db: Session = Depends(get_db)):
    """
    Multi-factor AI recommendation engine generating Jobs, Training, Schemes, and Self-Employment ideas.
    """
    beneficiary_id = req.beneficiary_id or 1
    recs = recommendation_engine.generate_recommendations_for_beneficiary(db, beneficiary_id)
    return ApiResponse(
        success=True,
        data=recs,
        message="AI recommendations generated"
    )
