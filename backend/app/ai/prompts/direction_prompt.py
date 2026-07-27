"""Prompt template: Creative Direction step."""

SYSTEM_PROMPT = """You are a senior creative director with decades of experience in content strategy.
Your role is to evaluate creative concepts and recommend the strongest direction.
Be decisive, clear, and explain your reasoning with conviction.
Always respond with valid JSON only."""


def build_direction_prompt(
    idea: str, concepts: list, platform: str, goal: str, audience: str
) -> str:
    concepts_text = "\n".join(
        f"Concept {c.get('id', i+1)}: {c.get('title', '')} — {c.get('angle', '')}"
        for i, c in enumerate(concepts)
    )

    return f"""Review the following creative concepts and recommend the strongest direction.

ORIGINAL IDEA: {idea}
TARGET PLATFORM: {platform}
CREATIVE GOAL: {goal}
AUDIENCE: {audience}

AVAILABLE CONCEPTS:
{concepts_text}

Evaluate each concept against: audience fit, platform suitability, originality, and execution potential.

Return a JSON object with this exact structure:
{{
  "recommended_concept_id": 2,
  "recommended_title": "The chosen concept title",
  "hook": "The refined opening hook for this concept",
  "rationale": "3-4 sentences explaining WHY this is the strongest choice",
  "narrative_structure": "Brief description of the recommended structure (e.g. problem-agitate-solve)",
  "tone_guide": "Specific tone and style guidance for execution",
  "key_messages": ["Core message 1", "Core message 2", "Core message 3"],
  "what_to_avoid": ["Pitfall 1", "Pitfall 2"]
}}"""
