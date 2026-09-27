from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=True)
    role = Column(String, default="student")  # student, teacher, admin
    firebase_uid = Column(String, unique=True, index=True, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    teacher_profile = relationship("TeacherProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="student")
    submissions = relationship("Submission", back_populates="student")
    topic_masteries = relationship("TopicMastery", back_populates="student")
    recommendations = relationship("Recommendation", back_populates="student")
    student_achievements = relationship("StudentAchievement", back_populates="student")
    platform_connections = relationship("PlatformConnection", back_populates="student")
    problem_sessions = relationship("ProblemSession", back_populates="student")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    current_streak = Column(Integer, default=0)
    highest_streak = Column(Integer, default=0)
    total_problems_solved = Column(Integer, default=0)
    total_time_spent_minutes = Column(Integer, default=0)
    overall_accuracy = Column(Float, default=0.0)
    preferred_difficulty = Column(String, default="Easy")  # Easy, Medium, Hard
    focus_topic = Column(String, default="Dynamic Programming")
    learning_goal = Column(String, default="Master Data Structures & Algorithms")

    user = relationship("User", back_populates="student_profile")

class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    institution = Column(String, default="Computer Science Dept")
    department = Column(String, default="Software Engineering")

    user = relationship("User", back_populates="teacher_profile")
    classes = relationship("TeacherClass", back_populates="teacher")

class TeacherClass(Base):
    __tablename__ = "teacher_classes"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teacher_profiles.id"), nullable=False)
    class_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    access_code = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("TeacherProfile", back_populates="classes")
    memberships = relationship("ClassMembership", back_populates="teacher_class")

class ClassMembership(Base):
    __tablename__ = "class_memberships"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("teacher_classes.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    teacher_class = relationship("TeacherClass", back_populates="memberships")

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    platform = Column(String, default="FrictionFlow")  # LeetCode, Codeforces, GitHub, FrictionFlow
    external_id = Column(String, nullable=True)
    topic = Column(String, index=True, nullable=False)
    difficulty = Column(String, default="Easy")  # Easy, Medium, Hard
    description = Column(Text, nullable=False)
    starter_code = Column(Text, nullable=True)
    hints = Column(JSON, nullable=True)
    expected_solve_time_minutes = Column(Integer, default=20)
    created_at = Column(DateTime, default=datetime.utcnow)

class ProblemTopic(Base):
    __tablename__ = "problem_topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, default="Core Algorithms")
    roadmap_order = Column(Integer, default=1)
    prerequisite = Column(String, nullable=True)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform = Column(String, default="FrictionFlow")
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=True)
    problem_name = Column(String, nullable=True)
    topic = Column(String, nullable=True)
    difficulty = Column(String, nullable=True)
    activity_type = Column(String, nullable=False) # PROBLEM_STARTED, SUBMISSION_FAILED, SUBMISSION_ACCEPTED, HINT_REQUESTED, SOLUTION_REQUESTED
    time_spent_seconds = Column(Integer, default=0)
    attempt_number = Column(Integer, default=1)
    error_message = Column(Text, nullable=True)
    friction_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="activities")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    status = Column(String, nullable=False) # Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error, Compilation Error
    code_snippet = Column(Text, nullable=True)
    language = Column(String, default="python")
    execution_time_ms = Column(Integer, default=0)
    memory_kb = Column(Integer, default=0)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="submissions")

class TopicMastery(Base):
    __tablename__ = "topic_masteries"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String, nullable=False)
    mastery_score = Column(Float, default=50.0) # 0 to 100
    total_attempts = Column(Integer, default=0)
    successful_attempts = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="topic_masteries")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    reason = Column(String, nullable=False)
    target_difficulty = Column(String, default="Easy")
    status = Column(String, default="active") # active, completed, dismissed
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="recommendations")

class HintSession(Base):
    __tablename__ = "hint_sessions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=True)
    hint_level = Column(Integer, default=1) # 1=Conceptual, 2=Directional, 3=Specific, 4=Solution
    prompt_used = Column(Text, nullable=False)
    hint_response = Column(Text, nullable=False)
    helpfulness_rating = Column(Integer, nullable=True) # 1-5
    created_at = Column(DateTime, default=datetime.utcnow)

class LearningSession(Base):
    __tablename__ = "learning_sessions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform = Column(String, default="FrictionFlow")
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    problems_attempted = Column(Integer, default=0)
    average_friction_score = Column(Float, default=0.0)

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, default="Consistency")
    badge_icon = Column(String, default="Flame")
    criteria_key = Column(String, nullable=False)
    target_value = Column(Integer, default=1)

class StudentAchievement(Base):
    __tablename__ = "student_achievements"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="student_achievements")

class PlatformConnection(Base):
    __tablename__ = "platform_connections"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform_name = Column(String, nullable=False) # Codeforces, GitHub, LeetCode
    handle_or_username = Column(String, nullable=False)
    status = Column(String, default="connected") # connected, sync_failed, disconnected
    last_synced_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="platform_connections")

class ProblemSession(Base):
    __tablename__ = "problem_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True, nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform = Column(String, default="LeetCode")
    problem_id = Column(String, nullable=True) # e.g. "123A", "two-sum"
    problem_title = Column(String, nullable=False)
    difficulty = Column(String, default="Easy")
    topic = Column(String, default="General")
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, default=0)
    attempt_count = Column(Integer, default=1)
    failed_attempts = Column(Integer, default=0)
    successful = Column(Boolean, default=False)
    error_patterns = Column(JSON, default=list)
    hints_requested = Column(Integer, default=0)
    hints_used = Column(JSON, default=list)
    code_snippet = Column(Text, nullable=True)
    friction_score = Column(Float, default=0.0)
    friction_level = Column(String, default="Low")
    status = Column(String, default="active") # active, completed, abandoned

    student = relationship("User", back_populates="problem_sessions")

