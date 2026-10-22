# Backend API Server (`apps/backend`)

> **Primary Owner:** Person 2 (`P2` - Backend & API Lead)  
> **Agent Tag:** `@role:backend`  
> **Port:** `8000`  
> **Contracts:** Exposes APIs strictly matching [`packages/shared/contracts/`](file:///Users/bhanurathore/projects/hack/packages/shared/contracts)

---

## Overview
This service powers the core business logic, database persistence, and API gateway routes for authentication and AI model proxying.

## Directory Structure
```
apps/backend/
├── src/
│   ├── routes/          # Express/Fastify/Hono API routes
│   │   ├── health.ts    # Healthcheck endpoint (GET /health)
│   │   └── ai.ts        # AI gateway route (POST /api/ai/infer)
│   ├── services/        # Business logic services
│   ├── middleware/      # Auth, logging, and error handling
│   └── server.ts        # Server bootstrap and port listener
└── package.json
```

## Running Locally
```bash
npm install
npm run dev
# Running at http://localhost:8000
```

## Contract Compliance
- Responses must be wrapped in `ApiResponse<T>`.
- AI requests routed to `http://localhost:5000/infer` must conform to `AIInferenceRequest`.
