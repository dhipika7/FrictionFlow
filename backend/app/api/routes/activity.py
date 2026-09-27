from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Activity, StudentProfile, TopicMastery
from app.schemas.schemas import ActivityCreate, ActivityResponse, FrictionCalculateRequest
from app.services.friction_service import FrictionService

from uuid import uuid4
from datetime import datetime
from app.models.models import ProblemSession
from app.schemas.schemas import (
    ProblemSessionStartRequest, ProblemSessionSubmissionRequest,
    ProblemSessionCompleteRequest, ProblemSessionResponse
)
from app.services.mastery_service import MasteryService

router = APIRouter()

@router.post("/start", response_model=ProblemSessionResponse)
def start_problem_session(
    req: ProblemSessionStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sid = req.session_id or f"sess_{uuid4().hex[:12]}"
    
    # Check if existing session active for this student & problem
    session = db.query(ProblemSession).filter(
        ProblemSession.student_id == current_user.id,
        ProblemSession.session_id == sid
    ).first()

    if not session:
        session = ProblemSession(
            session_id=sid,
            student_id=current_user.id,
            platform=req.platform,
            problem_id=req.problem_id or req.problem_title.lower().replace(" ", "-"),
            problem_title=req.problem_title,
            difficulty=req.difficulty,
            topic=req.topic,
            started_at=datetime.utcnow(),
            status="active"
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    return ProblemSessionResponse.model_validate(session)

@router.post("/submission", response_model=ProblemSessionResponse)
def record_problem_submission(
    req: ProblemSessionSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(ProblemSession).filter(
        ProblemSession.student_id == current_user.id,
        ProblemSession.session_id == req.session_id
    ).first()

    if not session:
        # Auto-create if session not found
        session = ProblemSession(
            session_id=req.session_id,
            student_id=current_user.id,
            platform=req.platform,
            problem_id=req.problem_id or req.problem_title.lower().replace(" ", "-"),
            problem_title=req.problem_title,
            difficulty="Easy",
            topic="General",
            started_at=datetime.utcnow(),
            status="active"
        )
        db.add(session)

    session.duration_seconds = max(session.duration_seconds, req.time_spent_seconds)
    session.code_snippet = req.code_snippet or session.code_snippet

    if req.status == "SUBMISSION_ACCEPTED":
        session.successful = True
        session.status = "completed"
        session.ended_at = datetime.utcnow()
    else:
        session.attempt_count += 1
        session.failed_attempts += 1
        if req.error_message:
            errors = list(session.error_patterns or [])
            errors.append(req.error_message)
            session.error_patterns = errors

    # Compute current friction score
    tm = db.query(TopicMastery).filter(
        TopicMastery.student_id == current_user.id,
        TopicMastery.topic == session.topic
    ).first()
    mastery_score = tm.mastery_score if tm else 50.0

    f_req = FrictionCalculateRequest(
        session_id=session.session_id,
        problem_difficulty=session.difficulty,
        time_spent_seconds=session.duration_seconds,
        attempt_number=session.attempt_count,
        failed_attempts=session.failed_attempts,
        topic=session.topic,
        error_message=req.error_message
    )
    friction_res = FrictionService.calculate_friction(f_req, historical_topic_mastery=mastery_score)
    session.friction_score = friction_res.friction_score
    session.friction_level = friction_res.friction_level

    # Log Activity
    activity = Activity(
        student_id=current_user.id,
        platform=session.platform,
        problem_name=session.problem_title,
        topic=session.topic,
        difficulty=session.difficulty,
        activity_type=req.status,
        time_spent_seconds=session.duration_seconds,
        attempt_number=session.attempt_count,
        error_message=req.error_message,
        friction_score=friction_res.friction_score
    )
    db.add(activity)

    # If accepted, trigger Topic Mastery Engine!
    if req.status == "SUBMISSION_ACCEPTED":
        MasteryService.update_mastery_after_session(db, current_user.id, session)

    db.commit()
    db.refresh(session)
    return ProblemSessionResponse.model_validate(session)

@router.post("/complete", response_model=ProblemSessionResponse)
def complete_problem_session(
    req: ProblemSessionCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(ProblemSession).filter(
        ProblemSession.student_id == current_user.id,
        ProblemSession.session_id == req.session_id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Problem session not found")

    session.successful = req.successful
    session.status = "completed"
    session.ended_at = datetime.utcnow()
    session.duration_seconds = max(session.duration_seconds, req.time_spent_seconds)
    if req.code_snippet:
        session.code_snippet = req.code_snippet

    MasteryService.update_mastery_after_session(db, current_user.id, session)
    db.commit()
    db.refresh(session)
    return ProblemSessionResponse.model_validate(session)

@router.post("/", response_model=ActivityResponse)
def record_activity(
    activity_in: ActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mastery_score = 60.0
    if activity_in.topic:
        tm = db.query(TopicMastery).filter(
            TopicMastery.student_id == current_user.id,
            TopicMastery.topic == activity_in.topic
        ).first()
        if tm:
            mastery_score = tm.mastery_score

    req = FrictionCalculateRequest(
        problem_difficulty=activity_in.difficulty or "Easy",
        time_spent_seconds=activity_in.time_spent_seconds,
        attempt_number=activity_in.attempt_number,
        failed_attempts=activity_in.attempt_number if activity_in.activity_type == "SUBMISSION_FAILED" else 0,
        topic=activity_in.topic,
        error_message=activity_in.error_message
    )
    friction_res = FrictionService.calculate_friction(req, historical_topic_mastery=mastery_score)

    activity = Activity(
        student_id=current_user.id,
        platform=activity_in.platform,
        problem_id=activity_in.problem_id,
        problem_name=activity_in.problem_name,
        topic=activity_in.topic,
        difficulty=activity_in.difficulty,
        activity_type=activity_in.activity_type,
        time_spent_seconds=activity_in.time_spent_seconds,
        attempt_number=activity_in.attempt_number,
        error_message=activity_in.error_message,
        friction_score=friction_res.friction_score
    )
    db.add(activity)

    if activity_in.activity_type == "SUBMISSION_ACCEPTED":
        sp = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if sp:
            sp.total_problems_solved += 1
            sp.total_time_spent_minutes += (activity_in.time_spent_seconds // 60)

    db.commit()
    db.refresh(activity)
    return ActivityResponse.model_validate(activity)

@router.get("/recent", response_model=List[ActivityResponse])
def get_recent_activities(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    acts = db.query(Activity).filter(Activity.student_id == current_user.id).order_by(Activity.created_at.desc()).limit(limit).all()
    return [ActivityResponse.model_validate(a) for a in acts]
