"""Prompt template: Creative Suggestions step."""

SYSTEM_PROMPT = """You are a top-tier content marketing strategist and creative consultant.
Your role is to provide actionable, specific creative enhancement suggestions that elevate content from good to exceptional.
Be specific, not generic. Every suggestion must be immediately actionable.
Always respond with valid JSON only."""


def build_suggestions_prompt(
    title: str,
    full_draft: str,
    platform: str,
    goal: str,
    keywords: list[str],
) -> str:
    kw_str = ", ".join(keywords) if keywords else "none provided"

    return f"""Review the following content and provide strategic creative enhancement suggestions.

TITLE: {title}
PLATFORM: {platform}
GOAL: {goal}
TARGET KEYWORDS: {kw_str}

CONTENT DRAFT:
{full_draft[:1500]}{"..." if len(full_draft) > 1500 else ""}

Provide highly specific, immediately actionable suggestions.

Return a JSON object with this exact structure:
{{
  "better_hook": "A rewritten, more powerful opening hook (2-3 sentences)",
  "seo_keywords": ["primary keyword", "secondary keyword 1", "secondary keyword 2", "long tail phrase"],
  "call_to_action": {{
    "primary": "The main CTA (what you want the audience to do next)",
    "secondary": "An alternative or softer CTA"
  }},
  "thumbnail_ideas": [
    "Thumbnail concept 1 — describe the visual clearly",
    "Thumbnail concept 2",
    "Thumbnail concept 3"
  ],
  "improvement_tips": [
    {{
      "area": "Area of improvement (e.g. Opening, Structure, Emotional Impact)",
      "current_issue": "What's weak about this area",
      "suggested_fix": "Specific, actionable fix"
    }}
  ],
  "viral_potential": "Assessment of virality potential and what would need to change to maximise it",
  "repurpose_opportunities": ["Quick win repurpose idea 1", "Quick win repurpose idea 2"]
}}"""
