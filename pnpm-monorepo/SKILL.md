---
name: pnpm-monorepo
description: Use when structuring a pnpm workspace monorepo — deciding whether to extract code into packages/, wiring internal package dependencies/versions, or setting up shared tooling and dependency versions across apps and packages.
---

# pnpm Monorepo Standard

Personal defaults for organizing a pnpm workspace with multiple apps and internal packages.

## When to Extract a Package

Extract shared code into `packages/` only when:

- It's actually used by 2+ apps (or clearly about to be) — not preemptively.
- It has a coherent single responsibility (`ui`, `api-types`, `config`) — not a dumping-ground `utils` or `shared`.

If only one app uses it, keep it inside that app. Don't create a package just because the code "feels reusable."

## Workspace Layout

```text
.
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   ├── ui/
│   ├── api-types/
│   └── config/
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## Package Structure

Each package is self-contained: own `package.json`, own `tsconfig.json` extending the root, a `src/` with an `index.ts` barrel export. See `templates/package/` for a starting point.

- Name: `@<org>/<name>`, kebab-case (e.g. `@acme/ui`).
- `"private": true` unless the package is actually published externally.
- Export types and runtime code through `exports` in `package.json`, not deep imports into `src/`.

## Dependency Direction

- Apps depend on packages. Packages never depend on apps.
- No circular dependencies between packages — if two packages need each other, merge them or extract the shared piece into a third package.
- Internal dependencies use the workspace protocol, not a version range:

```json
{
  "dependencies": {
    "@acme/ui": "workspace:*"
  }
}
```

## Shared Dependency Versions

Use pnpm catalogs to pin a dependency to one version across the whole workspace instead of letting each package drift:

```yaml
# pnpm-workspace.yaml
catalog:
  react: ^19.0.0
  zod: ^3.24.0
```

```json
{
  "dependencies": {
    "react": "catalog:",
    "zod": "catalog:"
  }
}
```

## Versioning & Publishing

- Internal-only packages: no independent versioning needed, stay `workspace:*` consumers, no changelog.
- Packages actually published externally: version with release-please/changesets like any other release artifact — don't hand-bump versions.

## Scripts & Build

- Root scripts orchestrate with `pnpm -r` (all packages) or `pnpm --filter <name>` (one package/app and its deps).
- In development, consume packages as TypeScript source directly (via `tsconfig` path mapping or the package's own `exports`) — don't require a build step before an app can use a sibling package.
- Only compile a package to `dist/` when it's published externally or the build tool requires it.

## Common Mistakes

- A catch-all `packages/shared` or `packages/utils` that accumulates unrelated code — split by responsibility instead.
- Publishing internal-only packages to a registry "just in case."
- Apps importing another app's internals instead of going through a package.
- Pinning the same third-party dependency to different versions in different packages instead of using a catalog entry.
