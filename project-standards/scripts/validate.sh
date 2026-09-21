#!/usr/bin/env bash
# Runs the full pre-completion validation suite for project-standards.
# See references/testing.md for what each step checks.
set -euo pipefail

run() {
  echo "==> $*"
  "$@"
}

run pnpm install
run pnpm typecheck
run pnpm lint
run pnpm format:check
run pnpm test
run pnpm test:e2e
run pnpm build

echo "All checks passed."
