from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, StudentProfile, TopicMastery, ProblemSession
from app.schemas.schemas import StudentProfileResponse, StudentProfileUpdate, TopicMasterySchema, ProblemSessionResponse
from app.services.mastery_service import MasteryService

router = APIRouter()

@router.get("/profile", response_model=StudentProfileResponse)
def get_student_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id, current_streak=7, focus_topic="Dynamic Programming")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return StudentProfileResponse.model_validate(profile)

@router.patch("/profile", response_model=StudentProfileResponse)
def update_student_profile(
    update_data: StudentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    if update_data.preferred_difficulty:
        profile.preferred_difficulty = update_data.preferred_difficulty
    if update_data.focus_topic:
        profile.focus_topic = update_data.focus_topic
    if update_data.learning_goal:
        profile.learning_goal = update_data.learning_goal

    db.commit()
    db.refresh(profile)
    return StudentProfileResponse.model_validate(profile)

@router.get("/topic-mastery", response_model=List[TopicMasterySchema])
def get_student_topic_masteries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    masteries = db.query(TopicMastery).filter(TopicMastery.student_id == current_user.id).all()
    if not masteries:
        # Seed default masteries if empty
        defaults = [
            ("Arrays & Hashing", 82.0, 15, 13),
            ("Two Pointers", 76.0, 12, 10),
            ("Trees & Graphs", 63.0, 14, 9),
            ("Dynamic Programming", 39.0, 18, 7),
            ("Sliding Window", 70.0, 10, 8)
        ]
        for top, score, att, succ in defaults:
            tm = TopicMastery(
                student_id=current_user.id,
                topic=top,
                mastery_score=score,
                total_attempts=att,
                successful_attempts=succ
            )
            db.add(tm)
        db.commit()
        masteries = db.query(TopicMastery).filter(TopicMastery.student_id == current_user.id).all()
    
    return [
        TopicMasterySchema(
            topic=m.topic,
            mastery_score=m.mastery_score,
            total_attempts=m.total_attempts,
            successful_attempts=m.successful_attempts
        )
        for m in masteries
    ]

@router.get("/history", response_model=List[ProblemSessionResponse])
def get_student_learning_history(
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = (
        db.query(ProblemSession)
        .filter(ProblemSession.student_id == current_user.id)
        .order_by(ProblemSession.started_at.desc())
        .limit(limit)
        .all()
    )
    return [ProblemSessionResponse.model_validate(s) for s in sessions]

@router.get("/insights", response_model=List[str])
def get_student_learning_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return MasteryService.generate_learning_insights(db, current_user.id)
