"""
AI diagnostic endpoints.
"""
from fastapi import APIRouter

from app.ai.client import ai_client
from app.core.config import settings

router = APIRouter()


@router.get(
    "/ai/test",
    summary="AI Provider Test",
    description="Returns current provider status, model name, and configuration state.",
    tags=["AI"],
)
async def ai_test() -> dict:
    return {
        "status": "connected" if ai_client.is_ready else "not_configured",
        "provider": "Groq",
        "model": settings.MODEL_NAME,
        "ai_configured": settings.ai_configured,
    }
