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

## When to Read What

Load only the file(s) relevant to the current task — never load all of them for a small change.

| Task involves...                                                            | Read                                               |
| --------------------------------------------------------------------------- | -------------------------------------------------- |
| New repo, init order, commit sequence, monorepo layout                      | [references/bootstrap.md](references/bootstrap.md) |
| NestJS modules, TypeORM, Postgres, Kavo, Zod, DTOs, rate limiting           | [references/backend.md](references/backend.md)     |
| React/Router, TypeScript config, Prettier, ESLint, commitlint, Node version | [references/frontend.md](references/frontend.md)   |
| Writing/running tests, Testcontainers, pre-completion validation            | [references/testing.md](references/testing.md)     |
| Docker, GitHub Actions, Dependabot, release-please, GHCR                    | [references/cicd.md](references/cicd.md)           |
| A repo that already has code/history                                        | [references/existing.md](references/existing.md)   |
| Confirming a bootstrap is actually done, final report format                | [references/checklist.md](references/checklist.md) |

## Templates & Scripts

- `templates/base/` — starter config files (package.json, tsconfig.json, .prettierrc, commitlint.config.ts, .gitignore, dependabot.yml). Copy and adapt instead of generating from scratch.
- `scripts/validate.sh` — runs the full pre-completion validation suite (typecheck, lint, format:check, test, test:e2e, build). Run it instead of re-deriving the command list.

## Definition of Done

Every rule lives in exactly one place — the table above, not this section, says where. Before declaring work complete, run `scripts/validate.sh` (or the equivalent commands in [references/testing.md](references/testing.md)) and fix failures. Never claim a command passed without having run it.
