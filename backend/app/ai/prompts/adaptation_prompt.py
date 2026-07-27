"""Prompt template: Platform Adaptation step."""

SYSTEM_PROMPT = """You are a multi-platform content expert who understands the native language of every digital platform.
You know exactly what works on YouTube vs LinkedIn vs Instagram vs Twitter vs Blog vs Podcast.
Your adaptations feel native — never like repurposed content.
Always respond with valid JSON only."""

PLATFORM_GUIDES = {
    "youtube": "Hook in first 30s, timestamps-friendly, SEO title, description with chapters, engaging call to action",
    "linkedin": "Professional insight, personal story angle, no hashtag spam, thought leadership tone, value in first 2 lines",
    "instagram": "Visual-first storytelling, punchy captions, strategic emoji use, 3-5 hashtags, clear CTA in bio",
    "twitter": "Thread format, punchy opening tweet, one idea per tweet, numbered structure, engagement question at end",
    "blog": "SEO-optimised headings, scannable format, internal links placeholder, meta description, conclusion with CTA",
    "podcast": "Conversational tone, natural transitions, listener engagement questions, episode summary, key takeaways",
}


def build_adaptation_prompt(    
    title: str,
    full_draft: str,
    target_platform: str,
    all_platforms: list[str] | None = None,
) -> str:
    platforms = all_platforms or ["youtube", "linkedin", "instagram", "twitter", "blog", "podcast"]
    guides = "\n".join(f"- {p.upper()}: {PLATFORM_GUIDES.get(p, 'standard format')}" for p in platforms)

    return f"""Adapt the following content for every target platform.

ORIGINAL TITLE: {title}
ORIGINAL CONTENT:
{full_draft[:2000]}{"..." if len(full_draft) > 2000 else ""}

PLATFORM ADAPTATION GUIDES:
{guides}

Each version must feel completely native to its platform — not like repurposed content.

Return a JSON object with this exact structure:
{{
  "youtube": {{
    "title": "SEO-optimised YouTube title",
    "description": "YouTube description with chapters and CTAs (150-300 words)",
    "script_opening": "First 60 seconds of the video script",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
  }},
  "linkedin": {{
    "post": "Full LinkedIn post (150-300 words, professional tone, line breaks for readability)",
    "headline": "LinkedIn article headline if applicable"
  }},
  "instagram": {{
    "caption": "Instagram caption with emojis and clear CTA (100-150 words)",
    "hashtags": ["hashtag1", "hashtag2"],
    "story_hook": "One-line hook for Instagram Stories"
  }},
  "twitter": {{
    "thread": ["Tweet 1 (hook)", "Tweet 2", "Tweet 3", "Tweet 4", "Tweet 5 (CTA)"],
    "standalone_tweet": "Single impactful tweet if the idea fits in 280 characters"
  }},
  "blog": {{
    "title": "SEO blog post title",
    "meta_description": "150-character meta description",
    "intro_paragraph": "Compelling blog introduction (100-150 words)",
    "subheadings": ["H2 Section 1", "H2 Section 2", "H2 Section 3"]
  }},
  "podcast": {{
    "episode_title": "Podcast episode title",
    "show_notes": "Episode show notes (100-200 words)",
    "intro_script": "Host intro script (30-60 seconds)",
    "key_takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
  }}
}}"""
