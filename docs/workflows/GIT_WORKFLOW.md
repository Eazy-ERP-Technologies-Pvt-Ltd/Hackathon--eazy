# Git Collaboration & Concurrency Workflow

This protocol guarantees that 5 team members and their AI agents can push commits and open pull requests simultaneously without merge conflicts or lost work.

---

## 1. Branch Strategy

Main branch (`main`) is always deployable and protected. All active work takes place in scoped feature branches:

```
main (protected)
  ├── feat/p1-ui-navigation          (Owned by Person 1)
  ├── feat/p2-api-auth-endpoints     (Owned by Person 2)
  ├── feat/p3-ai-rag-pipeline        (Owned by Person 3)
  ├── chore/p4-infra-docker-setup    (Owned by Person 4)
  └── test/p5-e2e-smoke-suite        (Owned by Person 5)
```

### Branch Naming Convention
`<type>/<role-prefix>-<short-slug>`

- `<type>`: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`
- `<role-prefix>`: `p1`, `p2`, `p3`, `p4`, `p5`
- `<short-slug>`: 2–4 hyphen-separated words describing the work

---

## 2. Commit Message Standards (Conventional Commits)

Format: `<type>(<scope>): <action-oriented description>`

| Scope | Allowed Roles | Example |
| :--- | :--- | :--- |
| `frontend` / `ui` | `P1` | `feat(frontend): create responsive chat input bar` |
| `backend` / `api` | `P2` | `feat(backend): add JWT authentication middleware` |
| `ai` / `llm` | `P3` | `feat(ai): integrate Gemini streaming response handler` |
| `shared` / `contracts` | `P4` | `feat(shared): declare AIInferenceRequest contract schema` |
| `infra` / `ci` | `P4` | `chore(infra): add Redis container to docker-compose` |
| `qa` / `docs` | `P5` | `test(qa): add end-to-end API integration test` |

---

## 3. Daily Collaborative Routine

### A. Starting a New Task
```bash
# 1. Fetch latest changes from main
git checkout main
git pull origin main

# 2. Create your isolated feature branch
git checkout -b feat/p1-login-screen

# 3. Check docs/tasks/BACKLOG.md and mark task in-progress
```

### B. Before Committing (Local Verification)
```bash
# Run workspace integrity & contract check
./scripts/verify-setup.sh
```

### C. Updating from Main (Preventing Stale Branches)
```bash
git fetch origin
git rebase origin/main
```

### D. Creating a Pull Request
- Target: `main`
- Fill out the PR template (`.github/PULL_REQUEST_TEMPLATE.md`).
- Ensure all CI checks and `./scripts/verify-setup.sh` pass.
- Request review from adjacent roles if contracts were modified.
