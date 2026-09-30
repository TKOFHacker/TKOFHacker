from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Notification, User
from app.schemas.schemas import ApiResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=ApiResponse[List[Dict[str, Any]]])
def list_notifications(db: Session = Depends(get_db)):
    notes = db.query(Notification).order_by(Notification.created_at.desc()).all()
    data = [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat()
        }
        for n in notes
    ]
    return ApiResponse(success=True, data=data, message="Notifications retrieved")

@router.put("/{id}/read", response_model=ApiResponse[Dict[str, Any]])
def mark_notification_read(id: int, db: Session = Depends(get_db)):
    note = db.query(Notification).filter(Notification.id == id).first()
    if note:
        note.is_read = True
        db.commit()
    return ApiResponse(success=True, data={"id": id, "is_read": True}, message="Notification marked as read")
