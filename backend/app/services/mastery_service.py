from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict, Any, List
from app.models.models import StudentProfile, TopicMastery, ProblemSession, Activity

class MasteryService:
    DIFFICULTY_WEIGHTS = {
        "Easy": 6.0,
        "Medium": 12.0,
        "Hard": 18.0
    }

    @classmethod
    def update_mastery_after_session(
        cls,
        db: Session,
        student_id: int,
        session: ProblemSession
    ) -> Dict[str, Any]:
        """
        Updates Topic Mastery & Student Profile after a coding session is completed.
        Formula takes into account:
        - Problem difficulty
        - Success / failure
        - Failed attempt penalty
        - Time ratio bonus/penalty
        - Hints requested penalty
        """
        topic_name = session.topic or "General"
        
        # Retrieve or create TopicMastery record
        mastery = db.query(TopicMastery).filter(
            TopicMastery.student_id == student_id,
            TopicMastery.topic == topic_name
        ).first()

        if not mastery:
            mastery = TopicMastery(
                student_id=student_id,
                topic=topic_name,
                mastery_score=50.0,
                total_attempts=0,
                successful_attempts=0
            )
            db.add(mastery)

        mastery.total_attempts += session.attempt_count
        
        old_score = mastery.mastery_score
        diff_weight = cls.DIFFICULTY_WEIGHTS.get(session.difficulty, 8.0)

        if session.successful:
            mastery.successful_attempts += 1
            # Base increase
            delta = diff_weight
            
            # Penalize for extra failed attempts (max -4)
            penalty = min(4.0, session.failed_attempts * 1.2)
            delta -= penalty
            
            # Penalize for hints requested (max -3)
            hint_penalty = min(3.0, session.hints_requested * 1.0)
            delta -= hint_penalty
            
            # Clamp positive growth
            delta = max(1.5, delta)
            new_score = min(100.0, old_score + delta)
        else:
            # Drop score slightly on abandoned/failed session
            drop = min(6.0, 2.0 + (session.failed_attempts * 0.8))
            new_score = max(0.0, old_score - drop)

        mastery.mastery_score = round(new_score, 1)
        mastery.updated_at = datetime.utcnow()

        # Update StudentProfile metrics
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == student_id).first()
        if profile:
            if session.successful:
                profile.total_problems_solved += 1
            profile.total_time_spent_minutes += (session.duration_seconds // 60)
            
            # Compute overall accuracy across all masteries
            all_m = db.query(TopicMastery).filter(TopicMastery.student_id == student_id).all()
            tot_att = sum(m.total_attempts for m in all_m)
            tot_succ = sum(m.successful_attempts for m in all_m)
            if tot_att > 0:
                profile.overall_accuracy = round((tot_succ / tot_att) * 100.0, 1)

        db.commit()
        db.refresh(mastery)

        return {
            "topic": topic_name,
            "old_score": old_score,
            "new_score": mastery.mastery_score,
            "delta": round(mastery.mastery_score - old_score, 1)
        }

    @classmethod
    def generate_learning_insights(cls, db: Session, student_id: int) -> List[str]:
        """
        Generates contextual learning insights based on stored student activity & mastery records.
        """
        masteries = db.query(TopicMastery).filter(TopicMastery.student_id == student_id).all()
        if not masteries:
            return [
                "Start solving challenges to unlock personalized AI skill insights!",
                "Focus on building intuition with Easy Array and String problems."
            ]

        insights = []
        # Sort masteries
        sorted_m = sorted(masteries, key=lambda x: x.mastery_score, reverse=True)
        strongest = sorted_m[0]
        weakest = sorted_m[-1]

        if strongest.mastery_score >= 75.0:
            insights.append(f"Your strongest topic is {strongest.topic} with {strongest.mastery_score}% mastery.")

        if weakest.mastery_score < 60.0:
            insights.append(f"You're currently experiencing friction in {weakest.topic} ({weakest.mastery_score}% mastery). Consider reviewing fundamentals before tackling Medium problems.")

        # Check recent friction/error activities
        high_friction_count = db.query(Activity).filter(
            Activity.student_id == student_id,
            Activity.friction_score >= 70.0
        ).count()

        if high_friction_count >= 3:
            insights.append("You tend to hit high friction on boundary condition errors. Check loop constraints before running.")

        if not insights:
            insights.append("Your learning progress is balanced across active topics. Keep going!")

        return insights
