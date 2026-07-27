"""Prompt template: Content Development step."""

SYSTEM_PROMPT = """You are a world-class content creator and professional writer.
Your job is to develop a full, polished piece of content based on the creative direction provided.
Write in an engaging, human voice that feels native to the platform.
Structure your content professionally and make it immediately usable.
Always respond with valid JSON only."""


def build_development_prompt(
    idea: str,
    direction: dict,
    goal: str,
    platform: str,
    length: str,
    tone: str,
) -> str:
    title = direction.get("recommended_title", idea)
    hook = direction.get("hook", "")
    structure = direction.get("narrative_structure", "")
    tone_guide = direction.get("tone_guide", tone)
    key_messages = "\n".join(f"- {m}" for m in direction.get("key_messages", []))

    length_guide = {
        "short": "approximately 400-600 words",
        "medium": "approximately 1000-1500 words",
        "long": "approximately 2000-3000 words",
    }.get(length, "approximately 1000 words")

    return f"""Develop a complete, professional piece of content.

TITLE: {title}
OPENING HOOK: {hook}
PLATFORM: {platform}
GOAL: {goal}
TONE: {tone_guide}
NARRATIVE STRUCTURE: {structure}
KEY MESSAGES TO COVER:
{key_messages}
TARGET LENGTH: {length_guide}

Create content that immediately grabs attention, delivers genuine value, and leaves a lasting impression.

Return a JSON object with this exact structure:
{{
  "title": "Final polished title",
  "subtitle": "Optional subtitle or tagline",
  "outline": [
    {{
      "section": "Section name",
      "talking_points": ["Point 1", "Point 2", "Point 3"]
    }}
  ],
  "full_draft": "The complete, formatted content draft ready for use. Use \\n\\n for paragraph breaks.",
  "word_count": 1200,
  "reading_time_minutes": 5
}}"""
