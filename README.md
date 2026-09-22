# skills

Personal agent skills for Claude Code.

## Skills

- [project-standards](project-standards/SKILL.md) — default standards for TypeScript/NestJS/React projects (stack choice, architecture, database, testing, Docker, CI/CD).
- [pnpm-monorepo](pnpm-monorepo/SKILL.md) — structuring a pnpm workspace: when to extract packages, layout, dependency direction, shared dependency versions.
- [recommended-tools](recommended-tools/SKILL.md) — recommended agent tooling: Superpowers, RTK token reducer, Kavo skills, and how to install them.

## Install

Install all skills (auto-detects agent, e.g. `~/.claude/skills/`):

```bash
npx skills add h16d/skills
```

Install a specific skill only:

```bash
npx skills add h16d/skills -s project-standards
```

List available skills without installing:

```bash
npx skills add h16d/skills --list
```

Useful flags: `-g` (global/user-level), `-a <agent>` (target agent, `*` for all), `-y` (skip prompts), `--copy` (copy instead of symlink). Re-run any time to pull updates, or `npx skills update`.

### Manual install

Clone the repo and symlink a skill directory instead, if you'd rather track it live:

```bash
git clone git@github.com:h16d/skills.git
ln -s "$(pwd)/skills/project-standards" ~/.claude/skills/project-standards
```
