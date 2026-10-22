# AI Service Engine (`apps/ai-service`)

> **Primary Owner:** Person 3 (`P3` - AI & Intelligence Systems Lead)  
> **Agent Tag:** `@role:ai`  
> **Port:** `5000`  
> **Contracts:** Exposes inference endpoints defined in [`packages/shared/contracts/ai.ts`](file:///Users/bhanurathore/projects/hack/packages/shared/contracts/ai.ts)

---

## Overview
This service houses LLM orchestration, model provider abstraction (OpenAI, Gemini, Anthropic, Ollama), vector store retrieval (RAG), and agentic tool dispatch.

## Directory Structure
```
apps/ai-service/
├── src/
│   ├── agent.ts         # Agent reasoning loop & prompt execution
│   ├── providers/       # LLM provider adapters
│   ├── tools/           # Custom tool definitions (retrieval, code execution)
│   └── server.ts        # Internal HTTP inference listener
└── package.json
```

## Running Locally
```bash
npm install
npm run dev
# Inference listener active at http://localhost:5000/infer
```

## Environment Configuration
Set in `.env`:
- `GEMINI_API_KEY`: API key for Gemini models.
- `OPENAI_API_KEY`: API key for OpenAI models.
- `DEFAULT_MODEL`: `gemini-1.5-pro` or `gpt-4o`.
