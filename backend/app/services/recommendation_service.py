from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.models.models import Problem, TopicMastery, Recommendation, ProblemTopic, Activity

class RecommendationService:
    @classmethod
    def get_recommendations_for_student(cls, db: Session, student_id: int) -> List[Dict[str, Any]]:
        # Find topics where mastery < 70
        weak_masteries = (
            db.query(TopicMastery)
            .filter(TopicMastery.student_id == student_id)
            .order_by(TopicMastery.mastery_score.asc())
            .all()
        )

        target_topics = [tm.topic for tm in weak_masteries if tm.mastery_score < 75.0]
        if not target_topics:
            target_topics = ["Dynamic Programming", "Trees & Graphs", "Two Pointers"]

        # Fetch solved problem IDs for student
        solved_ids = [
            act.problem_id for act in db.query(Activity.problem_id)
            .filter(Activity.student_id == student_id, Activity.activity_type == "SUBMISSION_ACCEPTED")
            .all() if act.problem_id
        ]

        # Recommend un-solved problems matching weak topics
        recommended_problems = (
            db.query(Problem)
            .filter(Problem.topic.in_(target_topics))
            .filter(~Problem.id.in_(solved_ids) if solved_ids else True)
            .limit(5)
            .all()
        )

        results = []
        for idx, prob in enumerate(recommended_problems):
            reason = f"Targeted practice for weak topic: {prob.topic}"
            if idx == 0:
                reason = f"Highest Priority — Strengthen low mastery topic ({prob.topic})"
            results.append({
                "id": idx + 1,
                "problem": {
                    "id": prob.id,
                    "title": prob.title,
                    "slug": prob.slug,
                    "platform": prob.platform,
                    "topic": prob.topic,
                    "difficulty": prob.difficulty,
                    "description": prob.description,
                    "starter_code": prob.starter_code,
                    "expected_solve_time_minutes": prob.expected_solve_time_minutes
                },
                "reason": reason,
                "target_difficulty": prob.difficulty,
                "status": "active"
            })
        return results

    @classmethod
    def get_learning_roadmap(cls, db: Session, student_id: int) -> List[Dict[str, Any]]:
        topics = db.query(ProblemTopic).order_by(ProblemTopic.roadmap_order.asc()).all()
        masteries = {
            tm.topic: tm.mastery_score
            for tm in db.query(TopicMastery).filter(TopicMastery.student_id == student_id).all()
        }

        roadmap_nodes = []
        unlocked = True
        for topic in topics:
            score = masteries.get(topic.name, 40.0 if unlocked else 0.0)
            status = "completed" if score >= 80.0 else ("in_progress" if unlocked else "locked")
            
            roadmap_nodes.append({
                "id": topic.id,
                "topic": topic.name,
                "category": topic.category,
                "description": topic.description,
                "mastery_percent": round(score, 1),
                "status": status,
                "prerequisite": topic.prerequisite,
                "recommended_problem": f"{topic.name} Fundamentals Challenge"
            })

            # Next node is locked if current mastery is less than 50%
            if score < 50.0:
                unlocked = False

        return roadmap_nodes
