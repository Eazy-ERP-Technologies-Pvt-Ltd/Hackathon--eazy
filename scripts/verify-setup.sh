#!/usr/bin/env bash

# ==============================================================================
# verify-setup.sh — 5-Person AI Collaborative Setup Validator
# ==============================================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}  Validating 5-Person AI Collaborative Repository     ${NC}"
echo -e "${BLUE}======================================================${NC}\n"

ERRORS=0

check_file() {
  if [ -f "$1" ]; then
    echo -e "  [${GREEN}OK${NC}] File found: $1"
  else
    echo -e "  [${RED}FAIL${NC}] Missing file: $1"
    ERRORS=$((ERRORS + 1))
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo -e "  [${GREEN}OK${NC}] Directory found: $1"
  else
    echo -e "  [${RED}FAIL${NC}] Missing directory: $1"
    ERRORS=$((ERRORS + 1))
  fi
}

echo -e "${YELLOW}1. Checking Agent Operating Files & Rules:${NC}"
check_file "AGENTS.md"
check_file "README.md"
check_file ".agents/rules/01-collaboration.md"
check_file ".agents/rules/02-docs-coded.md"
check_file ".agents/rules/03-doc-sync.md"

echo -e "\n${YELLOW}2. Checking Docs-Coded Knowledge Engine:${NC}"
check_file "docs/ROLES.md"
check_file "docs/ARCHITECTURE.md"
check_file "docs/CONTRACTS.md"
check_file "docs/tasks/BACKLOG.md"
check_file "docs/workflows/GIT_WORKFLOW.md"
check_file "docs/workflows/PROMPT_PLAYBOOK.md"

echo -e "\n${YELLOW}3. Checking 5-Person Domain Boundaries:${NC}"
check_dir "apps/frontend"
check_dir "apps/backend"
check_dir "apps/ai-service"
check_dir "packages/shared"
check_dir "infra"
check_dir "tests"

echo -e "\n${YELLOW}4. Checking Shared Contracts & Interfaces:${NC}"
check_file "packages/shared/contracts/api.ts"
check_file "packages/shared/contracts/ai.ts"
check_file "packages/shared/contracts/user.ts"
check_file "packages/shared/contracts/index.ts"

echo -e "\n${YELLOW}5. Checking GitHub Collaborative Workflows:${NC}"
check_file ".github/CODEOWNERS"
check_file ".github/PULL_REQUEST_TEMPLATE.md"

echo -e "\n------------------------------------------------------"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}SUCCESS: Workspace verification passed! (0 errors)${NC}"
  echo -e "All 5 domains and AI Agent protocols are properly configured."
  exit 0
else
  echo -e "${RED}FAILED: Found $ERRORS issues during setup verification.${NC}"
  exit 1
fi
