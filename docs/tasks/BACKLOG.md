# Project Backlog & Machine-Readable Task Matrix

> **Agent Protocol:**
> 1. Find your role's tasks (`TASK-P1-*`, `TASK-P2-*`, `TASK-P3-*`, `TASK-P4-*`, `TASK-P5-*`).
> 2. Ensure dependencies are satisfied before beginning implementation.
> 3. Update task status from `[ ]` (Pending) to `[/]` (In Progress) and finally `[x]` (Completed).
> 4. Record the Git commit or PR hash next to the task upon completion.

---

## Sprint 0: Foundation & Environment (All Roles)

| Task ID | Role | Title | Status | Dependencies | Owner | Notes / Deliverables |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| `TASK-P4-001` | `P4` | Setup monorepo package structure & shared contracts | [x] | None | Infra Lead | `packages/shared/contracts/` initialized |
| `TASK-P4-002` | `P4` | Create local Docker Compose orchestrator | [x] | `TASK-P4-001` | Infra Lead | `infra/docker-compose.yml` & `.env.example` |
| `TASK-P4-003` | `P4` | Setup validation script (`verify-setup.sh`) | [x] | `TASK-P4-001` | Infra Lead | `./scripts/verify-setup.sh` executable |
| `TASK-P1-001` | `P1` | Scaffold Frontend client application | [x] | `TASK-P4-001` | Frontend Lead | `apps/frontend/` initialized |
| `TASK-P2-001` | `P2` | Scaffold Backend API server | [x] | `TASK-P4-001` | Backend Lead | `apps/backend/` initialized |
| `TASK-P3-001` | `P3` | Scaffold AI Service & Agent Engine | [x] | `TASK-P4-001` | AI Lead | `apps/ai-service/` initialized |
| `TASK-P5-001` | `P5` | Setup E2E Test harness & QA verification suite | [x] | `TASK-P1-001`, `TASK-P2-001` | QA Lead | `tests/` initialized |

---

## Sprint 1: Core Feature Development

### P1: Frontend Team (`apps/frontend/`)
- [ ] `TASK-P1-101`: Build shared App Shell (Navbar, Sidebar, Theme Switcher)
  - **Inputs:** `docs/specs/ui/`, `packages/shared/contracts/`
  - **Outputs:** `apps/frontend/src/components/layout/`
  - **Validation:** Responsive across mobile/desktop, zero console errors.
- [ ] `TASK-P1-102`: Implement AI Prompt & Stream View
  - **Inputs:** `packages/shared/contracts/ai.ts`
  - **Outputs:** `apps/frontend/src/features/chat/`
  - **Validation:** Real-time token streaming and message history.

### P2: Backend Team (`apps/backend/`)
- [ ] `TASK-P2-101`: Implement Healthcheck & Core API Router
  - **Inputs:** `docs/CONTRACTS.md`
  - **Outputs:** `apps/backend/src/routes/health.ts`
  - **Validation:** `GET /health` returns `{ success: true, status: "healthy" }`.
- [ ] `TASK-P2-102`: AI Inference Gateway & Proxy
  - **Inputs:** `packages/shared/contracts/ai.ts`
  - **Outputs:** `apps/backend/src/routes/ai.ts`
  - **Validation:** Forwards client requests to `apps/ai-service/` with auth headers.

### P3: AI & Intelligence Team (`apps/ai-service/`)
- [ ] `TASK-P3-101`: Setup LLM Inference Provider Router (OpenAI / Gemini / Anthropic / Local)
  - **Inputs:** Environment variables (`OPENAI_API_KEY`, `GEMINI_API_KEY`)
  - **Outputs:** `apps/ai-service/src/providers/`
  - **Validation:** Dispatches prompt and parses structured JSON output.
- [ ] `TASK-P3-102`: Implement Context/RAG Retrieval Engine
  - **Inputs:** Ingestion document format
  - **Outputs:** `apps/ai-service/src/rag/`
  - **Validation:** Semantic retrieval returns top-k relevant snippets.

### P4: DevOps & Shared Infra (`packages/shared/`, `infra/`)
- [ ] `TASK-P4-101`: Setup GitHub Actions CI Pipeline
  - **Inputs:** `.github/workflows/ci.yml`
  - **Outputs:** Automated linting, type-checking, contract validation.
  - **Validation:** Runs cleanly on pull requests.

### P5: Product & QA (`tests/`, `docs/`)
- [ ] `TASK-P5-101`: End-to-End Health & Flow Integration Test
  - **Inputs:** `apps/frontend`, `apps/backend`, `apps/ai-service`
  - **Outputs:** `tests/e2e/health.test.ts`
  - **Validation:** Verifies all 3 microservices respond and connect cleanly.
