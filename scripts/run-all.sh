#!/usr/bin/env bash

# ==============================================================================
# run-all.sh — 1-Click Multi-Service Runner for EazyGrowth Engine
# Starts:
#   1. AI Intelligence Engine (Port 5050)
#   2. Core Backend API (Port 8000)
#   3. Frontend Web Dashboard (Port 3000)
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}  Starting Eazy AI Opportunity Loss & Growth Engine   ${NC}"
echo -e "${BLUE}======================================================${NC}\n"

# 1. Check / Generate Processed Dataset
if [ ! -f "apps/backend/src/data/growth_engine_data.json" ]; then
  echo -e "${YELLOW}Dataset JSON not found. Running Python ingestion pipeline...${NC}"
  python3 scripts/build_engine_data.py
fi

# 2. Kill existing processes on ports 3000, 8000, 5050 if running
cleanup_port() {
  local port=$1
  local pid=$(lsof -ti :$port 2>/dev/null || true)
  if [ -n "$pid" ]; then
    echo -e "Freeing port $port (PID: $pid)..."
    kill -9 $pid 2>/dev/null || true
  fi
}

cleanup_port 3000
cleanup_port 8000
# Only kill port 5050 if it's node (don't kill AirPlay if on 5000)
pid_5050=$(lsof -ti :5050 2>/dev/null || true)
if [ -n "$pid_5050" ]; then
  kill -9 $pid_5050 2>/dev/null || true
fi

echo -e "\n${YELLOW}1. Starting AI Intelligence Engine (Port 5050)...${NC}"
npx -y tsx apps/ai-service/src/server.ts > /dev/null 2>&1 &
PID_AI=$!
sleep 1

echo -e "${YELLOW}2. Starting Backend Core API (Port 8000)...${NC}"
npx -y tsx apps/backend/src/server.ts > /dev/null 2>&1 &
PID_BACKEND=$!
sleep 1

echo -e "${YELLOW}3. Starting Frontend Web Client (Port 3000)...${NC}"
node apps/frontend/server.js > /dev/null 2>&1 &
PID_FRONTEND=$!
sleep 1

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}  ✓ All 3 services are active!                         ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "  • Frontend Web Client : ${BLUE}http://localhost:3000${NC}"
echo -e "  • Backend Core API    : ${BLUE}http://localhost:8000${NC}"
echo -e "  • AI Service (Engine) : ${BLUE}http://localhost:5050${NC}"
echo -e "\nOpening browser to http://localhost:3000..."

open http://localhost:3000 2>/dev/null || true

echo -e "\n${YELLOW}Press Ctrl+C to stop all services.${NC}"
trap "kill $PID_AI $PID_BACKEND $PID_FRONTEND 2>/dev/null || true; exit 0" SIGINT SIGTERM
wait
