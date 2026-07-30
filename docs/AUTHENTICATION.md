# Authentication

## Overview

CreatorLoop supports two authentication methods:

1. **Email / Password** — JWT-based authentication
2. **Google OAuth 2.0** — Federated sign-in via Google

---

## JWT Token Flow

```
Client                       Backend
  │                             │
  ├── POST /api/auth/login ─────►│
  │    { email, password }       │  1. Verify email/password
  │                              │  2. Generate JWT (HS256)
  │◄── { access_token, user } ───┤
  │                              │
  │  Store token in localStorage │
  │                              │
  ├── GET /api/projects ─────────►│
  │    Authorization: Bearer ... │  3. Validate JWT signature
  │                              │  4. Extract user_id from claims
  │◄── { projects... } ──────────┤
```

### Token Storage

Tokens are stored in `localStorage` under the key `cl_token`. The user object is cached under `cl_user`.

On application startup, the `AuthProvider` validates the stored token by calling `GET /api/auth/me`. If validation fails, the token is removed and the user is treated as unauthenticated.

### Token Expiry

Configure in `backend/.env`:
```env
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
```

---

## Google OAuth 2.0 Flow

```
Browser                    Backend                  Google
  │                           │                       │
  ├── Google Sign-In button   │                       │
  │   (renders Google popup)  │                       │
  │                           │                       │
  │◄── Google ID Token ───────────────────────────────┤
  │    (credential string)    │                       │
  │                           │                       │
  ├── POST /api/auth/google ──►│                       │
  │    { credential }         │                       │
  │                           ├── Verify token ───────►│
  │                           │◄── User info ─────────┤
  │                           │                       │
  │                           │  Create/update user   │
  │                           │  Generate JWT         │
  │◄── { access_token, user } ┤
```

The frontend uses `@react-oauth/google` to render the Google button. The credential (ID token) is sent to our backend, which verifies it using Google's public keys via the `google-auth-library`.

---

## Route Protection

### ProtectedRoute

Wraps all authenticated workspace routes. During auth loading, shows a spinner. If unauthenticated, redirects to `/auth/signin` with the current path saved as `location.state.from`.

```jsx
<ProtectedRoute>
  <WorkspaceLayout />
</ProtectedRoute>
```

### GuestRoute

Wraps all auth pages (Sign In, Sign Up, Forgot Password). If already authenticated, redirects to `/workspace` with `replace: true` (prevents Back button returning to login).

```jsx
<GuestRoute>
  <SignInPage />
</GuestRoute>
```

---

## Logout Flow

When the user signs out:

1. All `cl_*` localStorage keys are removed (token, user, draft)
2. sessionStorage is cleared
3. Axios default headers are cleared
4. React state is reset (user = null, token = null)
5. `navigate('/', { replace: true })` — prevents Back returning to dashboard

---

## Security Considerations

- Passwords are hashed with **bcrypt** via `passlib`
- JWT uses **HS256** — ensure `SECRET_KEY` is sufficiently random (32+ chars)
- Tokens are validated on every authenticated request
- Google tokens are verified server-side using Google's public certificate
- CORS is restricted to `ALLOWED_ORIGINS`
- HTTP-only cookies are not used (SPA trade-off — localStorage is acceptable for this security model)
