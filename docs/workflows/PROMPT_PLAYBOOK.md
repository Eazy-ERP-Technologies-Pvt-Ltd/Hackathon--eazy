# AI Agent Prompt Playbook (For All 5 Team Members)

This playbook contains battle-tested prompt templates for each team member to prompt their AI Agent effectively while maintaining repository harmony and contract compliance.

---

## 1. Universal Agent Header

Whenever a team member starts a session with their AI Agent, they can prepend this header:

```markdown
@role:<YOUR_ROLE>
I am working on Task ID: <TASK_ID> from docs/tasks/BACKLOG.md.
Before writing code:
1. Review my role boundaries in docs/ROLES.md.
2. Read the relevant contracts in docs/CONTRACTS.md and packages/shared/contracts/.
3. Keep changes isolated to my role's directories.
4. After implementation, update all affected .md files.
```

---

## 2. Role-Specific Prompt Templates

### A. Person 1: Frontend & UI Lead
```markdown
@role:frontend
We need to implement the Chat Feed component for TASK-P1-102.
- Directory: apps/frontend/src/features/chat/
- Consume the AIInferenceResponse contract from packages/shared/contracts/ai.ts.
- Make the UI responsive with glassmorphic styling and auto-scroll to the latest token.
- Update docs/tasks/BACKLOG.md and docs/specs/ui/ when complete.
```

### B. Person 2: Backend & API Lead
```markdown
@role:backend
We need to implement the AI proxy router for TASK-P2-102.
- Directory: apps/backend/src/routes/ai.ts
- Expose POST /api/ai/infer adhering to ApiResponse<AIInferenceResponse>.
- Forward the payload to http://localhost:5000/infer (apps/ai-service).
- Include request validation and error handling.
- Update docs/CONTRACTS.md and docs/tasks/BACKLOG.md when complete.
```

### C. Person 3: AI & Intelligence Lead
```markdown
@role:ai
We need to implement the model provider wrapper for TASK-P3-101.
- Directory: apps/ai-service/src/providers/
- Support streaming responses conforming to packages/shared/contracts/ai.ts.
- Add structured tool calling support for system actions.
- Update docs/specs/ai/ and docs/tasks/BACKLOG.md when complete.
```

### D. Person 4: Shared Infra & DevOps Lead
```markdown
@role:devops
We need to add a new shared data type for user preferences.
- Directory: packages/shared/contracts/
- Create UserPreferences interface with theme, language, and notification settings.
- Ensure zero breaking changes to existing contracts in packages/shared/contracts/user.ts.
- Run ./scripts/verify-setup.sh and update docs/CONTRACTS.md.
```

### E. Person 5: Product & QA Lead
```markdown
@role:qa
We need an integration test verifying the full flow from Backend to AI Service.
- Directory: tests/e2e/
- Verify that POST /api/ai/infer returns an ApiResponse matching the contract.
- Update test matrix in docs/tasks/BACKLOG.md.
```
