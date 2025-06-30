#!/bin/bash

set -e

# === GUARDIAN OSS UNIVERSAL START SCRIPT ===

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

function check_command() {
  if ! command -v "$1" &> /dev/null
  then
    echo -e "${RED}Missing: $1${NC}"
    return 1
  else
    echo -e "${GREEN}Found: $1${NC}"
    return 0
  fi
}

function docker_mode() {
  echo -e "\n${GREEN}Running in Docker Compose mode...${NC}"
  docker compose up --build
}

function native_mode() {
  echo -e "\n${GREEN}Running in native host mode...${NC}"

  MISSING=0

  check_command node || MISSING=1
  check_command bun || MISSING=1
  check_command git || MISSING=1
  check_command ollama || MISSING=1

  if [[ "$MISSING" -eq 1 ]]; then
    echo -e "\n${RED}Missing required dependencies. Please install them before continuing.${NC}"
    exit 1
  fi

  echo -e "\nInstalling subproject dependencies..."

  for dir in codegen-worker guardian-api guardian-cli guardian-dashboard ollama-proxy guardian-open; do
    if [ -d "$dir" ]; then
      echo "\n=> Installing in $dir"
      cd "$dir"
      bun install
      cd ..
    fi
  done

  echo -e "\nInstalling guardian-cli globally..."
  cd guardian-cli
  bun install
  bun run build || true
  bun link
  cd ..

  echo -e "\nStarting core services..."

  cd guardian-api && bun run dev & cd ..
  cd ollama-proxy && bun run dev & cd ..
  cd guardian-dashboard && bun run dev & cd ..

  echo -e "\nLaunching onboarding wizard..."
  guardian-cli launch
}

# Entry point

echo "Guardian OSS Universal Bootstrap"
echo "----------------------------------"
echo "Choose startup mode:"
echo "1) Docker Compose (recommended for quick start)"
echo "2) Native Host (for local development)"
read -p "Enter choice [1 or 2]: " choice

if [ "$choice" == "1" ]; then
  docker_mode
elif [ "$choice" == "2" ]; then
  native_mode
else
  echo -e "${RED}Invalid choice.${NC}"
  exit 1
fi
