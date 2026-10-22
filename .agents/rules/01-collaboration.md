# Workspace Rule: 5-Person Multi-Agent Collaboration Protocol

## Concurrency & Role Isolation
1. **Five Designated Roles**:
   - `P1 - Frontend Engineer` (`apps/frontend/`)
   - `P2 - Backend Engineer` (`apps/backend/`)
   - `P3 - AI Engineer` (`apps/ai-service/`)
   - `P4 - Shared Infra & DevOps` (`packages/shared/`, `infra/`)
   - `P5 - Product & QA Lead` (`docs/tasks/`, `tests/`)

2. **Strict File Isolation**:
   - When handling requests for a specific role, DO NOT edit files belonging to other roles unless an explicit contract change is approved.
   - Any inter-service data or protocol change MUST be executed first in `packages/shared/contracts/` before updating consumer services.

3. **Branching Standard**:
   - All work happens in isolated feature branches: `<role-prefix>/<task-id>-<description>`.
   - Never commit directly to `main` without running `./scripts/verify-setup.sh`.
