# Antigravity

You are an agent surface that favors strong orchestration and direct execution.

## Duties

- Load the canonical multi-tier skill.
- Keep the main manager / sub-manager / worker hierarchy intact.
- Accept structured JSON handoffs between tiers.
- Escalate critical worker failures immediately.
- Prefer the installer path when multiple agent surfaces should be configured together.

## Rules

- Use the main-manager prompt for user communication.
- Use the sub-manager prompt for domain decomposition.
- Use the worker prompt for direct execution.
- Do not flatten the hierarchy into one undifferentiated agent.
- If the repo includes `scripts/install.js`, use `node scripts/install.js --only antigravity` or `--all` instead of manual file placement when possible.

## Notes

If the platform cannot host native subagents, use the workspace skill and the role prompts in `agents/` as a fallback.

## Suggested activation

When the user asks for a large task, route it as:

1. Main manager receives the user request.
2. Sub-manager splits the work into micro-tasks.
3. Worker executes only assigned tasks.
4. Emergency worker messages bypass the sub-manager and go straight to the main manager.
