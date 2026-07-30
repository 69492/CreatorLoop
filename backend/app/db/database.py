"""
Async SQLAlchemy database setup for CreatorLoop.

Supports SQLite (development) and PostgreSQL (production) via DATABASE_URL.
Switching databases only requires changing the DATABASE_URL environment variable.

Development:  sqlite+aiosqlite:///./creatorloop.db
Production:   postgresql+asyncpg://user:pass@host/dbname
Neon:         postgresql+asyncpg://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
"""
from __future__ import annotations

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


# ── Engine factory ──────────────────────────────────────────────────────────────

def _build_engine_kwargs() -> dict:
    """
    Build engine kwargs appropriate for the configured database backend.
    SQLite needs check_same_thread=False; PostgreSQL needs pool settings.
    """
    url = settings.DATABASE_URL

    if url.startswith("sqlite"):
        return {
            "connect_args": {"check_same_thread": False},
            "echo": settings.DB_ECHO,
        }

    # PostgreSQL / asyncpg
    return {
        "echo": settings.DB_ECHO,
        "pool_size": settings.DB_POOL_SIZE,
        "max_overflow": settings.DB_MAX_OVERFLOW,
        "pool_pre_ping": True,        # detect stale connections
        "pool_recycle": 3600,         # recycle connections after 1 hour
    }


engine = create_async_engine(settings.DATABASE_URL, **_build_engine_kwargs())

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ── Base ───────────────────────────────────────────────────────────────────────

class Base(DeclarativeBase):
    pass


# ── Dependency ─────────────────────────────────────────────────────────────────

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields an async session per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# ── Initialisation ─────────────────────────────────────────────────────────────

async def init_db() -> None:
    """
    Create all tables if they don't already exist.

    This is used for development (SQLite auto-migration).
    In production with PostgreSQL, use Alembic migrations instead.
    """
    from app.db import models       # noqa: F401
    from app.db import user_models  # noqa: F401

    db_url = settings.DATABASE_URL
    is_sqlite = db_url.startswith("sqlite")

    if is_sqlite:
        # Auto-create tables for SQLite development
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database initialised (SQLite auto-schema) — url=%s", db_url)
    else:
        # For PostgreSQL: rely on Alembic migrations
        # Tables should already exist after `alembic upgrade head`
        logger.info("Database connected (PostgreSQL) — url=%s", _redact_url(db_url))


def _redact_url(url: str) -> str:
    """Redact password from a database URL for safe logging."""
    try:
        from urllib.parse import urlparse, urlunparse
        parsed = urlparse(url)
        if parsed.password:
            netloc = f"{parsed.username}:***@{parsed.hostname}"
            if parsed.port:
                netloc += f":{parsed.port}"
            return urlunparse(parsed._replace(netloc=netloc))
    except Exception:
        pass
    return url[:30] + "..." if len(url) > 30 else url
