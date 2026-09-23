# CI/CD, Docker, and Environment

## Docker

Provide production Docker config when Docker deployment is required. Multi-stage builds; keep production images small; no dev dependencies in the production image; run as non-root when practical. Use explicit base image versions for production — never `latest`. Provide `Dockerfile` and `docker-compose.yml` when appropriate. For pinning production compose image tags and deploy ordering, see the [production-compose](../../production-compose/SKILL.md) skill.

## GitHub Actions

CI runs, from a clean checkout, with no dependency on a developer's local services (PostgreSQL via Testcontainers):

1. Dependency installation
2. Type checking
3. Linting
4. Formatting check
5. Unit tests
6. E2E tests
7. Build

## Dependabot

Configure for pnpm/npm dependencies and GitHub Actions in `.github/dependabot.yml`. Weekly schedule unless there's a specific reason otherwise. Group related updates to reduce PR noise.

## Release Please

Conventional Commits drive: release PRs, version bumps, changelogs, GitHub releases, Git tags. Use the current official release-please Action/config format. Don't manually maintain versions once release-please manages them. Keep config committed. Full setup, extra-files annotations, and troubleshooting: the [release-please](../../release-please/SKILL.md) skill.

## GitHub Container Registry

Publish images via GitHub Actions to GHCR (unless another registry is explicitly required). Tag with immutable identifiers: `sha-<commit>`, `v1.2.3`, `latest` where appropriate.

### GHCR Retention

Keep only the 5 most recent image versions, cleaned up automatically via GitHub Actions + GitHub's package APIs. The process must: identify versions, preserve the 5 newest, delete older ones, avoid deleting the currently deployed version when possible, and fail safely if package metadata can't be determined. Never delete tags blindly. The currently deployed tag is whatever the production compose file pins — see [production-compose](../../production-compose/SKILL.md).

## Dependabot/Release Safety

Automated dependency and release changes must not bypass CI — require CI to pass before merge when branch protection supports it.

## Environment Configuration

Provide `.env.example`. Never commit secrets or hard-code credentials/API keys/DB passwords. Separate config for development, test, and production. Document required environment variables.
