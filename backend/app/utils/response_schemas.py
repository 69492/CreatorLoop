"""
Pydantic v2 validation models for the complete CreatorLoop AI response.

These models serve two purposes:
    1. Runtime validation — reject or coerce responses with wrong shapes.
    2. Documentation — make the expected contract explicit and IDE-navigable.

Usage:
    from app.utils.response_schemas import CreatorLoopResponse, validate_response

    validated = validate_response(raw_dict)          # raises on hard failures
    # or
    result, errors = validate_response_safe(raw_dict) # never raises
"""
from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator

from app.core.logging import get_logger

logger = get_logger(__name__)


# ── Section models ─────────────────────────────────────────────────────────────

class AnalysisSection(BaseModel):
    topic:    str = Field(default="", description="Core topic in one sentence")
    audience: str = Field(default="", description="Target audience description")
    purpose:  str = Field(default="", description="Primary purpose of the content")
    tone:     str = Field(default="", description="Recommended tone")
    keywords: list[str] = Field(default_factory=list, description="5 relevant keywords")

    @field_validator("keywords", mode="before")
    @classmethod
    def coerce_keywords(cls, v: Any) -> list[str]:
        """Accept a comma-separated string as well as a proper list."""
        if isinstance(v, str):
            return [kw.strip() for kw in v.split(",") if kw.strip()]
        if isinstance(v, list):
            return [str(item) for item in v]
        return []


class BrainstormConcept(BaseModel):
    title:       str = Field(default="", description="Concept title")
    hook:        str = Field(default="", description="Opening hook sentence")
    description: str = Field(default="", description="What makes this angle unique")


class RecommendedDirection(BaseModel):
    title:  str = Field(default="", description="Chosen concept title")
    reason: str = Field(default="", description="Why this is the strongest direction")


class ContentSection(BaseModel):
    title:   str       = Field(default="", description="Final polished title")
    outline: list[str] = Field(default_factory=list, description="Section headings")
    draft:   str       = Field(default="", description="Full content draft")

    @field_validator("outline", mode="before")
    @classmethod
    def coerce_outline(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            return [line.strip() for line in v.splitlines() if line.strip()]
        if isinstance(v, list):
            return [str(item) for item in v]
        return []


class AdaptationsSection(BaseModel):
    youtube:   str = Field(default="", description="YouTube description")
    linkedin:  str = Field(default="", description="LinkedIn post")
    instagram: str = Field(default="", description="Instagram caption")
    twitter:   str = Field(default="", description="Twitter/X thread")
    blog:      str = Field(default="", description="Blog introduction")
    podcast:   str = Field(default="", description="Podcast intro script")


class CreativeSuggestionsSection(BaseModel):
    seo_keywords:     list[str] = Field(default_factory=list, description="SEO keywords")
    cta:              str       = Field(default="", description="Call to action")
    thumbnail_ideas:  list[str] = Field(default_factory=list, description="Thumbnail concepts")
    improvements:     list[str] = Field(default_factory=list, description="Improvement tips")

    @field_validator("seo_keywords", "thumbnail_ideas", "improvements", mode="before")
    @classmethod
    def coerce_string_list(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            return [item.strip() for item in v.split(",") if item.strip()]
        if isinstance(v, list):
            return [str(item) for item in v]
        return []


# ── Root model ─────────────────────────────────────────────────────────────────

class CreatorLoopResponse(BaseModel):
    """
    Complete shape of the JSON object produced by a single Groq creative call.

    All sections have safe defaults so that a partial response can still be
    returned to the frontend rather than causing a hard 500 error.
    """

    analysis:             AnalysisSection          = Field(default_factory=AnalysisSection)
    brainstorm:           list[BrainstormConcept]  = Field(default_factory=list)
    recommended_direction: RecommendedDirection    = Field(default_factory=RecommendedDirection)
    content:              ContentSection            = Field(default_factory=ContentSection)
    adaptations:          AdaptationsSection        = Field(default_factory=AdaptationsSection)
    creative_suggestions: CreativeSuggestionsSection = Field(
        default_factory=CreativeSuggestionsSection
    )

    @model_validator(mode="before")
    @classmethod
    def accept_extra_keys(cls, data: Any) -> Any:
        """Silently drop unknown keys instead of raising a validation error."""
        if isinstance(data, dict):
            known = {
                "analysis", "brainstorm", "recommended_direction",
                "content", "adaptations", "creative_suggestions",
            }
            return {k: v for k, v in data.items() if k in known}
        return data

    @field_validator("brainstorm", mode="before")
    @classmethod
    def coerce_brainstorm(cls, v: Any) -> list[dict]:
        """Accept a single dict wrapped in a list or None."""
        if v is None:
            return []
        if isinstance(v, dict):
            return [v]
        if isinstance(v, list):
            return v
        return []

    def to_dict(self) -> dict[str, Any]:
        """Return a plain dict representation (Pydantic v2 compatible)."""
        return self.model_dump()


# ── Validation helpers ─────────────────────────────────────────────────────────

def validate_response(data: dict[str, Any]) -> dict[str, Any]:
    """
    Validate *data* against CreatorLoopResponse.

    Returns the validated, normalised dict on success.
    Raises ValueError with field-level details on validation failure.
    """
    try:
        model = CreatorLoopResponse.model_validate(data)
        return model.to_dict()
    except Exception as exc:
        raise ValueError(f"Response validation failed: {exc}") from exc


def validate_response_safe(
    data: dict[str, Any],
) -> tuple[dict[str, Any], list[str]]:
    """
    Validate *data* without raising.

    Returns:
        (validated_dict, errors)
        - validated_dict: best-effort normalised dict (may use defaults for missing fields)
        - errors: list of human-readable validation error strings (empty on clean pass)
    """
    errors: list[str] = []
    try:
        model = CreatorLoopResponse.model_validate(data)
        return model.to_dict(), errors
    except Exception as exc:
        errors.append(str(exc))
        logger.warning("validate_response_safe: validation errors — %s", errors)
        # Return raw data so the caller still has something usable
        return data, errors
