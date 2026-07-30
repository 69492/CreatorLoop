"""
Authentication router — register, login, Google OAuth, profile endpoints.
"""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentUser, DbDep
from app.core.logging import get_logger
from app.core.security import (
    create_access_token,
    hash_password,
    needs_rehash,
    verify_password,
)
from app.db.user_models import User
from app.schemas.auth import (
    ChangePasswordRequest,
    GoogleAuthRequest,
    LoginRequest,
    MeResponse,
    RegisterRequest,
    TokenResponse,
    UpdateProfileRequest,
    UserResponse,
)

router = APIRouter(tags=["Auth"])
logger = get_logger(__name__)


# ── Register ────────────────────────────────────────────────────────────────────

@router.post(
    "/auth/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new account",
)
async def register(body: RegisterRequest, db: DbDep) -> TokenResponse:
    # Duplicate-email check
    existing = await db.execute(select(User).where(User.email == body.email.lower()))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        email=body.email.lower(),
        full_name=body.full_name,
        hashed_password=hash_password(body.password),
        is_verified=False,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    token = create_access_token(user.id)
    logger.info("register: new user id=%s email=%s", user.id, user.email)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


# ── Login ───────────────────────────────────────────────────────────────────────

@router.post(
    "/auth/login",
    response_model=TokenResponse,
    summary="Sign in with email and password",
)
async def login(body: LoginRequest, db: DbDep) -> TokenResponse:
    result = await db.execute(select(User).where(User.email == body.email.lower()))
    user = result.scalar_one_or_none()

    if not user or not user.hashed_password:
        # Use constant-time path to avoid timing-based account enumeration
        _dummy_verify(body.password)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated.",
        )

    # ── Transparent hash upgrade: bcrypt → Argon2id ─────────────────────────
    if needs_rehash(user.hashed_password):
        try:
            user.hashed_password = hash_password(body.password)
            await db.flush()
            logger.info("login: upgraded hash algorithm for user id=%s", user.id)
        except Exception as exc:  # pragma: no cover
            logger.warning("login: hash upgrade failed for user id=%s: %s", user.id, exc)

    token = create_access_token(user.id)
    logger.info("login: user id=%s", user.id)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


# ── Google OAuth ────────────────────────────────────────────────────────────────

@router.post(
    "/auth/google",
    response_model=TokenResponse,
    summary="Sign in / sign up with Google",
)
async def google_auth(body: GoogleAuthRequest, db: DbDep) -> TokenResponse:
    """
    Verifies a Google ID token sent from the frontend after Google Sign-In.
    Creates the user if first-time, otherwise returns the existing user.
    """
    from app.core.config import settings

    google_data = await _verify_google_token(body.credential, settings.GOOGLE_CLIENT_ID)
    if not google_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential.",
        )

    google_id = google_data["sub"]
    email = google_data.get("email", "").lower()
    full_name = google_data.get("name")
    avatar_url = google_data.get("picture")

    # Find existing user by google_id or email
    result = await db.execute(
        select(User).where(
            (User.google_id == google_id) | (User.email == email)
        )
    )
    user = result.scalar_one_or_none()

    if user:
        # Attach Google identity if this was an email-registered account
        if not user.google_id:
            user.google_id = google_id
        if not user.avatar_url and avatar_url:
            user.avatar_url = avatar_url
        if not user.full_name and full_name:
            user.full_name = full_name
        user.is_verified = True
        await db.flush()
        await db.refresh(user)
    else:
        user = User(
            email=email,
            full_name=full_name,
            avatar_url=avatar_url,
            google_id=google_id,
            is_verified=True,
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)

    token = create_access_token(user.id)
    logger.info("google_auth: user id=%s email=%s", user.id, user.email)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


# ── Me ──────────────────────────────────────────────────────────────────────────

@router.get(
    "/auth/me",
    response_model=MeResponse,
    summary="Get current user profile",
)
async def me(current_user: CurrentUser) -> MeResponse:
    return MeResponse.model_validate(current_user)


@router.put(
    "/auth/me",
    response_model=MeResponse,
    summary="Update profile",
)
async def update_me(
    body: UpdateProfileRequest,
    current_user: CurrentUser,
    db: DbDep,
) -> MeResponse:
    if body.full_name is not None:
        current_user.full_name = body.full_name
    if body.avatar_url is not None:
        current_user.avatar_url = body.avatar_url
    await db.flush()
    await db.refresh(current_user)
    return MeResponse.model_validate(current_user)


@router.post(
    "/auth/change-password",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Change password",
)
async def change_password(
    body: ChangePasswordRequest,
    current_user: CurrentUser,
    db: DbDep,
) -> None:
    if not current_user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No password set on this account. Use Google login.",
        )
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )
    # Always hash the new password with Argon2id regardless of previous algorithm
    current_user.hashed_password = hash_password(body.new_password)
    await db.flush()


# ── Helpers ─────────────────────────────────────────────────────────────────────

def _dummy_verify(password: str) -> None:
    """
    Perform a fake hash operation to prevent timing-based user-enumeration when
    no matching user is found (constant-time response).
    """
    try:
        hash_password(password)
    except Exception:
        pass


async def _verify_google_token(credential: str, client_id: str | None) -> dict | None:
    """
    Verify a Google credential with Google's public endpoints.

    Accepts two credential types produced by @react-oauth/google:
      - ID token (JWT)  — returned by <GoogleLogin> component (flow="implicit")
        Verified via: GET /tokeninfo?id_token=<token>
      - Access token    — returned by useGoogleLogin({ flow: "implicit" })
        Verified via: GET /oauth2/v3/userinfo  (Authorization: Bearer <token>)

    Both paths return a dict with at least: sub, email, name, picture.
    """
    try:
        import httpx
        async with httpx.AsyncClient(timeout=10) as client:

            # ── Strategy 1: try as an ID token (JWT) ──────────────────────
            id_resp = await client.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": credential},
            )
            if id_resp.status_code == 200:
                data = id_resp.json()
                # Validate audience claim when a client_id is configured
                if client_id and data.get("aud") != client_id:
                    logger.warning("Google token aud mismatch — expected %s got %s", client_id, data.get("aud"))
                    return None
                return data

            # ── Strategy 2: try as an access token ────────────────────────
            userinfo_resp = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {credential}"},
            )
            if userinfo_resp.status_code == 200:
                return userinfo_resp.json()

        return None

    except Exception as exc:
        logger.warning("Google token verification failed: %s", exc)
        return None
