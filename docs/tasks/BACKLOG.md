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

## Sprint 1: Data Unification & Opportunity Loss Detection Engine

### P1: Frontend Team (`apps/frontend/`)
- [ ] `TASK-P1-101`: Build Executive Leakage Dashboard & Revenue-at-Risk Cockpit
  - **Inputs:** `packages/shared/contracts/growth-engine.ts`, `docs/specs/ui/`
  - **Outputs:** `apps/frontend/src/features/dashboard/LeakageCockpit.js`
  - **Validation:** Visualizes critical stockouts, silent churn, and unproductive beat stops with revenue filter toggles.
- [ ] `TASK-P1-102`: Build Field Rep Daily Beat & Prescriptive Action Sheet
  - **Inputs:** `packages/shared/contracts/growth-engine.ts`
  - **Outputs:** `apps/frontend/src/features/field/BeatSheet.js`
  - **Validation:** Renders prioritized outlet visit cards with SKU pitch quantities and WhatsApp push trigger.

### P2: Backend Team (`apps/backend/`)
- [ ] `TASK-P2-101`: Ingestion Pipeline & Relational Schema for 5 Core Datasets
  - **Inputs:** Retailer Master, SKU Master, Schemes & Promotions, DMS, Inventory, SFA logs
  - **Outputs:** `apps/backend/src/models/` and `apps/backend/src/services/ingestion.ts`
  - **Validation:** Clean entity joins across Retailer Master, SKU Master, DMS, WMS, and SFA.
- [ ] `TASK-P2-102`: Core Opportunity Loss Engine & API Router
  - **Inputs:** Cleaned transactions and multi-echelon stock levels
  - **Outputs:** `apps/backend/src/services/loss-engine.ts`, `apps/backend/src/routes/leakages.ts`
  - **Validation:** Detects Phantom Stockouts, Silent Churn, and Field Force Drain; computes `revenue_at_risk`.

### P3: AI & Intelligence Team (`apps/ai-service/`)
- [ ] `TASK-P3-101`: Prescriptive Action Generation Pipeline (LLM Directive Layer)
  - **Inputs:** Deterministic JSON leakage payloads from Backend (`P2`)
  - **Outputs:** `apps/ai-service/src/agents/prescriptive-action.ts`
  - **Validation:** Emits structured 3-bullet Executive Memos and localized 08:30 AM Rep Pitch notifications.
- [ ] `TASK-P3-102`: SKU Affinity & Scheme Optimization Engine
  - **Inputs:** Store purchase history, SKU clusters, active Schemes and Promotions catalog
  - **Outputs:** `apps/ai-service/src/agents/scheme-optimizer.ts`
  - **Validation:** Matches churned retailers with high-margin promotional bundles to maximize win-back probability.

### P4: DevOps & Shared Infra (`packages/shared/`, `infra/`)
- [ ] `TASK-P4-101`: Define Growth Engine Contracts & DTOs
  - **Inputs:** Data dictionary and schema specifications
  - **Outputs:** `packages/shared/contracts/growth-engine.ts`
  - **Validation:** Full TypeScript types for Master Data, Invoices, Inventory, SFA logs, and Directives.
- [ ] `TASK-P4-102`: Feature Store Setup & Mock Data Seeder
  - **Inputs:** Synthetic data generation logic
  - **Outputs:** `infra/seed/data-generator.py`, updated `infra/docker-compose.yml`
  - **Validation:** Seeds 50+ stores, multi-SKU inventory, and 30-day beat history.

### P5: Product & QA (`tests/`, `docs/`)
- [ ] `TASK-P5-101`: Leakage Detection Accuracy & Revenue Calculation Tests
  - **Inputs:** Synthetic edge cases (e.g., zero cover, idle distributor stock, 0% strike rate)
  - **Outputs:** `tests/integration/loss-engine.test.ts`
  - **Validation:** Verified calculation of `revenue_at_risk` and Days of Cover (DoC).
- [ ] `TASK-P5-102`: A/B Testing Measurement Framework & Documentation
  - **Inputs:** Control vs Treatment route protocol
  - **Outputs:** `docs/specs/AB_TESTING_FRAMEWORK.md`
  - **Validation:** Clear statistical formula for Throughput per Productive Call lift.
