from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, PlatformConnection
from app.schemas.schemas import PlatformConnectRequest, PlatformSyncResponse
from app.services.platform_service import get_platform_adapter

router = APIRouter()

@router.post("/connect", response_model=PlatformSyncResponse)
async def connect_platform(
    req: PlatformConnectRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    adapter = get_platform_adapter(req.platform_name)
    stats = await adapter.fetch_user_stats(req.handle_or_username)
    
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.student_id == current_user.id,
        PlatformConnection.platform_name == req.platform_name
    ).first()

    if not conn:
        conn = PlatformConnection(
            student_id=current_user.id,
            platform_name=req.platform_name,
            handle_or_username=req.handle_or_username,
            status="connected",
            last_synced_at=datetime.utcnow()
        )
        db.add(conn)
    else:
        conn.handle_or_username = req.handle_or_username
        conn.status = "connected"
        conn.last_synced_at = datetime.utcnow()

    db.commit()

    return PlatformSyncResponse(
        platform_name=req.platform_name,
        status="connected",
        synced_items_count=12,
        message=f"Successfully connected {req.platform_name} account @{req.handle_or_username}!"
    )

@router.get("/{platform}/sync", response_model=PlatformSyncResponse)
async def sync_platform(
    platform: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.student_id == current_user.id,
        PlatformConnection.platform_name.ilike(platform)
    ).first()

    handle = conn.handle_or_username if conn else "student_user"
    adapter = get_platform_adapter(platform)
    subs = await adapter.fetch_recent_submissions(handle)

    if conn:
        conn.last_synced_at = datetime.utcnow()
        db.commit()

    return PlatformSyncResponse(
        platform_name=platform,
        status="synced",
        synced_items_count=len(subs),
        message=f"Synced {len(subs)} activity records from {platform}."
    )
