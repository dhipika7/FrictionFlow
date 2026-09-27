import logging
from typing import Optional
from pymongo import MongoClient
from pymongo.database import Database
from app.config import settings

logger = logging.getLogger("frictionflow.mongodb")

_mongo_client: Optional[MongoClient] = None

def get_mongo_client() -> Optional[MongoClient]:
    """
    Returns or initializes PyMongo MongoClient for MongoDB operations.
    Falls back gracefully if MongoDB server is unreachable.
    """
    global _mongo_client
    if _mongo_client is not None:
        return _mongo_client

    mongo_url = settings.MONGODB_URL or "mongodb://localhost:27017"
    try:
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=2000)
        # Test connection with a fast ping
        client.admin.command('ping')
        _mongo_client = client
        logger.info(f"Successfully connected to MongoDB at {mongo_url}")
        return _mongo_client
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB ({mongo_url}): {e}. Using SQLite fallback.")
        return None

def get_mongo_db() -> Optional[Database]:
    """
    Returns PyMongo Database instance if connected.
    """
    client = get_mongo_client()
    if client:
        return client[settings.MONGODB_DB_NAME]
    return None

def is_mongo_connected() -> bool:
    """
    Checks if MongoDB server is active and reachable.
    """
    client = get_mongo_client()
    if not client:
        return False
    try:
        client.admin.command('ping')
        return True
    except Exception:
        return False

# Mongo Helper Collections
def get_mongo_collection(collection_name: str):
    db = get_mongo_db()
    if db is not None:
        return db[collection_name]
    return None

def seed_mongo_data():
    """
    Seeds initial collections into the MongoDB database (e.g., 'deba').
    """
    db = get_mongo_db()
    if db is None:
        return

    logger.info(f"Seeding demo data into MongoDB database '{settings.MONGODB_DB_NAME}'...")
    
    # 1. Users Collection
    db.users.delete_many({})
    db.users.insert_many([
        {
            "_id": 1,
            "email": "student@frictionflow.ai",
            "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW", # password123
            "full_name": "Demo Student",
            "role": "student",
            "is_active": True
        },
        {
            "_id": 2,
            "email": "teacher@frictionflow.ai",
            "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW", # password123
            "full_name": "Demo Instructor",
            "role": "teacher",
            "is_active": True
        }
    ])

    # 2. Problem Topics Collection
    db.problem_topics.delete_many({})
    db.problem_topics.insert_many([
        {"name": "Arrays & Hashing", "category": "Core Foundations", "roadmap_order": 1, "description": "Frequency counting, lookup tables"},
        {"name": "Two Pointers", "category": "Core Foundations", "roadmap_order": 2, "description": "Symmetric scanning, sorted array searching"},
        {"name": "Sliding Window", "category": "Advanced Arrays", "roadmap_order": 3, "description": "Subsegment analysis"},
        {"name": "Trees & Graphs", "category": "Data Structures", "roadmap_order": 4, "description": "DFS, BFS traversal"},
        {"name": "Dynamic Programming", "category": "Advanced Optimization", "roadmap_order": 5, "description": "Memoization, tabulating"}
    ])

    # 3. Problems Collection
    db.problems.delete_many({})
    db.problems.insert_many([
        {
            "title": "Two Sum",
            "slug": "two-sum",
            "platform": "FrictionFlow",
            "topic": "Arrays & Hashing",
            "difficulty": "Easy",
            "expected_solve_time_minutes": 15
        },
        {
            "title": "Container With Most Water",
            "slug": "container-with-most-water",
            "platform": "LeetCode",
            "topic": "Two Pointers",
            "difficulty": "Medium",
            "expected_solve_time_minutes": 25
        },
        {
            "title": "House Robber",
            "slug": "house-robber",
            "platform": "LeetCode",
            "topic": "Dynamic Programming",
            "difficulty": "Medium",
            "expected_solve_time_minutes": 30
        }
    ])

    # 4. Student Profiles & Topic Masteries
    db.student_profiles.delete_many({})
    db.student_profiles.insert_one({
        "user_id": 1,
        "total_problems_solved": 14,
        "total_time_spent_minutes": 380,
        "current_streak_days": 5,
        "overall_accuracy": 78.5,
        "weak_topics": ["Dynamic Programming", "Trees & Graphs"]
    })

    db.topic_masteries.delete_many({})
    db.topic_masteries.insert_many([
        {"student_id": 1, "topic": "Arrays & Hashing", "mastery_score": 85.0, "total_attempts": 12, "successful_attempts": 10},
        {"student_id": 1, "topic": "Two Pointers", "mastery_score": 72.0, "total_attempts": 8, "successful_attempts": 6},
        {"student_id": 1, "topic": "Dynamic Programming", "mastery_score": 42.0, "total_attempts": 10, "successful_attempts": 4}
    ])

    logger.info(f"MongoDB database '{settings.MONGODB_DB_NAME}' successfully seeded!")

