from typing import Dict, Any, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import LivelihoodRoadmap, RoadmapStep, Beneficiary
from app.schemas.schemas import ApiResponse, RoadmapGenerateRequest, RoadmapStepUpdate
from app.ai.llm_service import llm_service

router = APIRouter(prefix="/roadmap", tags=["Livelihood Roadmap"])

@router.post("/generate", response_model=ApiResponse[Dict[str, Any]])
def generate_roadmap(req: RoadmapGenerateRequest, db: Session = Depends(get_db)):
    beneficiary = db.query(Beneficiary).filter(Beneficiary.id == req.beneficiary_id).first()
    if not beneficiary:
        return ApiResponse(success=False, message="Beneficiary not found", error={"code": "BENEFICIARY_NOT_FOUND"})
        
    target_career = beneficiary.profile.target_career if beneficiary.profile else "Electrician"
    goal_title = req.goal_title or f"Become a Certified {target_career} & Start Independent Enterprise"
    
    # Delete old roadmap if exists
    existing = db.query(LivelihoodRoadmap).filter(LivelihoodRoadmap.beneficiary_id == beneficiary.id).first()
    if existing:
        db.delete(existing)
        db.commit()
        
    steps_data = llm_service.generate_livelihood_roadmap(goal_title=goal_title, target_career=target_career)
    
    new_roadmap = LivelihoodRoadmap(
        beneficiary_id=beneficiary.id,
        goal_title=goal_title,
        target_timeframe="6 Months",
        total_steps=len(steps_data),
        completed_steps=1,
        status="active"
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    
    for s in steps_data:
        step_obj = RoadmapStep(
            roadmap_id=new_roadmap.id,
            step_order=s["step_order"],
            title=s["title"],
            description=s["description"],
            expected_duration=s["expected_duration"],
            action_type=s["action_type"],
            is_completed=s["is_completed"],
            completed_at=datetime.now(timezone.utc) if s["is_completed"] else None
        )
        db.add(step_obj)
    db.commit()
    
    return ApiResponse(
        success=True,
        data={"roadmap_id": new_roadmap.id, "goal_title": new_roadmap.goal_title, "steps_count": len(steps_data)},
        message="Livelihood roadmap generated successfully"
    )

@router.get("/beneficiary/{beneficiary_id}", response_model=ApiResponse[Dict[str, Any]])
def get_beneficiary_roadmap(beneficiary_id: int, db: Session = Depends(get_db)):
    roadmap = db.query(LivelihoodRoadmap).filter(LivelihoodRoadmap.beneficiary_id == beneficiary_id).first()
    if not roadmap:
        # Auto-generate if not exists
        req = RoadmapGenerateRequest(beneficiary_id=beneficiary_id)
        generate_roadmap(req, db)
        roadmap = db.query(LivelihoodRoadmap).filter(LivelihoodRoadmap.beneficiary_id == beneficiary_id).first()
        
    steps = [
        {
            "id": s.id,
            "step_order": s.step_order,
            "title": s.title,
            "description": s.description,
            "expected_duration": s.expected_duration,
            "action_type": s.action_type,
            "is_completed": s.is_completed,
            "completed_at": s.completed_at.isoformat() if s.completed_at else None
        }
        for s in roadmap.steps
    ]
    
    completed_count = sum(1 for s in steps if s["is_completed"])
    roadmap.completed_steps = completed_count
    db.commit()
    
    data = {
        "id": roadmap.id,
        "beneficiary_id": roadmap.beneficiary_id,
        "goal_title": roadmap.goal_title,
        "target_timeframe": roadmap.target_timeframe,
        "total_steps": roadmap.total_steps,
        "completed_steps": completed_count,
        "progress_percentage": round((completed_count / max(roadmap.total_steps, 1)) * 100),
        "status": roadmap.status,
        "steps": steps
    }
    return ApiResponse(success=True, data=data, message="Roadmap fetched successfully")

@router.put("/step/{step_id}/progress", response_model=ApiResponse[Dict[str, Any]])
def update_step_progress(step_id: int, update: RoadmapStepUpdate, db: Session = Depends(get_db)):
    step = db.query(RoadmapStep).filter(RoadmapStep.id == step_id).first()
    if not step:
        return ApiResponse(success=False, message="Roadmap step not found", error={"code": "STEP_NOT_FOUND"})
        
    step.is_completed = update.is_completed
    step.completed_at = datetime.now(timezone.utc) if update.is_completed else None
    db.commit()
    
    roadmap = step.roadmap
    completed_count = sum(1 for s in roadmap.steps if s.is_completed)
    roadmap.completed_steps = completed_count
    db.commit()
    
    return ApiResponse(
        success=True,
        data={
            "step_id": step.id,
            "is_completed": step.is_completed,
            "completed_steps": completed_count,
            "progress_percentage": round((completed_count / max(roadmap.total_steps, 1)) * 100)
        },
        message="Step progress updated"
    )
