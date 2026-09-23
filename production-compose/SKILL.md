---
name: production-compose
description: Use when versioning or reviewing a production docker-compose file — pinning release-please-managed image tags, choosing pull policy, separating secrets from the versioned file, GHCR retention, and deploy ordering with Dokploy.
---

# Production Compose Versioning

Personal defaults for the compose file that runs production (e.g. `compose.prod.yml`). The one rule everything else serves: **what's in git is exactly what runs** — the image tag is versioned in the file, not guessed at deploy time.

## Pin Immutable Tags, Never `latest`

```yaml
services:
  app:
    image: ghcr.io/h16d/forough:1.4.0 # x-release-please-version
    restart: always
```

- `latest` + `pull_policy: always` means every redeploy is a different build — unreproducible and unrollbackable.
- A pinned tag makes rollback "put the old tag back" and makes any deploy auditable against a git SHA.

## Version the Tag With release-please

The tag must bump in the same PR that bumps `package.json`/the manifest — hand-edited tags drift. Wire it once:

```json
{
  "packages": {
    ".": {
      "extra-files": [{ "type": "generic", "path": "compose.prod.yml" }]
    }
  }
}
```

The `# x-release-please-version` annotation makes release-please rewrite `1.4.0` → the new version on every release PR. Details and other annotation forms: [release-please](../release-please/SKILL.md).

## Hardcode the Tag — Don't Use `${IMAGE_TAG}`

The env-var variant (`image: ghcr.io/forough:${IMAGE_TAG}`) looks cleaner but fails this workflow:

- release-please only rewrites **tracked** files — the value would live in gitignored `.env`, which it can't touch, so the version splits across two sources and drifts.
- Dokploy clones the repo and runs the compose file as-is; nothing exports `IMAGE_TAG` for it unless you add a custom command or deploy script that re-imputes the version from elsewhere.
- Hardcoding keeps one source of truth: the release PR. If indirection is unavoidable, derive it in the deploy script from `.release-please-manifest.json` — never from a manually maintained env var.

## Secrets Stay Out

Only the image tag is versioned in the file. Secrets (`POSTGRES_PASSWORD`, `JWT_SECRET`, …) come from the gitignored `.env` / Dokploy's panel environment; the compose file references `${VAR}` for those. The image line itself should contain no interpolation beyond the annotation:

```yaml
# good — release-please can find one semver on the line
image: ghcr.io/h16d/forough:1.4.0 # x-release-please-version

# bad — ambiguous for humans, still no benefit for tooling
image: ghcr.io/${GITHUB_REPOSITORY:-h16d/forough}:${IMAGE_TAG}
```

## Pull Policy

With unique per-release tags, drop `pull_policy: always`. The default (pull if missing) fetches the tag on first deploy and never re-pulls a tag that can't change. Keep `always` only if the same tag is deliberately re-pushed (rebuild-in-place), which shouldn't happen for release tags.

## Tag Parity With CI

Compose's tag must be byte-for-byte what the publish workflow pushes:

- If the workflow tags `type=raw,value=${version}` from its version output (detect step or action output), compose carries bare `1.4.0` — no `v` prefix.
- A `v`-prefix mismatch fails at pull time with `manifest unknown`, which looks like a registry bug but is a naming mismatch.

## The Release Race

Release PR merges → compose now references `N+1.0.0` → **but the image for that tag is only pushed by the workflow that runs on the same push to `main`.** Anything that deploys from that push (Dokploy auto-deploy on the branch) can pull before the build finishes and fail.

Fix the ordering once — create the tag only after the image push succeeds (detect → build → release-please, see the [release-please](../release-please/SKILL.md) skill) — then pick a trigger:

1. **Tag trigger (recommended)** — Dokploy service `triggerType: tag`; the tag now lands after the image exists, so the pull always succeeds. No API keys, no deploy step in CI. Leave branch auto-deploy off on the prod service so merges don't fire an early deploy.
2. **Deploy from CI** — `POST` the Dokploy deploy API after the push (see [dokploy](../dokploy/SKILL.md)) when deploys shouldn't follow tags automatically (manual gate per release).
3. **Retry** — let the first deploy fail and redeploy from the panel once GHCR has the tag. Acceptable, sloppy.

## GHCR Retention

Cleanup that keeps only the N most recent image versions (project-standards [cicd.md](../project-standards/references/cicd.md)) must never delete the tag currently referenced by the production compose file — a rollback to a GC'd tag is a rollback that doesn't exist. When bumping N, check what production pins first.

## Validate

```bash
docker compose -f compose.prod.yml config   # interpolates & merges; fails on bad YAML/refs
```

Run it in CI or pre-commit for the prod file — it catches syntax errors and missing-variable fallout before a deploy does. Unset secret variables only produce warnings; structural errors exit non-zero.

## Related

- [release-please](../release-please/SKILL.md) — rewrites the annotated tag each release.
- [dokploy](../dokploy/SKILL.md) — clones the repo and runs this file; GitHub auto-deploy and deploy API.
- project-standards [cicd.md](../project-standards/references/cicd.md) — Docker/GHCR publishing and retention defaults.
