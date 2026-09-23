---
name: dokploy
description: Use when deploying with Dokploy — GitHub integration and auto-deploy, Docker Compose services, watch paths, PR preview deployments, secrets, domains/SSL, or triggering a deploy from CI.
---

# Dokploy

Personal defaults for wiring repos and compose stacks to a self-hosted Dokploy panel. Prefer Dokploy when the app is one or a few docker-compose stacks on a single host; reach for plain `docker compose` over SSH only when the panel itself is overkill.

## Service Types

- **Application** — single service built from a Dockerfile (or Docker image).
- **Docker Compose** — multi-service stacks from a compose file in the repo. Default for production (app + Postgres).
- **Stack** — Docker Swarm mode; `build:` and some compose features don't apply. Don't use unless Swarm is actually required.

One Dokploy service = one environment. For dev/staging/prod of the same repo, create one service per environment and point each at its own branch — don't try to drive environments from a single service.

## GitHub Integration

Connect once at the panel, then pick repo/branch per service:

1. **Settings → Git → GitHub → Create GitHub App** (unique name, e.g. `Dokploy-Github-App`) → **Install & Authorize**, selecting either all repos or an explicit list.
2. In each Application/Compose service's **Source** tab: choose GitHub, the org or personal account, the repository, and the branch.
3. **Auto Deploy** — on by default for GitHub; every push to the service's selected branch triggers a deployment. A push to any other branch silently does nothing ("Branch Not Match" when using manual webhooks) — the branch field is the contract.
4. **Trigger type** — `push` (default) or `tag`. Tag-triggered services deploy when release tags land; combine with release-please when the compose file itself doesn't carry the version.
5. **Watch Paths** — restrict auto-deploy to changes under specific paths (zero-config with GitHub). Use for monorepos so docs-only pushes don't redeploy.
6. **Preview Deployments** — spin up ephemeral deployments for PRs (opened/synchronize/reopened). Enable **Require Collaborator Permissions** so only users with write access and above can trigger them.

Manual/webhook fallback: the panel serves `https://<dokploy-domain>/api/deploy/github` (also used by GitLab/Bitbucket/Gitea and by CI-triggered deploys). With the GitHub App connected, no manual webhook setup is needed.

## Compose Services

- Point the service at the compose file via `composePath` (e.g. `compose.prod.yml`); `createEnvFile` controls whether Dokploy writes the environment file it injects.
- **Auto-deploy runs `git clone` on every deployment** — the checkout is wiped and recreated. Anything that must persist lives in the panel (env vars, File Mounts), never as a repo-relative mount (`./config:...` comes back empty after the next deploy). Repo files needed at runtime → **Advanced → Mounts**.
- **Custom command replaces the default entirely** (it doesn't append). The UI shows the default `docker compose ...` line — copy it whole before adding flags like `--force-recreate`.
- Named volumes for state (`postgres_data`, `uploads_data`); healthchecks + `depends_on: condition: service_healthy` so the app never races the database.
- Keep the compose file committed and reviewable — the image tag it pins is what actually deploys. See [production-compose](../production-compose/SKILL.md).

## Environments & Secrets

Secrets never live in the repo: set them in the service's environment in the panel, and let the compose file reference `${VAR}`. Keep `.env.example` (keys, no values) committed as documentation. Rotate by editing the panel and redeploying — not by committing.

## Domains & Health

Attach domains per service in the panel; SSL (Let's Encrypt) is provisioned automatically. Prefer compose healthchecks over fixed `sleep` delays in `depends_on`.

## Deploys from CI

When a deploy must wait on something (image build finished, migrations ran), skip auto-deploy and hit the deploy webhook from the pipeline:

```bash
curl -X POST "https://<dokploy-domain>/api/deploy/compose" \
  -H "x-api-key: $DOKPLOY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"composeId": "<id>"}'
```

This is also the fix for the release race described in [production-compose](../production-compose/SKILL.md) — trigger the deploy after GHCR confirms the push instead of letting the push webhook win.

## Related

- [production-compose](../production-compose/SKILL.md) — versioned image tags Dokploy pulls.
- [release-please](../release-please/SKILL.md) — produces the version being deployed.
- project-standards [cicd.md](../project-standards/references/cicd.md) — Docker/GHCR defaults the compose file builds on.
