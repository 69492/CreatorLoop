"""
Server startup + route smoke test.
Run from backend/ directory: python tests/test_startup.py
"""
import sys, os, asyncio
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-smoke")

# ── 1. App import ──────────────────────────────────────────────────────────────
from app.main import app
print("PASS: FastAPI app imports without errors")

# ── 2. Auth router routes ─────────────────────────────────────────────────────
from app.api.auth import router as auth_router
auth_paths = {r.path for r in auth_router.routes}
required = {"/auth/register", "/auth/login", "/auth/google", "/auth/me", "/auth/change-password"}
missing = required - auth_paths
assert not missing, f"Missing auth routes: {missing}"
print(f"PASS: all auth routes registered: {sorted(required)}")

# ── 3. Database init ───────────────────────────────────────────────────────────
async def check_db():
    from app.db.database import init_db
    await init_db()
    print("PASS: database init_db() completed without errors")

asyncio.run(check_db())

# ── 4. Security layer final check ─────────────────────────────────────────────
from app.core.security import hash_password, verify_password, create_access_token, decode_token
import uuid

pw = "StrongPass99!"
hashed = hash_password(pw)
assert verify_password(pw, hashed)
assert not verify_password("bad", hashed)

uid = str(uuid.uuid4())
token = create_access_token(uid)
assert decode_token(token) == uid
print("PASS: security layer hash + JWT round-trip OK")

print()
print("=" * 40)
print("SERVER STARTUP SMOKE TEST PASSED")
print("=" * 40)
