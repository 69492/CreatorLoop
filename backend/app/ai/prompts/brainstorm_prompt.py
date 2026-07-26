"""Prompt template: Brainstorm step."""


def build_brainstorm_prompt(idea: str, platform: str, length: str) -> str:
    """
    Assemble the brainstorm prompt.

    NOTE: Template body is intentionally a placeholder.
          Real prompt engineering happens in Phase 3.
    """
    return (
        f"[BRAINSTORM]\n"
        f"Idea: {idea}\n"
        f"Platform: {platform}\n"
        f"Length: {length}\n"
        f"Task: Generate creative angles, hooks, and brainstorm possibilities."
    )
