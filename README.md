# multi-tier-agent-system

One repo. Many agent surfaces. Clean hierarchy.

## What it gives you

- Main manager, sub-manager, worker.
- JSON-only internal handoffs.
- Worker emergency bypass.
- OpenClaw bootstrap.
- Antigravity support.
- One-shot install across many surfaces.
- PowerShell bootstrap installer for Windows.
- npm / npx execution path.

## Install fast

```bash
node scripts/install.js --all
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/Happyalex1122/multi-tier-agent-system/main/install.ps1 | iex
```

Shell:

```bash
curl -fsSL https://raw.githubusercontent.com/Happyalex1122/multi-tier-agent-system/main/install.sh | bash
```

npm / npx:

```bash
npx -y github:Happyalex1122/multi-tier-agent-system -- --all
npm exec -y github:Happyalex1122/multi-tier-agent-system -- --all
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
- `install.ps1`
- `install.sh`

## Core loop

Main manager talks to user. Sub-manager splits the work. Worker does the task. If work breaks hard, worker sends `status: EMERGENCY` and the branch stops.

## OpenClaw

OpenClaw gets the workspace bootstrap from `skills/multi-tier-agent-system/references/openclaw-bootstrap.md` plus the role prompts in `agents/`.
