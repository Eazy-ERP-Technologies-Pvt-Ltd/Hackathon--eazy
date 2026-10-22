# 5-Person Team Charter & Role Definitions

This document defines the clear divisions of responsibility, file boundaries, and communication paths for the 5-person engineering team.

---

## Role Matrix Overview

```
                      ┌───────────────────────────┐
                      │    P5: Product & QA Lead  │
                      │  (Contracts, Tests, Tasks)│
                      └─────────────┬─────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ P1: Frontend Lead│ <---> │ P2: Backend Lead │ <---> │  P3: AI Engineer │
│  (UI / Web Apps) │       │  (APIs, DB, Auth)│       │  (LLMs, Agents)  │
└──────────────────┘       └──────────────────┘       └──────────────────┘
         ▲                          ▲                          ▲
         └──────────────────────────┼──────────────────────────┘
                                    │
                      ┌─────────────┴─────────────┐
                      │  P4: Infra & Shared Lead  │
                      │  (Contracts, Docker, CI)  │
                      └───────────────────────────┘
```

---

## Detailed Role Profiles

### Role P1: Frontend & UI/UX Lead
- **Primary Scope:** `apps/frontend/`, `docs/specs/ui/`
- **Focus Areas:**
  - Responsive web client, layout, navigation, and theme system.
  - Component library, accessible forms, state management.
  - Consuming REST / WebSocket endpoints defined in `packages/shared/contracts/`.
  - Providing fast, reactive user feedback with optimistic updates.
- **Rules & Boundaries:**
  - Does NOT alter backend databases or server controllers directly.
  - Only consumes endpoints verified against `packages/shared/contracts/`.
- **AI Agent Shortcut:** `@role:frontend`

---

### Role P2: Backend & System API Lead
- **Primary Scope:** `apps/backend/`, `docs/specs/api/`
- **Focus Areas:**
  - Business logic, data models, persistence, and migrations.
  - RESTful APIs, WebSocket handlers, and middleware (authentication, rate-limiting).
  - Interfacing with AI services via internal RPC / HTTP calls.
  - Securing endpoints, managing tokens, and handling validation.
- **Rules & Boundaries:**
  - Must ensure responses match the contracts in `packages/shared/contracts/`.
  - Does NOT write client-side CSS or UI React components.
- **AI Agent Shortcut:** `@role:backend`

---

### Role P3: AI & Intelligence Systems Lead
- **Primary Scope:** `apps/ai-service/`, `docs/specs/ai/`
- **Focus Areas:**
  - LLM prompt engineering, chains, and autonomous agent orchestration.
  - Vector search, embeddings, retrieval-augmented generation (RAG).
  - External tool calling, agentic memory, and safety filters.
  - Exposing structured inference endpoints consumed by Backend (`P2`).
- **Rules & Boundaries:**
  - Does NOT directly serve public web clients; all external access routes through `apps/backend/`.
  - Must define input and output schemas in `packages/shared/contracts/`.
- **AI Agent Shortcut:** `@role:ai`

---

### Role P4: Shared Infra & DevOps Lead
- **Primary Scope:** `packages/shared/`, `infra/`, `.github/`
- **Focus Areas:**
  - Shared TypeScript types, DTO schemas, and contract interfaces.
  - Docker Compose configurations for local multi-service orchestration.
  - Continuous integration workflows (linting, contract checks, automated tests).
  - Environment variables documentation and configuration management.
- **Rules & Boundaries:**
  - Every contract change must be non-breaking or coordinated with `P1`, `P2`, and `P3`.
  - Maintains `./scripts/verify-setup.sh` to ensure workspace integrity.
- **AI Agent Shortcut:** `@role:devops`

---

### Role P5: Product Architecture & QA Lead
- **Primary Scope:** `docs/tasks/`, `tests/`, `docs/specs/`
- **Focus Areas:**
  - Backlog prioritization, acceptance criteria, and task definition.
  - End-to-end integration tests, contract compliance checks, and regression tests.
  - Documentation quality, onboarding guides, and sprint reviews.
  - Triaging issues and cross-boundary merge requests.
- **Rules & Boundaries:**
  - Ensures tasks in `docs/tasks/BACKLOG.md` are up to date and assigned clearly.
  - Verifies that all pull requests include updated documentation.
- **AI Agent Shortcut:** `@role:qa`
