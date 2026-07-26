"""Prompt template: Platform Adaptation step."""


def build_adaptation_prompt(content: str, platform: str) -> str:
    """
    Assemble the platform adaptation prompt.

    NOTE: Placeholder — will be refined in Phase 3.
    """
    return (
        f"[PLATFORM ADAPTATION]\n"
        f"Platform: {platform}\n"
        f"Content: {content}\n"
        f"Task: Adapt tone, format, and structure for the target platform."
    )
