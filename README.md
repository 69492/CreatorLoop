# CreatorLoop

> **AI-powered Content Production Pipeline** — Phase 1 Foundation

CreatorLoop is an open-source AI pipeline that transforms one content idea into platform-ready titles, outlines, scripts, and repurposed social content.

---

## Tech Stack

| Layer    | Technology                             |
|----------|----------------------------------------|
| Frontend | React 18 · Vite · Tailwind CSS · React Router |
| Backend  | FastAPI · Python 3.11+ · Uvicorn · Pydantic |
| AI (future) | IBM Granite (Phase 2+)             |

---

## Project Structure

```
CreatorLoop/
├── frontend/               # React + Vite SPA
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── layout/     # RootLayout, Navbar, Footer
│       │   ├── common/     # Logo, SectionHeader, SectionWrapper
│       │   ├── sections/   # Hero, Features, Pipeline, TechStack, Why, CTA
│       │   └── ui/         # Button, Card, Badge
│       ├── hooks/          # useHealth
│       ├── pages/          # Home, About, NotFound
│       ├── router/         # createBrowserRouter config
│       ├── services/       # api.js, healthService.js
│       └── styles/         # globals.css (Tailwind base)
│
└── backend/                # FastAPI application
    ├── app/
    │   ├── api/            # health.py
    │   ├── core/           # config.py, logging.py
    │   ├── middleware/     # logging.py, exception_handler.py
    │   ├── models/
    │   ├── schemas/
    │   ├── services/
    │   ├── utils/
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

# 4. Run development server
python run.py
# → API available at http://localhost:8000
# → Swagger docs at http://localhost:8000/docs
# → Health check: GET http://localhost:8000/api/health
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

| Method | Path         | Description              |
|--------|--------------|--------------------------|
| GET    | /api/health  | Health check             |
| GET    | /docs        | Swagger UI               |
| GET    | /redoc       | ReDoc documentation      |

---

## Phase Roadmap

| Phase | Status   | Description                      |
|-------|----------|----------------------------------|
| 1     | ✅ Done   | Project foundation & landing page |
| 2     | ⏳ Next   | Core AI pipeline (title, outline, script) |
| 3     | 📋 Planned | Repurposing, style matching, export |

---

## License

MIT — see [LICENSE](./LICENSE)
