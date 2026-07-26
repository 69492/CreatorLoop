"""Custom exceptions for the AI layer."""


class AIProviderError(Exception):
    """Raised when an AI provider encounters an error during generation."""


class AIProviderNotConfiguredError(AIProviderError):
    """Raised when no AI provider has been registered or configured."""


class AIPromptError(Exception):
    """Raised when a prompt template cannot be assembled."""
