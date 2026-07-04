# Install multi-tier-agent-system

One skill. Works across multiple agent surfaces.

## Canonical skill path

The distributable skill lives at:

- `skills/multi-tier-agent-system/SKILL.md`
- `skills/multi-tier-agent-system/README.md`
- `skills/multi-tier-agent-system/references/`

## Multi-agent install

Install for every supported surface at once:

```bash
node scripts/install.js --all
```

Install only selected surfaces:

```bash
node scripts/install.js --only codex --only openclaw
node scripts/install.js --only antigravity
```

Preview without writing:

```bash
node scripts/install.js --all --dry-run
```

## Bootstrap installers

### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/Happyalex1122/multi-tier-agent-system/main/install.ps1 | iex
```

### Shell

```bash
curl -fsSL https://raw.githubusercontent.com/Happyalex1122/multi-tier-agent-system/main/install.sh | bash
```

### npm / npx

```bash
npx -y github:Happyalex1122/multi-tier-agent-system -- --all
npm exec -y github:Happyalex1122/multi-tier-agent-system -- --all
```

## Install by agent

### Codex

```bash
npx skills add Happyalex1122/multi-tier-agent-system -a codex
```

### Claude Code

```bash
npx skills add Happyalex1122/multi-tier-agent-system -a claude
```

### Cursor

```bash
npx skills add Happyalex1122/multi-tier-agent-system -a cursor
```

### Windsurf

```bash
npx skills add Happyalex1122/multi-tier-agent-system -a windsurf
```

### Cline

```bash
npx skills add Happyalex1122/multi-tier-agent-system -a cline
```

### Antigravity

```bash
npx skills add Happyalex1122/multi-tier-agent-system -a antigravity
```

### OpenClaw

OpenClaw uses a workspace skill folder plus a bootstrap block in `SOUL.md`.

1. Copy `skills/multi-tier-agent-system/` into the OpenClaw workspace skill directory.
2. Append the block from `skills/multi-tier-agent-system/references/openclaw-bootstrap.md` into `SOUL.md`.
3. Restart or reload the workspace so the bootstrap is picked up.

## What gets supported

- Main manager: user communication, planning, escalation, final merge.
- Sub-manager: domain decomposition and first-pass review.
- Worker: micro-task execution and structured reporting.
- Emergency path: worker bypasses sub-manager and escalates directly to main manager when critical failure appears.

## Notes

- Internal agent handoffs use JSON only.
- The skill is compatible with any agent platform that can load a Markdown skill body and a role prompt.
- If a platform does not support native subagents, use the templates in `agents/` to simulate the hierarchy.
