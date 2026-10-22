# System Architecture & Technical Blueprint

This document specifies the system design, communication protocols, and runtime architecture for the project.

---

## 1. High-Level System Topology

```mermaid
graph TD
    User([End User / Browser]) -->|HTTPS / WSS| Frontend["Frontend Client (P1)<br/>apps/frontend<br/>Port 3000"]
    Frontend -->|REST API / JSON| Backend["Core Backend API (P2)<br/>apps/backend<br/>Port 8000"]
    Backend -->|Internal REST / gRPC| AIService["AI Intelligence Engine (P3)<br/>apps/ai-service<br/>Port 5000"]
    Backend -->|SQL / NoSQL| Database[(Application DB)]
    AIService -->|Vector Search / Embeddings| VectorDB[(Vector Store)]
    
    subgraph Shared["Contracts & Infrastructure (P4)"]
        SharedTypes["packages/shared/contracts"]
        InfraCompose["infra/docker-compose.yml"]
    end
    
    subgraph Quality["Validation & Docs (P5)"]
        E2ETests["tests/e2e/"]
        DocsEngine["docs/"]
    end

    Frontend -.->|Implements Types| SharedTypes
    Backend -.->|Implements Types| SharedTypes
    AIService -.->|Implements Types| SharedTypes
    E2ETests -.->|Validates Endpoints| Backend
```

---

## 2. Port & Network Allocation

To prevent port collisions across local development and multi-container environments:

| Service | Port | Host Address | Responsibility | Owner |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Web** | `3000` | `http://localhost:3000` | Web UI & SPA Dashboard | `P1` |
| **Backend API** | `8000` | `http://localhost:8000` | Core Business API & Auth | `P2` |
| **AI Engine** | `5050` | `http://localhost:5050` | LLM Agents & Inference (Port 5050 used to avoid macOS AirPlay collision) | `P3` |
| **Primary Database** | `5432` | `localhost:5432` | PostgreSQL (or SQLite local) | `P2` / `P4` |
| **Vector DB / Cache**| `6379` | `localhost:6379` | Redis / Chroma / Qdrant | `P3` / `P4` |

---

## 3. Communication Patterns

### A. Client to Backend (`P1` <-> `P2`)
- **Protocol:** REST over HTTPS + WebSocket for real-time streaming notifications.
- **Authentication:** Bearer JWT in the `Authorization` header.
- **Contract Source:** `packages/shared/contracts/api.ts`.
- **Response Format:**
  ```json
  {
    "success": true,
    "data": {},
    "error": null,
    "meta": { "timestamp": "2026-10-22T06:00:00Z", "requestId": "req_123" }
  }
  ```

### B. Backend to AI Engine (`P2` <-> `P3`)
- **Protocol:** Internal HTTP/JSON RPC.
- **Security:** Internal network isolation / shared service token (`X-Internal-Token`).
- **Contract Source:** `packages/shared/contracts/ai.ts`.
- **Pattern:** Asynchronous job execution or streaming response for LLM token emission.

---

## 4. Monorepo Structure & Module Boundaries

- `apps/frontend/`: Client UI logic only. Consumes `@workspace/shared` for contract types.
- `apps/backend/`: Server logic, routing, database access. Consumes `@workspace/shared`.
- `apps/ai-service/`: LLM chains, prompt templates, agentic tools. Consumes `@workspace/shared`.
- `packages/shared/`: Shared TypeScript models, validation schemas (Zod/JSON Schema), error constants.
- `infra/`: Docker compose, Kubernetes manifests, CI configuration files.
- `docs/`: All documentation, task boards, playbooks, and contracts.
- `tests/`: Integration tests that exercise contracts between the services.

---

## 5. Frontend Visual Analytics & Chart Architecture (`P1`)

The frontend features a high-contrast executive white theme powered by Chart.js (CDN), visualizing live commercial data across 6 specialized charts:

1. **Territory Throughput & Opportunity Loss (`#territoryChartCanvas`)**: Grouped bar chart comparing delivered revenue vs unfulfilled shortfalls across all 12 sales territories.
2. **Category Revenue Share (`#categoryDonutCanvas`)**: Doughnut chart representing ₹62.27 Cr revenue split across 6 product categories.
3. **Opportunity Loss Vectors (`#lossVectorCanvas`)**: Horizontal bar chart breaking down the ₹18.74 Cr leakage vectors (Aged Stock, Silent Churn, Field Force Drain, Ghost Stockouts, Supply Shortfalls).
4. **Distributor Stock Health Profile (`#stockAgingCanvas`)**: Doughnut chart displaying active inventory (300,916 units) vs slow-moving 90+ days (13,369 units) and critical 180+ days (2,717 units).
5. **Field Rep Performance Anomaly (`#repProductivityCanvas`)**: Dual-axis bar chart correlating rep strike rate against non-compliant drive-by visits (<10 min).
6. **Scheme Commercial ROI (`#schemeRoiCanvas`)**: Grouped comparative bar chart quantifying promotional spend vs incremental sales lift across trade incentive programs.
