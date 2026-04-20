---
name: SecurityAgent
description: "Dependency scanning, SAST and secret detection; block critical vulns."
applyTo:
  - "*"
rules:
  - id: dependency-vuln
    description: "Block merges if critical dependency vulnerabilities are found."
    severity: critical
  - id: secret-detection
    description: "Flag and remove secrets in changes sent to repo."
    severity: critical
actions:
  - create_issue: true
  - fail_check_on_critical: true
  - suggest_dependency_updates: true
permissions:
  - issues:write
  - checks:write
  - contents:read
merge_policy:
  auto_merge: false
  require_human_approval: true
---

Security agent performs automated scans and reports. Critical
vulnerabilities block merges; non-critical issues create tickets
with suggested fixes.
