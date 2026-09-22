---
name: recommended-tools
description: Use when recommending agent skills or developer tooling — Superpowers, RTK (Rust token reducer), Kavo skills, or related setup/install commands for Claude Code and OpenCode.
---

# Recommended Tools

Personal picks for agent skills and token-efficient tooling. Use when the user asks what to install, how to extend their agent, or how to cut token usage.

## Superpowers

Composable skills framework by Jesse Vincent (obra/superpowers): brainstorming, TDD, systematic debugging, writing/executing plans, verification-before-completion, subagent-driven development with code review, and skill authoring.

Install:

```bash
# Claude Code (official marketplace)
/plugin install superpowers@claude-plugins-official
```

Works in Claude Code, OpenCode, Cursor, Codex CLI, Gemini CLI, and others — see the [repo](https://github.com/obra/superpowers) for per-agent wiring. Skills auto-trigger; no manual invocation needed beyond the bootstrap.

## RTK (Rust Token Killer)

CLI proxy that compresses command output before it reaches the LLM context — 60–90% token savings on `git`, `test`, `lint`, `ls`, `grep`. Single Rust binary, <10ms overhead ([rtk-ai/rtk](https://github.com/rtk-ai/rtk)).

Install:

```bash
brew install rtk
```

Wire into an agent (pick one):

```bash
rtk init -g                 # Claude Code (PreToolUse hook)
rtk init -g --opencode      # OpenCode (plugin)
rtk init -g --copilot       # GitHub Copilot
rtk init -g --cursor        # Cursor
```

Verify with `rtk --version` and `rtk gain`. For compact reads the agent should prefer `rtk read` / `rtk grep` / `rtk find` over raw `cat` / `rg` / `find`.

## Kavo Skills

Ready-made skills for the Kavo CRUD framework (already the default in [project-standards](../project-standards/SKILL.md)): `@Kavo()` decorator, global config, query grammar, DTO slots, error handling, soft delete, Swagger, GraphQL/MCP bindings, and per-ORM adapters (TypeORM, Prisma, Mongoose, MikroORM).

Install via Kavo's own marketplace:

```bash
/plugin marketplace add kavo-labs/kavo
/plugin install kavo-skills@kavo-marketplace
```

Use these instead of re-deriving Kavo conventions from docs when working on a Kavo-decorated controller or answering "how do I filter/configure/expose this entity" questions.

## Stack Pairing

- Superpowers for process (how to build), Kavo skills for domain (what the stack does), RTK for cost (keep output tokens low).
- RTK is the only one that needs no agent-side skill loading — it intercepts at the shell layer, so install it even when using the other two.
