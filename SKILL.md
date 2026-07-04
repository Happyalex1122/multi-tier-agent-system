---
name: multi-tier-agent-system
description: This skill should be used when coordinating complex work through a three-tier hierarchy of main manager, sub-manager, and worker roles with structured JSON communication and emergency escalation.
category: orchestration
risk: medium
source: custom
tags: [multi-agent, orchestration, delegation, escalation, json, hierarchy]
date_added: "2026-07-03"
---

# multi-tier-agent-system

## Purpose

This skill defines a disciplined three-tier agent operating model for complex tasks that can overload a single agent's context window. It establishes a strict separation of responsibilities across a main manager, sub-managers, and workers so that planning, decomposition, execution, validation, and escalation remain stable as task complexity grows.

The core goal is to preserve context, reduce coordination noise, and make failure handling explicit. The main manager remains responsible for user communication and final decision-making. Sub-managers translate broad goals into micro-tasks and perform first-pass validation. Workers execute only the tasks assigned to them and report results in structured form.

## When to Use This Skill

Use this skill when:

- A request is large enough to benefit from hierarchical decomposition.
- Multiple domains, phases, or specialties need to be coordinated.
- Work should be delegated into bounded micro-tasks with review gates.
- Failure handling must be immediate and explicit.
- The task benefits from machine-readable handoffs instead of free-form relay text.

Do not use this skill for trivial one-step requests where orchestration would add overhead.

## Operating Model

### Tier 1: Main Manager

The main manager is the control plane.

Responsibilities:

- Communicate with the user.
- Define the overall objective and success criteria.
- Create or approve the task tree.
- Assign domain-level work to sub-managers.
- Stop the workflow during emergencies.
- Merge validated outputs into the final response.

Constraints:

- The main manager must not drift into routine implementation work unless no subordinate is available.
- The main manager should remain at the level of intent, prioritization, and risk control.

### Tier 2: Sub-Manager

The sub-manager is the domain lead.

Responsibilities:

- Break a domain task into micro-tasks that workers can execute directly.
- Clarify assumptions and acceptance criteria.
- Validate worker outputs before escalation upward.
- Detect inconsistencies, missing dependencies, or low-confidence results.

Constraints:

- The sub-manager must not bypass the main manager for routine progress updates.
- The sub-manager should keep work localized to its domain.

### Tier 3: Worker

The worker is the executor.

Responsibilities:

- Perform only the assigned micro-task.
- Return results, artifacts, and evidence in a structured payload.
- Report blockers immediately and precisely.

Constraints:

- The worker must not expand scope.
- The worker must not improvise new goals.
- The worker must not speak to the user directly unless explicitly instructed by the main manager.

## Communication Protocol

All agent-to-agent communication in this system must use JSON only.

Natural language is allowed only in user-facing messages and final summaries. Internal handoffs must remain machine-readable so that context does not degrade as work passes through the hierarchy.

### Required Message Shape

Use this baseline shape for non-emergency traffic:

```json
{
  "type": "TASK_UPDATE",
  "from": "worker",
  "to": "sub_manager",
  "task_id": "task-001",
  "parent_task_id": "project-000",
  "status": "IN_PROGRESS",
  "summary": "Short structured summary",
  "evidence": [],
  "risks": [],
  "next_action": "What should happen next"
}
```

Recommended fields:

- `type`
- `from`
- `to`
- `task_id`
- `parent_task_id`
- `status`
- `summary`
- `evidence`
- `risks`
- `next_action`
- `confidence`

### Status Values

Use a narrow status vocabulary:

- `NEW`
- `ASSIGNED`
- `IN_PROGRESS`
- `BLOCKED`
- `DONE`
- `NEEDS_REVIEW`
- `EMERGENCY`

## Emergency Escalation

This is the central exception path.

If a worker encounters a critical failure such as server downtime, permission denial, data corruption, runaway recursion, infinite loop, or any other condition that prevents safe continuation, the worker must bypass the sub-manager and notify the main manager immediately.

Emergency payload:

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

Main manager response on emergency:

- Halt the active sub-tree.
- Stop issuing new work to affected agents.
- Report the issue to the user with the minimum necessary detail.
- Wait for user instructions before resuming.

Sub-managers must respect the halt once informed. No routine retry loop should continue after a confirmed emergency unless the main manager explicitly approves it.

## Standard Workflow

1. Intake the user request at the main manager.
2. Define the project goal, constraints, and completion criteria.
3. Split the project into domain chunks and assign each chunk to a sub-manager.
4. Let each sub-manager split its chunk into worker-sized micro-tasks.
5. Let workers execute the micro-tasks and return JSON updates.
6. Let sub-managers validate, normalize, and aggregate the worker outputs.
7. Let the main manager assemble the validated results and deliver the user-facing answer.

## Decision Rules

- Prefer decomposition over broad instructions.
- Prefer bounded tasks over open-ended exploration.
- Prefer structured status updates over narrative progress reports.
- Prefer escalation early rather than after repeated failure.
- Prefer a halt when safety or correctness is uncertain.

## Output Discipline

The final user-facing response should:

- State the result of the work plainly.
- Mention any unresolved risks or assumptions.
- Reflect the hierarchy only as much as needed for clarity.
- Avoid exposing internal chatter or unverified intermediate speculation.

## Examples

### Normal worker update

```json
{
  "type": "TASK_UPDATE",
  "from": "worker",
  "to": "sub_manager",
  "task_id": "frontend-02",
  "parent_task_id": "project-000",
  "status": "DONE",
  "summary": "Implemented the component and added tests.",
  "evidence": ["tests passed", "lint clean"],
  "risks": [],
  "next_action": "Request review"
}
```

### Sub-manager validation

```json
{
  "type": "REVIEW_RESULT",
  "from": "sub_manager",
  "to": "main_manager",
  "task_id": "frontend-02",
  "status": "NEEDS_REVIEW",
  "summary": "Implementation is correct but needs a small accessibility fix.",
  "evidence": ["manual review complete"],
  "risks": ["button label is ambiguous"],
  "next_action": "Send back to worker for refinement"
}
```

### Emergency escalation

```json
{
  "status": "EMERGENCY",
  "from": "worker",
  "task_id": "db-migration-04",
  "severity": "critical",
  "cause": "server_down",
  "impact": "migration cannot continue safely",
  "halt_scope": "entire branch",
  "recommended_action": "halt_and_notify_user"
}
```

## Notes

This skill is intentionally strict. The value of the system comes from predictable boundaries, clean handoffs, and immediate escalation when something goes wrong. If the situation is ambiguous, the safer choice is to stop, report, and ask for direction.
