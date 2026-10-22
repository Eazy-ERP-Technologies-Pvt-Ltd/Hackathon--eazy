# Infrastructure & Shared Environment (`infra/`)

> **Primary Owner:** Person 4 (`P4` - Shared Infra & DevOps Lead)  
> **Agent Tag:** `@role:devops`  

---

## Overview
This folder contains container specifications, Docker Compose orchestration for local development, and continuous integration configs.

## Local Multi-Service Spin-Up
```bash
# 1. Copy environment template
cp infra/.env.example .env

# 2. Launch all services with Docker Compose
docker-compose -f infra/docker-compose.yml up --build
```

## Service Access Points
- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **AI Engine:** [http://localhost:5000](http://localhost:5000)
- **Postgres DB:** `localhost:5432`
