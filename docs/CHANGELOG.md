# Changelog

All notable changes to CreatorLoop are documented here.

This project follows [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) conventions.

---

## [Unreleased]

### Added
- **Unsaved Changes Protection** — `UnsavedChangesModal` blocks in-app navigation, browser Back, refresh, and tab close when the Create Wizard has unsaved progress
- **Auto-Save Draft** — Create Wizard auto-saves form state to `localStorage` every 2 seconds; `ResumeDraftModal` prompts to resume on next visit
- **GuestRoute** — Auth pages now redirect authenticated users to `/workspace` with history replacement, preventing Back navigation to login
- **Complete Logout** — Sign-out clears all `cl_*` localStorage keys, sessionStorage, React Query cache, and Axios headers; Back button cannot re-enter dashboard
- **Enhanced Error Handling** — API client returns human-readable messages for network errors, timeouts, offline mode, 4xx/5xx HTTP status codes
- **Warning Toast** — New `toast.warning()` notification type (amber colour)
- **GuestRoute component** — `frontend/src/components/auth/GuestRoute.jsx`
- **useUnsavedChanges hook** — `frontend/src/hooks/useUnsavedChanges.js`
- **useDraft hook** — `frontend/src/hooks/useDraft.js`
- **UnsavedChangesModal component** — `frontend/src/components/workspace/UnsavedChangesModal.jsx`
- **ResumeDraftModal component** — `frontend/src/components/workspace/ResumeDraftModal.jsx`
- **docs/** — Architecture, Database, API Reference, Authentication, Deployment, Security, Contributing documentation
- **README.md** — Complete rewrite with full installation, deployment, and API documentation

### Changed
- `AuthContext.logout()` — now clears all application cache, not just the auth tokens
- `useProjects.fetchProjects()` — no longer shows "Failed to load projects" when the API returns zero results
- `api.js` — comprehensive error normalisation for all HTTP status codes and network failures
- `TopNav.handleLogout()` — navigates with `replace: true` to prevent dashboard re-entry via Back
- Router — auth pages wrapped in `GuestRoute`; `useBlocker`-based navigation prevention

---

## [1.0.0] — 2024

### Added
- Initial release
- 5-stage AI creative pipeline (Groq LLaMA 3)
- Create Wizard (5-step form)
- Project management (save, edit, rename, duplicate, delete, export)
- Rich text editor with auto-save
- Email/password authentication
- Google OAuth 2.0 sign-in
- Dashboard with search, filter, sort, pagination
- Workspace overview with recent projects and pipeline card
- Profile page with stats
- Settings page (password change)
- Help page
- Midnight Studio dark design system
- Skeleton loaders on Dashboard and Workspace
- Toast notification system (success, error, info)
- Responsive design (mobile, tablet, desktop)
- Lazy-loaded routes with Suspense fallback
- ProtectedRoute (unauthenticated redirect to sign-in)
- OnboardingModal (shown on first login)
- Docker Compose setup
