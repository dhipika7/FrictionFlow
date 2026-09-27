from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from app.utils.security import get_password_hash, verify_password
from app.db.database import get_db
from app.config import settings
from app.models.models import User, StudentProfile, TeacherProfile
from app.schemas.schemas import UserCreate, UserLogin, UserResponse, Token

router = APIRouter()

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
@router.post("/signup", response_model=Token)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed,
        role=user_in.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if user.role == "student":
        sp = StudentProfile(user_id=user.id, current_streak=1, focus_topic="Dynamic Programming")
        db.add(sp)
    elif user.role == "teacher":
        tp = TeacherProfile(user_id=user.id)
        db.add(tp)
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return Token(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if user.hashed_password and not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return Token(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_db)):
    return UserResponse.model_validate(user)
