"""
Pydantic schemas for authentication endpoints.
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


# ── Request schemas ────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=64)
    full_name: Optional[str] = Field(None, max_length=255)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if len(v) > 64:
            raise ValueError("Password must be no longer than 64 characters.")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    # No length restriction on login — avoid leaking information about policy
    password: str = Field(..., min_length=1, max_length=128)


class GoogleAuthRequest(BaseModel):
    credential: str  # Google ID token (JWT)


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = Field(None, max_length=255)
    avatar_url: Optional[str] = Field(None, max_length=1024)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1, max_length=128)
    new_password: str = Field(..., min_length=8, max_length=64)

    @field_validator("new_password")
    @classmethod
    def new_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if len(v) > 64:
            raise ValueError("Password must be no longer than 64 characters.")
        return v


# ── Response schemas ───────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    is_verified: bool
    google_id: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MeResponse(UserResponse):
    pass
