# multi-tier-agent-system

This skill defines a three-tier orchestration pattern for large or risky tasks. It is designed for situations where a single agent would struggle with context overload or where work must be split cleanly across planning, implementation, and review.

## What it does

- Keeps the main manager focused on user communication and final decisions.
- Uses sub-managers to split broad goals into worker-sized micro-tasks.
- Restricts workers to executing only their assigned work.
- Enforces JSON-only internal handoffs so messages stay structured and low-noise.
- Includes an emergency escalation path that bypasses normal routing when a critical issue appears.

## Trigger ideas

Use this skill for requests like:

- "Coordinate this large feature across frontend and backend"
- "Split this project into reviewable tasks"
- "Run a multi-agent workflow with escalation"
- "Organize a complex implementation with strict handoffs"

## How to use it

1. Start with the user goal at the main-manager level.
2. Break the goal into domain areas such as frontend, backend, infra, or docs.
3. Let each sub-manager turn its area into micro-tasks.
4. Have workers execute only those micro-tasks.
5. Validate at each boundary before moving upward.
6. Escalate immediately if a worker reports a critical blocker.

## Communication rule

Internal messages must stay in JSON. That keeps handoffs precise and helps prevent context loss as work moves through the hierarchy.

## Emergency rule

If a worker encounters a critical failure such as server downtime, permission denial, or an infinite loop, it should send an emergency JSON payload directly to the main manager. The main manager should halt the affected work and ask the user for the next step.

## Files

- `SKILL.md` contains the operational rules and examples.
- `references/communication-schema.md` documents the JSON shape in more detail.
- `references/escalation-protocol.md` explains the halt and recovery process.
