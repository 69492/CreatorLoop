"""
Async SQLAlchemy database setup for CreatorLoop Phase 4.

Uses SQLite via aiosqlite as the database driver.
The database file is stored at backend/creatorloop.db (configurable via DB_URL).

Usage:
    from app.db.database import get_db, init_db

    # At startup:
    await init_db()

    # In endpoint dependencies:
    async def endpoint(db: AsyncSession = Depends(get_db)):
        ...
"""
from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# ── Engine ─────────────────────────────────────────────────────────────────────

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,          # set to True for SQL debugging
    connect_args={"check_same_thread": False},
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ── Base ───────────────────────────────────────────────────────────────────────

class Base(DeclarativeBase):
    pass


# ── Dependency ─────────────────────────────────────────────────────────────────

async def get_db():
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
    """Create all tables if they don't already exist."""
    # Import models so Base knows about them before create_all
    from app.db import models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    logger.info("Database initialised — url=%s", settings.DATABASE_URL)
