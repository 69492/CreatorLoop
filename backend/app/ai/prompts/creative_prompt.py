"""
Master creative prompt — generates the full structured JSON in ONE Groq request.

A single system prompt + one user message replaces six sequential AI calls,
dramatically reducing latency, cost, and failure surface.
"""

SYSTEM_PROMPT = """You are CreatorLoop AI — an expert creative partner, content strategist, and multi-platform writer.

Your task is to take a creator's idea and produce a complete, professional creative package in one response.

════════════════════════════════
STRICT JSON OUTPUT CONTRACT
════════════════════════════════
- Output ONLY a single, valid JSON object.
- Do NOT wrap the response in markdown code fences (no ```json, no ```).
- Do NOT prepend or append any prose, explanation, or commentary.
- Start your ENTIRE response with { and end with }.
- Do NOT use trailing commas anywhere in the JSON.
- Do NOT include raw (unescaped) newlines inside string values.
  Use the two-character sequence \\n instead of a real line break inside strings.
- Escape all backslashes, double quotes, and control characters within string values.
- Do NOT truncate any field — write every value completely.
- Do NOT add any field not listed in the schema below.

The JSON must contain exactly these six top-level keys:

1. "analysis"              — deep understanding of the idea
2. "brainstorm"            — array of three distinct creative concepts
3. "recommended_direction" — the single strongest concept with reasoning
4. "content"               — full outline and complete draft
5. "adaptations"           — native versions for all six platforms
6. "creative_suggestions"  — SEO, CTA, thumbnails, improvements

Be specific, professional, and immediately usable. Every field matters."""


def build_creative_prompt(
    idea: str,
    goal: str,
    platform: str,
    length: str,
) -> str:
    """
    Build the single user-turn prompt that drives the entire creative workflow.
    """
    length_guide = {
        "short":  "400–600 words / 2–3 minutes",
        "medium": "1000–1500 words / 8–12 minutes",
        "long":   "2000–3000 words / 18–25 minutes",
    }.get(length, "1000–1500 words")

    return f"""Create a complete creative content package for the following idea.

IDEA: {idea}
CREATIVE GOAL: {goal}
PRIMARY PLATFORM: {platform}
CONTENT LENGTH: {length} ({length_guide})

Return a single JSON object with this exact structure (fill every field with real content):

{{
  "analysis": {{
    "topic": "Core topic in one clear sentence",
    "audience": "Specific target audience description",
    "purpose": "Primary purpose this content serves",
    "tone": "Recommended tone (e.g. educational, entertaining, conversational)",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  }},

  "brainstorm": [
    {{
      "title": "Concept 1 title",
      "hook": "Opening hook sentence for concept 1",
      "description": "What makes this angle unique and compelling"
    }},
    {{
      "title": "Concept 2 title",
      "hook": "Opening hook sentence for concept 2",
      "description": "What makes this angle unique and compelling"
    }},
    {{
      "title": "Concept 3 title",
      "hook": "Opening hook sentence for concept 3",
      "description": "What makes this angle unique and compelling"
    }}
  ],

  "recommended_direction": {{
    "title": "Chosen concept title",
    "reason": "2–3 sentences explaining why this is the strongest direction for this goal and platform"
  }},

  "content": {{
    "title": "Final polished title",
    "outline": [
      "Section 1: Introduction / Hook",
      "Section 2: Core Point 1",
      "Section 3: Core Point 2",
      "Section 4: Core Point 3",
      "Section 5: Conclusion / CTA"
    ],
    "draft": "The complete {length} content draft. Write the full text here, formatted professionally. Use paragraph breaks for readability. Minimum length: {length_guide}."
  }},

  "adaptations": {{
    "youtube": "YouTube video description with SEO title, chapter markers, and end-screen CTA (150-250 words)",
    "linkedin": "LinkedIn post in professional thought-leadership tone with line breaks for readability (150-200 words)",
    "instagram": "Instagram caption with relevant emojis, story hook, and 5 hashtags (80-120 words)",
    "twitter": "Twitter/X thread — 5 numbered tweets, each under 280 characters, starting with a hook",
    "blog": "Blog introduction paragraph (100-150 words) with SEO-optimised H1 title and 3 H2 subheadings listed",
    "podcast": "Podcast episode intro script (60-90 seconds read aloud), episode title, and 3 key takeaways"
  }},

  "creative_suggestions": {{
    "seo_keywords": ["primary keyword", "secondary keyword", "long-tail phrase 1", "long-tail phrase 2"],
    "cta": "One compelling call-to-action the audience should take after consuming this content",
    "thumbnail_ideas": [
      "Thumbnail idea 1 — describe the visual clearly",
      "Thumbnail idea 2 — describe the visual clearly",
      "Thumbnail idea 3 — describe the visual clearly"
    ],
    "improvements": [
      "Specific improvement tip 1",
      "Specific improvement tip 2",
      "Specific improvement tip 3"
    ]
  }}
}}

REMINDER: Return ONLY the JSON object above — no markdown fences, no prose before or after.
Use \\n (backslash-n) for line breaks inside string values, never raw newlines."""
