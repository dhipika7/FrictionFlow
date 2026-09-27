from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.db.database import get_db
from app.api.deps import get_current_teacher
from app.models.models import User
from app.schemas.schemas import TeacherAnalyticsResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("/dashboard", response_model=TeacherAnalyticsResponse)
def get_teacher_dashboard(
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    data = AnalyticsService.get_teacher_analytics(db, current_teacher.id)
    return TeacherAnalyticsResponse.model_validate(data)

@router.get("/class")
def get_class_overview(
    current_teacher: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    return AnalyticsService.get_teacher_analytics(db, current_teacher.id)
