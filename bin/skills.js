#!/usr/bin/env node
// Installs skills from this repo into the local Claude Code skills directory.
// Usage: npx github:h16d/skills [skill-name ...]  (installs all if none given)

import { readdirSync, statSync, existsSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const targetRoot = process.env.SKILLS_HOME ?? join(os.homedir(), '.claude', 'skills');

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: npx github:h16d/skills [skill-name ...]

Installs skills into ${targetRoot} (override with SKILLS_HOME).

Options:
  -h, --help   Show this help
  --list       List available skills without installing`);
  process.exit(0);
}

const available = readdirSync(repoRoot).filter((name) => {
  const dir = join(repoRoot, name);
  return statSync(dir).isDirectory() && existsSync(join(dir, 'SKILL.md'));
});

if (available.length === 0) {
  console.error('No skills found in this repo (no directory contains a SKILL.md).');
  process.exit(1);
}

if (args.includes('--list')) {
  console.log(available.join('\n'));
  process.exit(0);
}

const requested = args.filter((a) => !a.startsWith('-'));
const toInstall = requested.length > 0 ? requested : available;

for (const name of toInstall) {
  if (!available.includes(name)) {
    console.error(`Skipping "${name}": not found. Available: ${available.join(', ')}`);
    continue;
  }

  const src = join(repoRoot, name);
  const dest = join(targetRoot, name);

  mkdirSync(targetRoot, { recursive: true });
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });

  console.log(`Installed ${name} -> ${dest}`);
}
