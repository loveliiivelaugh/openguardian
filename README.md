[![Guardian OSS](https://img.shields.io/badge/guardian-oss-blue)](https://github.com/loveliiivelaugh/guardian-oss)

# 🧠 `guardian-open`

*A minimal, open-source starter brain for local-first autonomous software systems.*

---

Read [Getting Set Up](https://blog.woodwardwebdev.com/post/getting-set-up-tools-i-use-to-power-my-stack)

Read the [full tutorial series](https://blog.woodwardwebdev.com/post/the-guardian-tutorial-series) for step-by-step guides on setting up and using Guardian.

---

### 🚀 What is This?

`guardian-open` is the open-source foundation of my agentic infrastructure system — a **self-hosted AI automation engine** built with LLMs, memory, pipelines, and real-time tooling. It’s designed to help developers:

* Automate reasoning and task handling with `runLLM`
* Store and retrieve memory with Qdrant + Supabase
* Trigger actions via code, CLI, or agents
* Build upon real infrastructure — not toy examples

---

### 🧱 Included Services

This project is a bundled OSS release of the core Guardian system — a modular, local-first AI infrastructure stack. It includes four key services, each designed to run independently or as part of a unified agentic automation engine.

| Service                                          | Description                                                                                                                                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🧠 [`guardian-open`](./src)                      | The main backend server. Handles memory creation, LLM routing, metadata storage, and API orchestration using Bun + Hono + Supabase + Qdrant.                                                |
| ✍️ [`codegen-worker`](./services/codegen-worker) | A task-triggered microservice that receives input (like feature prompts or TDD test plans), generates production-ready code using LLMs, and returns structured output.                      |
| 🔁 [`ollama-proxy`](./services/ollama-proxy)     | A smart router for LLM requests. Wraps Ollama calls with memory context, schema formats, and model selection logic. Designed to give your system LLM superpowers with centralized control.  |
| 🛠️ [`guardian-cli`](./services/guardian-cli)    | A local-first CLI to interact with the Guardian server and trigger workflows like ingesting files, running blog or codegen pipelines, and managing memory. Lightweight and script-friendly. |

> Each service runs independently and can be used standalone or together as a foundation for agentic automation workflows.

---

## 🧠 Quick Start

```bash
# Clone the repo
git clone https://github.com/woodwardstudio/guardian-oss.git
cd guardian-oss

# Copy and edit config
cp .env.template .env

# Start the Sovereign AI system
bash scripts/bootstrap.sh
```

### 📦 Install Dependencies

Run this to get started:

```bash
git clone https://github.com/loveliiivelaugh/guardian-oss.git
cd guardian-oss
bun install
docker compose up
```
This will install the dependencies and start all the services.

* `guardian-open` - The main backend server. Handles memory creation, LLM routing, metadata storage, and API orchestration using Bun + Hono + Supabase + Qdrant. [port 9876]
* `codegen-worker` - A task-triggered microservice that receives input (like feature prompts or TDD test plans), generates production-ready code using LLMs, and returns structured output. [port 3535]
* `ollama-proxy` - A smart router for LLM requests. Wraps Ollama calls with memory context, schema formats, and model selection logic. Designed to give your system LLM superpowers with centralized control. [port 3456]

### Guardian CLI
To install the Guardian CLI
🧙🏼‍♂️ Use this 👉
```bash
bun install -g ./services/guardian-cli
```

---

### 📁 Project Structure

```
guardian-oss/
├── config/              # Shared client configs (LLMs, APIs, DB)
├── services/            # Optional local tools (CLI, codegen, LLM proxy)
├── src/
│   └── lib/             # Core memory and automation utilities
│       ├── addMemory.ts
│       ├── embed.ts
│       ├── runLLM.ts
│       ├── logSystemEvent.ts
│       └── withHandler.ts
├── scripts/             # Bash scripts for setup, seeding, testing (coming soon)
├── .env.example         # Reference for your environment variables
├── README.md            # You're here
```

---

### 🧪 Example Usage

```ts
import { runLLM, addMemory } from "./src/lib";

await addMemory({
  content: "Shipped Guardian Open v1.0",
  type: "Reflection",
  tags: ["release", "guardian"],
});

const result = await runLLM("Summarize the core memory system design");
console.log(result);
```

---

### 🔐 Required `.env` Keys

Create a `.env` file using `.env.example` and include:

```env
NOTION_API_KEY=
GOOGLE_GENAI_KEY=
N8N_API_KEY=
N8N_BASE_URL=http://localhost:5678/api/v1
SLACK_BOT_TOKEN=
WORDPRESS_BASIC=base64encoded
WORDPRESS_HOSTNAME=https://yourwordpress.com/wp-json/wp/v2
HOME_ASSISTANT_ACCESS_TOKEN=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=
DATABASE_URL=postgres://...
```
See how to set this up in the 👉 [Guardian Environment Setup]()

---

### 📚 Tutorials & Documentation

All tutorials for this repo live on my blog:
👉 [The Guardian Tutorial Series](https://blog.woodwardwebdev.com/post/the-guardian-tutorial-series)

You’ll find step-by-step guides for:

* Setting up Supabase, Qdrant, and Ollama
* Building the MemoryManager
* Running BlogGen, CodeGen, and TestGen pipelines
* Hooking into Notion, Slack, WordPress, and more

---

### 🔧 Scripts (Coming Soon)

Inside `/scripts/`:

* `dev.sh` → Starts local services (Qdrant, Supabase, etc.)
* `seed.ts` → Populates sample memory + test data
* `bootstrap.sh` → One-liner to install, run, and test everything

---

### Qdrant Memory
To set up the default memory collection in Qdrant
🧙🏼‍♂️ Use this 👉
```bash
curl -X PUT http://localhost:6333/collections/memories \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": {
      "size": 1024,
      "distance": "Cosine"
    }
  }'
```

---

### 🧩 Coming Soon

* [x] Guardian CLI installable via `pnpm dlx`
* [ ] Memory ingestion loop
* [ ] UI walkthrough via blog
* [ ] Minimal `AgentFlow` support
* [ ] Full tutorial map

---

### 💬 Need Help?

* Reach out via [X / Twitter](https://x.com/LoveLiiiveLaugh)
* Open an issue or feature request
* Want to hire me to set this up for your business? [Work with me](https://blog.woodwardwebdev.com/services)

---

### 🧙‍♂️ Author

Built by [Michael Woodward](https://blog.woodwardwebdev.com)
I build sovereign AI infrastructure using local-first tools and agentic pipelines.
This repo is part of the Guardian AI ecosystem.

