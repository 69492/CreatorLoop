# CreatorLoop

<p align="center">
  <strong>AI-powered Content Production Platform</strong><br/>
  Transform one idea into platform-ready content across every channel.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react" alt="React 18"/>
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Groq-LLaMA3-orange?style=flat" alt="Groq AI"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat" alt="MIT License"/>
</p>

---

## Project Overview

CreatorLoop is an open-source AI pipeline that transforms a single content idea into fully-structured titles, outlines, scripts, and cross-platform adaptations — powered by Groq (LLaMA 3) and delivered through a polished SaaS interface with the **Midnight Studio** dark design system.

Users describe a concept, choose a creative goal, select a target platform (YouTube, LinkedIn, Blog, Instagram, Podcast, X/Twitter), pick a content length, and the AI generates a complete, publish-ready content package in one click.

---

## Features

| Feature | Description |
|---|---|
| **AI Creative Pipeline** | 5-stage generation: Understand → Brainstorm → Write → Optimise → Polish |
| **Cross-Platform Content** | YouTube, LinkedIn, Instagram, Blog, X/Twitter, Podcast |
| **Project Management** | Save, edit, rename, duplicate, export, and organise all generated content |
| **Rich Text Editor** | Auto-saving draft editor built into every project |
| **Draft Auto-Save** | Create Wizard auto-saves to localStorage — resume anytime |
| **Unsaved Changes Guard** | Modal confirmation before losing wizard progress |
| **Export** | JSON, TXT, and Markdown export for any project |
| **Authentication** | Email/password and Google OAuth sign-in |
| **Protected Routes** | Authenticated shell — unauthenticated users redirect to sign-in |
| **Toast Notifications** | Success / Error / Warning / Info notifications |
| **Skeleton Loaders** | Loading states on Dashboard, Workspace, Profile |
| **Responsive Design** | Premium dark-mode interface optimised for desktop, tablet, and mobile |

---

## Screenshots

> Add screenshots to `/docs/screenshots/` and reference them here.

| Dashboard | Create Wizard | Results |
|---|---|---|
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

---

## Architecture

```
Browser
  └── React SPA (Vite)
        ├── React Router v6 (file-based routes)
        ├── Auth Context (JWT + Google OAuth)
        ├── Toast Notification System
        └── Axios API Client
              └── FastAPI Backend (Python)
                    ├── JWT Authentication
                    ├── Google OAuth 2.0
                    ├── PostgreSQL (via SQLAlchemy async)
                    └── Groq AI Service (LLaMA 3)
```

---

## Folder Structure

```
CreatorLoop/
├── frontend/                    # React + Vite SPA
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── auth/            # ProtectedRoute, GuestRoute, GoogleOAuthButton
│       │   ├── layout/          # RootLayout, Navbar, Footer, WorkspaceLayout
│       │   ├── common/          # Logo, SectionHeader, SectionWrapper
│       │   ├── sections/        # Hero, Features, Pipeline, TechStack, Why, CTA
│       │   ├── ui/              # Button, Card, Badge
│       │   ├── workspace/       # Sidebar, TopNav, SelectCard, StepIndicator,
│       │   │                    # UnsavedChangesModal, ResumeDraftModal, OnboardingModal
│       │   └── projects/        # ProjectCard, StatsGrid, SearchBar, FilterPanel, ExportMenu
│       ├── contexts/            # AuthContext (JWT state management)
│       ├── hooks/               # useProjects, useToast, useUnsavedChanges, useDraft
│       ├── pages/               # Workspace, Dashboard, Create, Results, ProjectDetail,
│       │                        # Profile, Settings, Help, Home, About, AuthPage, NotFound
│       ├── router/              # createBrowserRouter config
│       ├── services/            # api.js, projectService.js, authService.js, workspaceService.js
│       └── styles/              # globals.css (Midnight Studio design system)
│
└── backend/                     # FastAPI application
    ├── app/
    │   ├── api/                 # auth, users, projects, generate endpoints
    │   ├── core/                # config, security, database
    │   ├── models/              # SQLAlchemy ORM models
    │   ├── schemas/             # Pydantic request/response schemas
    │   ├── services/            # AI pipeline, project service
    │   └── main.py
    ├── requirements.txt
    └── run.py
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool + dev server |
| React Router | v6 | Client-side routing |
| Tailwind CSS | v3 | Utility-first CSS |
| Axios | latest | HTTP client |
| React Icons (HI) | latest | Icon system |
| @react-oauth/google | latest | Google OAuth |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.100+ | REST API framework |
| SQLAlchemy | 2.x (async) | ORM + database abstraction |
| Pydantic | v2 | Request/response validation |
| python-jose | latest | JWT token handling |
| passlib (bcrypt) | latest | Password hashing |
| httpx | latest | Async HTTP client (Google OAuth) |

### AI
| Technology | Purpose |
|---|---|
| Groq API | LLM inference (LLaMA 3) |
| Custom pipeline | 5-stage content generation |

### Database
| Technology | Purpose |
|---|---|
| PostgreSQL (Neon) | Production database |
| SQLite (aiosqlite) | Development database |

### Authentication
| Method | Flow |
|---|---|
| Email / Password | Register → bcrypt hash → JWT token |
| Google OAuth 2.0 | Google credential → backend verify → JWT token |

---

## Installation

### Prerequisites

- Node.js 18+
- Python 3.11+
- A Groq API key (free at [console.groq.com](https://console.groq.com))
- A Google Cloud project with OAuth credentials (optional, for Google Login)

---

### Backend Setup

```bash
cd backend

