#!/usr/bin/env bash
set -e

# Ingest data if not already generated
[ -f "apps/backend/src/data/growth_engine_data.json" ] || python3 scripts/build_engine_data.py

# Free ports 3000, 8000, 5050
for port in 3000 8000 5050; do
  lsof -ti :$port | xargs kill -9 2>/dev/null || true
done

echo "🚀 Starting EazyGrowth Services (Ports: 3000 Web | 8000 API | 5050 AI)..."
npx -y tsx apps/ai-service/src/server.ts > /dev/null 2>&1 &
PIDS=$!
npx -y tsx apps/backend/src/server.ts > /dev/null 2>&1 &
PIDS="$PIDS $!"
node apps/frontend/server.js > /dev/null 2>&1 &
PIDS="$PIDS $!"

sleep 1
open http://localhost:3000 2>/dev/null || true

echo "✓ Dashboard: http://localhost:3000 | Press Ctrl+C to stop"
trap "kill $PIDS 2>/dev/null || true; exit 0" SIGINT SIGTERM
wait
