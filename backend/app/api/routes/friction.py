from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, TopicMastery
from app.schemas.schemas import FrictionCalculateRequest, FrictionResponse
from app.services.friction_service import FrictionService

router = APIRouter()

@router.post("/calculate", response_model=FrictionResponse)
def calculate_friction_score(
    req: FrictionCalculateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mastery = 60.0
    if req.topic:
        tm = db.query(TopicMastery).filter(
            TopicMastery.student_id == current_user.id,
            TopicMastery.topic == req.topic
        ).first()
        if tm:
            mastery = tm.mastery_score

    return FrictionService.calculate_friction(req, historical_topic_mastery=mastery)
