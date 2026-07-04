# multi-tier-agent-system

This skill defines a three-tier orchestration pattern for large or risky tasks. It is meant for cases where one agent would run out of room, while a manager/sub-manager/worker chain can keep the work controlled.

## What it does

- Keeps the main manager focused on the user and the final merge.
- Uses sub-managers to break broad goals into worker-sized micro-tasks.
- Restricts workers to execution only.
- Enforces JSON-only internal handoffs.
- Includes a direct emergency route for critical failures.
- Works across Codex, Claude Code, OpenClaw, Antigravity, and other agent surfaces that can load Markdown instructions.
- Can be installed across many surfaces in one pass with `node scripts/install.js --all`.

## Trigger ideas

Use this skill for requests like:

- "Coordinate this large feature across frontend and backend"
- "Split this project into reviewable tasks"
- "Run a multi-agent workflow with escalation"
- "Organize a complex implementation with strict handoffs"

## How to use it

1. Start with the user goal at the main-manager level.
2. Break the goal into domains such as frontend, backend, infra, or docs.
3. Let each sub-manager turn its area into micro-tasks.
4. Have workers execute only those micro-tasks.
5. Validate at each boundary before moving upward.
6. Escalate immediately if a worker reports a critical blocker.

## OpenClaw

OpenClaw works best when the workspace has a small bootstrap block plus the role prompts in `agents/`. See `references/openclaw-bootstrap.md` for the block to inject into `SOUL.md`.

## Files

- `SKILL.md` contains the operational rules and examples.
- `references/communication-schema.md` defines the JSON message shape.
- `references/escalation-protocol.md` defines the halt path.
- `references/openclaw-bootstrap.md` contains the OpenClaw marker block.
- `agents/` contains the role prompts for manager, sub-manager, worker, and antigravity surfaces.
- `scripts/install.js` provides the simultaneous multi-agent installer.
