---
name: release-please
description: Use when setting up or troubleshooting release-please — manifest config, release PRs driven by Conventional Commits, extra-files version annotations, GHCR image tagging from a release, or stuck autorelease labels.
---

# Release Please

Personal defaults for release automation: Conventional Commits in, one rolling release PR out — version bump, changelog, and tag land when the PR merges. Adopt at bootstrap (project-standards [bootstrap.md](../project-standards/references/bootstrap.md) step 24) and never hand-bump versions once it manages them.

## Files

Two files, both committed, both owned by release-please after bootstrap:

- `release-please-config.json` — packages, changelog sections, extra-files. Link the `$schema` for editor validation.
- `.release-please-manifest.json` — current version per package (`{ ".": "1.4.0" }`).

Minimal single-package config:

```json
{
  "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
  "packages": {
    ".": {
      "release-type": "node",
      "package-name": "my-app",
      "changelog-sections": [
        { "type": "feat", "section": "Features" },
        { "type": "fix", "section": "Bug Fixes" },
        { "type": "perf", "section": "Performance" },
        { "type": "refactor", "section": "Code Refactoring", "hidden": true },
        { "type": "chore", "section": "Miscellaneous", "hidden": true },
        { "type": "docs", "section": "Documentation", "hidden": true },
        { "type": "ci", "section": "CI/CD", "hidden": true },
        { "type": "test", "section": "Tests", "hidden": true }
      ],
      "bump-minor-pre-major": true,
      "bump-patch-for-minor-pre-major": true,
      "include-component-in-tag": false
    }
  },
  "separate-pull-requests": false,
  "group-pull-request-title-pattern": "chore: release ${version}"
}
```

## Workflow

Run the official Action on every push to `main` (`googleapis/release-please-action@v5`, manifest mode, pointing at both files above). The action's `version` output is the source of truth for downstream jobs — read it, never re-derive it from git tags.

Merge discipline: squash-merge release PRs; the PR title/body are generated, don't rewrite them in ways that break release-please's parsing.

## Shipping Only Docker Images (No GitHub Release)

When the repo's only artifact is a GHCR image, GitHub Releases are noise — but tagging still has to happen, and release-please won't do it if you skip the release:

1. Run the action with `skip-github-release: true`. This bumps manifest/changelog and manages the release PR, but also skips tagging **and** the `autorelease: pending` → `tagged` label swap.
2. After checkout, read the version from `.release-please-manifest.json`; if `refs/tags/v<version>` doesn't exist on the remote, create and push the tag yourself.
3. Flip any merged PRs labeled `autorelease: pending` to `autorelease: tagged` via `gh pr edit`. While a pending label lingers, release-please refuses to open the next release PR.

## Extra Files

Anything beyond `package.json` that carries a version goes through `extra-files`. The generic updater rewrites the first semver-looking string on any line annotated inline:

```json
{
  "packages": {
    ".": {
      "extra-files": [{ "type": "generic", "path": "compose.prod.yml" }]
    }
  }
}
```

```yaml
image: ghcr.io/h16d/forough:1.4.0 # x-release-please-version
```

- Inline annotations: `x-release-please-version`, `-major`, `-minor`, `-patch`.
- Block annotations: `x-release-please-start-version` … `x-release-please-end` — replaces versions between the markers.
- Typed updaters (`json`/`yaml`/`toml` need `jsonpath`; `xml` needs `xpath`) replace the whole value at the path — wrong tool for embedding a version inside a larger string; use `generic` there.
- Force the generic updater for non-JSON files with `type: "generic"` — by extension, `.yml` would otherwise get the YAML updater.

See the [production-compose](../production-compose/SKILL.md) skill for the full compose-tag pattern.

## GHCR Tagging

Tag images from the action's version output, not from `git describe`:

```yaml
tags: |
  type=raw,value=${{ steps.release.outputs.version }}
  type=raw,value=latest
```

Bare semver (`1.4.0`) or `v`-prefixed — pick one and keep compose files, docs, and the metadata action in agreement. Keep the image-retention cleanup (project-standards [cicd.md](../project-standards/references/cicd.md)) from deleting the tag currently deployed.

## Troubleshooting

- **No release PR appearing** — commits since the last release may all be non-releasable (`chore`/`docs`/`ci`/`test` don't cut releases; `feat`/`fix`/`perf`/breaking do). Also check for an old PR still holding `autorelease: pending`, or add `release-please:force-run` to a merged PR.
- **Stuck `autorelease: pending`** — remove the label from the stale PR; it blocks all future release PRs.
- **Wrong version proposed** — don't edit the manifest by hand (bootstrap only); use a `Release-As: x.y.x` commit body to force the next version.
- **Hand-edited manifest/config drift** — revert; release-please rewrites both on every release PR.

## Related

- [production-compose](../production-compose/SKILL.md) — pinning the released tag in a production compose file.
- [dokploy](../dokploy/SKILL.md) — deploying the release; ordering deploys after the image push.
- project-standards [cicd.md](../project-standards/references/cicd.md) — GHCR publishing/retention, Dependabot/release safety.
