from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.models import User
from app.schemas.schemas import StudentAnalyticsResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("/student", response_model=StudentAnalyticsResponse)
def get_student_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = AnalyticsService.get_student_analytics(db, current_user.id)
    return StudentAnalyticsResponse.model_validate(data)
