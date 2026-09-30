from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import GovernmentScheme
from app.schemas.schemas import ApiResponse
from app.ai.recommendation_engine import recommendation_engine

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

@router.get("", response_model=ApiResponse[List[Dict[str, Any]]])
def list_schemes(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(GovernmentScheme)
    if category:
        query = query.filter(GovernmentScheme.category.ilike(f"%{category}%"))
    schemes = query.all()
    
    result = [
        {
            "id": s.id,
            "scheme_name": s.scheme_name,
            "ministry": s.ministry,
            "category": s.category,
            "subsidy_amount": s.subsidy_amount,
            "eligibility_criteria": s.eligibility_criteria,
            "benefits": s.benefits,
            "required_documents": s.required_documents_json or [],
            "application_portal_url": s.application_portal_url,
            "description": s.description
        }
        for s in schemes
    ]
    return ApiResponse(success=True, data=result, message="Government schemes list retrieved")

@router.get("/eligible/{beneficiary_id}", response_model=ApiResponse[List[Dict[str, Any]]])
def get_eligible_schemes(beneficiary_id: int, db: Session = Depends(get_db)):
    recs = recommendation_engine.generate_recommendations_for_beneficiary(db, beneficiary_id)
    return ApiResponse(success=True, data=recs["government_schemes"], message="Eligible schemes retrieved")

@router.get("/{id}", response_model=ApiResponse[Dict[str, Any]])
def get_scheme_detail(id: int, db: Session = Depends(get_db)):
    s = db.query(GovernmentScheme).filter(GovernmentScheme.id == id).first()
    if not s:
        return ApiResponse(success=False, message="Scheme not found", error={"code": "SCHEME_NOT_FOUND"})
    data = {
        "id": s.id,
        "scheme_name": s.scheme_name,
        "ministry": s.ministry,
        "category": s.category,
        "subsidy_amount": s.subsidy_amount,
        "eligibility_criteria": s.eligibility_criteria,
        "benefits": s.benefits,
        "required_documents": s.required_documents_json or [],
        "application_portal_url": s.application_portal_url,
        "description": s.description
    }
    return ApiResponse(success=True, data=data, message="Scheme detail retrieved")
