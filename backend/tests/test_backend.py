import pytest
from app.services.friction_service import FrictionService
from app.schemas.schemas import FrictionCalculateRequest
from app.ai.llm_provider import MockAIProvider

def test_friction_low():
    req = FrictionCalculateRequest(
        problem_difficulty="Easy",
        time_spent_seconds=300, # 5 min
        attempt_number=1,
        failed_attempts=0
    )
    res = FrictionService.calculate_friction(req, historical_topic_mastery=80.0)
    assert res.friction_level == "Low"
    assert res.should_intervene is False
    assert res.friction_score < 30.0

def test_friction_high():
    req = FrictionCalculateRequest(
        problem_difficulty="Easy",
        time_spent_seconds=1800, # 30 min on Easy
        attempt_number=4,
        failed_attempts=3,
        error_message="Time Limit Exceeded (TLE)"
    )
    res = FrictionService.calculate_friction(req, historical_topic_mastery=35.0)
    assert res.friction_level in ["High", "Critical"]
    assert res.should_intervene is True
    assert "small hint" in res.intervention_message or "intense" in res.intervention_message

@pytest.mark.asyncio
async def test_ai_mock_progressive_hints():
    ai = MockAIProvider()
    l1 = await ai.generate_hint("House Robber", "Dynamic Programming", "Medium", hint_level=1)
    assert l1["can_request_next"] is True
    assert "Level 1" in l1["title"]

    l4 = await ai.generate_hint("House Robber", "Dynamic Programming", "Medium", hint_level=4)
    assert l4["can_request_next"] is False
    assert "def solve" in l4["content"] or "def rob" in l4["content"] or "solution" in l4["title"].lower()

@pytest.mark.asyncio
async def test_error_translator_segfault():
    ai = MockAIProvider()
    res = await ai.explain_error("Segmentation fault (core dumped)", "cpp")
    assert "Segmentation Fault" in res["error_type"]
    assert len(res["actionable_checklist"]) > 0
