<!-- multi-tier-agent-system-begin -->
## Multi-tier agent system (always on)

Route large work through three layers:

- Main manager: user communication, planning, final merge
- Sub-manager: domain decomposition, review, aggregation
- Worker: direct execution only

Internal agent handoffs use JSON only.

Emergency path: worker may bypass sub-manager and escalate directly to main manager when critical failure appears.

OpenClaw workspace support lives in:

  skills/multi-tier-agent-system/SKILL.md

Default behavior: preserve the hierarchy, keep messages structured, and halt on critical failure.
<!-- multi-tier-agent-system-end -->
