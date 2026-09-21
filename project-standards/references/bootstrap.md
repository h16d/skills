# Bootstrap: New Repository

## Order

1. Initialize Git (`git init`).
2. Initialize pnpm workspace.
3. Configure TypeScript.
4. Configure Prettier.
5. Configure ESLint.
6. Configure commitlint.
7. Create the NestJS API.
8. Configure TypeORM.
9. Configure PostgreSQL.
10. Configure Kavo.
11. Configure Zod.
12. Configure Swagger.
13. Create the initial API module (health check — see below).
14. Create the React application.
15. Configure React Router.
16. Configure Orval against the Swagger spec.
17. Configure Vitest.
18. Configure Testcontainers.
19. Add unit tests.
20. Add e2e tests.
21. Add Docker configuration.
22. Add GitHub Actions CI.
23. Add Dependabot.
24. Add release-please.
25. Add GHCR publishing.
26. Add GHCR image cleanup.
27. Add documentation.
28. Run the complete validation suite.

Commit each logical stage separately — never one giant initial commit.

## Commit Strategy

One coherent change per commit. Conventional Commits, validated with commitlint.

Recommended sequence:

```text
chore: initialize pnpm monorepo
chore: configure typescript
chore: configure prettier
chore: configure eslint
chore: configure commitlint
feat: add nestjs api
feat: add typeorm and postgres
feat: add kavo crud
feat: add zod validation
feat: add swagger
feat: add react application
feat: add react router
feat: add orval codegen
test: configure vitest
test: add testcontainers
test: add unit and e2e tests
docker: add production containers
ci: add github actions
ci: add dependabot
ci: add release please
ci: add ghcr image publishing
ci: add ghcr image cleanup
docs: add project documentation
```

Adjust when necessary. Don't mix unrelated changes; don't pad with meaningless commits; each commit should leave the repo in a reasonable state. Run relevant checks after significant changes.

## Monorepo Layout

pnpm workspaces, `apps/api` + `apps/web`:

```text
.
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── modules/
│   │       │   └── health/
│   │       │       ├── health.controller.ts
│   │       │       ├── health.service.ts
│   │       │       └── health.module.ts
│   │       └── main.ts
│   └── web/
│       └── src/
│           ├── routes/
│           └── main.tsx
├── packages/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── release-please.yml
│   └── dependabot.yml
├── docker/
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── commitlint.config.ts
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md
```

No empty directories or placeholder files unless required by tooling.

## Initial Module

Use a minimal `health` module to verify the NestJS setup. Do not create example entities (`user`, `product`, `book`) just to demonstrate CRUD — add real domain entities only when requirements define them.

## Fresh-Repo Requirement

A developer must be able to run, from a clean checkout:

```bash
git clone <repository>
cd <repository>
pnpm install
```

then follow the README to start development. CI must reproduce the test environment without manually configured infrastructure.
