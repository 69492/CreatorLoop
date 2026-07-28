"""
End-to-end verification of the auth security layer.
Run from the backend/ directory:
    python tests/test_security.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-ci-only")

from app.core.security import (
    hash_password, verify_password, needs_rehash,
    create_access_token, decode_token,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH,
    validate_password_strength,
)

# ── 1. Import ──────────────────────────────────────────────────────────────────
print("PASS: security module imports cleanly")

# ── 2. Argon2id hashing ────────────────────────────────────────────────────────
h = hash_password("Hunter2@secure")
assert h.startswith("$argon2id"), f"Expected argon2id prefix, got: {h[:20]}"
print(f"PASS: hash_password -> argon2id prefix, len={len(h)}")

# ── 3. Argon2 verify correct ───────────────────────────────────────────────────
assert verify_password("Hunter2@secure", h), "correct password should verify"
print("PASS: verify_password(correct) -> True")

# ── 4. Argon2 verify wrong ────────────────────────────────────────────────────
assert not verify_password("wrong_password", h), "wrong password should fail"
print("PASS: verify_password(wrong) -> False")

# ── 5. needs_rehash ───────────────────────────────────────────────────────────
assert not needs_rehash(h), "fresh argon2 hash should not need rehash"
# Simulate a passlib-style bcrypt hash prefix
fake_bcrypt = "$2b$12$" + "x" * 53
assert needs_rehash(fake_bcrypt), "bcrypt hash should need rehash"
print("PASS: needs_rehash works correctly")

# ── 6. validate_password_strength ─────────────────────────────────────────────
try:
    validate_password_strength("short")
    assert False, "should have raised"
except ValueError as e:
    assert "8" in str(e)
    print("PASS: validate_password_strength rejects too-short password")

try:
    validate_password_strength("x" * 65)
    assert False, "should have raised"
except ValueError as e:
    assert "64" in str(e)
    print("PASS: validate_password_strength rejects too-long password")

validate_password_strength("exactly8")
print("PASS: validate_password_strength accepts 8-char password")

# ── 7. hash_password enforces max length ──────────────────────────────────────
try:
    hash_password("x" * 65)
    assert False, "should have raised"
except ValueError:
    print("PASS: hash_password rejects password > 64 chars")

# ── 8. Legacy bcrypt verify (passlib path) ────────────────────────────────────
from passlib.context import CryptContext
bcrypt_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
legacy_hash = bcrypt_ctx.hash("legacy_password")
assert legacy_hash.startswith("$2b$"), f"Expected bcrypt hash, got {legacy_hash[:20]}"
assert verify_password("legacy_password", legacy_hash), "legacy bcrypt should verify"
assert not verify_password("wrong", legacy_hash), "wrong pwd should fail for bcrypt"
print("PASS: legacy bcrypt verify via passlib works")

# ── 9. JWT round-trip ─────────────────────────────────────────────────────────
import uuid
uid = str(uuid.uuid4())
token = create_access_token(uid)
assert isinstance(token, str) and len(token) > 20
decoded_uid = decode_token(token)
assert decoded_uid == uid, f"JWT round-trip failed: {decoded_uid!r} != {uid!r}"
print(f"PASS: JWT create + decode round-trip ok (uid={uid[:8]}...)")

# ── 10. decode_token returns None for bad tokens ──────────────────────────────
assert decode_token("not.a.valid.jwt") is None
assert decode_token("") is None
print("PASS: decode_token returns None for invalid tokens")

# ── 11. Pydantic schemas ──────────────────────────────────────────────────────
from app.schemas.auth import RegisterRequest, LoginRequest, ChangePasswordRequest
from pydantic import ValidationError

# Valid registration
r = RegisterRequest(email="test@example.com", password="ValidPass1", full_name="Test User")
assert r.email == "test@example.com"
print("PASS: RegisterRequest validates correctly")

# Too-short password
try:
    RegisterRequest(email="test@example.com", password="short")
    assert False
except ValidationError:
    print("PASS: RegisterRequest rejects password < 8 chars")

# Too-long password (65 chars)
try:
    RegisterRequest(email="test@example.com", password="a" * 65)
    assert False
except ValidationError:
    print("PASS: RegisterRequest rejects password > 64 chars")

# Exactly at limit (64 chars) — must pass
r2 = RegisterRequest(email="test2@example.com", password="a" * 64)
assert r2.password == "a" * 64
print("PASS: RegisterRequest accepts exactly 64-char password")

# Valid login
l = LoginRequest(email="test@example.com", password="anypass")
assert l.email == "test@example.com"
print("PASS: LoginRequest validates correctly")

# ChangePasswordRequest valid
cp = ChangePasswordRequest(current_password="old_pass", new_password="new_secure1")
assert cp.new_password == "new_secure1"
print("PASS: ChangePasswordRequest validates correctly")

# ChangePasswordRequest too-short new password
try:
    ChangePasswordRequest(current_password="old_pass", new_password="short")
    assert False
except ValidationError:
    print("PASS: ChangePasswordRequest rejects new_password < 8 chars")

print()
print("=" * 40)
print("ALL CHECKS PASSED")
print("=" * 40)
