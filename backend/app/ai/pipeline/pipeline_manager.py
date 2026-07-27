"""
Pipeline Manager — single-call architecture (Groq migration).

ONE Groq request replaces six sequential AI calls.
The pipeline manager now calls CreativeWorkflowService once, receives the full
structured JSON, and writes every section into PipelineContext.outputs.

The STAGE_ORDER enum and PipelineContext dataclass are preserved so that the
workspace API and frontend pipeline-progress animation continue to work without
any changes to routes or contracts.
"""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Any

from app.ai.client import AIClient
from app.ai.services.creative_services import CreativeWorkflowService
from app.core.logging import get_logger

logger = get_logger(__name__)


class PipelineStage(str, Enum):
    IDEA_ANALYSIS = "idea_analysis"
    BRAINSTORM = "brainstorm"
    CREATIVE_DIRECTION = "creative_direction"
    CONTENT_DEVELOPMENT = "content_development"
    PLATFORM_ADAPTATION = "platform_adaptation"
    CREATIVE_SUGGESTIONS = "creative_suggestions"


@dataclass
class PipelineContext:
    """Input parameters + mutable outputs for a single pipeline run."""
    idea: str
    goal: str
    platform: str
    length: str
    outputs: dict[str, Any] = field(default_factory=dict)
    current_stage: PipelineStage = PipelineStage.IDEA_ANALYSIS
    completed: bool = False
    error: str | None = None


class PipelineManager:
    """
    Orchestrates the creative pipeline via a single Groq API call.

    One request → full structured JSON → outputs written to PipelineContext.
    The stage-order list is kept intact for UI compatibility.
    """

    STAGE_ORDER: list[PipelineStage] = [
        PipelineStage.IDEA_ANALYSIS,
        PipelineStage.BRAINSTORM,
        PipelineStage.CREATIVE_DIRECTION,
        PipelineStage.CONTENT_DEVELOPMENT,
        PipelineStage.PLATFORM_ADAPTATION,
        PipelineStage.CREATIVE_SUGGESTIONS,
    ]

    def __init__(self, client: AIClient) -> None:
        self._client = client
        self._workflow = CreativeWorkflowService(client)

    async def run(self, context: PipelineContext) -> PipelineContext:
        """
        Execute the full creative pipeline in ONE AI request.

        On success, context.outputs contains all six sections and
        context.completed is set to True.
        """
        logger.info(
            "Pipeline started (single-call) — idea='%s…' goal=%s platform=%s length=%s",
            context.idea[:50],
            context.goal,
            context.platform,
            context.length,
        )

        t0 = time.perf_counter()

        try:
            # ── Single AI call returns all six sections ────────────────────────
            context.current_stage = PipelineStage.IDEA_ANALYSIS
            result = await self._workflow.generate(
                idea=context.idea,
                goal=context.goal,
                platform=context.platform,
                length=context.length,
            )

            # ── Write each section to outputs ──────────────────────────────────
            context.outputs["analysis"] = result.get("analysis", {})
            context.outputs["brainstorm"] = result.get("brainstorm", [])
            context.outputs["recommended_direction"] = result.get("recommended_direction", {})
            context.outputs["content"] = result.get("content", {})
            context.outputs["adaptations"] = result.get("adaptations", {})
            context.outputs["creative_suggestions"] = result.get("creative_suggestions", {})

            context.current_stage = PipelineStage.CREATIVE_SUGGESTIONS
            context.completed = True

            elapsed = (time.perf_counter() - t0) * 1000
            logger.info("Pipeline completed — %.0fms (single Groq call)", elapsed)

        except Exception as exc:
            context.error = str(exc)
            elapsed = (time.perf_counter() - t0) * 1000
            logger.error(
                "Pipeline failed at stage %s after %.0fms: %s",
                context.current_stage,
                elapsed,
                exc,
            )
            raise

        return context

    def get_stage_labels(self) -> list[str]:
        """Return UI-friendly stage labels (unchanged for frontend compatibility)."""
        return [stage.value.replace("_", " ").title() for stage in self.STAGE_ORDER]
