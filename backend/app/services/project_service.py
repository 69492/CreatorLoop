"""
Project CRUD service — Phase 4.

All database interactions go through this service so that endpoints stay thin.
Uses async SQLAlchemy 2.0 ORM operations.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import func, select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectStats
from app.core.logging import get_logger

logger = get_logger(__name__)


def _count_words(data: dict[str, Any] | None) -> int:
    """Estimate word count from the content.draft field."""
    if not data:
        return 0
    draft = data.get("draft", "")
    if not isinstance(draft, str):
        return 0
    return len(draft.split())


# ── Read ───────────────────────────────────────────────────────────────────────

async def get_projects(
    db: AsyncSession,
    *,
    search: str | None = None,
    platform: str | None = None,
    sort_by: str = "updated_at",
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[Project], int]:
    """
    Return paginated projects with optional search and filter.

    Returns:
        (list of Project ORM objects, total count matching the filter)
    """
    query = select(Project)

    # ── Filters ────────────────────────────────────────────────────────────────
    if search:
        term = f"%{search.lower()}%"
        query = query.where(
            func.lower(Project.title).like(term)
            | func.lower(Project.idea).like(term)
            | func.lower(Project.platform).like(term)
        )
    if platform:
        query = query.where(Project.platform == platform)

    # ── Count before pagination ────────────────────────────────────────────────
    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    # ── Sorting ────────────────────────────────────────────────────────────────
    order_col = getattr(Project, sort_by, Project.updated_at)
    query = query.order_by(order_col.desc())

    # ── Pagination ─────────────────────────────────────────────────────────────
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    result = await db.execute(query)
    projects = list(result.scalars().all())

    logger.debug(
        "get_projects: found=%d total=%d search=%s platform=%s",
        len(projects), total, search, platform,
    )
    return projects, total


async def get_project(db: AsyncSession, project_id: str) -> Project | None:
    """Return a single project by ID, or None."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    return result.scalar_one_or_none()


async def get_stats(db: AsyncSession) -> ProjectStats:
    """Compute dashboard statistics from the projects table."""
    total_result = await db.execute(select(func.count(Project.id)))
    total = total_result.scalar_one()

    words_result = await db.execute(select(func.sum(Project.word_count)))
    total_words = words_result.scalar_one() or 0

    platforms_result = await db.execute(select(Project.platform).distinct())
    platforms_used = sorted(set(row[0] for row in platforms_result.all()))

    last_result = await db.execute(
        select(Project.created_at).order_by(Project.created_at.desc()).limit(1)
    )
    last_row = last_result.scalar_one_or_none()

    return ProjectStats(
        total_projects=total,
        total_words=total_words,
        platforms_used=platforms_used,
        last_generation_date=last_row,
    )


# ── Create ─────────────────────────────────────────────────────────────────────

async def create_project(db: AsyncSession, data: ProjectCreate) -> Project:
    """Persist a new project and return the ORM object."""
    project = Project(
        id=str(uuid.uuid4()),
        title=data.title,
        idea=data.idea,
        goal=data.goal,
        platform=data.platform,
        length=data.length,
        analysis=data.analysis,
        brainstorm=data.brainstorm,
        recommended_direction=data.recommended_direction,
        content=data.content,
        adaptations=data.adaptations,
        creative_suggestions=data.creative_suggestions,
        word_count=_count_words(data.content),
    )
    db.add(project)
    await db.flush()
    await db.refresh(project)
    logger.info("create_project: id=%s title=%r", project.id, project.title)
    return project


# ── Update ─────────────────────────────────────────────────────────────────────

async def update_project(
    db: AsyncSession, project: Project, data: ProjectUpdate
) -> Project:
    """Apply partial updates to an existing project."""
    changed = data.model_dump(exclude_none=True)
    for field, value in changed.items():
        setattr(project, field, value)

    # Re-compute word count if content was updated
    if "content" in changed:
        project.word_count = _count_words(changed["content"])

    project.updated_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(project)
    logger.info("update_project: id=%s fields=%s", project.id, list(changed.keys()))
    return project


# ── Delete ─────────────────────────────────────────────────────────────────────

async def delete_project(db: AsyncSession, project_id: str) -> None:
    """Hard-delete a project by ID."""
    await db.execute(delete(Project).where(Project.id == project_id))
    logger.info("delete_project: id=%s", project_id)


# ── Duplicate ─────────────────────────────────────────────────────────────────

async def duplicate_project(db: AsyncSession, project: Project) -> Project:
    """Clone a project with a new ID and '(Copy)' suffix on the title."""
    copy = Project(
        id=str(uuid.uuid4()),
        title=f"{project.title} (Copy)",
        idea=project.idea,
        goal=project.goal,
        platform=project.platform,
        length=project.length,
        analysis=project.analysis,
        brainstorm=project.brainstorm,
        recommended_direction=project.recommended_direction,
        content=project.content,
        adaptations=project.adaptations,
        creative_suggestions=project.creative_suggestions,
        word_count=project.word_count,
    )
    db.add(copy)
    await db.flush()
    await db.refresh(copy)
    logger.info("duplicate_project: original=%s copy=%s", project.id, copy.id)
    return copy
