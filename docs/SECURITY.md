# Security

## Threat Model

CreatorLoop is a standard SPA + REST API application. The primary concerns are:

1. **Authentication bypass** — accessing protected routes without a valid token
2. **Token theft** — stealing JWT tokens from localStorage
3. **CSRF** — cross-site request forgery (mitigated by token-based auth)
4. **Injection** — SQL injection, XSS
5. **API abuse** — rate limiting, unauthorised data access

---

## Implemented Controls

### Authentication
- JWT tokens are validated on every authenticated API request
- Tokens use HS256 signing with a configurable `SECRET_KEY`
- Google OAuth credentials are verified server-side using Google's public certificate endpoint
- Passwords are hashed with **bcrypt** (passlib, cost factor 12)
- Expired or invalid tokens result in 401 → automatic client-side sign-out

### Authorisation
- Every project endpoint checks `project.user_id == current_user.id`
- Users can only read/write their own data
- Admin actions are not exposed via the public API

### Input Validation
- All request bodies validated by **Pydantic v2** schemas
- FastAPI automatically returns `422` for malformed requests
- SQL injection is prevented by SQLAlchemy's parameterised queries

### CORS
- `ALLOWED_ORIGINS` must be explicitly configured
- Wildcard (`*`) is not used in production
- Credentials are required for cross-origin requests

### Frontend
- React's JSX auto-escapes all string interpolations (XSS prevention)
- No `dangerouslySetInnerHTML` is used with user-supplied content
- All API errors are caught and displayed as toast notifications (no raw stack traces)

---

## Known Trade-offs

### localStorage for JWT
JWT tokens are stored in `localStorage` instead of HTTP-only cookies. This is the standard approach for SPAs without a backend-for-frontend (BFF) pattern:

- **Risk:** XSS attacks could steal tokens if third-party scripts are compromised
- **Mitigation:** No third-party scripts with DOM access; React auto-escapes all output
- **Alternative:** Use HTTP-only cookies + a BFF for higher security requirements

---

## Security Hardening Checklist

- [ ] `SECRET_KEY` is a random 32+ char string (not the default)
- [ ] `DATABASE_URL` uses SSL for PostgreSQL (`?ssl=require`)
- [ ] `ALLOWED_ORIGINS` does not include `*`
- [ ] HTTPS is enforced on all production endpoints
- [ ] API rate limiting is enabled (e.g. via nginx or a WAF)
- [ ] Dependency updates are reviewed regularly (`pip audit`, `npm audit`)
- [ ] Production logs do not contain sensitive data (tokens, passwords)
- [ ] Google OAuth redirect URIs are restricted to known domains

---

## Reporting Vulnerabilities

If you discover a security vulnerability, please email the maintainers privately instead of creating a public issue. Include:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. (Optional) Suggested fix
