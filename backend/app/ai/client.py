"""
Central AI client — completed in Phase 3.

Supports:
  • generate(prompt, system_prompt)  → str
  • generate_json(prompt, system_prompt) → dict
  • register_provider(provider)
  • is_ready property
"""
from __future__ import annotations

from typing import Any

from app.ai.providers.interfaces.ai_provider_interface import AIProviderInterface
from app.ai.providers.exceptions import AIProviderNotConfiguredError
from app.core.logging import get_logger

logger = get_logger(__name__)


class AIClient:
    """
    Provider-independent AI client singleton.

    The concrete provider (Gemini, IBM Granite, …) is registered at startup
    and is swappable without changing any service or pipeline code.
    """

    def __init__(self) -> None:
        self._provider: AIProviderInterface | None = None

    def register_provider(self, provider: AIProviderInterface) -> None:
        """Register the active AI provider. Must be called once at startup."""
        self._provider = provider
        logger.info("AI provider registered: %s", provider.get_provider_name())

    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
        options: dict[str, Any] | None = None,
    ) -> str:
        """
        Generate a plain-text response.

        Raises:
            AIProviderNotConfiguredError: No provider registered.
            AIProviderError: Provider-level failure.
        """
        self._require_provider()
        logger.debug("AIClient.generate — provider=%s", self._provider.get_provider_name())
        return await self._provider.generate(prompt, system_prompt=system_prompt, options=options)

    async def generate_json(
        self,
        prompt: str,
        system_prompt: str | None = None,
    ) -> dict[str, Any]:
        """
        Generate a response and parse it as JSON.

        Raises:
            AIProviderNotConfiguredError: No provider registered.
            AIProviderError: Provider-level failure or JSON parse error.
        """
        self._require_provider()
        logger.debug("AIClient.generate_json — provider=%s", self._provider.get_provider_name())
        return await self._provider.generate_json(prompt, system_prompt=system_prompt)

    @property
    def is_ready(self) -> bool:
        """Return True when a provider is registered."""
        return self._provider is not None

    def _require_provider(self) -> None:
        if self._provider is None:
            raise AIProviderNotConfiguredError(
                "No AI provider is registered. "
                "Ensure GEMINI_API_KEY is set in your .env file and the application has started."
            )


# Singleton — import and use this throughout the codebase
ai_client = AIClient()
