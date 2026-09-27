from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.utils.security import get_password_hash
from app.models.models import (
    User, StudentProfile, TeacherProfile, TeacherClass, ClassMembership,
    Problem, ProblemTopic, Activity, Submission, TopicMastery,
    Recommendation, Achievement, StudentAchievement, PlatformConnection
)



def seed_demo_data(db: Session):
    # 1. Clear existing records for clean demo state
    db.query(StudentAchievement).delete()
    db.query(Achievement).delete()
    db.query(Recommendation).delete()
    db.query(TopicMastery).delete()
    db.query(Submission).delete()
    db.query(Activity).delete()
    db.query(ClassMembership).delete()
    db.query(TeacherClass).delete()
    db.query(StudentProfile).delete()
    db.query(TeacherProfile).delete()
    db.query(PlatformConnection).delete()
    db.query(Problem).delete()
    db.query(ProblemTopic).delete()
    db.query(User).delete()
    db.commit()

    # 2. Seed Problem Topics
    topics_data = [
        {"name": "Arrays & Hashing", "category": "Core Foundations", "order": 1, "desc": "Frequency counting, lookup tables, array manipulation", "prereq": None},
        {"name": "Two Pointers", "category": "Core Foundations", "order": 2, "desc": "Symmetric scanning, sorted array searching", "prereq": "Arrays & Hashing"},
        {"name": "Sliding Window", "category": "Advanced Arrays", "order": 3, "desc": "Subsegment analysis, dynamic window expansion/contraction", "prereq": "Two Pointers"},
        {"name": "Trees & Graphs", "category": "Data Structures", "order": 4, "desc": "DFS, BFS traversal, binary search trees, graph cycles", "prereq": "Arrays & Hashing"},
        {"name": "Dynamic Programming", "category": "Advanced Optimization", "order": 5, "desc": "Memoization, bottom-up tabulating, subproblem recurrence", "prereq": "Trees & Graphs"}
    ]
    
    for t in topics_data:
        topic_obj = ProblemTopic(
            name=t["name"],
            category=t["category"],
            roadmap_order=t["order"],
            description=t["desc"],
            prerequisite=t["prereq"]
        )
        db.add(topic_obj)
    db.commit()

    # 3. Seed Problems
    problems_data = [
        {
            "title": "Two Sum",
            "slug": "two-sum",
            "platform": "FrictionFlow",
            "topic": "Arrays & Hashing",
            "difficulty": "Easy",
            "expected_solve_time_minutes": 15,
            "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
            "starter_code": "def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    pass"
        },
        {
            "title": "Valid Anagram",
            "slug": "valid-anagram",
            "platform": "LeetCode",
            "topic": "Arrays & Hashing",
            "difficulty": "Easy",
            "expected_solve_time_minutes": 10,
            "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
            "starter_code": "def isAnagram(s: str, t: str) -> bool:\n    pass"
        },
        {
            "title": "Container With Most Water",
            "slug": "container-with-most-water",
            "platform": "LeetCode",
            "topic": "Two Pointers",
            "difficulty": "Medium",
            "expected_solve_time_minutes": 25,
            "description": "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
            "starter_code": "def maxArea(height: list[int]) -> int:\n    pass"
        },
        {
            "title": "Climbing Stairs",
            "slug": "climbing-stairs",
            "platform": "FrictionFlow",
            "topic": "Dynamic Programming",
            "difficulty": "Easy",
            "expected_solve_time_minutes": 20,
            "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
            "starter_code": "def climbStairs(n: int) -> int:\n    pass"
        },
        {
            "title": "House Robber",
            "slug": "house-robber",
            "platform": "LeetCode",
            "topic": "Dynamic Programming",
            "difficulty": "Medium",
            "expected_solve_time_minutes": 30,
            "description": "Determine the maximum amount of money you can rob tonight without alerting the police by robbing adjacent houses.",
            "starter_code": "def rob(nums: list[int]) -> int:\n    pass"
        },
        {
            "title": "Coin Change",
            "slug": "coin-change",
            "platform": "Codeforces",
            "topic": "Dynamic Programming",
            "difficulty": "Medium",
            "expected_solve_time_minutes": 35,
            "description": "Return the fewest number of coins that you need to make up the given amount using coins of given denominations.",
            "starter_code": "def coinChange(coins: list[int], amount: int) -> int:\n    pass"
        }
    ]

    problem_objs = {}
    for p in problems_data:
        prob = Problem(
            title=p["title"],
            slug=p["slug"],
            platform=p["platform"],
            topic=p["topic"],
            difficulty=p["difficulty"],
            description=p["description"],
            starter_code=p["starter_code"],
            expected_solve_time_minutes=p["expected_solve_time_minutes"]
        )
        db.add(prob)
        db.flush()
        problem_objs[p["slug"]] = prob
    db.commit()

    # 4. Seed Achievements
    achievements_data = [
        {"title": "First Step", "description": "Solved your very first programming challenge", "category": "Milestone", "icon": "CheckCircle2", "key": "problems_solved", "target": 1},
        {"title": "7-Day Streak 🔥", "description": "Maintained continuous daily practice for 7 days", "category": "Consistency", "icon": "Flame", "key": "streak_days", "target": 7},
        {"title": "Arrays & Hashing Master", "description": "Achieved 85%+ mastery in Arrays & Hashing topic", "category": "Mastery", "icon": "Award", "key": "array_mastery", "target": 85},
        {"title": "DP Explorer", "description": "Completed 5 Dynamic Programming practice problems", "category": "Exploration", "icon": "Zap", "key": "dp_problems", "target": 5}
    ]

    ach_objs = []
    for a in achievements_data:
        ach = Achievement(
            title=a["title"],
            description=a["description"],
            category=a["category"],
            badge_icon=a["icon"],
            criteria_key=a["key"],
            target_value=a["target"]
        )
        db.add(ach)
        ach_objs.append(ach)
    db.commit()

    # 5. Seed Primary Student User: Alex Chen
    hashed_pwd = get_password_hash("student123")
    student = User(
        email="alex.student@frictionflow.edu",
        full_name="Alex Chen",
        hashed_password=hashed_pwd,
        role="student"
    )
    db.add(student)
    db.flush()

    student_profile = StudentProfile(
        user_id=student.id,
        current_streak=7,
        highest_streak=12,
        total_problems_solved=42,
        total_time_spent_minutes=850,
        overall_accuracy=74.5,
        preferred_difficulty="Medium",
        focus_topic="Dynamic Programming",
        learning_goal="Master Dynamic Programming & Graph Algorithms"
    )
    db.add(student_profile)

    # 6. Seed Secondary Students for Teacher Dashboard
    students_list = [
        student,
        User(email="maria.garcia@frictionflow.edu", full_name="Maria Garcia", hashed_password=hashed_pwd, role="student"),
        User(email="david.kim@frictionflow.edu", full_name="David Kim", hashed_password=hashed_pwd, role="student"),
        User(email="liam.smith@frictionflow.edu", full_name="Liam Smith", hashed_password=hashed_pwd, role="student"),
        User(email="priya.patel@frictionflow.edu", full_name="Priya Patel", hashed_password=hashed_pwd, role="student")
    ]

    for idx, s in enumerate(students_list[1:], start=2):
        db.add(s)
        db.flush()
        accuracy = 48.0 if idx in [2, 4] else 82.0  # Make 2 students at-risk needing support
        sp = StudentProfile(
            user_id=s.id,
            current_streak=idx * 2,
            highest_streak=idx * 3,
            total_problems_solved=idx * 10,
            total_time_spent_minutes=idx * 150,
            overall_accuracy=accuracy,
            focus_topic="Dynamic Programming" if accuracy < 60 else "Arrays & Hashing"
        )
        db.add(sp)

        # Topic masteries for students
        tm1 = TopicMastery(student_id=s.id, topic="Arrays & Hashing", mastery_score=85.0 if accuracy > 60 else 50.0, total_attempts=20, successful_attempts=17)
        tm2 = TopicMastery(student_id=s.id, topic="Dynamic Programming", mastery_score=35.0 if accuracy < 60 else 65.0, total_attempts=15, successful_attempts=5)
        db.add(tm1)
        db.add(tm2)

    # 7. Seed Topic Masteries for Alex Chen
    masteries_alex = [
        TopicMastery(student_id=student.id, topic="Arrays & Hashing", mastery_score=88.0, total_attempts=25, successful_attempts=22),
        TopicMastery(student_id=student.id, topic="Two Pointers", mastery_score=82.0, total_attempts=18, successful_attempts=15),
        TopicMastery(student_id=student.id, topic="Sliding Window", mastery_score=75.0, total_attempts=14, successful_attempts=11),
        TopicMastery(student_id=student.id, topic="Trees & Graphs", mastery_score=58.0, total_attempts=20, successful_attempts=12),
        TopicMastery(student_id=student.id, topic="Dynamic Programming", mastery_score=38.0, total_attempts=30, successful_attempts=11)
    ]
    for tm in masteries_alex:
        db.add(tm)

    # 8. Seed Activity Log for Alex Chen (showing high friction on House Robber)
    now = datetime.utcnow()
    act1 = Activity(
        student_id=student.id,
        platform="LeetCode",
        problem_id=problem_objs["house-robber"].id,
        problem_name="House Robber",
        topic="Dynamic Programming",
        difficulty="Medium",
        activity_type="SUBMISSION_FAILED",
        time_spent_seconds=2200,
        attempt_number=3,
        error_message="Time Limit Exceeded (TLE) — Recursive calls without memoization",
        friction_score=78.5,
        created_at=now - timedelta(minutes=15)
    )
    act2 = Activity(
        student_id=student.id,
        platform="FrictionFlow",
        problem_id=problem_objs["two-sum"].id,
        problem_name="Two Sum",
        topic="Arrays & Hashing",
        difficulty="Easy",
        activity_type="SUBMISSION_ACCEPTED",
        time_spent_seconds=420,
        attempt_number=1,
        friction_score=15.0,
        created_at=now - timedelta(hours=3)
    )
    db.add(act1)
    db.add(act2)

    # 9. Seed Student Achievements
    sa1 = StudentAchievement(student_id=student.id, achievement_id=ach_objs[0].id)
    sa2 = StudentAchievement(student_id=student.id, achievement_id=ach_objs[1].id)
    db.add(sa1)
    db.add(sa2)

    # 10. Seed Platform Connections
    pc1 = PlatformConnection(student_id=student.id, platform_name="Codeforces", handle_or_username="alex_coder", status="connected")
    pc2 = PlatformConnection(student_id=student.id, platform_name="GitHub", handle_or_username="alex-chen-dev", status="connected")
    pc3 = PlatformConnection(student_id=student.id, platform_name="LeetCode", handle_or_username="alex_leetcode", status="connected")
    db.add(pc1)
    db.add(pc2)
    db.add(pc3)

    # 11. Seed Teacher Profile & Class
    teacher_user = User(
        email="sarah.teacher@frictionflow.edu",
        full_name="Prof. Sarah Jenkins",
        hashed_password=get_password_hash("teacher123"),
        role="teacher"
    )
    db.add(teacher_user)
    db.flush()

    teacher_prof = TeacherProfile(
        user_id=teacher_user.id,
        institution="Stanford University CS Department",
        department="Computer Science"
    )
    db.add(teacher_prof)
    db.flush()

    t_class = TeacherClass(
        teacher_id=teacher_prof.id,
        class_name="CS201 — Data Structures & Algorithms",
        description="Spring 2026 Core Algorithm Principles & Practice",
        access_code="CS201-2026"
    )
    db.add(t_class)
    db.flush()

    # Link all students to class
    for st in students_list:
        mem = ClassMembership(class_id=t_class.id, student_id=st.id)
        db.add(mem)

    db.commit()
    print("FrictionFlow DB Seeded Successfully!")
