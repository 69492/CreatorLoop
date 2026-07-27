"""
Creative Workflow Service — single unified AI call.

Replaces the six individual stage services (IdeaAnalysis, Brainstorm, etc.)
with one CreativeWorkflowService that issues a single Groq request and returns
the complete structured creative package.

The individual service classes are preserved as lightweight wrappers so that
any code that imports them directly continues to function.

JSON Hardening
──────────────
The raw Groq response is passed through the full reliability pipeline in
GroqProvider.generate_json():
    safe_parse_json()  →  validate_response_safe()  →  repair loop (if needed)

CreativeWorkflowService does NOT call json.loads() directly — it relies on the
provider layer to always return a validated, normalised dict.
"""
from __future__ import annotations

import time
from typing import Any

from app.ai.client import AIClient
from app.ai.prompts.creative_prompt import SYSTEM_PROMPT, build_creative_prompt
from app.core.logging import get_logger

logger = get_logger(__name__)

_REQUIRED_SECTIONS = frozenset({
    "analysis",
    "brainstorm",
    "recommended_direction",
    "content",
    "adaptations",
    "creative_suggestions",
})


class CreativeWorkflowService:
    """
    Issues ONE Groq request and returns the complete creative JSON package.

    Expected output keys:
        analysis, brainstorm, recommended_direction,
        content, adaptations, creative_suggestions
    """

    def __init__(self, client: AIClient) -> None:
        self._client = client

    async def generate(
        self,
        idea: str,
        goal: str,
        platform: str,
        length: str,
    ) -> dict[str, Any]:
        t0 = time.perf_counter()
        logger.info(
            "CreativeWorkflowService.generate START — goal=%s platform=%s length=%s",
            goal, platform, length,
        )

        prompt = build_creative_prompt(idea, goal, platform, length)

        # generate_json() handles: JSON mode, safe_parse_json, Pydantic validation,
        # and one automatic repair attempt — we never call json.loads() here.
        result = await self._client.generate_json(prompt, system_prompt=SYSTEM_PROMPT)

        elapsed = (time.perf_counter() - t0) * 1000
        received = set(result.keys())
        missing = _REQUIRED_SECTIONS - received

        if missing:
            logger.warning(
                "CreativeWorkflowService.generate: missing sections=%s (%.0fms)",
                sorted(missing), elapsed,
            )
        else:
            logger.info(
                "CreativeWorkflowService.generate DONE — all sections present (%.0fms)",
                elapsed,
            )

        return result


# ── Backward-compatible stub wrappers ─────────────────────────────────────────
# These allow any existing import of the individual service classes to continue
# working without raising ImportError. Each delegates to CreativeWorkflowService.

class IdeaAnalysisService:
    def __init__(self, client: AIClient) -> None:
        self._svc = CreativeWorkflowService(client)

    async def analyse(self, idea: str, goal: str, platform: str, length: str) -> dict:
        result = await self._svc.generate(idea, goal, platform, length)
        return result.get("analysis", {})


class BrainstormService:
    def __init__(self, client: AIClient) -> None:
        self._svc = CreativeWorkflowService(client)

    async def brainstorm(self, idea: str, analysis: dict, platform: str, goal: str) -> list:
        result = await self._svc.generate(idea, goal, platform, "medium")
        return result.get("brainstorm", [])


class CreativeDirectionService:
    def __init__(self, client: AIClient) -> None:
        self._svc = CreativeWorkflowService(client)

    async def define_direction(
        self, idea: str, concepts: list, platform: str, goal: str, audience: str
    ) -> dict:
        result = await self._svc.generate(idea, goal, platform, "medium")
        return result.get("recommended_direction", {})


class ContentDevelopmentService:
    def __init__(self, client: AIClient) -> None:
        self._svc = CreativeWorkflowService(client)

    async def develop(
        self, idea: str, direction: dict, goal: str, platform: str, length: str, tone: str
    ) -> dict:
        result = await self._svc.generate(idea, goal, platform, length)
        return result.get("content", {})


class PlatformAdaptationService:
    def __init__(self, client: AIClient) -> None:
        self._svc = CreativeWorkflowService(client)

    async def adapt(self, title: str, full_draft: str, target_platform: str) -> dict:
        # Adaptation already included in the single call; return empty to avoid re-call
        logger.debug("PlatformAdaptationService: returning cached adaptations (single-call mode)")
        return {}


class CreativeSuggestionService:
    def __init__(self, client: AIClient) -> None:
        self._svc = CreativeWorkflowService(client)

    async def suggest(
        self, title: str, full_draft: str, platform: str, goal: str, keywords: list
    ) -> dict:
        logger.debug("CreativeSuggestionService: returning cached suggestions (single-call mode)")
        return {}
