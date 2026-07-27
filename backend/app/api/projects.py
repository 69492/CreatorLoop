"""
Projects API router — Phase 4.

Endpoints:
    GET    /api/projects                    — list + search + filter + stats
    POST   /api/projects                    — save a new project
    GET    /api/projects/{id}               — get full project
    PUT    /api/projects/{id}               — update (auto-save compatible)
    DELETE /api/projects/{id}               — delete
    POST   /api/projects/{id}/duplicate     — clone project
    GET    /api/projects/export/{id}/{fmt}  — download as pdf | docx | markdown
"""
from __future__ import annotations

import io
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.project import (
    ProjectCreate,
    ProjectListResponse,
    ProjectResponse,
    ProjectSummary,
    ProjectUpdate,
)
from app.services import project_service
from app.services.export_service import export_project
from app.core.logging import get_logger

router = APIRouter(tags=["Projects"])
logger = get_logger(__name__)

DbDep = Annotated[AsyncSession, Depends(get_db)]


# ── List / Search ──────────────────────────────────────────────────────────────

@router.get(
    "/projects",
    response_model=ProjectListResponse,
    summary="List Projects",
)
async def list_projects(
    db: DbDep,
    search: str | None = Query(None, description="Search by title, idea, or platform"),
    platform: str | None = Query(None, description="Filter by platform"),
    sort_by: str = Query("updated_at", description="Sort field: updated_at | created_at"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
) -> ProjectListResponse:
    projects, total = await project_service.get_projects(
        db,
        search=search,
        platform=platform,
        sort_by=sort_by,
        page=page,
        per_page=per_page,
    )
    stats = await project_service.get_stats(db)
    return ProjectListResponse(
        projects=[ProjectSummary.model_validate(p) for p in projects],
        total=total,
        page=page,
        per_page=per_page,
        stats=stats,
    )


# ── Create ─────────────────────────────────────────────────────────────────────

@router.post(
    "/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save Project",
)
async def create_project(body: ProjectCreate, db: DbDep) -> ProjectResponse:
    project = await project_service.create_project(db, body)
    return ProjectResponse.model_validate(project)


# ── Read ───────────────────────────────────────────────────────────────────────

@router.get(
    "/projects/{project_id}",
    response_model=ProjectResponse,
    summary="Get Project",
)
async def get_project(project_id: str, db: DbDep) -> ProjectResponse:
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return ProjectResponse.model_validate(project)


# ── Update ─────────────────────────────────────────────────────────────────────

@router.put(
    "/projects/{project_id}",
    response_model=ProjectResponse,
    summary="Update Project (Auto-save)",
)
async def update_project(
    project_id: str, body: ProjectUpdate, db: DbDep
) -> ProjectResponse:
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    updated = await project_service.update_project(db, project, body)
    return ProjectResponse.model_validate(updated)


# ── Delete ─────────────────────────────────────────────────────────────────────

@router.delete(
    "/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Project",
)
async def delete_project(project_id: str, db: DbDep) -> None:
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    await project_service.delete_project(db, project_id)


# ── Duplicate ─────────────────────────────────────────────────────────────────

@router.post(
    "/projects/{project_id}/duplicate",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Duplicate Project",
)
async def duplicate_project(project_id: str, db: DbDep) -> ProjectResponse:
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    copy = await project_service.duplicate_project(db, project)
    return ProjectResponse.model_validate(copy)


# ── Export ─────────────────────────────────────────────────────────────────────

@router.get(
    "/projects/{project_id}/export/{fmt}",
    summary="Export Project",
    responses={
        200: {"description": "File download"},
        400: {"description": "Unsupported format"},
        404: {"description": "Project not found"},
    },
)
async def export_project_endpoint(
    project_id: str,
    fmt: str,
    db: DbDep,
) -> StreamingResponse:
    """Export a project as pdf, docx, or markdown."""
    if fmt not in ("pdf", "docx", "markdown"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported export format: {fmt!r}. Use pdf, docx, or markdown.",
        )
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    file_bytes, media_type, filename = export_project(project, fmt)
    return StreamingResponse(
        io.BytesIO(file_bytes),
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
