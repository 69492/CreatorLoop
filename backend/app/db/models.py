"""
SQLAlchemy ORM models — Projects.

Compatible with both SQLite (development) and PostgreSQL (production).
JSON columns use sqlalchemy.types.JSON which maps to:
  - TEXT (JSON-encoded) on SQLite
  - JSONB on PostgreSQL (via dialect negotiation)
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Project(Base):
    __tablename__ = "projects"

    # ── Identity ───────────────────────────────────────────────────────────────
    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    # ── Ownership ──────────────────────────────────────────────────────────────
    user_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    # ── User-facing fields ─────────────────────────────────────────────────────
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    idea: Mapped[str] = mapped_column(Text, nullable=False)
    goal: Mapped[str] = mapped_column(String(100), nullable=False)
    platform: Mapped[str] = mapped_column(String(100), nullable=False)
    length: Mapped[str] = mapped_column(String(20), nullable=False)

    # ── AI-generated content (database-agnostic JSON) ──────────────────────────
    analysis: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    brainstorm: Mapped[list | None] = mapped_column(JSON, nullable=True)
    recommended_direction: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    content: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    adaptations: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    creative_suggestions: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # ── Statistics ─────────────────────────────────────────────────────────────
    word_count: Mapped[int] = mapped_column(Integer, default=0)

    # ── Timestamps ─────────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_utcnow,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_utcnow,
        onupdate=_utcnow,
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Project id={self.id!r} title={self.title!r}>"
