"""
Abstract AI provider interface.
All future providers (IBM Granite, OpenAI, etc.) must implement this contract.
"""
from abc import ABC, abstractmethod
from typing import Any


class AIProviderInterface(ABC):
    """Contract that every AI provider must satisfy."""

    @abstractmethod
    async def generate(self, prompt: str, options: dict[str, Any] | None = None) -> str:
        """
        Send a prompt to the provider and return the text response.

        Args:
            prompt: The assembled prompt string.
            options: Optional provider-specific parameters (temperature, max_tokens, etc.)

        Returns:
            Generated text response.

        Raises:
            NotImplementedError: Until a concrete provider is registered.
            AIProviderError: When the provider encounters an error.
        """

    @abstractmethod
    def get_provider_name(self) -> str:
        """Return a human-readable provider identifier."""
