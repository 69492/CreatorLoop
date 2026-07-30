# CreatorLoop

> **AI-powered Content Production Platform** — Transform one idea into platform-ready content across every channel.

CreatorLoop is an open-source AI pipeline that transforms a single content idea into fully-structured titles, outlines, scripts, and cross-platform adaptations — powered by Groq and delivered through a polished SaaS interface.

---

## Features

- **AI Creative Pipeline** — Multi-stage generation: idea analysis → brainstorming → drafting → platform optimization → final polish
- **Cross-Platform Content** — YouTube, LinkedIn, Instagram, Blog, X/Twitter, Podcast
- **Project Management** — Save, edit, rename, duplicate, export, and organize all generated content
- **Rich Text Editor** — Auto-saving draft editor built into every project
- **Export** — JSON, TXT, and Markdown export for any project
- **Authentication** — Email/password and Google OAuth sign-in
- **Responsive Design** — Premium dark-mode interface (Midnight Studio) optimized for desktop, tablet, and mobile

---

## Tech Stack

| Layer    | Technology                                                      |
|----------|-----------------------------------------------------------------|
| Frontend | React 18 · Vite · Tailwind CSS v3 · React Router v6            |
| Backend  | FastAPI · Python 3.11+ · SQLAlchemy (async) · SQLite (aiosqlite)|
| AI       | Groq (LLaMA 3) · Multi-stage pipeline                          |
| Auth     | JWT tokens · Google OAuth                                       |
| Fonts    | Sora (headings) · Inter (body) · JetBrains Mono (code)         |

---

## Project Structure

```
CreatorLoop/
├── frontend/               # React + Vite SPA
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── layout/     # RootLayout, Navbar, Footer, Sidebar, TopNav
│       │   ├── common/     # Logo, SectionHeader, SectionWrapper
│       │   ├── sections/   # Hero, Features, Pipeline, TechStack, Why, CTA
│       │   ├── ui/         # Button, Card, Badge
│       │   ├── workspace/  # SelectCard, StepIndicator
│       │   └── projects/   # ProjectCard, StatsGrid, SearchBar, FilterPanel, ExportMenu
│       ├── contexts/       # AuthContext
│       ├── hooks/          # useProjects, useToast
│       ├── pages/          # Workspace, Dashboard, Create, Results, ProjectDetail, Profile, Settings
│       ├── router/         # createBrowserRouter config
│       ├── services/       # api.js, projectService.js, authService.js
│       └── styles/         # globals.css (Midnight Studio design system)
│
└── backend/                # FastAPI application
    ├── app/
    │   ├── api/            # auth, users, projects, generate endpoints
    │   ├── core/           # config, security, database
    │   ├── models/         # SQLAlchemy ORM models
    │   ├── schemas/        # Pydantic request/response schemas
    │   ├── services/       # AI pipeline, project service
    │   └── main.py
    ├── requirements.txt
    └── run.py
```

---

## Quick Start

### Backend

```bash
cd backend

# 1. Create virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
copy .env.example .env    # Windows
cp .env.example .env      # macOS / Linux
# Required: GROQ_API_KEY, SECRET_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

# 4. Run development server
python run.py
# → API available at http://localhost:8000
# → Swagger docs at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Configure environment
copy .env.example .env    # Windows
cp .env.example .env      # macOS / Linux

# 3. Run development server
npm run dev
# → App available at http://localhost:5173
```

---

## API Endpoints

| Method | Path                     | Description                    |
|--------|--------------------------|--------------------------------|
| POST   | /api/auth/register       | Create a new account           |
| POST   | /api/auth/login          | Email/password authentication  |
| GET    | /api/auth/google         | Google OAuth redirect          |
| GET    | /api/users/me            | Current user profile           |
| POST   | /api/generate            | Run AI creative pipeline       |
| GET    | /api/projects            | List user projects (paginated) |
| POST   | /api/projects            | Save a generated project       |
| GET    | /api/projects/{id}       | Get single project             |
| PATCH  | /api/projects/{id}       | Update project content/title   |
| DELETE | /api/projects/{id}       | Delete project                 |
| POST   | /api/projects/{id}/duplicate | Duplicate a project        |
| GET    | /api/health              | Service health check           |

---

## Design System

CreatorLoop uses the **Midnight Studio** design language:

- Background: `#050816` · Surface: `#0F172A` · Elevated: `#172033`
- Primary accent: `#FF7A1A` (Creative Orange)
- Secondary accent: `#2DD4BF` (Fresh Teal)
- Heading font: Sora · Body font: Inter

---

## License

MIT — see [LICENSE](./LICENSE)
