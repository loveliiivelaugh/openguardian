# ✍️ Codegen Worker

The `codegen-worker` service is a decoupled code generation and test automation microservice.

It receives task instructions (usually in the form of structured prompts), generates production code or test files using a local LLM, and returns clean, formatted outputs — ready to be injected back into your filesystem, CI/CD pipeline, or agent loop.

---

## 🔧 Why This Exists

Most LLM-based tools generate code *inside the same process* as the orchestrator — leading to tight coupling, harder debugging, and no isolation.

The Codegen Worker was built to:

- ✅ Run test generation separately from the Guardian server
- ✅ Accept structured tasks from CLI, agents, or orchestrators
- ✅ Streamline code + test + doc generation loops
- ✅ Use local models (via Ollama Proxy) to generate deterministic, context-aware output

---

## 🧱 Core Features

- 📦 Accepts prompt instructions via POST
- 🧠 Uses Ollama via `ollama-proxy` for model inference
- 🧪 TDD-first: can generate test files before code files
- 📁 Structured return format: `{ code, tests, docs, filename }`
- 🔌 Designed to plug into a larger automation pipeline or run independently

---

## 📥 Example Usage

Send a POST request to generate a new file:

```bash
curl -X POST http://localhost:8789/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a TypeScript helper that parses Markdown frontmatter and returns metadata.",
    "format": "ts"
  }'
```

Returns:
```json
{
  "filename": "parseFrontmatter.ts",
  "code": "...",
  "tests": "...",
  "docs": "..."
}
```

---

## 🚀 Getting Started

1. Make sure `ollama-proxy` is running at `localhost:3456`
2. Start the codegen worker:
```bash
bun run dev
```
3. POST to `/generate` with a `prompt` and optional `format` or `task metadata`

---

## 📦 Folder Structure

```
codegen-worker/
├── index.ts               # Hono server entry
├── generate.ts            # Main route logic
├── helpers/               # Prompt builders, formatters, etc.
├── examples/              # Optional demo inputs
├── .env.example           # Env vars (optional)
```

---

## 🧠 Part of the Guardian Stack

The `codegen-worker` can be used standalone, or as part of:
- `guardian-open`: for agent-powered task triggering
- `guardian-cli`: for local dev automation

> Use this service to automate feature generation, enforce TDD, or explore code reflection loops.
