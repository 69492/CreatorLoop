"""initial_schema — users and projects tables

Revision ID: 1d05b04dc3dc
Revises:
Create Date: 2026-07-30

This migration creates the initial database schema for CreatorLoop.
It is safe to run against a fresh PostgreSQL or SQLite database.
Existing tables are skipped (production-safe).
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '1d05b04dc3dc'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create initial schema — users and projects tables."""
    # ── users ────────────────────────────────────────────────────────────────
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('avatar_url', sa.Text(), nullable=True),
        sa.Column('hashed_password', sa.String(255), nullable=True),
        sa.Column('google_id', sa.String(255), nullable=True),
        sa.Column('is_verified', sa.Boolean(), default=False, nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_google_id', 'users', ['google_id'], unique=True)

    # ── projects ─────────────────────────────────────────────────────────────
    op.create_table(
        'projects',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column(
            'user_id',
            sa.String(36),
            sa.ForeignKey('users.id', ondelete='CASCADE'),
            nullable=True,
        ),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('idea', sa.Text(), nullable=False),
        sa.Column('goal', sa.String(100), nullable=False),
        sa.Column('platform', sa.String(100), nullable=False),
        sa.Column('length', sa.String(20), nullable=False),
        sa.Column('analysis', sa.JSON(), nullable=True),
        sa.Column('brainstorm', sa.JSON(), nullable=True),
        sa.Column('recommended_direction', sa.JSON(), nullable=True),
        sa.Column('content', sa.JSON(), nullable=True),
        sa.Column('adaptations', sa.JSON(), nullable=True),
        sa.Column('creative_suggestions', sa.JSON(), nullable=True),
        sa.Column('word_count', sa.Integer(), default=0, nullable=False),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_index('ix_projects_user_id', 'projects', ['user_id'])


def downgrade() -> None:
    """Drop all tables in reverse dependency order."""
    op.drop_table('projects')
    op.drop_index('ix_users_google_id', table_name='users')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')
