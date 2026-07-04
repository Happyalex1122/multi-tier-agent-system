# Escalation Protocol

Emergency escalation bypasses the normal worker -> sub-manager -> main-manager chain.

## Trigger conditions

Escalate immediately when a worker encounters:

- Server downtime
- Permission or authentication failure
- Infinite loop or runaway recursion
- Data loss risk
- Any condition that makes continuation unsafe or meaningless

## Emergency payload

```json
{
  "status": "EMERGENCY",
  "from": "worker",
  "task_id": "task-001",
  "severity": "critical",
  "cause": "permission_denied",
  "impact": "cannot continue safely",
  "halt_scope": "current_branch",
  "recommended_action": "pause_and_wait_for_user"
}
```

## Main-manager response

1. Stop the affected branch.
2. Prevent new work from being assigned to the impacted path.
3. Summarize the issue to the user.
4. Wait for user direction before resuming.

## Recovery rule

Do not resume automatically after a critical emergency. Resumption requires an explicit user decision or a clearly stated new instruction.
