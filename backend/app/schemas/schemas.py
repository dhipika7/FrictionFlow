from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    firebase_uid: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenPayload(BaseModel):
    sub: Optional[int] = None
    role: Optional[str] = None

# --- Student Profile Schemas ---
class StudentProfileResponse(BaseModel):
    id: int
    user_id: int
    current_streak: int
    highest_streak: int
    total_problems_solved: int
    total_time_spent_minutes: int
    overall_accuracy: float
    preferred_difficulty: str
    focus_topic: str
    learning_goal: str

    model_config = ConfigDict(from_attributes=True)

class StudentProfileUpdate(BaseModel):
    preferred_difficulty: Optional[str] = None
    focus_topic: Optional[str] = None
    learning_goal: Optional[str] = None

# --- Problem Session Schemas ---
class ProblemSessionStartRequest(BaseModel):
    session_id: Optional[str] = None
    platform: str = "LeetCode"
    problem_id: Optional[str] = None
    problem_title: str
    difficulty: str = "Easy"
    topic: str = "General"

class ProblemSessionSubmissionRequest(BaseModel):
    session_id: str
    platform: str = "LeetCode"
    problem_id: Optional[str] = None
    problem_title: str
    status: str # "SUBMISSION_FAILED" or "SUBMISSION_ACCEPTED"
    error_message: Optional[str] = None
    code_snippet: Optional[str] = None
    time_spent_seconds: int = 0

class ProblemSessionCompleteRequest(BaseModel):
    session_id: str
    successful: bool = True
    time_spent_seconds: int = 0
    code_snippet: Optional[str] = None

class ProblemSessionResponse(BaseModel):
    id: int
    session_id: str
    student_id: int
    platform: str
    problem_id: Optional[str] = None
    problem_title: str
    difficulty: str
    topic: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    duration_seconds: int
    attempt_count: int
    failed_attempts: int
    successful: bool
    error_patterns: List[str] = []
    hints_requested: int
    hints_used: List[int] = []
    friction_score: float
    friction_level: str
    status: str

    model_config = ConfigDict(from_attributes=True)

# --- Activity & Friction Schemas ---
class ActivityCreate(BaseModel):
    session_id: Optional[str] = None
    platform: str = "FrictionFlow"
    problem_id: Optional[int] = None
    problem_name: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[str] = None
    activity_type: str  # PROBLEM_STARTED, SUBMISSION_FAILED, SUBMISSION_ACCEPTED, HINT_REQUESTED, SOLUTION_REQUESTED
    time_spent_seconds: int = 0
    attempt_number: int = 1
    error_message: Optional[str] = None

class ActivityResponse(ActivityCreate):
    id: int
    student_id: int
    friction_score: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class FrictionCalculateRequest(BaseModel):
    session_id: Optional[str] = None
    problem_difficulty: str = "Easy" # Easy, Medium, Hard
    time_spent_seconds: int = 0
    attempt_number: int = 1
    failed_attempts: int = 0
    topic: Optional[str] = None
    error_message: Optional[str] = None

class FrictionResponse(BaseModel):
    friction_score: float # 0 to 100
    friction_level: str # Low, Moderate, High, Critical
    should_intervene: bool
    intervention_message: Optional[str] = None
    suggested_hint_level: int = 1
    signals: List[str] = []
    breakdown: Dict[str, float]

# --- AI Mentor Schemas ---
class MentorChatRequest(BaseModel):
    session_id: Optional[str] = None
    problem_id: Optional[str] = None
    problem_title: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[str] = "Easy"
    user_message: str
    code_snippet: Optional[str] = None
    error_message: Optional[str] = None
    current_hint_level: int = 1

class MentorChatResponse(BaseModel):
    reply: str
    hint_level_offered: Optional[int] = None
    suggested_followups: List[str] = []

class ProgressiveHintRequest(BaseModel):
    session_id: Optional[str] = None
    problem_id: Optional[str] = None
    problem_title: str
    topic: str
    difficulty: str = "Easy"
    hint_level: int = Field(default=1, ge=1, le=4) # 1: Conceptual, 2: Directional, 3: Specific, 4: Solution
    student_attempt_code: Optional[str] = None
    error_message: Optional[str] = None

class ProgressiveHintResponse(BaseModel):
    problem_title: str
    hint_level: int
    hint_title: str
    content: str
    can_request_next: bool

# --- Error Translator Schemas ---
class ErrorExplainRequest(BaseModel):
    raw_error: str
    programming_language: str = "python"
    code_context: Optional[str] = None

class ErrorExplainResponse(BaseModel):
    error_type: str
    simple_explanation: str
    root_cause: str
    actionable_checklist: List[str]
    suggested_fix_direction: str

# --- Problem & Recommendation Schemas ---
class ProblemResponse(BaseModel):
    id: int
    title: str
    slug: str
    platform: str
    topic: str
    difficulty: str
    description: str
    starter_code: Optional[str] = None
    expected_solve_time_minutes: int

    model_config = ConfigDict(from_attributes=True)

class RecommendationResponse(BaseModel):
    id: int
    problem: ProblemResponse
    reason: str
    target_difficulty: str
    status: str

    model_config = ConfigDict(from_attributes=True)

# --- Analytics Schemas ---
class TopicMasterySchema(BaseModel):
    topic: str
    mastery_score: float
    total_attempts: int
    successful_attempts: int

class AchievementSchema(BaseModel):
    id: int
    title: str
    description: str
    category: str
    badge_icon: str
    earned: bool
    earned_at: Optional[datetime] = None

class StudentAnalyticsResponse(BaseModel):
    streak_days: int
    weekly_goal_completed: int
    weekly_goal_target: int
    overall_accuracy: float
    total_problems_solved: int
    total_time_spent_hours: float
    average_solve_time_minutes: float
    friction_status: str
    weak_topics: List[str]
    strong_topics: List[str]
    topic_masteries: List[TopicMasterySchema]
    recent_activity_chart: List[Dict[str, Any]]
    achievements: List[AchievementSchema]

class TeacherClassStudentOverview(BaseModel):
    student_id: int
    full_name: str
    email: str
    streak: int
    problems_solved: int
    accuracy: float
    friction_status: str
    weakest_topic: str
    needs_support: bool

class TeacherAnalyticsResponse(BaseModel):
    total_students: int
    avg_accuracy: float
    students_needing_support: int
    strongest_class_topic: str
    weakest_class_topic: str
    top_failed_concepts: List[Dict[str, Any]]
    at_risk_students: List[TeacherClassStudentOverview]
    class_students: List[TeacherClassStudentOverview]

# --- Platform Connection Schemas ---
class PlatformConnectRequest(BaseModel):
    platform_name: str # Codeforces, GitHub, LeetCode
    handle_or_username: str

class PlatformSyncResponse(BaseModel):
    platform_name: str
    status: str
    synced_items_count: int
    message: str
