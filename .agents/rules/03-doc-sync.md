# Workspace Rule: Mandatory Markdown Documentation Sync

## Strict Synchronization Requirement
1. **Always Update MD Files**: Whenever code, APIs, configuration, dependencies, or architectural patterns are added, modified, or removed, the agent **MUST** immediately update the corresponding Markdown (`.md`) documentation files across the project.
2. **Key Files to Update**:
   - `docs/tasks/BACKLOG.md`: Update task status (e.g. `[ ]` to `[x]`, notes, PR references).
   - `docs/CONTRACTS.md`: Update API endpoints, payload schemas, and response formats when endpoints change.
   - `docs/ARCHITECTURE.md`: Update data flow or component relationships if service topology changes.
   - `README.md`: Update quickstart instructions, port mappings, or environment variables if dependencies evolve.
3. **No Discrepancies**: It is considered an error for implementation code to differ from what is documented in the `.md` files.
