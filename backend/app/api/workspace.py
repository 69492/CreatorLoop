"""
Workspace API endpoints.
"""
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.ai.pipeline.pipeline_manager import PipelineContext, PipelineManager
from app.ai.client import ai_client
from app.core.logging import get_logger

router = APIRouter()
logger = get_logger(__name__)
_pipeline = PipelineManager(ai_client)


class CreateWorkspaceRequest(BaseModel):
    idea: str = Field(..., min_length=20, max_length=5000, description="The creative idea")
    goal: str = Field(..., description="Creative goal identifier")
    platform: str = Field(..., description="Target platform identifier")
    length: str = Field(..., pattern="^(short|medium|long)$", description="Content length")


class CreateWorkspaceResponse(BaseModel):
    status: str
    message: str
    workflow_id: str
    accepted_at: str
    pipeline_stages: list[str]
    ai_ready: bool


@router.post(
    "/workspace/create",
    response_model=CreateWorkspaceResponse,
    summary="Initialize Creative Workspace",
    description=(
        "Accepts a creative idea, goal, platform, and length. "
        "Validates the request and initialises the pipeline architecture. "
        "AI execution will be enabled in Phase 3."
    ),
    tags=["Workspace"],
)
async def create_workspace(body: CreateWorkspaceRequest) -> CreateWorkspaceResponse:
    logger.info(
        "Workspace create — goal=%s platform=%s length=%s idea_len=%d",
        body.goal,
        body.platform,
        body.length,
        len(body.idea),
    )

    import uuid
    workflow_id = str(uuid.uuid4())

    return CreateWorkspaceResponse(
        status="accepted",
        message="Workflow initialised. AI integration will be enabled in Phase 3.",
        workflow_id=workflow_id,
        accepted_at=datetime.now(timezone.utc).isoformat(),
        pipeline_stages=_pipeline.get_stage_labels(),
        ai_ready=ai_client.is_ready,
    )
