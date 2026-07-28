from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.health import router as health_router
from app.api.workspace import router as workspace_router
from app.api.ai import router as ai_router
from app.api.projects import router as projects_router
from app.ai.client import ai_client
from app.ai.providers.groq_provider import GroqProvider
from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.db.database import init_db
from app.middleware.exception_handler import global_exception_handler
from app.middleware.logging import RequestLoggingMiddleware

# ── Logging ─────────────────────────────────────────────────────────────────
setup_logging(debug=settings.DEBUG)
_log = get_logger(__name__)

# ── AI Provider Registration ──────────────────────────────────────────────────
if settings.ai_configured:
    ai_client.register_provider(
        GroqProvider(
            api_key=settings.GROQ_API_KEY,
            model_name=settings.MODEL_NAME,
            temperature=settings.TEMPERATURE,
            max_output_tokens=settings.MAX_OUTPUT_TOKENS,
        )
    )
    _log.info(
        "GroqProvider registered — model=%s", settings.MODEL_NAME
    )
else:
    _log.warning(
        "GROQ_API_KEY is not set — AI generation endpoints will return 503. "
        "Set GROQ_API_KEY in backend/.env to enable AI features."
    )

# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup tasks before serving requests."""
    await init_db()
    _log.info("CreatorLoop API ready")
    yield


# ── Application ──────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── Middleware ────────────────────────────────────────────────────────────────
app.add_middleware(RequestLoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Exception handlers ────────────────────────────────────────────────────────
app.add_exception_handler(Exception, global_exception_handler)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(health_router, prefix=settings.API_PREFIX)
app.include_router(workspace_router, prefix=settings.API_PREFIX)
app.include_router(ai_router, prefix=settings.API_PREFIX)
app.include_router(projects_router, prefix=settings.API_PREFIX)
