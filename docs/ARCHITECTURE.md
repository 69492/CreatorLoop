# Architecture

## Overview

CreatorLoop follows a classic client-server architecture with a React SPA frontend and a FastAPI Python backend. The frontend and backend are independently deployable and communicate via a REST API.

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                React SPA (Vite)                         │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ React Router │  │ Auth Context │  │ Toast System │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │              Axios API Client                   │   │   │
│  │  │  • JWT request interceptor                      │   │   │
│  │  │  • Response error normalisation                 │   │   │
│  │  │  • 401 → auto redirect to /auth/signin          │   │   │
│  │  └────────────────────┬────────────────────────────┘   │   │
│  └───────────────────────┼─────────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTPS REST
┌──────────────────────────┼──────────────────────────────────────┐
│                 FastAPI Backend                                  │
│                          │                                      │
│  ┌───────────────────────▼────────────────────────────────┐    │
│  │                  API Routes                             │    │
│  │  /api/auth  /api/projects  /api/generate  /api/health  │    │
│  └──────────────────────┬─────────────────────────────────┘    │
│                         │                                       │
│  ┌──────────────────────▼──────────────┐                       │
│  │           Services Layer            │                       │
│  │  ProjectService  │  AI Pipeline     │                       │
│  └──────────────────────┬──────────────┘                       │
│                         │                                       │
│  ┌──────────┬───────────▼────────────┐                         │
│  │ PostgreSQL│      Groq LLM API     │                         │
│  │(SQLAlchemy│  (LLaMA 3 inference)  │                         │
│  └──────────┴───────────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### State Management
- **Auth state** — `AuthContext` (React Context + localStorage)
- **Project state** — `useProjects` custom hook (local component state)
- **Toast state** — `ToastProvider` context
- **Draft state** — `useDraft` hook (localStorage)
- **Form state** — local `useState` per page

### Routing Strategy
- `ProtectedRoute` — wraps all authenticated workspace routes; redirects to `/auth/signin` if unauthenticated
- `GuestRoute` — wraps all auth pages; redirects to `/workspace` if already authenticated
- All workspace routes are lazy-loaded with `React.lazy` + `Suspense`

### Data Flow (Create Wizard)
```
User fills form → Auto-save to localStorage (debounced 2s)
User navigates away → useUnsavedChanges hook fires
  ├── isDirty=true → show UnsavedChangesModal
  │     ├── Stay → cancel navigation
  │     └── Discard → clearDraft() + proceed
  └── isDirty=false → navigate freely

On mount → check localStorage for draft
  ├── draft found → show ResumeDraftModal
  │     ├── Resume → restore state from draft
  │     └── Start Fresh → clearDraft()
  └── no draft → fresh form
```

## Backend Architecture

### Request Lifecycle
```
Client request
  → CORS middleware
  → JWT middleware (extract + validate token)
  → Route handler
  → Service layer
  → Database (async SQLAlchemy)
  → Response
```

### AI Pipeline
The 5-stage creative pipeline runs sequentially:
1. **Understand** — analyse the concept, extract key themes
2. **Brainstorm** — generate creative angles, hooks, and ideas
3. **Write** — draft the full content based on goal + platform
4. **Optimise** — tailor the content for the specific platform
5. **Polish** — final refinement and formatting

Each stage feeds context into the next via the Groq API.

## Security Model

- JWT tokens stored in `localStorage` (standard SPA approach)
- Tokens validated on every API request via request interceptor
- 401 responses trigger automatic sign-out and redirect
- Google OAuth credentials verified server-side via Google's public keys
- Passwords hashed with bcrypt (passlib)
- CORS restricted to configured origins
