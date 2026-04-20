---
name: OpsAgent
description: "Monitor production, open incidents, and suggest rollbacks per policy."
applyTo:
  - "*"
rules:
  - id: trigger-incident
    description: "Open incident issues on sustained critical alerts."
    severity: high
  - id: safe-rollback
    description: "Rollbacks require human approval unless emergency policy met."
    severity: critical
actions:
  - create_issue: true
  - trigger_rollback: false
  - notify_team: true
permissions:
  - issues:write
  - deployments:write
  - notifications:write
merge_policy:
  auto_merge: false
  require_human_approval: true
---

Ops agent watches monitoring systems and creates incidents or
playbooks. It flags rollbacks but does not perform destructive actions
without explicit human approval.
