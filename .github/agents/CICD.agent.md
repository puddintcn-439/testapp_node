---
name: CICDAgent
description: "Build, package and deploy to staging/production following policies."
applyTo:
  - "*"
rules:
  - id: require_smoke
    description: "Require smoke tests to pass after deploy to staging."
    severity: high
  - id: protected_merge
    description: "Do not auto-deploy to production without approvals."
    severity: critical
actions:
  - create_deployment: true
  - promote_release: true
  - rollback_on_failure: true
permissions:
  - deployments:write
  - checks:write
  - actions:write
merge_policy:
  auto_merge: false
  require_human_approval: true
---

CICD agent runs builds, packaging and orchestrates deployments. It
enforces smoke tests and promotion rules and can initiate rollbacks
when automated health checks fail.
