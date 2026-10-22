# End-to-End & Integration Tests (`tests/`)

> **Primary Owner:** Person 5 (`P5` - Product & QA Lead)  
> **Agent Tag:** `@role:qa`  

---

## Overview
This directory contains system integration tests, contract compliance checks, and end-to-end verification suites to ensure seamless communication between Frontend (`P1`), Backend (`P2`), and AI Engine (`P3`).

## Running Tests
```bash
# Run integrity & contract verification
./scripts/verify-setup.sh

# Run E2E health suite (when servers are running)
npx tsx tests/e2e/health.test.ts
```
