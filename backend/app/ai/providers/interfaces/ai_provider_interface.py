"""
Abstract AI provider interface.
All future providers (Google Gemini, IBM Granite, etc.) must implement this contract.
"""
from abc import ABC, abstractmethod
from typing import Any


class AIProviderInterface(ABC):
    """Contract that every AI provider must satisfy."""

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
        options: dict[str, Any] | None = None,
    ) -> str:
        """
        Send a prompt to the provider and return the text response.

        Args:
            prompt:        The user-facing prompt content.
            system_prompt: Optional system / persona instruction.
            options:       Optional provider-specific overrides (temperature, etc.)

        Returns:
            Generated text response as a plain string.

        Raises:
            AIProviderError: When the provider encounters an error.
        """

    @abstractmethod
    async def generate_json(
        self,
        prompt: str,
        system_prompt: str | None = None,
    ) -> dict[str, Any]:
        """
        Generate a response and parse it as JSON.

        Returns:
            Parsed dict from the model's JSON output.
        """

    @abstractmethod
    def get_provider_name(self) -> str:
        """Return a human-readable provider identifier."""