# 1. Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
copy .env.example .env   # Windows
cp .env.example .env     # macOS / Linux
```

Edit `backend/.env` and set the required values (see **Environment Variables** below).

```bash
# 4. Run development server
python run.py
# → API:   http://localhost:8000
# → Docs:  http://localhost:8000/docs
```

---

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Configure environment
copy .env.example .env   # Windows
cp .env.example .env     # macOS / Linux
```

Edit `frontend/.env` and set the required values.

```bash
# 3. Run development server
npm run dev
# → App: http://localhost:5173

# 4. Build for production
npm run build
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Required
SECRET_KEY=your_secret_key_min_32_chars
GROQ_API_KEY=gsk_...

# Database (SQLite for dev, PostgreSQL for prod)
DATABASE_URL=sqlite+aiosqlite:///./creatorloop.db
# DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Docker

```bash
# Start all services
docker compose up --build

# Production
docker compose -f docker-compose.prod.yml up --build
```

---

## Deployment

### Frontend (Vercel / Netlify)
1. Push to GitHub
2. Connect repo to Vercel or Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables: `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`

### Backend (Railway / Render / Fly.io)
1. Set environment variables in the platform dashboard
2. Set `DATABASE_URL` to a PostgreSQL connection string (e.g. Neon)
3. Set start command: `python run.py` or `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Application type: **Web application**
6. Authorised JavaScript origins: `http://localhost:5173`, your production domain
7. Authorised redirect URIs: `http://localhost:8000/api/auth/google/callback`
8. Copy `Client ID` to `VITE_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID`
9. Copy `Client Secret` to `GOOGLE_CLIENT_SECRET`

---

## Neon PostgreSQL Setup

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Set `DATABASE_URL=postgresql+asyncpg://...` in `backend/.env`

---

## API Documentation

Full interactive docs available at `http://localhost:8000/docs` (Swagger UI) or `http://localhost:8000/redoc`.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create a new account |
| POST | `/api/auth/login` | — | Email/password authentication |
| POST | `/api/auth/google` | — | Google OAuth sign-in |
| GET | `/api/auth/me` | ✓ | Current user profile |
| PUT | `/api/auth/me` | ✓ | Update profile |
| POST | `/api/auth/change-password` | ✓ | Change password |
| POST | `/api/generate` | ✓ | Run AI creative pipeline |
| GET | `/api/projects` | ✓ | List user projects (paginated) |
| POST | `/api/projects` | ✓ | Save a generated project |
| GET | `/api/projects/{id}` | ✓ | Get single project |
| PUT | `/api/projects/{id}` | ✓ | Update project content/title |
| DELETE | `/api/projects/{id}` | ✓ | Delete project |
| POST | `/api/projects/{id}/duplicate` | ✓ | Duplicate a project |
| GET | `/api/health` | — | Service health check |

---

## Development Workflow

```bash
# Frontend dev with HMR
cd frontend && npm run dev

# Backend dev with auto-reload
cd backend && python run.py

# Lint frontend
cd frontend && npm run lint

# Build frontend
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview
```

---

## Testing

```bash
# Frontend lint
cd frontend && npm run lint

# Backend tests (if configured)
cd backend && pytest
```

---

## Production Checklist

- [ ] `VITE_API_BASE_URL` points to production backend
- [ ] `SECRET_KEY` is a strong random value (32+ chars)
- [ ] `GROQ_API_KEY` is set
- [ ] `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` are set (if using Google Login)
- [ ] `DATABASE_URL` points to PostgreSQL (not SQLite)
- [ ] `ALLOWED_ORIGINS` includes production frontend domain
- [ ] HTTPS is configured on both frontend and backend
- [ ] Sentry or error tracking is configured (optional)
- [ ] Environment variables are NOT committed to git

---

## Future Improvements

- [ ] Webhook integrations (publish to Notion, WordPress, etc.)
- [ ] Team workspaces and collaboration
- [ ] Content scheduling and calendar view
- [ ] Advanced analytics dashboard
- [ ] Custom AI personas / writing styles
- [ ] Image generation integration
- [ ] Stripe billing for pro plans
- [ ] Email notifications

---

## Design System

CreatorLoop uses the **Midnight Studio** design language:

| Token | Value | Usage |
|---|---|---|
| Background | `#050816` | Page background |
| Surface | `#0F172A` | Cards, sidebar |
| Elevated | `#172033` | Modals, dropdowns |
| Border | `#263247` | Card borders |
| Orange | `#FF7A1A` | Primary CTA, active state |
| Teal | `#2DD4BF` | Secondary accent |
| Heading font | Sora | All headings |
| Body font | Inter | Body text, UI |

---

## License

MIT — see [LICENSE](./LICENSE)

---

## Contributors

- **CreatorLoop Team** — Initial design, architecture, and implementation

Contributions welcome! Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) before submitting a PR.
