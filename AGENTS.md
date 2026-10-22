# AGENTS.md — AI Collaborative Operating System (5-Person Team)

> **Version:** 1.0.0  
> **Repository:** GarvishJainErp/Hackathon  
> **Paradigm:** Docs-as-Code ("Docs Coded") & Contract-Driven Multi-Agent Collaboration  

---

## 1. Prime Directive for AI Agents

You are acting as an autonomous or semi-autonomous AI collaborator in a **5-person concurrent development team**. Up to five team members and their respective AI agents are operating on this repository simultaneously.

To ensure **zero merge collisions**, **coherent system architecture**, and **continuous integration**, you MUST adhere to the following core tenets:

1. **Docs Coded First**: All system architecture, API contracts, interfaces, and role duties are coded in markdown and type definitions under [`docs/`](file:///Users/bhanurathore/projects/hack/docs). You MUST read and follow relevant documents before writing or modifying any implementation file.
2. **Strict Boundary Adherence**: You may ONLY modify files owned by the active role/person unless explicitly granted cross-boundary authorization via a shared contract. See [Role Ownership Matrix](#2-role-ownership-matrix).
3. **Mandatory Documentation Sync**: Whenever you create, modify, or delete any feature, API, or configuration, you **MUST immediately update the corresponding `.md` files** in [`docs/`](file:///Users/bhanurathore/projects/hack/docs) and the root documentation. Stale documentation is treated as a breaking bug.
4. **Contract-Driven Development**: Frontend, Backend, AI Engine, and DevOps communicate via strictly typed schemas in [`packages/shared/contracts/`](file:///Users/bhanurathore/projects/hack/packages/shared/contracts). Never guess or invent an API format—read the contract.

---

## 2. Role Ownership Matrix (The 5 Roles)

Every session with the AI Agent should specify or infer which role is active. When prompted with `@role:<role_name>` or when working within a role's designated directories, assume that role's persona, permissions, and constraints.

| Role ID | Role Name | Primary Owner | Workspace Boundaries | Key Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| `P1` | **Frontend / UI Lead** | Member 1 | `apps/frontend/`, `docs/specs/ui/` | Client web application, components, state management, UI/UX polish |
| `P2` | **Backend / API Lead** | Member 2 | `apps/backend/`, `docs/specs/api/` | Server logic, database models, business workflows, REST/WebSocket APIs |
| `P3` | **AI & Intelligence Lead** | Member 3 | `apps/ai-service/`, `docs/specs/ai/` | LLM pipelines, prompt templates, RAG vector search, AI agent tooling |
| `P4` | **Shared Infra & DevOps Lead**| Member 4 | `packages/shared/`, `infra/`, `.github/` | Common schemas/types, Docker, environment configs, CI/CD, build tools |
| `P5` | **Product & QA Lead** | Member 5 | `docs/tasks/`, `tests/e2e/`, `docs/specs/` | Test suites, quality gates, sprint backlog, contract verification |

---

## 3. The "Docs Coded" Protocol

"Docs Coded" means that documentation is not merely commentary—it is the executable blueprint of the project.

```
                    ┌───────────────────────────┐
                    │  docs/tasks/BACKLOG.md    │  <-- 1. Read Task & Role
                    └─────────────┬─────────────┘
                                  ▼
                    ┌───────────────────────────┐
                    │ docs/contracts/SCHEMA.ts  │  <-- 2. Validate/Extend Contract
                    └─────────────┬─────────────┘
                                  ▼
           ┌──────────────────────┴──────────────────────┐
           ▼                                             ▼
┌─────────────────────┐                       ┌─────────────────────┐
│ Code Implementation │                       │ Documentation Sync  │
│ (Within Boundaries) │                       │ (Update .md files)  │
└─────────────────────┘                       └─────────────────────┘
```

### Pre-Flight Checklist Before Generating Code:
1. **Identify the Active Role**: Read the user prompt or check directory context (`P1` through `P5`).
2. **Verify Boundary**: Does this file belong to the active role? If touching shared files (`packages/shared/`), ensure no breaking changes to existing contracts.
3. **Inspect Contracts**: Check [`packages/shared/contracts/`](file:///Users/bhanurathore/projects/hack/packages/shared/contracts) and [`docs/ARCHITECTURE.md`](file:///Users/bhanurathore/projects/hack/docs/ARCHITECTURE.md).
4. **Inspect Tasks**: Read [`docs/tasks/BACKLOG.md`](file:///Users/bhanurathore/projects/hack/docs/tasks/BACKLOG.md) to ensure work is aligned with current Sprint goals.

### Post-Implementation Checklist:
1. **Update Documentation**: Update relevant `.md` files (e.g. [docs/TASKS.md](file:///Users/bhanurathore/projects/hack/docs/tasks/BACKLOG.md), API specs, or component documentation).
2. **Type Safety & Contract Adherence**: Ensure types imported from shared packages are properly respected.
3. **Verification Command**: Run `./scripts/verify-setup.sh` to confirm contract integrity and directory hygiene.

---

## 4. Branching & Git Protocols for Concurrent AI Work

To prevent merge chaos across 5 members:
- **Branch Naming**: `<role>/<task-id>-<short-description>`  
  - *Example:* `feat/p1-ui-login-page`, `feat/p2-api-auth-endpoints`, `feat/p3-ai-rag-pipeline`
- **Commit Message Format (Conventional Commits)**:
  - `feat(p1-ui): add responsive navigation sidebar`
  - `fix(p2-backend): resolve JWT expiration bug`
  - `docs(p5-qa): update test matrix for v1 release`
- **Zero Cross-Role Overwrites**: Never touch another role's directory in the same commit. Submit shared contract adjustments as separate pull requests or commits tagged with `scope(shared)`.

---

## 5. Agent Invocation Shortcuts

Team members can activate targeted AI behavior using role tags:

- `@role:frontend` — Activate P1 Frontend persona: Emphasize UI component hierarchy, responsive layouts, Tailwind/CSS variables, and mock client-side state.
- `@role:backend` — Activate P2 Backend persona: Emphasize API routing, relational/document database schemas, error middleware, and token validation.
- `@role:ai` — Activate P3 AI persona: Emphasize prompt engineering, token economy, tool calling schemas, embeddings, and context window optimization.
- `@role:devops` — Activate P4 Infra persona: Emphasize Docker compose orchestration, environment variables, monorepo build pipelines, and shared package exports.
- `@role:qa` — Activate P5 QA persona: Emphasize end-to-end integration tests, contract compliance checks, task backlog status, and documentation auditing.

---

## 6. Directory Map Reference

```
/Users/bhanurathore/projects/hack/
├── AGENTS.md                  # <-- MASTER AGENT OPERATING SYSTEM (This file)
├── README.md                  # Project overview & quickstart
├── .agents/                   # Agent custom rules and behaviors
│   └── rules/                 # Granular agent rules (collaboration, docs-sync, contracts)
├── apps/
│   ├── frontend/              # [P1] Client Application
│   ├── backend/               # [P2] Core API & Server
│   └── ai-service/            # [P3] AI Engine & Agents
├── packages/
│   └── shared/                # [P4] Shared Contracts, Types, DTOs
├── infra/                     # [P4] Docker, CI/CD, Local Dev Stacks
├── tests/                     # [P5] E2E & Cross-Service Integration Tests
├── docs/                      # [P5 & Shared] Docs-Coded Knowledge Engine
│   ├── ARCHITECTURE.md        # System design & topology
│   ├── ROLES.md               # 5-Person team charter & responsibilities
│   ├── CONTRACTS.md           # API specs & data contracts
│   ├── tasks/
│   │   └── BACKLOG.md         # Task matrix & sprint progress
│   └── workflows/
│       ├── GIT_WORKFLOW.md    # Branching & merge strategy
│       └── PROMPT_PLAYBOOK.md # Prompt templates for each team member
└── scripts/
    └── verify-setup.sh        # System integrity and contract verification script
```
