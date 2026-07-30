# Contributing

Thank you for your interest in contributing to CreatorLoop!

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CreatorLoop.git
   cd CreatorLoop
   ```
3. **Set up** the development environment (see [README.md](../README.md))
4. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/my-bug
   ```

---

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
```

Types:
- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `style` — formatting, missing semicolons, etc.
- `refactor` — code change that neither fixes a bug nor adds a feature
- `perf` — performance improvement
- `test` — adding or updating tests
- `chore` — build process, dependency updates

Examples:
```
feat(create): add auto-save draft to localStorage
fix(auth): redirect to /workspace after Google sign-in
docs(readme): update deployment instructions
```

---

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Run `npm run lint` in `frontend/` — no errors allowed
3. Test your changes manually
4. Write a clear PR description:
   - What problem does this solve?
   - What changes were made?
   - How was it tested?
5. Request a review from a maintainer

---

## Code Style

### Frontend (JavaScript/JSX)
- Follow the existing ESLint configuration
- Use functional components with hooks
- Keep components focused — one responsibility per component
- Extract reusable logic into custom hooks (`src/hooks/`)
- Use the existing design system classes (`btn-primary`, `card`, `input-base`, etc.)
- No `console.log` in production code

### Backend (Python)
- Follow PEP 8
- Use type hints on all function signatures
- Async functions for all I/O operations
- Keep route handlers thin — business logic belongs in services

---

## Project Structure

Please place new files in the correct directory:

| Type | Location |
|---|---|
| Page component | `frontend/src/pages/` |
| Shared UI component | `frontend/src/components/ui/` |
| Auth component | `frontend/src/components/auth/` |
| Workspace component | `frontend/src/components/workspace/` |
| Custom hook | `frontend/src/hooks/` |
| API service | `frontend/src/services/` |
| Backend route | `backend/app/api/` |
| Backend service | `backend/app/services/` |
| ORM model | `backend/app/models/` |
| Pydantic schema | `backend/app/schemas/` |

---

## Questions?

Open a GitHub Discussion or reach out to the maintainers.
