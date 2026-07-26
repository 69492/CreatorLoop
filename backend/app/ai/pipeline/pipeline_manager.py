"""
Pipeline Manager — orchestrates the full creative workflow.

Execution order (Phase 3 will fill in actual AI calls):
  1. Idea Analysis
  2. Brainstorm
  3. Creative Direction
  4. Content Development
  5. Platform Adaptation
  6. Creative Suggestions
  7. Final Response assembly
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any

from app.ai.client import AIClient
from app.core.logging import get_logger

logger = get_logger(__name__)


class PipelineStage(str, Enum):
    IDEA_ANALYSIS = "idea_analysis"
    BRAINSTORM = "brainstorm"
    CREATIVE_DIRECTION = "creative_direction"
    CONTENT_DEVELOPMENT = "content_development"
    PLATFORM_ADAPTATION = "platform_adaptation"
    CREATIVE_SUGGESTIONS = "creative_suggestions"
    FINAL_RESPONSE = "final_response"


@dataclass
class PipelineContext:
    """Mutable state passed through the pipeline."""
    idea: str
    goal: str
    platform: str
    length: str
    outputs: dict[str, Any] = field(default_factory=dict)
    current_stage: PipelineStage = PipelineStage.IDEA_ANALYSIS
    completed: bool = False


class PipelineManager:
    """
    Orchestrates the end-to-end creative pipeline.
    Stage execution is gated on AI availability (Phase 3).
    """

    STAGE_ORDER: list[PipelineStage] = [
        PipelineStage.IDEA_ANALYSIS,
        PipelineStage.BRAINSTORM,
        PipelineStage.CREATIVE_DIRECTION,
        PipelineStage.CONTENT_DEVELOPMENT,
        PipelineStage.PLATFORM_ADAPTATION,
        PipelineStage.CREATIVE_SUGGESTIONS,
        PipelineStage.FINAL_RESPONSE,
    ]

    def __init__(self, ai_client: AIClient) -> None:
        self._client = ai_client

    async def run(self, context: PipelineContext) -> PipelineContext:
        """
        Execute the pipeline for the given context.
        Raises NotImplementedError until Phase 3 AI integration.
        """
        logger.info(
            "Pipeline started — idea='%s' goal=%s platform=%s length=%s",
            context.idea[:40],
            context.goal,
            context.platform,
            context.length,
        )

        for stage in self.STAGE_ORDER:
            context.current_stage = stage
            logger.debug("Pipeline stage: %s", stage.value)
            # Each stage will call its corresponding service in Phase 3.
            # For now, record that the stage was reached.
            context.outputs[stage.value] = None

        context.completed = True
        logger.info("Pipeline architecture validated — no AI provider connected yet.")
        return context

    def get_stage_labels(self) -> list[str]:
        """Return human-readable stage labels for the UI."""
        return [stage.value.replace("_", " ").title() for stage in self.STAGE_ORDER]
