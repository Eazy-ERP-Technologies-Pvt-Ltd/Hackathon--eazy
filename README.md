# Hackathon — 5-Person AI-Driven Collaborative Platform

> **Architecture:** Docs-as-Code ("Docs Coded") & Multi-Agent Isolated Workspaces  
> **Team Capacity:** 5 Concurrent Engineers with Autonomous AI Copilots  
> **Primary Agent Entrypoint:** [`AGENTS.md`](file:///Users/bhanurathore/projects/hack/AGENTS.md)  

---

## 🚀 Overview

This repository is engineered specifically for **5 engineers working concurrently with AI agents** during high-velocity development sprints. 

By applying the **"Docs Coded"** methodology, all architectural designs, data models, API endpoints, role boundaries, and sprint backlogs are defined in version-controlled Markdown and TypeScript contracts before code is generated. This eliminates merge collisions, context drift, and API incompatibilities between team members and their AI agents.

---

## 👥 5-Person Role Matrix & Ownership

Each team member and their respective AI copilot has an assigned domain boundary:

| Role ID | Role | Member Directory | AI Invocation | Scope & Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **P1** | **Frontend Lead** | [`apps/frontend/`](file:///Users/bhanurathore/projects/hack/apps/frontend) | `@role:frontend` | Client UI, design tokens, interactive dashboard, responsive layouts |
| **P2** | **Backend Lead** | [`apps/backend/`](file:///Users/bhanurathore/projects/hack/apps/backend) | `@role:backend` | Core API, authentication, database persistence, AI proxy routes |
| **P3** | **AI Engineer** | [`apps/ai-service/`](file:///Users/bhanurathore/projects/hack/apps/ai-service) | `@role:ai` | LLM pipelines, prompt templates, RAG retrieval, agent tool execution |
| **P4** | **Infra & Shared Lead**| [`packages/shared/`](file:///Users/bhanurathore/projects/hack/packages/shared)<br/>[`infra/`](file:///Users/bhanurathore/projects/hack/infra) | `@role:devops` | Shared contracts, types, Docker Compose, CI/CD pipelines |
| **P5** | **Product & QA Lead** | [`docs/tasks/`](file:///Users/bhanurathore/projects/hack/docs/tasks)<br/>[`tests/`](file:///Users/bhanurathore/projects/hack/tests) | `@role:qa` | Backlog management, contract compliance tests, E2E validation |

For in-depth role definitions and boundaries, see [`docs/ROLES.md`](file:///Users/bhanurathore/projects/hack/docs/ROLES.md).

---

## 📐 The "Docs Coded" Blueprint

In this project, documentation functions as machine-executable specifications:

1. **System Design:** [`docs/ARCHITECTURE.md`](file:///Users/bhanurathore/projects/hack/docs/ARCHITECTURE.md) defines network topology, port maps (3000, 8000, 5000), and communication protocols.
2. **Contracts First:** [`docs/CONTRACTS.md`](file:///Users/bhanurathore/projects/hack/docs/CONTRACTS.md) and [`packages/shared/contracts/`](file:///Users/bhanurathore/projects/hack/packages/shared/contracts) define the single source of truth for all API requests and responses.
3. **Task Backlog as Code:** [`docs/tasks/BACKLOG.md`](file:///Users/bhanurathore/projects/hack/docs/tasks/BACKLOG.md) tracks machine-readable sprint tasks (`TASK-P1-001`, `TASK-P2-001`, etc.) with dependencies and validation criteria.
4. **Git Concurrency Protocol:** [`docs/workflows/GIT_WORKFLOW.md`](file:///Users/bhanurathore/projects/hack/docs/workflows/GIT_WORKFLOW.md) standardizes feature branch naming (`feat/<role>-<task>`) and zero-collision PRs.
5. **Prompt Playbook:** [`docs/workflows/PROMPT_PLAYBOOK.md`](file:///Users/bhanurathore/projects/hack/docs/workflows/PROMPT_PLAYBOOK.md) provides ready-to-use prompt templates for each team member.

---

## 🤖 How Your AI Agent Works

Whenever any team member prompts an AI agent (e.g. Antigravity, Claude, Cursor, Copilot):

1. **The agent reads [`AGENTS.md`](file:///Users/bhanurathore/projects/hack/AGENTS.md)** and the active workspace rules under [`.agents/rules/`](file:///Users/bhanurathore/projects/hack/.agents/rules).
2. **The role tag (e.g. `@role:backend`)** instructs the agent to constrain edits strictly to that role's directory.
3. **The agent checks shared contracts** in [`packages/shared/contracts/`](file:///Users/bhanurathore/projects/hack/packages/shared/contracts) before creating or updating endpoints.
4. **The agent automatically updates the relevant `.md` documentation** after any code modification.

---

## 🛠️ Quickstart

### 1. Validate Workspace Integrity
Run the built-in validation script to ensure all files, contracts, and role boundaries are intact:
```bash
./scripts/verify-setup.sh
```

### 2. Local Multi-Service Development
Start all 5 subsystems using Docker Compose:
```bash
# Copy template environment file
cp infra/.env.example .env

# Launch containers
docker-compose -f infra/docker-compose.yml up --build
```

Access points:
- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000) (Health: `GET /health`)
- **AI Service:** [http://localhost:5000](http://localhost:5000) (Health: `GET /health`)

### 3. Individual Service Startup (Without Docker)
```bash
# Frontend (P1)
cd apps/frontend && npm install && npm run dev

# Backend (P2)
cd apps/backend && npm install && npm run dev

# AI Service (P3)
cd apps/ai-service && npm install && npm run dev
```

---

## 🛡️ Workspace Rules & Customizations

Located in [`.agents/rules/`](file:///Users/bhanurathore/projects/hack/.agents/rules):
- [`01-collaboration.md`](file:///Users/bhanurathore/projects/hack/.agents/rules/01-collaboration.md): Role boundaries & branch isolation rules.
- [`02-docs-coded.md`](file:///Users/bhanurathore/projects/hack/.agents/rules/02-docs-coded.md): Contract-first and tasks-as-code requirements.
- [`03-doc-sync.md`](file:///Users/bhanurathore/projects/hack/.agents/rules/03-doc-sync.md): Mandatory documentation synchronization.

---

## 📁 Repository Directory Structure

```
/Users/bhanurathore/projects/hack/
├── AGENTS.md                  # Master AI agent operating instructions
├── README.md                  # Project overview & documentation index
├── .agents/                   # Custom agent behavioral rules
│   └── rules/                 # Collaboration, docs-coded, and doc-sync rules
├── apps/
│   ├── frontend/              # [P1] Client UI & interactive dashboard
│   ├── backend/               # [P2] Core API server & auth/proxy handlers
│   └── ai-service/            # [P3] AI model inference & agent reasoning engine
├── packages/
│   └── shared/                # [P4] Shared DTO contracts & TypeScript types
├── infra/                     # [P4] Docker Compose & environment templates
├── tests/                     # [P5] E2E integration test suite
├── docs/                      # [P5 & Shared] "Docs Coded" Knowledge Base
│   ├── ARCHITECTURE.md        # System architecture & topology
│   ├── ROLES.md               # 5-person team charter & boundaries
│   ├── CONTRACTS.md           # API specs & data contracts
│   ├── tasks/
│   │   └── BACKLOG.md         # Machine-readable task matrix
│   └── workflows/
│       ├── GIT_WORKFLOW.md    # Git branching & PR standards
│       └── PROMPT_PLAYBOOK.md # AI prompt templates for each role
└── scripts/
    └── verify-setup.sh        # Setup validation script
```
