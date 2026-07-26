"""
Central AI client.

Acts as the single entry-point for all AI generation requests.
Provider registration will happen in Phase 3.
"""
from typing import Any
from app.ai.providers.interfaces.ai_provider_interface import AIProviderInterface
from app.ai.providers.exceptions import AIProviderNotConfiguredError
from app.core.logging import get_logger

logger = get_logger(__name__)


class AIClient:
    """
    Provider-independent AI client.

    Usage (once a provider is registered):
        client = AIClient()
        client.register_provider(GraniteProvider())
        result = await client.generate(prompt)
    """

    def __init__(self) -> None:
        self._provider: AIProviderInterface | None = None

    def register_provider(self, provider: AIProviderInterface) -> None:
        """Register the active AI provider. Call once at startup."""
        self._provider = provider
        logger.info("AI provider registered: %s", provider.get_provider_name())

    async def generate(
        self, prompt: str, options: dict[str, Any] | None = None
    ) -> str:
        """
        Generate a response for the given prompt.

        Raises:
            AIProviderNotConfiguredError: No provider registered yet (Phase 2).
        """
        if self._provider is None:
            raise AIProviderNotConfiguredError(
                "No AI provider is registered. "
                "IBM Granite integration will be enabled in Phase 3."
            )
        logger.debug("Generating with provider: %s", self._provider.get_provider_name())
        return await self._provider.generate(prompt, options)

    @property
    def is_ready(self) -> bool:
        """Return True when a provider is registered and ready."""
        return self._provider is not None


# Singleton instance — import this throughout the application
ai_client = AIClient()
