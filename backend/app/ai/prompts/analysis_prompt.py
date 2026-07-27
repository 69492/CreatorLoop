"""Prompt template: Idea Analysis step."""

SYSTEM_PROMPT = """You are an expert creative strategist and content analyst.
Your job is to deeply analyse a creator's idea and extract structured insights that will guide the entire creative workflow.
Always respond with valid JSON only."""


def build_analysis_prompt(idea: str, goal: str, platform: str, length: str) -> str:
    return f"""Analyse the following creative idea and return a structured JSON analysis.

IDEA: {idea}
CREATIVE GOAL: {goal}
TARGET PLATFORM: {platform}
CONTENT LENGTH: {length}

Return a JSON object with this exact structure:
{{
  "topic": "The core topic or subject in one clear sentence",
  "audience": "Specific target audience description",
  "purpose": "The primary purpose this content serves",
  "tone": "Recommended tone (e.g. educational, entertaining, inspirational, conversational)",
  "difficulty": "Content complexity level (beginner / intermediate / advanced)",
  "keywords": ["5", "to", "8", "relevant", "keywords"],
  "content_type": "The best content format for this idea and platform",
  "estimated_length": "Estimated word count or duration for {length} content on {platform}"
}}"""
