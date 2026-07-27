"""
Workspace API endpoints — Phase 3 implementation.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.ai.pipeline.pipeline_manager import PipelineContext, PipelineManager
from app.ai.providers.exceptions import AIProviderNotConfiguredError, AIProviderError
from app.ai.client import ai_client
from app.core.logging import get_logger

router = APIRouter()
logger = get_logger(__name__)
_pipeline = PipelineManager(ai_client)


# ── Request / Response Models ─────────────────────────────────────────────────

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


class GenerateRequest(BaseModel):
    idea: str = Field(..., min_length=20, max_length=5000)
    goal: str = Field(...)
    platform: str = Field(...)
    length: str = Field(..., pattern="^(short|medium|long)$")


class GenerateResponse(BaseModel):
    workflow_id: str
    generated_at: str
    analysis: dict
    brainstorm: list
    recommended_direction: dict
    content: dict
    adaptations: dict
    creative_suggestions: dict


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post(
    "/workspace/create",
    response_model=CreateWorkspaceResponse,
    summary="Initialize Creative Workspace",
    tags=["Workspace"],
)
async def create_workspace(body: CreateWorkspaceRequest) -> CreateWorkspaceResponse:
    """Validate the request and return pipeline metadata (no AI call)."""
    logger.info(
        "Workspace create — goal=%s platform=%s length=%s", body.goal, body.platform, body.length
    )
    return CreateWorkspaceResponse(
        status="accepted",
        message="Workspace initialised. Call /api/workspace/generate to start AI collaboration.",
        workflow_id=str(uuid.uuid4()),
        accepted_at=datetime.now(timezone.utc).isoformat(),
        pipeline_stages=_pipeline.get_stage_labels(),
        ai_ready=ai_client.is_ready,
    )


@router.post(
    "/workspace/generate",
    response_model=GenerateResponse,
    summary="Run Full Creative Pipeline",
    description=(
        "Executes the full 6-stage creative pipeline using Google Gemini. "
        "Returns a complete structured creative package."
    ),
    tags=["Workspace"],
)
async def generate_content(body: GenerateRequest) -> GenerateResponse:
    """Run the full AI creative pipeline and return structured results."""
    logger.info(
        "Generate — goal=%s platform=%s length=%s idea_len=%d",
        body.goal, body.platform, body.length, len(body.idea),
    )

    if not ai_client.is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "AI provider is not configured. "
                "Please set GEMINI_API_KEY in your .env file and restart the server."
            ),
        )

    context = PipelineContext(
        idea=body.idea,
        goal=body.goal,
        platform=body.platform,
        length=body.length,
    )

    try:
        await _pipeline.run(context)
    except AIProviderNotConfiguredError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))
    except AIProviderError as exc:
        logger.error("AI provider error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI generation failed: {exc}",
        )
    except Exception as exc:
        logger.exception("Unexpected pipeline error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during content generation.",
        )

    return GenerateResponse(
        workflow_id=str(uuid.uuid4()),
        generated_at=datetime.now(timezone.utc).isoformat(),
        analysis=context.outputs.get("analysis", {}),
        brainstorm=context.outputs.get("brainstorm", []),
        recommended_direction=context.outputs.get("recommended_direction", {}),
        content=context.outputs.get("content", {}),
        adaptations=context.outputs.get("adaptations", {}),
        creative_suggestions=context.outputs.get("creative_suggestions", {}),
    )
