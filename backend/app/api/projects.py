"""
Projects API router with user ownership support.
"""
from __future__ import annotations

import io
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentUser, get_optional_user, DbDep
from app.db.database import get_db
from app.db.user_models import User
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

OptUserDep = Annotated[Optional[User], Depends(get_optional_user)]


# ── List / Search ──────────────────────────────────────────────────────────────

@router.get(
    "/projects",
    response_model=ProjectListResponse,
    summary="List Projects",
)
async def list_projects(
    db: DbDep,
    current_user: OptUserDep,
    search: str | None = Query(None),
    platform: str | None = Query(None),
    sort_by: str = Query("updated_at"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
) -> ProjectListResponse:
    user_id = current_user.id if current_user else None
    projects, total = await project_service.get_projects(
        db,
        user_id=user_id,
        search=search,  
        platform=platform,
        sort_by=sort_by,
        page=page,
        per_page=per_page,
    )
    stats = await project_service.get_stats(db, user_id=user_id)
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
async def create_project(body: ProjectCreate, db: DbDep, current_user: OptUserDep) -> ProjectResponse:
    user_id = current_user.id if current_user else None
    project = await project_service.create_project(db, body, user_id=user_id)
    return ProjectResponse.model_validate(project)


# ── Read ───────────────────────────────────────────────────────────────────────

@router.get(
    "/projects/{project_id}",
    response_model=ProjectResponse,
    summary="Get Project",
)
async def get_project(project_id: str, db: DbDep, current_user: OptUserDep) -> ProjectResponse:
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    _check_ownership(project, current_user)
    return ProjectResponse.model_validate(project)


# ── Update ─────────────────────────────────────────────────────────────────────

@router.put(
    "/projects/{project_id}",
    response_model=ProjectResponse,
    summary="Update Project",
)
async def update_project(
    project_id: str, body: ProjectUpdate, db: DbDep, current_user: OptUserDep
) -> ProjectResponse:
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    _check_ownership(project, current_user)
    updated = await project_service.update_project(db, project, body)
    return ProjectResponse.model_validate(updated)


# ── Delete ─────────────────────────────────────────────────────────────────────

@router.delete(
    "/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Project",
)
async def delete_project(project_id: str, db: DbDep, current_user: OptUserDep) -> None:
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    _check_ownership(project, current_user)
    await project_service.delete_project(db, project_id)


# ── Duplicate ─────────────────────────────────────────────────────────────────

@router.post(
    "/projects/{project_id}/duplicate",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Duplicate Project",
)
async def duplicate_project(project_id: str, db: DbDep, current_user: OptUserDep) -> ProjectResponse:
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    _check_ownership(project, current_user)
    user_id = current_user.id if current_user else None
    copy = await project_service.duplicate_project(db, project, user_id=user_id)
    return ProjectResponse.model_validate(copy)


# ── Export ─────────────────────────────────────────────────────────────────────

@router.get(
    "/projects/{project_id}/export/{fmt}",
    summary="Export Project",
)
async def export_project_endpoint(
    project_id: str, fmt: str, db: DbDep, current_user: OptUserDep
) -> StreamingResponse:
    if fmt not in ("pdf", "docx", "markdown"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unsupported format: {fmt!r}")
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    _check_ownership(project, current_user)
    file_bytes, media_type, filename = export_project(project, fmt)
    return StreamingResponse(
        io.BytesIO(file_bytes),
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ── Helper ─────────────────────────────────────────────────────────────────────

def _check_ownership(project, current_user: Optional[User]) -> None:
    """Allow access if project has no owner (legacy) or owner matches current user."""
    if project.user_id is None:
        return  # legacy project — accessible to all
    if current_user is None or project.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
