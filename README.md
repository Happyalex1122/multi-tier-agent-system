# multi-tier-agent-system

A three-tier agent system for work that needs clean delegation, strict review gates, and immediate escalation.

## What this repo gives you

- A main-manager / sub-manager / worker hierarchy.
- JSON-only internal handoffs.
- Emergency bypass from worker to main manager.
- Skill packaging that can be installed across multiple agent surfaces.
- OpenClaw bootstrap support.
- Antigravity support.
- One-shot multi-agent install with `--all`.

## Quick install

Install for every supported surface at once:

```bash
node scripts/install.js --all
```

Install for just one surface:

```bash
node scripts/install.js --only codex
node scripts/install.js --only openclaw
node scripts/install.js --only antigravity
```

Preview without writing:

```bash
node scripts/install.js --all --dry-run
```

## Canonical skill package

The distributable skill lives in:

- `skills/multi-tier-agent-system/SKILL.md`
- `skills/multi-tier-agent-system/README.md`
- `skills/multi-tier-agent-system/references/`
- `agents/`
- `INSTALL.md`

## Install by platform

Use the full per-platform guide in [INSTALL.md](./INSTALL.md).

## Core idea

The main manager stays at the top level and talks to the user. Sub-managers break large work into bounded micro-tasks and review worker results. Workers do only the assigned task. If a worker hits a critical blocker, it can send `status: EMERGENCY` directly to the main manager and stop the branch.

## OpenClaw

OpenClaw support uses a short bootstrap block plus the role prompts in `agents/`. The workspace marker block lives in `skills/multi-tier-agent-system/references/openclaw-bootstrap.md`.

## Files

- `INSTALL.md` for install commands and platform notes
- `skills/multi-tier-agent-system/` for the actual skill package
- `agents/` for role prompts
- `references/` for protocol details
