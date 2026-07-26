"""Services for each pipeline stage — Phase 2 stubs."""
from __future__ import annotations

from app.ai.client import AIClient
from app.ai.providers.exceptions import AIProviderNotConfiguredError
from app.ai.prompts.brainstorm_prompt import build_brainstorm_prompt
from app.ai.prompts.direction_prompt import build_direction_prompt
from app.ai.prompts.development_prompt import build_development_prompt
from app.ai.prompts.adaptation_prompt import build_adaptation_prompt
from app.ai.prompts.suggestions_prompt import build_suggestions_prompt
from app.core.logging import get_logger

logger = get_logger(__name__)


class IdeaAnalysisService:
    """Validates and enriches the raw idea before pipeline execution."""

    def __init__(self, ai_client: AIClient) -> None:
        self._client = ai_client

    async def analyse(self, idea: str) -> dict:
        logger.debug("IdeaAnalysisService: analyse called")
        return {"raw": idea, "length": len(idea), "status": "received"}


class BrainstormService:
    """Generates creative angles and possibilities from the idea."""

    def __init__(self, ai_client: AIClient) -> None:
        self._client = ai_client

    async def brainstorm(self, idea: str, platform: str, length: str) -> str:
        logger.debug("BrainstormService: brainstorm called (AI not connected)")
        prompt = build_brainstorm_prompt(idea, platform, length)
        raise AIProviderNotConfiguredError(
            "BrainstormService requires an AI provider (Phase 3)."
        )


class CreativeDirectionService:
    """Defines the creative direction: tone, structure, narrative arc."""

    def __init__(self, ai_client: AIClient) -> None:
        self._client = ai_client

    async def define_direction(
        self, idea: str, brainstorm_output: str, platform: str
    ) -> str:
        logger.debug("CreativeDirectionService: define_direction called (AI not connected)")
        prompt = build_direction_prompt(idea, brainstorm_output, platform)
        raise AIProviderNotConfiguredError(
            "CreativeDirectionService requires an AI provider (Phase 3)."
        )


class ContentDevelopmentService:
    """Produces the full content — scripts, articles, stories."""

    def __init__(self, ai_client: AIClient) -> None:
        self._client = ai_client

    async def develop(
        self, idea: str, direction_output: str, goal: str, length: str
    ) -> str:
        logger.debug("ContentDevelopmentService: develop called (AI not connected)")
        prompt = build_development_prompt(idea, direction_output, goal, length)
        raise AIProviderNotConfiguredError(
            "ContentDevelopmentService requires an AI provider (Phase 3)."
        )


class PlatformAdaptationService:
    """Adapts developed content for each target platform."""

    def __init__(self, ai_client: AIClient) -> None:
        self._client = ai_client

    async def adapt(self, content: str, platform: str) -> str:
        logger.debug("PlatformAdaptationService: adapt called (AI not connected)")
        prompt = build_adaptation_prompt(content, platform)
        raise AIProviderNotConfiguredError(
            "PlatformAdaptationService requires an AI provider (Phase 3)."
        )


class SuggestionService:
    """Generates creative improvement suggestions and calls-to-action."""

    def __init__(self, ai_client: AIClient) -> None:
        self._client = ai_client

    async def suggest(self, content: str, goal: str) -> str:
        logger.debug("SuggestionService: suggest called (AI not connected)")
        prompt = build_suggestions_prompt(content, goal)
        raise AIProviderNotConfiguredError(
            "SuggestionService requires an AI provider (Phase 3)."
        )
