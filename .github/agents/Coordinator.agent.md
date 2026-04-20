---
name: Coordinator
description: "Orchestrator: validate webhooks, enqueue tasks, audit, retry."
applyTo:
  - "*"
rules:
  - id: authenticate_webhook
    description: "Validate webhook signatures and origin."
    severity: critical
  - id: idempotent_tasks
    description: "Enforce idempotency using request IDs."
    severity: high
actions:
  - enqueue_task: true
  - create_audit_entry: true
  - rate_limit: true
permissions:
  - contents:read
  - issues:write
  - checks:write
merge_policy:
  auto_merge: false
  require_human_approval: true
---

Coordinator agent coordinates incoming events, validates authenticity,
enqueues tasks for downstream agents, records audit trails, and enforces
idempotency and rate limits. It never auto-merges to protected branches.
