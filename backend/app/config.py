from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "FrictionFlow"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./frictionflow.db"
    DATABASE_TYPE: str = "sqlite"  # sqlite, mongodb, hybrid
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "frictionflow"
    
    # AI Config
    AI_PROVIDER: str = "mock"  # mock, gemini, openai
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # Authentication & Security
    SECRET_KEY: str = "frictionflow-super-secret-key-2026-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    FIREBASE_PROJECT_ID: Optional[str] = "frictionflow-demo"
    
    # Presentation / Demo Mode
    DEMO_MODE: bool = True
    
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
