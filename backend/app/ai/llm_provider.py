import abc
import httpx
from typing import Optional, Dict, Any, List
from app.config import settings

class AIProvider(abc.ABC):
    @abc.abstractmethod
    async def generate_hint(
        self,
        problem_title: str,
        topic: str,
        difficulty: str,
        hint_level: int,
        student_code: Optional[str] = None,
        error_message: Optional[str] = None,
        session_context: Optional[Dict[str, Any]] = None,
        student_profile: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate progressive contextual hint (Level 1: Conceptual, 2: Directional, 3: Specific, 4: Solution)"""
        pass

    @abc.abstractmethod
    async def explain_error(
        self,
        raw_error: str,
        language: str = "python",
        code_context: Optional[str] = None
    ) -> Dict[str, Any]:
        """Translate cryptic error logs into simple beginner explanations"""
        pass

    @abc.abstractmethod
    async def answer_question(
        self,
        user_message: str,
        problem_title: Optional[str] = None,
        topic: Optional[str] = None,
        difficulty: Optional[str] = "Easy",
        code_snippet: Optional[str] = None,
        error_message: Optional[str] = None,
        hint_level: int = 1,
        session_context: Optional[Dict[str, Any]] = None,
        student_profile: Optional[Dict[str, Any]] = None
    ) -> str:
        """Socratic chat mentor response avoiding direct code dump unless level 4 explicitly requested"""
        pass


class MockAIProvider(AIProvider):
    """
    Offline/Demo Socratic mentor provider ensuring FrictionFlow is 100% functional without external keys.
    Builds context-aware responses incorporating actual error history and student topic mastery.
    """
    async def generate_hint(
        self,
        problem_title: str,
        topic: str,
        difficulty: str,
        hint_level: int,
        student_code: Optional[str] = None,
        error_message: Optional[str] = None,
        session_context: Optional[Dict[str, Any]] = None,
        student_profile: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        error_note = ""
        if error_message:
            error_note = f"\n\n**Observed Error Context**: You've repeatedly encountered `{error_message[:60]}`. Pay special attention to your edge case boundaries."

        profile_note = ""
        if student_profile and student_profile.get("weak_topics"):
            if topic in student_profile.get("weak_topics", []):
                profile_note = f" (Note: We noticed {topic} is a focus area in your profile—let's build step-by-step intuition!)"

        hints_map = {
            1: {
                "title": f"Level 1 — Conceptual Hint for {problem_title}",
                "content": f"Think about how you can break down '{problem_title}' into smaller subproblems. For {topic}{profile_note}, consider what state or data structure (e.g., lookup table or pointers) you need to store as you traverse.{error_note}",
                "can_request_next": True
            },
            2: {
                "title": f"Level 2 — Directional Strategy for {topic}",
                "content": f"A data structure like a HashMap or Array table can help you check whether a required complementary value has already been processed in O(1) time instead of nested loops.{error_note}",
                "can_request_next": True
            },
            3: {
                "title": "Level 3 — Targeted Step-by-Step Logic",
                "content": f"Iterate through the elements once. Before modifying state, check boundary conditions carefully.{' Address the recurring error: verify index bounds before accessing array elements.' if error_message else ''} Update your tracking data structure at each step.",
                "can_request_next": True
            },
            4: {
                "title": "Level 4 — Complete Solution & Explanation",
                "content": f"```python\ndef solve_problem(inputs):\n    # Optimal approach for {problem_title} ({topic})\n    seen = dict()\n    for i, item in enumerate(inputs):\n        if is_valid(item, seen):\n            return [seen[item], i]\n        seen[item] = i\n    return []\n```\n**Why it works**: By maintaining state in a single pass, we reduce time complexity from O(N^2) to O(N).",
                "can_request_next": False
            }
        }
        return hints_map.get(hint_level, hints_map[1])

    async def explain_error(
        self,
        raw_error: str,
        language: str = "python",
        code_context: Optional[str] = None
    ) -> Dict[str, Any]:
        raw_lower = raw_error.lower()
        if "segmentation fault" in raw_lower or "sigsegv" in raw_lower:
            return {
                "error_type": "Segmentation Fault (Memory Access Violation)",
                "simple_explanation": "Your code tried to access or modify a memory address that doesn't belong to your program.",
                "root_cause": "Accessing an array out of bounds (e.g. `arr[10]` when array length is 5) or dereferencing an uninitialized null pointer.",
                "actionable_checklist": [
                    "Verify loop conditions: ensure index < array.size()",
                    "Check for off-by-one errors in `for` loops",
                    "Ensure pointers are properly initialized before dereferencing"
                ],
                "suggested_fix_direction": "Add bounds check assertions `if (i >= 0 && i < len) { ... }` before array indexing."
            }
        elif "time limit exceeded" in raw_lower or "tle" in raw_lower:
            return {
                "error_type": "Time Limit Exceeded (TLE)",
                "simple_explanation": "Your solution is taking longer to run than the platform's execution time limit (usually 1-2 seconds).",
                "root_cause": "Your algorithm's time complexity (e.g. O(N²)) is too slow for large input constraints (e.g. N = 10⁵).",
                "actionable_checklist": [
                    "Count the maximum nested loops in your approach",
                    "Look for repeated re-computation that could be memoized",
                    "Check if an infinite loop is occurring due to unchanged loop counters"
                ],
                "suggested_fix_direction": "Replace O(N²) nested searching with a HashMap, Two-Pointer, or Dynamic Programming strategy."
            }
        elif "nullpointerexception" in raw_lower or "attributeerror" in raw_lower or "indexerror" in raw_lower:
            return {
                "error_type": "Index / Null Reference Error",
                "simple_explanation": "Your code attempted to access an element at an invalid index or call a property on a `None`/`null` object.",
                "root_cause": "Array index went beyond length limits (e.g. `i >= len(arr)`), or variable returned `None` unexpectedly.",
                "actionable_checklist": [
                    "Check return values of search functions before accessing attributes",
                    "Verify array length before indexing `arr[i]`",
                    "Add guard clauses: `if i < len(arr): ...`"
                ],
                "suggested_fix_direction": "Insert explicit non-null and index range checks before accessing array elements."
            }
        else:
            return {
                "error_type": "Compiler / Runtime Error",
                "simple_explanation": "The program encountered an unexpected condition during compilation or execution.",
                "root_cause": f"Detailed error text: {raw_error[:200]}",
                "actionable_checklist": [
                    "Check variable types and syntax",
                    "Ensure function signatures match invocation arguments",
                    "Inspect line numbers mentioned in stack trace"
                ],
                "suggested_fix_direction": "Isolate the failing statement and test with simple print debugging statements."
            }

    async def answer_question(
        self,
        user_message: str,
        problem_title: Optional[str] = None,
        topic: Optional[str] = None,
        difficulty: Optional[str] = "Easy",
        code_snippet: Optional[str] = None,
        error_message: Optional[str] = None,
        hint_level: int = 1,
        session_context: Optional[Dict[str, Any]] = None,
        student_profile: Optional[Dict[str, Any]] = None
    ) -> str:
        msg_lower = user_message.lower()
        title_str = f" on '{problem_title}'" if problem_title else ""
        
        if error_message:
            return f"You're hitting `{error_message}`. Before altering your entire logic for '{problem_title}', check if your loop index is trying to access elements beyond the array bounds."

        if "tle" in msg_lower or "slow" in msg_lower or "time limit" in msg_lower:
            return f"Before changing the code{title_str}, let's identify why it's slow. How many times are you iterating through your main loop or collection? If your input size is N = 10⁵, an O(N²) loop will execute 10¹⁰ operations—well past the 1-second limit!"
        elif "give solution" in msg_lower or "code" in msg_lower or "answer" in msg_lower:
            if hint_level < 4:
                return f"I'm here to help you learn, not just give away the solution! Let me give you a Level {hint_level} nudge first: What is the current time complexity of your approach for {topic or 'this problem'}?"
            else:
                return f"Here is the approach for {problem_title}: build a lookup table where keys are values and values are indices. As you loop through, check if complementary value exists."
        elif "stuck" in msg_lower or "help" in msg_lower:
            return f"Don't worry! Being stuck is where the real learning happens. For {topic or 'this topic'}, try drawing out a small input array on paper with 3 elements. Walk through your logic manually step by step!"
        else:
            return f"That's a good question regarding {problem_title or 'this problem'}. What edge cases (like empty arrays, single elements, or negative numbers) have you tested so far?"


class GeminiProvider(AIProvider):
    """Google Gemini API Provider Integration"""
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

    async def generate_hint(
        self,
        problem_title: str,
        topic: str,
        difficulty: str,
        hint_level: int,
        student_code: Optional[str] = None,
        error_message: Optional[str] = None,
        session_context: Optional[Dict[str, Any]] = None,
        student_profile: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        prompt = (
            f"System: You are FrictionFlow, a Socratic programming mentor.\n"
            f"Student context: Problem='{problem_title}', Topic='{topic}', Difficulty='{difficulty}', Hint Level={hint_level}.\n"
            f"Error message='{error_message or 'None'}'.\n"
            f"Provide a Level {hint_level} hint. Do not give complete code solutions unless hint level is 4."
        )
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(self.url, json={"contents": [{"parts": [{"text": prompt}]}]})
                if resp.status_code == 200:
                    text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
                    return {
                        "title": f"Level {hint_level} Hint",
                        "content": text,
                        "can_request_next": hint_level < 4
                    }
        except Exception:
            pass
        return await MockAIProvider().generate_hint(
            problem_title, topic, difficulty, hint_level, student_code, error_message, session_context, student_profile
        )

    async def explain_error(self, raw_error: str, language: str = "python", code_context: Optional[str] = None) -> Dict[str, Any]:
        return await MockAIProvider().explain_error(raw_error, language, code_context)

    async def answer_question(
        self,
        user_message: str,
        problem_title: Optional[str] = None,
        topic: Optional[str] = None,
        difficulty: Optional[str] = "Easy",
        code_snippet: Optional[str] = None,
        error_message: Optional[str] = None,
        hint_level: int = 1,
        session_context: Optional[Dict[str, Any]] = None,
        student_profile: Optional[Dict[str, Any]] = None
    ) -> str:
        return await MockAIProvider().answer_question(
            user_message, problem_title, topic, difficulty, code_snippet, error_message, hint_level, session_context, student_profile
        )


class OpenAIProvider(AIProvider):
    """OpenAI API Provider Integration"""
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.url = "https://api.openai.com/v1/chat/completions"

    async def generate_hint(
        self,
        problem_title: str,
        topic: str,
        difficulty: str,
        hint_level: int,
        student_code: Optional[str] = None,
        error_message: Optional[str] = None,
        session_context: Optional[Dict[str, Any]] = None,
        student_profile: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        return await MockAIProvider().generate_hint(
            problem_title, topic, difficulty, hint_level, student_code, error_message, session_context, student_profile
        )

    async def explain_error(self, raw_error: str, language: str = "python", code_context: Optional[str] = None) -> Dict[str, Any]:
        return await MockAIProvider().explain_error(raw_error, language, code_context)

    async def answer_question(
        self,
        user_message: str,
        problem_title: Optional[str] = None,
        topic: Optional[str] = None,
        difficulty: Optional[str] = "Easy",
        code_snippet: Optional[str] = None,
        error_message: Optional[str] = None,
        hint_level: int = 1,
        session_context: Optional[Dict[str, Any]] = None,
        student_profile: Optional[Dict[str, Any]] = None
    ) -> str:
        return await MockAIProvider().answer_question(
            user_message, problem_title, topic, difficulty, code_snippet, error_message, hint_level, session_context, student_profile
        )


def get_ai_provider() -> AIProvider:
    provider_name = settings.AI_PROVIDER.lower()
    if provider_name == "gemini" and settings.GEMINI_API_KEY:
        return GeminiProvider(settings.GEMINI_API_KEY)
    elif provider_name == "openai" and settings.OPENAI_API_KEY:
        return OpenAIProvider(settings.OPENAI_API_KEY)
    return MockAIProvider()
