from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, HintSession
from app.schemas.schemas import MentorChatRequest, MentorChatResponse, ProgressiveHintRequest, ProgressiveHintResponse
from app.ai.llm_provider import get_ai_provider

from app.models.models import User, HintSession, ProblemSession, StudentProfile, TopicMastery

router = APIRouter()

@router.post("/chat", response_model=MentorChatResponse)
async def mentor_chat(
    req: MentorChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch active problem session if available
    session_context = None
    error_msg = req.error_message
    if req.session_id:
        p_sess = db.query(ProblemSession).filter(
            ProblemSession.student_id == current_user.id,
            ProblemSession.session_id == req.session_id
        ).first()
        if p_sess:
            session_context = {
                "duration_seconds": p_sess.duration_seconds,
                "attempt_count": p_sess.attempt_count,
                "failed_attempts": p_sess.failed_attempts,
                "friction_level": p_sess.friction_level
            }
            if not error_msg and p_sess.error_patterns:
                error_msg = p_sess.error_patterns[-1]

    # Fetch weak topics from student masteries
    weak_topics = [
        tm.topic for tm in db.query(TopicMastery).filter(
            TopicMastery.student_id == current_user.id,
            TopicMastery.mastery_score < 60.0
        ).all()
    ]
    student_profile = {
        "weak_topics": weak_topics
    }

    ai = get_ai_provider()
    reply = await ai.answer_question(
        user_message=req.user_message,
        problem_title=req.problem_title,
        topic=req.topic,
        difficulty=req.difficulty,
        code_snippet=req.code_snippet,
        error_message=error_msg,
        hint_level=req.current_hint_level,
        session_context=session_context,
        student_profile=student_profile
    )
    
    suggested = [
        "Can you explain the time complexity?",
        "What edge cases should I consider?",
        f"Can I get a Level {min(4, req.current_hint_level + 1)} hint?"
    ]
    
    return MentorChatResponse(
        reply=reply,
        hint_level_offered=req.current_hint_level,
        suggested_followups=suggested
    )

@router.post("/hint", response_model=ProgressiveHintResponse)
async def get_progressive_hint(
    req: ProgressiveHintRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch active session context if session_id provided
    session_context = None
    error_msg = req.error_message
    if req.session_id:
        p_sess = db.query(ProblemSession).filter(
            ProblemSession.student_id == current_user.id,
            ProblemSession.session_id == req.session_id
        ).first()
        if p_sess:
            p_sess.hints_requested += 1
            hints_used = list(p_sess.hints_used or [])
            if req.hint_level not in hints_used:
                hints_used.append(req.hint_level)
            p_sess.hints_used = hints_used
            
            session_context = {
                "duration_seconds": p_sess.duration_seconds,
                "attempt_count": p_sess.attempt_count,
                "failed_attempts": p_sess.failed_attempts,
                "friction_level": p_sess.friction_level
            }
            if not error_msg and p_sess.error_patterns:
                error_msg = p_sess.error_patterns[-1]

    # Fetch weak topics
    weak_topics = [
        tm.topic for tm in db.query(TopicMastery).filter(
            TopicMastery.student_id == current_user.id,
            TopicMastery.mastery_score < 60.0
        ).all()
    ]
    student_profile = {
        "weak_topics": weak_topics
    }

    ai = get_ai_provider()
    hint_data = await ai.generate_hint(
        problem_title=req.problem_title,
        topic=req.topic,
        difficulty=req.difficulty,
        hint_level=req.hint_level,
        student_code=req.student_attempt_code,
        error_message=error_msg,
        session_context=session_context,
        student_profile=student_profile
    )

    # Save hint session
    session = HintSession(
        student_id=current_user.id,
        hint_level=req.hint_level,
        prompt_used=f"Hint level {req.hint_level} for {req.problem_title}",
        hint_response=hint_data.get("content", "")
    )
    db.add(session)
    db.commit()

    return ProgressiveHintResponse(
        problem_title=req.problem_title,
        hint_level=req.hint_level,
        hint_title=hint_data.get("title", f"Level {req.hint_level} Hint"),
        content=hint_data.get("content", ""),
        can_request_next=hint_data.get("can_request_next", True)
    )
