# multi-tier-agent-system

One repo. Many agent surfaces. Clean hierarchy.

## What it gives you

- Main manager, sub-manager, worker.
- JSON-only internal handoffs.
- Worker emergency bypass.
- OpenClaw bootstrap.
- Antigravity support.
- One-shot install across many surfaces.

## Install fast

```bash
node scripts/install.js --all
```

Install only some surfaces:

```bash
node scripts/install.js --only codex --only openclaw --only antigravity
```

Preview first:

```bash
node scripts/install.js --all --dry-run
```

## Install guide

Read [INSTALL.md](./INSTALL.md) for the full matrix and platform notes.

## Skill package

The canonical skill lives in:

- `skills/multi-tier-agent-system/SKILL.md`
- `skills/multi-tier-agent-system/README.md`
- `skills/multi-tier-agent-system/references/`
- `agents/`
- `scripts/install.js`

## Core loop

Main manager talks to user. Sub-manager splits the work. Worker does the task. If work breaks hard, worker sends `status: EMERGENCY` and the branch stops.

## OpenClaw

OpenClaw gets the workspace bootstrap from `skills/multi-tier-agent-system/references/openclaw-bootstrap.md` plus the role prompts in `agents/`.
