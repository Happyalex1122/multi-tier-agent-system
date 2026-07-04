# Communication Schema

Use JSON for all internal agent-to-agent communication.

## Base fields

- `type`: message category such as `TASK_UPDATE`, `REVIEW_RESULT`, or `EMERGENCY`
- `from`: sender role
- `to`: recipient role
- `task_id`: current task identifier
- `parent_task_id`: higher-level project or parent task identifier
- `status`: lifecycle state
- `summary`: short plain summary
- `evidence`: list of artifacts, checks, or observations
- `risks`: list of blockers or uncertainties
- `next_action`: the next expected move
- `confidence`: optional confidence value

## Status vocabulary

- `NEW`
- `ASSIGNED`
- `IN_PROGRESS`
- `BLOCKED`
- `DONE`
- `NEEDS_REVIEW`
- `EMERGENCY`

## Example

```json
{
  "type": "TASK_UPDATE",
  "from": "worker",
  "to": "sub_manager",
  "task_id": "task-001",
  "parent_task_id": "project-000",
  "status": "DONE",
  "summary": "Completed the assigned unit.",
  "evidence": ["tests passed"],
  "risks": [],
  "next_action": "Review"
}
```
