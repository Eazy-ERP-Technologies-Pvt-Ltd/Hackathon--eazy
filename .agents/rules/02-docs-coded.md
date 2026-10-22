# Workspace Rule: Docs Coded (Docs-as-Code) Standard

## Core Principle
Documentation in this project is "coded" and machine-actionable:
1. **Contract-First**: Every data exchange between Frontend (`P1`), Backend (`P2`), and AI Engine (`P3`) is defined as a TypeScript interface and JSON schema in `packages/shared/contracts/`.
2. **Tasks as Code**: Sprint tasks, features, and fixes are tracked in `docs/tasks/BACKLOG.md` with explicit role ownership, inputs, outputs, and validation criteria.
3. **Traceability**: Every commit and PR must map to a task ID in `docs/tasks/BACKLOG.md`.
4. **Agent Self-Checking**: Before an agent declares any task complete, it must verify the implementation against the contract schema.
