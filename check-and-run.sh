#!/bin/bash

# Check if Qdrant is already running
if ! nc -z localhost 6333; then
  echo "Starting Qdrant..."
  docker-compose up -d qdrant
else
  echo "Qdrant already running"
fi

# Check if Ollama is installed and running
if ! command -v ollama &> /dev/null; then
  echo "Ollama not found. Installing..."
  curl -fsSL https://ollama.com/install.sh | sh
fi

if ! pgrep -f "ollama" > /dev/null; then
  echo "Starting Ollama..."
  ollama serve &
fi

# Optional: Start OpenWebUI if requested
if [ "$USE_OPENWEBUI" = "true" ]; then
  docker run -d -p 3000:3000 --name openwebui ghcr.io/open-webui/open-webui:main
fi
