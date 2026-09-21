# skills

Personal agent skills for Claude Code.

## Skills

- [project-standards](project-standards/SKILL.md) — default standards for TypeScript/NestJS/React projects (stack choice, architecture, database, testing, Docker, CI/CD).
- [pnpm-monorepo](pnpm-monorepo/SKILL.md) — structuring a pnpm workspace: when to extract packages, layout, dependency direction, shared dependency versions.

## Install

Install all skills into `~/.claude/skills/`:

```bash
npx github:h16d/skills
```

Install a specific skill only:

```bash
npx github:h16d/skills project-standards
```

This copies each skill directory in — re-run any time to pull updates. To point installs somewhere else, set `SKILLS_HOME`:

```bash
SKILLS_HOME=/path/to/skills npx github:h16d/skills
```

### Manual install

Clone the repo and symlink a skill directory instead, if you'd rather track it live:

```bash
git clone git@github.com:h16d/skills.git
ln -s "$(pwd)/skills/project-standards" ~/.claude/skills/project-standards
```
