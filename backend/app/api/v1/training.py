from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import TrainingProgram, TrainingEnrollment
from app.schemas.schemas import ApiResponse
from app.ai.recommendation_engine import recommendation_engine

router = APIRouter(prefix="/training", tags=["Training"])

@router.get("", response_model=ApiResponse[List[Dict[str, Any]]])
def list_training_programs(sector: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(TrainingProgram).filter(TrainingProgram.is_active == True)
    if sector:
        query = query.filter(TrainingProgram.sector.ilike(f"%{sector}%"))
    trainings = query.all()
    
    result = [
        {
            "id": t.id,
            "title": t.title,
            "provider_name": t.provider_name,
            "sector": t.sector,
            "duration": t.duration,
            "mode": t.mode,
            "cost": t.cost,
            "location": t.location,
            "certification": t.certification,
            "stipend": t.stipend,
            "description": t.description
        }
        for t in trainings
    ]
    return ApiResponse(success=True, data=result, message="Training programs list retrieved")

@router.get("/recommended/{beneficiary_id}", response_model=ApiResponse[List[Dict[str, Any]]])
def get_recommended_training(beneficiary_id: int, db: Session = Depends(get_db)):
    recs = recommendation_engine.generate_recommendations_for_beneficiary(db, beneficiary_id)
    return ApiResponse(success=True, data=recs["training_programs"], message="Recommended training programs retrieved")

@router.get("/{id}", response_model=ApiResponse[Dict[str, Any]])
def get_training_detail(id: int, db: Session = Depends(get_db)):
    t = db.query(TrainingProgram).filter(TrainingProgram.id == id).first()
    if not t:
        return ApiResponse(success=False, message="Training program not found", error={"code": "TRAINING_NOT_FOUND"})
    data = {
        "id": t.id,
        "title": t.title,
        "provider_name": t.provider_name,
        "sector": t.sector,
        "duration": t.duration,
        "mode": t.mode,
        "cost": t.cost,
        "location": t.location,
        "certification": t.certification,
        "stipend": t.stipend,
        "description": t.description
    }
    return ApiResponse(success=True, data=data, message="Training program detail retrieved")

@router.post("/{id}/enroll", response_model=ApiResponse[Dict[str, Any]])
def enroll_training(id: int, payload: Dict[str, Any] = {}, db: Session = Depends(get_db)):
    beneficiary_id = payload.get("beneficiary_id", 1)
    training = db.query(TrainingProgram).filter(TrainingProgram.id == id).first()
    if not training:
        return ApiResponse(success=False, message="Training program not found", error={"code": "TRAINING_NOT_FOUND"})
        
    existing = db.query(TrainingEnrollment).filter(
        TrainingEnrollment.beneficiary_id == beneficiary_id,
        TrainingEnrollment.training_id == id
    ).first()
    if existing:
        return ApiResponse(
            success=True,
            data={"enrollment_id": existing.id, "status": existing.status, "already_enrolled": True},
            message="Already enrolled in this training program"
        )
        
    enrollment = TrainingEnrollment(
        beneficiary_id=beneficiary_id,
        training_id=id,
        status="enrolled",
        progress_percent=0
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    
    return ApiResponse(
        success=True,
        data={"enrollment_id": enrollment.id, "status": enrollment.status, "training_title": training.title},
        message="Enrolled in training program successfully"
    )
