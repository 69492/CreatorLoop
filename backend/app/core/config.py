"""
Application configuration via pydantic-settings.

All secrets are loaded from environment variables or a .env file.
Never hardcode secrets in this file — use .env or the deployment platform's
secret management.

Supported databases (change DATABASE_URL only):
  Development:  sqlite+aiosqlite:///./creatorloop.db
  Production:   postgresql+asyncpg://user:pass@host:5432/dbname
  Neon:         postgresql+asyncpg://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
"""
from __future__ import annotations

import secrets
from typing import List, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── Application ───────────────────────────────────────────────────────────
    APP_NAME: str = "CreatorLoop"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "AI-Powered Creative Content Platform"
    APP_ENV: str = "development"   # development | staging | production

    # ── Server ────────────────────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CL_DEBUG: bool = False

    # ── CORS ──────────────────────────────────────────────────────────────────
    # Production: set ALLOWED_ORIGINS as a comma-separated list in .env
    # e.g. ALLOWED_ORIGINS=https://creatorloop.vercel.app,https://creatorloop.ai
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # ── API ───────────────────────────────────────────────────────────────────
    API_PREFIX: str = "/api"

    # ── AI / Groq ─────────────────────────────────────────────────────────────
    GROQ_API_KEY: Optional[str] = None
    MODEL_NAME: str = "llama-3.3-70b-versatile"
    TEMPERATURE: float = 0.7
    MAX_OUTPUT_TOKENS: int = 2048

    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./creatorloop.db"
    DB_ECHO: bool = False          # set True to log all SQL queries
    DB_POOL_SIZE: int = 5          # PostgreSQL connection pool size
    DB_MAX_OVERFLOW: int = 10      # max connections above pool_size

    # ── Authentication / JWT ──────────────────────────────────────────────────
    # SECURITY: Always set JWT_SECRET_KEY in production.
    # Generate: python -c "import secrets; print(secrets.token_urlsafe(64))"
    JWT_SECRET_KEY: str = secrets.token_urlsafe(32)
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7   # 7 days
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ── Google OAuth ──────────────────────────────────────────────────────────
    # Get from: Google Cloud Console → APIs & Services → Credentials
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None

    # ── Security ──────────────────────────────────────────────────────────────
    # Rate limiting (requests per minute per IP, applied to auth endpoints)
    RATE_LIMIT_AUTH: int = 20
    RATE_LIMIT_API: int = 100

    # ── Demo Mode ─────────────────────────────────────────────────────────────
    DEMO_MODE: bool = False
    DEMO_EMAIL: str = "demo@creatorloop.ai"
    DEMO_PASSWORD: str = "demo-password-change-in-env"

    # ── Computed properties ───────────────────────────────────────────────────

    @property
    def DEBUG(self) -> bool:
        return self.CL_DEBUG

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def ai_configured(self) -> bool:
        return bool(self.GROQ_API_KEY)

    @property
    def is_postgres(self) -> bool:
        return self.DATABASE_URL.startswith("postgresql")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
