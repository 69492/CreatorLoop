"""Prompt template: Creative Direction step."""


def build_direction_prompt(idea: str, brainstorm_output: str, platform: str) -> str:
    """
    Assemble the creative direction prompt.

    NOTE: Placeholder — will be refined in Phase 3.
    """
    return (
        f"[CREATIVE DIRECTION]\n"
        f"Idea: {idea}\n"
        f"Brainstorm: {brainstorm_output}\n"
        f"Platform: {platform}\n"
        f"Task: Define narrative structure, tone, and creative direction."
    )
