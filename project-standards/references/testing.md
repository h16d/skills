# Testing

## Vitest

- Unit tests: business logic, services, utilities, important isolated components.
- E2E tests: HTTP endpoints, CRUD operations, workflows, cross-layer integration.
- Prefer real integrations over mocks; avoid excessive mocking. Tests must be deterministic and isolated.

Provide scripts: `test`, `test:unit`, `test:e2e`, `test:coverage` (when applicable).

## Testcontainers

Any test needing infrastructure uses Testcontainers — PostgreSQL integration/e2e tests must use a PostgreSQL Testcontainer, never require a locally installed Postgres. Tests must be reproducible from a clean environment and able to start their own required infrastructure.

## Validation Before Declaring Complete

Run `../scripts/validate.sh` and fix failures before reporting completion — don't claim a command passed unless it actually ran successfully. The script runs, in order: install, typecheck, lint, format:check, test, test:e2e, build.

If Docker is part of the project, also verify:

```bash
docker compose build
docker compose up
```

Confirm: PostgreSQL starts, the API starts and connects to PostgreSQL, tests can start their Testcontainers, the frontend starts, and the production build succeeds.
