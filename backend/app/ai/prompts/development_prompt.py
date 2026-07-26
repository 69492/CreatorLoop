"""Prompt template: Content Development step."""


def build_development_prompt(
    idea: str, direction_output: str, goal: str, length: str
) -> str:
    """
    Assemble the content development prompt.

    NOTE: Placeholder — will be refined in Phase 3.
    """
    return (
        f"[CONTENT DEVELOPMENT]\n"
        f"Idea: {idea}\n"
        f"Direction: {direction_output}\n"
        f"Goal: {goal}\n"
        f"Length: {length}\n"
        f"Task: Write the full content in the creator's voice."
    )
