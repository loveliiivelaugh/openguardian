# 🔁 Ollama Proxy

The `ollama-proxy` is a lightweight inference router for local LLMs. It standardizes requests to Ollama, injects memory context when needed, and optionally formats responses using structured output schemas.

Use this service to cleanly separate your core automation logic from direct model calls — allowing you to swap models, inject memory, or enforce structured formats with zero friction.

---

## 🔧 Why This Exists

Raw model calls (even locally) can get messy fast:

- Different models have different input shapes
- No standard way to inject memory or schema format
- Local dev requires flexible routing and debugging

This proxy provides a clean interface for intelligent model selection and structured prompt execution.

---

## 🧠 Core Features

- 🔁 Route requests to different models: `llama3`, `deepseek`, etc.
- 🧠 Inject memory into prompts if context is provided
- 📄 Accept optional JSON schema for structured output (via `format`)
- 🧩 Compatible with any Ollama model served at `localhost:11434`
- 🔌 Minimal, stateless service — can be used from CLI, agent, or orchestrator

---

## 📥 Example Request

```bash
curl -X POST http://localhost:3456/proxy/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3:latest",
    "messages": [
      { "role": "user", "content": "Explain quantum entanglement in simple terms." }
    ]
  }'
```

Optional JSON format:
```json
"format": {
  "type": "object",
  "properties": {
    "summary": { "type": "string" },
    "metaphor": { "type": "string" }
  },
  "required": ["summary"]
}
```

---

## 🚀 Getting Started

1. Make sure [Ollama](https://ollama.com/) is installed and running locally:
```bash
ollama run llama3
```

2. Start the proxy server:
```bash
bun run dev
```

3. Send POST requests to `http://localhost:3456/proxy/chat`

---

## 📦 Folder Structure

```
ollama-proxy/
├── index.ts           # Hono server + routes
├── lib/               # Context injection, prompt builders, schema handling
├── .env.example       # Optional config (e.g. default model)
```

---

## 🧠 Part of the Guardian Stack

- Used by `guardian-open` to route all LLM requests
- Shared by `codegen-worker` and other services for model inference
- Plays nicely with memory context and JSON schema generation

> Think of it as your local LLM gateway — smarter than raw model access, and agent-ready out of the box.
