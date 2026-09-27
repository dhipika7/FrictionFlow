from typing import Dict, Any, Optional
from app.schemas.schemas import FrictionCalculateRequest, FrictionResponse

class FrictionService:
    EXPECTED_TIME_BY_DIFFICULTY = {
        "Easy": 15 * 60,      # 15 minutes in seconds
        "Medium": 30 * 60,    # 30 minutes in seconds
        "Hard": 50 * 60       # 50 minutes in seconds
    }

    @classmethod
    def calculate_friction(
        cls,
        req: FrictionCalculateRequest,
        historical_topic_mastery: Optional[float] = 60.0
    ) -> FrictionResponse:
        """
        Calculates a 0-100 Friction Score based on multi-signal indicators:
        - Time spent relative to difficulty baseline
        - Failed attempts & total attempts count
        - Topic historical weakness
        - Immediate error recurrence
        """
        # Baseline expected time
        expected_seconds = cls.EXPECTED_TIME_BY_DIFFICULTY.get(req.problem_difficulty, 20 * 60)
        
        # 1. Time Signal (0 - 35 points)
        time_ratio = req.time_spent_seconds / expected_seconds
        if time_ratio <= 0.5:
            time_score = 0.0
        elif time_ratio <= 1.0:
            time_score = (time_ratio - 0.5) * 20.0
        elif time_ratio <= 2.0:
            time_score = 10.0 + (time_ratio - 1.0) * 15.0
        else:
            time_score = 35.0

        # 2. Attempts & Failures Signal (0 - 35 points)
        attempts = max(req.attempt_number, req.failed_attempts)
        if attempts <= 1:
            attempt_score = 0.0
        elif attempts == 2:
            attempt_score = 10.0
        elif attempts == 3:
            attempt_score = 20.0
        elif attempts == 4:
            attempt_score = 28.0
        else:
            attempt_score = 35.0

        # 3. Topic Historical Weakness Signal (0 - 15 points)
        # If mastery is low (e.g. 20%), weakness score is high
        topic_mastery = historical_topic_mastery if historical_topic_mastery is not None else 60.0
        weakness_score = max(0.0, (100.0 - topic_mastery) * 0.15)

        # 4. Error Message Signal (0 - 15 points)
        error_score = 0.0
        if req.error_message:
            msg = req.error_message.lower()
            if "segmentation fault" in msg or "nullpointer" in msg:
                error_score = 15.0
            elif "time limit exceeded" in msg or "tle" in msg:
                error_score = 12.0
            elif "syntaxerror" in msg or "compilation error" in msg:
                error_score = 8.0
            else:
                error_score = 10.0

        # Construct human-readable friction signals list
        signals = []
        if req.time_spent_seconds >= 60:
            signals.append(f"{req.time_spent_seconds // 60} minutes spent on active problem")
        if attempts > 1:
            signals.append(f"{attempts} submission attempts recorded")
        if topic_mastery < 60.0:
            signals.append(f"Topic historical mastery below 60% ({round(topic_mastery, 1)}%)")
        if req.error_message:
            signals.append(f"Encountered error: {req.error_message[:40]}...")

        # Aggregate total friction score (0 to 100)
        total_friction = round(min(100.0, time_score + attempt_score + weakness_score + error_score), 1)

        # Determine level & intervention
        if total_friction <= 30.0:
            level = "Low"
            should_intervene = False
            message = None
            suggested_hint = 1
        elif total_friction <= 60.0:
            level = "Moderate"
            should_intervene = False
            message = "You're making steady progress. Let us know if you need a conceptual nudge!"
            suggested_hint = 1
        elif total_friction <= 80.0:
            level = "High"
            should_intervene = True
            message = "This problem seems to be taking longer than usual. Want a small hint?"
            suggested_hint = 2
        else:
            level = "Critical"
            should_intervene = True
            message = "You've encountered several unsuccessful attempts on this challenge! Would you like a progressive hint?"
            suggested_hint = 3

        return FrictionResponse(
            friction_score=total_friction,
            friction_level=level,
            should_intervene=should_intervene,
            intervention_message=message,
            suggested_hint_level=suggested_hint,
            signals=signals,
            breakdown={
                "time_signal": round(time_score, 1),
                "attempt_signal": round(attempt_score, 1),
                "weakness_signal": round(weakness_score, 1),
                "error_signal": round(error_score, 1)
            }
        )
