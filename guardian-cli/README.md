# 🛠️ Guardian CLI

The `guardian-cli` is a local-first command line tool for interacting with your Guardian system.

It lets you trigger automations, run pipelines, ingest memory, and interface with your agents and backend workflows directly from the terminal.

---

## 🔧 Why This Exists

Most automation tools are web-based and require cloud access.
The Guardian CLI was built to offer:

- ✅ Local-first control over your agents and pipelines
- ✅ Easy task triggering without needing to open a dashboard
- ✅ Seamless access to self-hosted APIs and services
- ✅ Support for custom extensions and developer workflows

---

## ⚙️ Current Capabilities

> 🔖 Commands may evolve — this CLI is designed to grow with your infrastructure.

- `guardian bloggen` — Trigger the AI-powered blog post generation pipeline
- `guardian ingest ./folder` — Ingest a folder of files or notes into your memory system
- `guardian run task` — Run a custom action or workflow (experimental)
- `guardian reflect` — Trigger self-reflection and memory consolidation (coming soon)

---

## 🚀 Getting Started

1. Make sure your `.env` file is configured with your API keys and local endpoints.
2. Link the CLI locally:

```bash
cd services/guardian-cli
bun link
```

Now you can run commands like:
```bash
guardian bloggen
```

---

## 📦 File Structure

```
guardian-cli/
├── index.js           # Entry point (kept in JavaScript for now)
├── commands/          # Individual command handlers
│   ├── bloggen.js
│   ├── ingest.js
│   └── run.js
├── lib/               # Shared utils
├── .env.example       # Environment variables
```

---

## 🧠 Part of the Guardian Stack

This CLI pairs with:
- `guardian-open` — send and receive memory + task data
- `codegen-worker` — trigger dev flows
- `ollama-proxy` — issue local LLM calls

It’s your developer interface to an agentic system.

---

## 💡 Future Plans

- Convert to TypeScript with Bun/TSX
- Add pipeline introspection commands
- Add `guardian flow` support for AgentFlow JSON

> Built for developers who want to own their AI automation stack — all from the terminal.
