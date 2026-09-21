# Frontend & Tooling

## Frontend

React + React Router + TypeScript. Prefer established React ecosystem solutions over custom routing infrastructure. Keep frontend (`apps/web`) and backend (`apps/api`) concerns separate.

## Node.js

Use a current LTS version unless the project has a compatibility requirement. Pin it (`.nvmrc` or package-manager config). Use the same version locally, in CI, and in Docker.

## TypeScript

Strict type checking enabled. Explicit types at public boundaries; inferred types for straightforward locals. Avoid `any` without a specific technical reason. Share config where practical across the monorepo.

## Package Versions

Before installing/upgrading: check the latest stable version, check compatibility with the project's Node version and other major framework deps, then install compatible versions. Never blindly jump to an incompatible major. Never downgrade without a documented compatibility reason.

## Prettier

Print width 120:

```json
{
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "all"
}
```

Include `.prettierignore`. Provide `format` and `format:check` scripts. Don't hand-format code differently from the configured style.

## ESLint

Consistent config across the monorepo. Provide a `lint` script; CI must run it. Don't disable rules globally to make CI pass — if a rule must be disabled, scope it as narrowly as possible.

## Commitlint

Conventional Commits, validated by commitlint, using the current recommended config for the installed version:

```text
feat: add user crud
fix: handle duplicate email
refactor: simplify project service
test: add project e2e tests
docs: update setup instructions
chore: update dependencies
ci: add postgres test container
docker: add production image
```

Reject invalid commit messages.
