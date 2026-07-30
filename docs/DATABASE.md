# Database

## Overview

CreatorLoop uses SQLAlchemy (async) as the ORM. By default in development it uses **SQLite** (via aiosqlite). In production it uses **PostgreSQL** (via asyncpg).

## Configuration

Set `DATABASE_URL` in `backend/.env`:

```env
# Development (SQLite)
DATABASE_URL=sqlite+aiosqlite:///./creatorloop.db

# Production (PostgreSQL)
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/creatorloop
```

## Schema

### `users`

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `email` | String (unique) | User email address |
| `hashed_password` | String (nullable) | bcrypt hash (null for OAuth users) |
| `full_name` | String (nullable) | Display name |
| `avatar_url` | String (nullable) | Profile picture URL |
| `google_id` | String (nullable) | Google account ID (OAuth users) |
| `is_verified` | Boolean | Email verified flag |
| `created_at` | DateTime | Account creation timestamp |
| `updated_at` | DateTime | Last update timestamp |

### `projects`

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID (FK → users) | Owner reference |
| `title` | String | Project title |
| `idea` | Text | Original concept input |
| `goal` | String | Creative goal (brainstorm/story/script/etc.) |
| `platform` | String | Target platform (youtube/linkedin/etc.) |
| `length` | String | Content length (short/medium/long) |
| `analysis` | Text (nullable) | AI pipeline stage 1 output |
| `brainstorm` | Text (nullable) | AI pipeline stage 2 output |
| `content` | Text (nullable) | AI pipeline stage 3 output |
| `optimised` | Text (nullable) | AI pipeline stage 4 output |
| `final` | Text (nullable) | AI pipeline stage 5 output |
| `rich_text` | Text (nullable) | Editor content (auto-saved) |
| `word_count` | Integer | Approximate word count |
| `created_at` | DateTime | Creation timestamp |
| `updated_at` | DateTime | Last update timestamp |

## Migrations

The application uses SQLAlchemy's `create_all()` for schema creation on startup. For production migrations, use **Alembic**:

```bash
cd backend
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Backups

For PostgreSQL in production:
```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```
