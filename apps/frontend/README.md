# Frontend Application (`apps/frontend`)

> **Primary Owner:** Person 1 (`P1` - Frontend & UI/UX Lead)  
> **Agent Tag:** `@role:frontend`  
> **Port:** `3000`  
> **Contracts:** Implements contracts from [`packages/shared/contracts/`](file:///Users/bhanurathore/projects/hack/packages/shared/contracts)

---

## Overview
This application serves as the user-facing web interface. It connects to the Core Backend API on port `8000` and displays real-time AI inference streams.

## Directory Structure
```
apps/frontend/
├── src/
│   ├── components/      # Reusable UI widgets (Layout, Navbar, Buttons)
│   ├── features/        # Feature modules (Chat, Auth, Dashboard)
│   ├── services/        # API client consuming backend endpoints
│   ├── index.html       # HTML entrypoint
│   └── styles.css       # Design tokens & styling
└── package.json
```

## Running Locally
```bash
npm install
npm run dev
# Accessible at http://localhost:3000
```

## Active Sprint Tasks
See [`docs/tasks/BACKLOG.md`](file:///Users/bhanurathore/projects/hack/docs/tasks/BACKLOG.md) under `P1: Frontend Team`.
