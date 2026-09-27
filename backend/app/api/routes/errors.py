from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.models import User
from app.schemas.schemas import ErrorExplainRequest, ErrorExplainResponse
from app.ai.llm_provider import get_ai_provider

router = APIRouter()

@router.post("/explain", response_model=ErrorExplainResponse)
async def explain_error(
    req: ErrorExplainRequest,
    current_user: User = Depends(get_current_user)
):
    ai = get_ai_provider()
    result = await ai.explain_error(
        raw_error=req.raw_error,
        language=req.programming_language,
        code_context=req.code_context
    )
    return ErrorExplainResponse(
        error_type=result.get("error_type", "Compiler / Runtime Error"),
        simple_explanation=result.get("simple_explanation", ""),
        root_cause=result.get("root_cause", ""),
        actionable_checklist=result.get("actionable_checklist", []),
        suggested_fix_direction=result.get("suggested_fix_direction", "")
    )
