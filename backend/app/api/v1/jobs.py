from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Job, Application, Beneficiary, JobSkill
from app.schemas.schemas import ApiResponse
from app.ai.recommendation_engine import recommendation_engine

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("", response_model=ApiResponse[List[Dict[str, Any]]])
def list_jobs(sector: Optional[str] = None, district: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Job).filter(Job.is_active == True)
    if sector:
        query = query.filter(Job.sector.ilike(f"%{sector}%"))
    if district:
        query = query.filter(Job.location_district.ilike(f"%{district}%"))
    jobs = query.all()
    
    result = [
        {
            "id": j.id,
            "title": j.title,
            "company_name": j.company_name,
            "sector": j.sector,
            "location_district": j.location_district,
            "location_state": j.location_state,
            "salary_range": j.salary_range,
            "experience_required": j.experience_required,
            "education_required": j.education_required,
            "vacancies": j.vacancies,
            "description": j.description,
            "skills": [s.skill_name for s in j.skills]
        }
        for j in jobs
    ]
    return ApiResponse(success=True, data=result, message="Jobs list retrieved")

@router.get("/recommended/{beneficiary_id}", response_model=ApiResponse[List[Dict[str, Any]]])
def get_recommended_jobs(beneficiary_id: int, db: Session = Depends(get_db)):
    recs = recommendation_engine.generate_recommendations_for_beneficiary(db, beneficiary_id)
    return ApiResponse(success=True, data=recs["jobs"], message="Recommended jobs retrieved")

@router.get("/{id}", response_model=ApiResponse[Dict[str, Any]])
def get_job_detail(id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == id).first()
    if not job:
        return ApiResponse(success=False, message="Job not found", error={"code": "JOB_NOT_FOUND"})
    data = {
        "id": job.id,
        "title": job.title,
        "company_name": job.company_name,
        "sector": job.sector,
        "location_district": job.location_district,
        "location_state": job.location_state,
        "salary_range": job.salary_range,
        "experience_required": job.experience_required,
        "education_required": job.education_required,
        "vacancies": job.vacancies,
        "description": job.description,
        "skills": [s.skill_name for s in job.skills]
    }
    return ApiResponse(success=True, data=data, message="Job detail retrieved")

@router.post("/{id}/apply", response_model=ApiResponse[Dict[str, Any]])
def apply_job(id: int, payload: Dict[str, Any] = {}, db: Session = Depends(get_db)):
    beneficiary_id = payload.get("beneficiary_id", 1)
    job = db.query(Job).filter(Job.id == id).first()
    if not job:
        return ApiResponse(success=False, message="Job not found", error={"code": "JOB_NOT_FOUND"})
        
    existing = db.query(Application).filter(Application.beneficiary_id == beneficiary_id, Application.job_id == id).first()
    if existing:
        return ApiResponse(
            success=True,
            data={"application_id": existing.id, "status": existing.status, "already_applied": True},
            message="Application already submitted previously"
        )
        
    app = Application(
        beneficiary_id=beneficiary_id,
        job_id=id,
        status="submitted",
        match_score=payload.get("match_score", 90.0)
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    
    return ApiResponse(
        success=True,
        data={"application_id": app.id, "status": app.status, "job_title": job.title},
        message="Application submitted successfully"
    )
