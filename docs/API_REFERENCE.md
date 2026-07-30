# API Reference

Base URL: `http://localhost:8000` (development) or your deployed backend URL.

All endpoints return JSON. Authenticated endpoints require a `Bearer` token in the `Authorization` header.

---

## Authentication

### POST `/api/auth/register`

Create a new user account.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "Jane Doe"  // optional
}
```

**Response `200`:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "is_verified": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### POST `/api/auth/login`

Sign in with email and password.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response `200`:** Same as register.

---

### POST `/api/auth/google`

Sign in with a Google credential token.

**Request body:**
```json
{
  "credential": "google_id_token_here"
}
```

**Response `200`:** Same as register.

---

### GET `/api/auth/me`

Get the current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "Jane Doe",
  "avatar_url": "https://...",
  "google_id": null,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### PUT `/api/auth/me`

Update the current user's profile.

**Request body (partial):**
```json
{
  "full_name": "New Name"
}
```

---

### POST `/api/auth/change-password`

Change the current user's password.

**Request body:**
```json
{
  "current_password": "old_password",
  "new_password": "new_password123"
}
```

---

## Generation

### POST `/api/generate`

Run the full 5-stage AI creative pipeline.

**Request body:**
```json
{
  "idea": "How remote teams can use async communication...",
  "goal": "script",
  "platform": "youtube",
  "length": "medium"
}
```

**Response `200`:**
```json
{
  "title": "Generated title",
  "analysis": "Stage 1 output...",
  "brainstorm": "Stage 2 output...",
  "content": "Stage 3 output...",
  "optimised": "Stage 4 output...",
  "final": "Stage 5 output...",
  "word_count": 1450
}
```

---

## Projects

### GET `/api/projects`

List user projects with pagination, search, and filtering.

**Query params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |
| `per_page` | int | 20 | Items per page |
| `search` | string | — | Full-text search on title/idea |
| `platform` | string | — | Filter by platform |
| `sort_by` | string | `updated_at` | Sort field |

**Response `200`:**
```json
{
  "projects": [...],
  "total": 42,
  "stats": {
    "total_projects": 42,
    "total_words": 85000,
    "platforms_used": ["youtube", "linkedin"]
  }
}
```

---

### POST `/api/projects`

Save a new project (typically after generation).

**Request body:** Project data (same fields as generation response + metadata).

---

### GET `/api/projects/{id}`

Get a single project by ID.

---

### PUT `/api/projects/{id}`

Update a project (partial update supported).

---

### DELETE `/api/projects/{id}`

Delete a project permanently.

---

### POST `/api/projects/{id}/duplicate`

Create a copy of a project.

---

## Health

### GET `/api/health`

Returns service status. No authentication required.

**Response `200`:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

---

## Error Format

All errors return a JSON body with a `detail` field:

```json
{
  "detail": "Human-readable error message"
}
```

| Status | Meaning |
|---|---|
| 400 | Bad request / validation error |
| 401 | Unauthenticated — token missing or expired |
| 403 | Forbidden — insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict — resource already exists |
| 422 | Unprocessable entity — request schema violation |
| 500 | Internal server error |
