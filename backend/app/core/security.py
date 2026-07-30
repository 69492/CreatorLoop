"""
Security utilities: Argon2id password hashing and JWT handling.

Password hashing strategy
--------------------------
- New hashes: Argon2id via argon2-cffi (OWASP recommended, 2024).
- Legacy verify: bcrypt hashes (starting with "$2b$" or "$2a$") are verified
  transparently via passlib so existing accounts continue to work.
- bcrypt pin: requires bcrypt==4.0.1 (bcrypt >=4.1.x removed __about__ which
  breaks passlib 1.7.4's version probe; bcrypt 5.x also enforces a hard 72-byte
  password limit that triggers a ValueError in passlib's wrap-bug detection).

JWT
---
- Algorithm: HS256 via python-jose[cryptography].
- Token payload: { sub: user_id, iat: ..., exp: ... }
"""
from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt

from app.core.config import settings

# ── Argon2id — primary hasher ──────────────────────────────────────────────────

try:
    from argon2 import PasswordHasher, exceptions as _argon2_exc

    _argon2_hasher = PasswordHasher(
        # OWASP 2023 recommended minimums (time_cost=3, memory_cost=64 MiB)
        time_cost=3,
        memory_cost=65536,  # 64 MiB
        parallelism=4,
        hash_len=32,
        salt_len=16,
    )
    _ARGON2_AVAILABLE = True
except ImportError:  # pragma: no cover
    _ARGON2_AVAILABLE = False
    _argon2_hasher = None  # type: ignore[assignment]
    _argon2_exc = None  # type: ignore[assignment]

# ── passlib bcrypt — legacy verify only ───────────────────────────────────────

try:
    from passlib.context import CryptContext as _CryptContext

    _bcrypt_ctx = _CryptContext(schemes=["bcrypt"], deprecated="auto")
    _BCRYPT_AVAILABLE = True
except Exception:  # pragma: no cover
    _BCRYPT_AVAILABLE = False
    _bcrypt_ctx = None  # type: ignore[assignment]

# ── Password validation constants ─────────────────────────────────────────────

PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 64  # Well below bcrypt's 72-byte hard limit

_BCRYPT_HASH_RE = re.compile(r"^\$2[ab]?\$")


# ── Public API ─────────────────────────────────────────────────────────────────

def validate_password_strength(password: str) -> None:
    """
    Raise ValueError with a user-facing message when the password does not
    meet minimum requirements.  Called by the Pydantic schema validator so
    the error surfaces as an HTTP 422 before any hashing occurs.
    """
    length = len(password)
    if length < PASSWORD_MIN_LENGTH:
        raise ValueError(
            f"Password must be at least {PASSWORD_MIN_LENGTH} characters long."
        )
    if length > PASSWORD_MAX_LENGTH:
        raise ValueError(
            f"Password must be no longer than {PASSWORD_MAX_LENGTH} characters."
        )


def hash_password(password: str) -> str:
    """
    Hash *password* with Argon2id.  Raises RuntimeError if argon2-cffi is not
    installed (should never happen in a correctly configured environment).
    """
    if not _ARGON2_AVAILABLE:  # pragma: no cover
        raise RuntimeError(
            "argon2-cffi is not installed. "
            "Run: pip install 'argon2-cffi>=23.1.0'"
        )
    # Enforce length limit before hashing (Pydantic schemas call this too, but
    # be defensive here to prevent truncation-based attacks on any code path).
    if len(password) > PASSWORD_MAX_LENGTH:
        raise ValueError(
            f"Password exceeds maximum allowed length of {PASSWORD_MAX_LENGTH} characters."
        )
    return _argon2_hasher.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """
    Verify *plain* against *hashed*.

    Routing logic:
    - Argon2 hashes (start with ``$argon2``): verified by argon2-cffi.
    - Legacy bcrypt hashes (``$2b$`` / ``$2a$``): verified by passlib.
    - Unknown prefix: returns False (never raises).
    """
    try:
        if hashed.startswith("$argon2"):
            if not _ARGON2_AVAILABLE:
                return False
            try:
                return _argon2_hasher.verify(hashed, plain)
            except _argon2_exc.VerifyMismatchError:
                return False
            except _argon2_exc.VerificationError:
                return False
            except _argon2_exc.InvalidHashError:
                return False

        if _BCRYPT_HASH_RE.match(hashed):
            if not _BCRYPT_AVAILABLE:
                return False
            return _bcrypt_ctx.verify(plain, hashed)

    except Exception:  # pragma: no cover — safety net, never propagate
        return False

    return False


def needs_rehash(hashed: str) -> bool:
    """
    Return True when the stored hash was created with bcrypt (legacy) so the
    caller can transparently upgrade it to Argon2id on next successful login.
    """
    return bool(_BCRYPT_HASH_RE.match(hashed))


# ── JWT ────────────────────────────────────────────────────────────────────────

def create_access_token(
    user_id: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Encode a signed JWT containing the user's UUID as the ``sub`` claim.
    Default expiry is driven by ``settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES``.
    """
    now = datetime.now(timezone.utc)
    expire = now + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload: dict = {
        "sub": user_id,
        "iat": now,
        "exp": expire,
        "type": "access",
    }
    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_token(token: str) -> Optional[str]:
    """
    Decode *token* and return the ``sub`` claim (user UUID), or ``None`` if
    the token is expired, malformed, or has an invalid signature.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        sub: Optional[str] = payload.get("sub")
        return sub
    except JWTError:
        return None
