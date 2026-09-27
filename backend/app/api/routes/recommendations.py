from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.models import User
from app.services.recommendation_service import RecommendationService

router = APIRouter()

@router.get("/", response_model=List[Dict[str, Any]])
def get_personalized_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return RecommendationService.get_recommendations_for_student(db, current_user.id)

@router.get("/roadmap", response_model=List[Dict[str, Any]])
def get_learning_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return RecommendationService.get_learning_roadmap(db, current_user.id)

@router.post("/{rec_id}/complete")
def complete_recommendation(
    rec_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {"status": "success", "message": f"Recommendation {rec_id} completed!"}
