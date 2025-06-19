# 🧠 The Architecture of `guardian-open`

*Why I chose Bun, Hono, and microservices — and how it all works together.*

---

### ⚙️ Runtime: **Bun**

I chose [**Bun**](https://bun.sh) as the runtime because it’s:

* **Fast by default** — excellent for memory-heavy agent tasks
* **Native TypeScript** — no build step needed
* **Includes its own bundler, test runner, and .env loader**
* Great for writing small, composable services with zero boilerplate

Bun helps me treat each file or microservice like a self-contained function — **perfect for an autonomous system that evolves over time.**

---

### 🧩 Framework: **Hono**

Each service (like the CLI, codegen worker, and ollama proxy) is built using [**Hono**](https://hono.dev), a tiny but powerful web framework for Bun and Deno.

* ✅ Lightweight and **blazing fast**
* ✅ Type-safe, ergonomic, and pairs beautifully with Bun
* ✅ Compatible with `@hono/zod-openapi` for self-documenting routes
* ✅ Works like Express, but faster and better typed

I use `@hono/zod-openapi` for routes that I want to expose and document automatically, especially as Guardian starts reasoning over its own routes.

---

## 🔄 Microservices Overview

Guardian is built around **loosely coupled, task-specific microservices**, which lets it run tasks in parallel, scale out in the future, and **separate responsibilities cleanly**.

---

### 🧠 `ollama-proxy`

**Why not use Ollama directly?**

I built this proxy for several reasons:

* 🔒 **Centralized context injection** — it adds memory + instruction wrapper to every LLM call
* 📦 **Encapsulation** — allows swapping Ollama for another model (local or API) without changing client code
* 🔁 **Routing logic** — different agents or tasks can use different models (e.g., `llama3`, `dolphin`, `deepseek`)
* 📜 **Auditable logging** — I can log every prompt + response to Guardian memory

This lets me treat `runLLM()` as a black box in the main code — the actual intelligence routing is offloaded to this smart layer.

---

### 🔧 `guardian-cli`

The CLI is **local-first** by design.

* Runs directly on your machine (or inside a container)
* Uses Bun's built-in `.env` + fs support
* Can trigger pipelines like:

  * `guardian ingest ./notes`
  * `guardian bloggen`
  * `guardian reflect`
* Works offline — you own your tooling

This supports my vision of **sovereign, developer-owned infrastructure** that runs without dependency on external APIs or clouds.

---

### 🧑‍💻 `codegen-worker`

This is an internal microservice that handles:

* 🧠 Generating code from memory, task inputs, or LLM instructions
* ✅ TDD workflow — test first → generate → validate
* 🔄 Interfaces with `ollama-proxy` + `supabase` + file system
* 🗂️ Outputs structured files: `feature.ts`, `test.feature.spec.ts`, and even doc snippets

**Why is it a microservice?**
Because code generation can:

* Run independently
* Queue/stream long tasks
* Scale out separately (if needed)

Also: multiple agents can call it in parallel.

---

## 🧱 Why Microservices?

This architecture mirrors the **way my agents work:**

* Task-based
* Stateless but memory-connected
* Independently callable
* Loggable, observable, testable

Each service in `guardian-open` is:

* Autonomous
* Replaceable
* Extendable

This allows me to ship *just the parts someone needs*, or to compose them in complex systems like Guardian Core — without coupling everything tightly together.

---

## 🔚 Summary

| Component        | Role                                                        |
| ---------------- | ----------------------------------------------------------- |
| `bun`            | Fast, native runtime for self-contained execution           |
| `hono`           | Lightweight router + API framework for each service         |
| `ollama-proxy`   | Intelligent context-aware LLM middleware                    |
| `guardian-cli`   | Local-first tool to automate workflows and pipelines        |
| `codegen-worker` | Background code + test generation engine for DevAgent flows |

Everything talks to each other through shared clients + memory. It’s modular, extensible, and most importantly — **built for developers who want to run their own AI infrastructure.**

---

Let me know if you want this written up as a `/docs/system-architecture.md` or blog post. This is the kind of explanation that makes your repo feel *10x more usable* and well-designed.
