from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "CreatorLoop"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "AI-powered Content Production Pipeline"
    CL_DEBUG: bool = False  # prefix avoids collision with system DEBUG env var

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # API
    API_PREFIX: str = "/api"

    @property
    def DEBUG(self) -> bool:
        return self.CL_DEBUG

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }


settings = Settings()
