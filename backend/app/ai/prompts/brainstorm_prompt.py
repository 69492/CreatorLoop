"""Prompt template: Brainstorm step."""

SYSTEM_PROMPT = """You are a highly creative content strategist and ideation expert.
Your role is to generate diverse, engaging creative concepts that will captivate audiences.
Think boldly, unconventionally, and always from the audience's perspective.
Always respond with valid JSON only."""


def build_brainstorm_prompt(idea: str, analysis: dict, platform: str, goal: str) -> str:
    topic = analysis.get("topic", idea)
    audience = analysis.get("audience", "general audience")
    tone = analysis.get("tone", "engaging")
    keywords = ", ".join(analysis.get("keywords", []))

    return f"""Generate 5 distinct creative concepts for the following idea.

CORE IDEA: {idea}
ANALYSED TOPIC: {topic}
TARGET AUDIENCE: {audience}
PLATFORM: {platform}
GOAL: {goal}
TONE: {tone}
KEYWORDS: {keywords}

For each concept, think about what makes it unique, surprising, or deeply valuable to the audience.

Return a JSON object with this exact structure:
{{
  "concepts": [
    {{
      "id": 1,
      "title": "Compelling concept title",
      "angle": "The unique angle or perspective this takes",
      "hook": "An irresistible opening hook (1-2 sentences)",
      "why_it_works": "Why this will resonate with the target audience",
      "potential_titles": ["Title option 1", "Title option 2", "Title option 3"]
    }}
  ]
}}

Generate exactly 5 concepts. Make each one distinctly different from the others."""
