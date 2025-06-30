#!/bin/bash

# Check if Qdrant is running
if ! curl -s http://localhost:6333 > /dev/null; then
  echo "Starting Qdrant..."
  docker compose up -d qdrant
else
  echo "Qdrant already running."
fi

# Check if Ollama is running
if ! curl -s http://localhost:11434 > /dev/null; then
  echo "Starting Ollama..."
  docker compose up -d ollama
else
  echo "Ollama already running."
fi

# Optional: OpenWebUI
if [[ "$USE_OPENWEBUI" == "true" ]]; then
  docker compose --profile openwebui up -d
fi

# Optional: n8n
if [[ "$USE_N8N" == "true" ]]; then
  docker compose --profile n8n up -d
fi

# Start core Guardian services
docker compose up -d guardian-api guardian-dashboard ollama-proxy postgres
