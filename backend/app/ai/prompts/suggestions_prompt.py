"""Prompt template: Creative Suggestions step."""


def build_suggestions_prompt(content: str, goal: str) -> str:
    """
    Assemble the creative suggestions prompt.

    NOTE: Placeholder — will be refined in Phase 3.
    """
    return (
        f"[CREATIVE SUGGESTIONS]\n"
        f"Goal: {goal}\n"
        f"Content: {content}\n"
        f"Task: Provide improvement suggestions, hooks, and CTAs."
    )
