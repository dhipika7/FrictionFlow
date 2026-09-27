from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import engine, Base, SessionLocal
from app.db.init_db import seed_demo_data
from app.db.mongodb import seed_mongo_data, is_mongo_connected
from app.api.routes import (
    auth, student, activity, friction, mentor,
    errors, recommendations, analytics, teacher, platform, demo
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FrictionFlow API — AI That Notices Before You Ask",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS for Frontend and Chrome Extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Vite dev server & Chrome extension calls
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(student.router, prefix=f"{settings.API_V1_STR}/student", tags=["Student Profile"])
app.include_router(activity.router, prefix=f"{settings.API_V1_STR}/activity", tags=["Activity Ingestion"])
app.include_router(friction.router, prefix=f"{settings.API_V1_STR}/friction", tags=["Friction Detection"])
app.include_router(mentor.router, prefix=f"{settings.API_V1_STR}/mentor", tags=["AI Mentor"])
app.include_router(errors.router, prefix=f"{settings.API_V1_STR}/errors", tags=["Error Translator"])
app.include_router(recommendations.router, prefix=f"{settings.API_V1_STR}/recommendations", tags=["Recommendations & Roadmap"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Analytics"])
app.include_router(teacher.router, prefix=f"{settings.API_V1_STR}/teacher", tags=["Teacher Dashboard"])
app.include_router(platform.router, prefix=f"{settings.API_V1_STR}/platform", tags=["Platform Integration"])
app.include_router(demo.router, prefix=f"{settings.API_V1_STR}/demo", tags=["Demo Mode"])

@app.on_event("startup")
def startup_event():
    # Create DB tables if not present
    Base.metadata.create_all(bind=engine)
    # Seed default dataset if in Demo Mode
    if settings.DEMO_MODE:
        db = SessionLocal()
        try:
            seed_demo_data(db)
        finally:
            db.close()

        # Seed MongoDB collections into database 'deba'
        if settings.DATABASE_TYPE == "mongodb" or is_mongo_connected():
            try:
                seed_mongo_data()
            except Exception as err:
                print(f"MongoDB seeding notice: {err}")

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": "AI That Notices Before You Ask",
        "status": "online",
        "database_type": settings.DATABASE_TYPE,
        "mongodb_database": settings.MONGODB_DB_NAME,
        "mongodb_connected": is_mongo_connected(),
        "docs": "/docs",
        "demo_mode": settings.DEMO_MODE
    }
