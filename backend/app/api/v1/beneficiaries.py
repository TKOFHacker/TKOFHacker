from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Beneficiary, BeneficiaryProfile, BeneficiarySkill, SkillGap, User
from app.schemas.schemas import ApiResponse, BeneficiarySkillRead, BeneficiaryProfileUpdate
from app.ai.recommendation_engine import recommendation_engine
from app.ai.llm_service import llm_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/beneficiaries", tags=["Beneficiaries"])

@router.get("/{id}", response_model=ApiResponse[Dict[str, Any]])
def get_beneficiary(id: int, db: Session = Depends(get_db)):
    beneficiary = db.query(Beneficiary).filter(Beneficiary.id == id).first()
    if not beneficiary:
        return ApiResponse(
            success=False,
            message="Beneficiary not found",
            error={"code": "BENEFICIARY_NOT_FOUND"}
        )
    
    profile = beneficiary.profile
    skills = [
        {
            "id": s.id,
            "skill_name": s.skill_name,
            "skill_category": s.skill_category,
            "skill_level": s.skill_level,
            "years_experience": s.years_experience,
            "ai_confidence": s.ai_confidence,
            "verified_by_assessment": s.verified_by_assessment
        }
        for s in beneficiary.skills
    ]
    
    data = {
        "id": beneficiary.id,
        "name": beneficiary.user.full_name if beneficiary.user else "Beneficiary",
        "phone_masked": beneficiary.phone_masked or "98765XXXX0",
        "age": beneficiary.age,
        "gender": beneficiary.gender,
        "location": {
            "state": beneficiary.location_state,
            "district": beneficiary.location_district,
            "village": beneficiary.location_village,
            "pincode": beneficiary.pincode
        },
        "is_profile_completed": beneficiary.is_profile_completed,
        "education": profile.education_level if profile else "12th",
        "education_detail": profile.education_detail if profile else None,
        "occupation": profile.current_occupation if profile else "Farmer",
        "years_experience": profile.years_experience if profile else 3.0,
        "target_career": profile.target_career if profile else "Electrician",
        "interests": profile.interests_json if profile else [],
        "income_range": profile.current_income_range if profile else "₹8,000 - ₹12,000",
        "device_type": profile.device_type if profile else "Feature Phone / Web",
        "skills": skills,
        "extracted_profile_raw": profile.extracted_profile_raw if profile else None
    }
    
    return ApiResponse(success=True, data=data, message="Beneficiary profile retrieved")

@router.put("/{id}", response_model=ApiResponse[Dict[str, Any]])
def update_beneficiary_profile(id: int, update_data: BeneficiaryProfileUpdate, db: Session = Depends(get_db)):
    beneficiary = db.query(Beneficiary).filter(Beneficiary.id == id).first()
    if not beneficiary:
        return ApiResponse(
            success=False,
            message="Beneficiary not found",
            error={"code": "BENEFICIARY_NOT_FOUND"}
        )
        
    profile = beneficiary.profile
    if not profile:
        profile = BeneficiaryProfile(beneficiary_id=beneficiary.id)
        db.add(profile)
        
    if update_data.education_level:
        profile.education_level = update_data.education_level
    if update_data.current_occupation:
        profile.current_occupation = update_data.current_occupation
    if update_data.years_experience is not None:
        profile.years_experience = update_data.years_experience
    if update_data.target_career:
        profile.target_career = update_data.target_career
    if update_data.interests is not None:
        profile.interests_json = update_data.interests
        
    if update_data.district:
        beneficiary.location_district = update_data.district
    if update_data.state:
        beneficiary.location_state = update_data.state
    if update_data.pincode:
        beneficiary.pincode = update_data.pincode
        
    beneficiary.is_profile_completed = True
    db.commit()
    
    return ApiResponse(
        success=True,
        data={"beneficiary_id": beneficiary.id, "status": "updated"},
        message="Profile updated successfully"
    )

@router.get("/{id}/skills", response_model=ApiResponse[List[BeneficiarySkillRead]])
def get_beneficiary_skills(id: int, db: Session = Depends(get_db)):
    skills = db.query(BeneficiarySkill).filter(BeneficiarySkill.beneficiary_id == id).all()
    skills_data = [
        BeneficiarySkillRead(
            id=s.id,
            skill_name=s.skill_name,
            skill_category=s.skill_category,
            skill_level=s.skill_level,
            years_experience=s.years_experience,
            ai_confidence=s.ai_confidence,
            verified_by_assessment=s.verified_by_assessment
        )
        for s in skills
    ]
    return ApiResponse(success=True, data=skills_data, message="Skills retrieved")

@router.post("/{id}/skills", response_model=ApiResponse[Dict[str, Any]])
def add_beneficiary_skill(id: int, skill_in: Dict[str, Any], db: Session = Depends(get_db)):
    new_skill = BeneficiarySkill(
        beneficiary_id=id,
        skill_name=skill_in.get("skill_name", "Skill"),
        skill_category=skill_in.get("skill_category", "Technical"),
        skill_level=skill_in.get("skill_level", "Intermediate"),
        years_experience=skill_in.get("years_experience", 1.0),
        ai_confidence=skill_in.get("ai_confidence", 0.85),
        verified_by_assessment=True
    )
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return ApiResponse(success=True, data={"id": new_skill.id, "skill_name": new_skill.skill_name}, message="Skill added")

@router.get("/{id}/recommendations", response_model=ApiResponse[Dict[str, Any]])
def get_recommendations(id: int, db: Session = Depends(get_db)):
    try:
        recommendations = recommendation_engine.generate_recommendations_for_beneficiary(db, id)
        return ApiResponse(success=True, data=recommendations, message="Recommendations generated successfully")
    except Exception as e:
        return ApiResponse(
            success=False,
            message=str(e),
            error={"code": "RECOMMENDATION_FAILED"}
        )
