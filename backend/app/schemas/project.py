"""
Pydantic schemas for the Projects API (Phase 4).

Separating schemas from ORM models keeps the API contract stable
independently of database implementation details.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


# ── Shared section types ───────────────────────────────────────────────────────

class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500, description="Project display name")
    idea: str = Field(..., min_length=20, max_length=5000, description="Original creative idea")
    goal: str = Field(..., description="Creative goal identifier")
    platform: str = Field(..., description="Target platform")
    length: str = Field(..., pattern="^(short|medium|long)$", description="Content length")


# ── Create ─────────────────────────────────────────────────────────────────────

class ProjectCreate(ProjectBase):
    """Payload for POST /api/projects — saves a generation result."""
    analysis:             dict[str, Any] = Field(default_factory=dict)
    brainstorm:           list[Any]      = Field(default_factory=list)
    recommended_direction: dict[str, Any] = Field(default_factory=dict)
    content:              dict[str, Any] = Field(default_factory=dict)
    adaptations:          dict[str, Any] = Field(default_factory=dict)
    creative_suggestions: dict[str, Any] = Field(default_factory=dict)


# ── Update ─────────────────────────────────────────────────────────────────────

class ProjectUpdate(BaseModel):
    """Payload for PUT /api/projects/{id} — all fields optional (PATCH semantics)."""
    title:                str | None            = Field(None, min_length=1, max_length=500)
    analysis:             dict[str, Any] | None = None
    brainstorm:           list[Any] | None      = None
    recommended_direction: dict[str, Any] | None = None
    content:              dict[str, Any] | None = None
    adaptations:          dict[str, Any] | None = None
    creative_suggestions: dict[str, Any] | None = None


# ── Response ───────────────────────────────────────────────────────────────────

class ProjectResponse(ProjectBase):
    """Full project object returned to the client."""
    id:         str
    word_count: int
    created_at: datetime
    updated_at: datetime

    analysis:              dict[str, Any]
    brainstorm:            list[Any]
    recommended_direction: dict[str, Any]
    content:               dict[str, Any]
    adaptations:           dict[str, Any]
    creative_suggestions:  dict[str, Any]

    model_config = {"from_attributes": True}


class ProjectSummary(BaseModel):
    """Lightweight card representation for the dashboard list."""
    id:         str
    title:      str
    platform:   str
    goal:       str
    length:     str
    word_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Statistics ─────────────────────────────────────────────────────────────────

class ProjectStats(BaseModel):
    total_projects:       int
    total_words:          int
    platforms_used:       list[str]
    last_generation_date: datetime | None


# ── List response ──────────────────────────────────────────────────────────────

class ProjectListResponse(BaseModel):
    projects: list[ProjectSummary]
    total:    int
    page:     int
    per_page: int
    stats:    ProjectStats
