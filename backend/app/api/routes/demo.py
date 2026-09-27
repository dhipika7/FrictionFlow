from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.init_db import seed_demo_data

router = APIRouter()

@router.post("/reset-data")
def reset_demo_data(db: Session = Depends(get_db)):
    """Re-seeds database with rich, realistic synthetic student & teacher demonstration data."""
    seed_demo_data(db)
    return {
        "status": "success",
        "message": "Demo database successfully initialized with realistic synthetic learning datasets."
    }

@router.get("/status")
def get_demo_status():
    return {
        "demo_mode": True,
        "sample_student": "Alex Chen (alex.student@frictionflow.edu)",
        "sample_teacher": "Prof. Sarah Jenkins (sarah.teacher@frictionflow.edu)",
        "weak_topic": "Dynamic Programming",
        "current_friction_level": "High"
    }
