---
name: project-standards
description: Use when creating, scaffolding, reviewing, or significantly modifying a TypeScript/NestJS/React project — applies default standards for stack choice, architecture, database, testing, Docker, and CI/CD.
---

# Project Standards

Personal defaults for full-stack TypeScript projects. Apply when bootstrapping a new project, scaffolding a module, reviewing code, or making significant architectural changes.

## Core Principles

- Prefer simple, conventional solutions and built-in framework capabilities over custom abstractions.
- Use the latest stable versions of technologies/packages unless compatibility requires otherwise. Never downgrade without a documented reason.
- Keep configuration explicit. Follow existing project conventions when they conflict with these defaults — identify the conflict and choose the smallest compatible deviation.
- Do not silently violate these standards; report deviations clearly.

## Default Stack

TypeScript, pnpm, NestJS, TypeORM, PostgreSQL, Kavo (CRUD), Zod (validation), React, React Router, Vitest, Testcontainers, Prettier, ESLint, commitlint, Conventional Commits, GitHub Actions, Dependabot, release-please, Docker, GHCR.

Only add a technology when the project actually requires it. No example business logic or unused dependencies.

## Reference Files

Load the relevant file(s) for the task at hand — don't load all of them for a small change.

| File | Covers |
|---|---|
| [bootstrap.md](references/bootstrap.md) | New repo: init order, commit sequence, monorepo layout |
| [backend.md](references/backend.md) | NestJS architecture, TypeORM, Kavo, Zod, DTOs, database, rate limiting |
| [frontend.md](references/frontend.md) | React/Router, TypeScript, Prettier, ESLint, commitlint, Node.js versions |
| [testing.md](references/testing.md) | Vitest, Testcontainers, e2e vs unit, validation commands |
| [cicd.md](references/cicd.md) | Docker, GitHub Actions, Dependabot, release-please, GHCR + retention |
| [existing.md](references/existing.md) | Applying these standards incrementally to a repo that already exists |
| [checklist.md](references/checklist.md) | Full completion checklist + final reporting format |

## Quick Rules (always apply, no file needed)

- Entities: singular names (`project.entity.ts`, not `projects.entity.ts`). UUIDv7 primary keys. Migrations only — never `synchronize: true` outside disposable local dev.
- DTOs/schemas live beside their module (`project.dto.ts`, `project.schema.ts`), not in a `dto/` subfolder. Zod is the source of truth, not class-validator.
- Rate limiting: in-memory by default, never Postgres; don't silently swap in Redis.
- New repo bootstrap: incremental Conventional Commits, never one giant initial commit — see [bootstrap.md](references/bootstrap.md).
- Existing repo: inspect first, never recreate Git, never overwrite working config — see [existing.md](references/existing.md).

Before declaring any implementation complete, run: typecheck, lint, format:check, unit tests, e2e tests, build. Don't claim a command passed unless it actually ran — see [testing.md](references/testing.md) and [checklist.md](references/checklist.md).
