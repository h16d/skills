# Completion Checklist & Final Reporting

## Checklist

**Repository:** Git initialized · meaningful commit history · Conventional Commits · commitlint configured

**Monorepo:** pnpm workspace · API app · Web app · shared packages only where necessary

**Backend:** NestJS · TypeScript · modular architecture · TypeORM · Kavo · Zod · in-memory rate limiting

**Database:** PostgreSQL · UUIDv7 · singular entities · migrations · appropriate indexes

**Frontend:** React · React Router · TypeScript

**Code Quality:** Prettier (120 print width) · ESLint · commitlint

**Testing:** Vitest · unit tests · e2e tests · Testcontainers · PostgreSQL Testcontainer

**CI/CD:** GitHub Actions · Dependabot · release-please · Docker build · GHCR publishing · GHCR retention (5 newest kept)

**Documentation:** README · `.env.example` · dev instructions · test instructions · Docker instructions

**Final validation:** `../scripts/validate.sh` passes (see [testing.md](testing.md))

## Final Reporting

After completing a new project bootstrap, report:

1. Project structure
2. Major dependencies
3. Available package scripts
4. Git commit history
5. Testing setup
6. CI configuration
7. Docker configuration
8. Dependabot configuration
9. Release-please configuration
10. GHCR configuration
11. Any deviations from these standards

Do not claim a command passed unless it was actually executed successfully. Do not claim the boilerplate is complete if required validation is still failing.
