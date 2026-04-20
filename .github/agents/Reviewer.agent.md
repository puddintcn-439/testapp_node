---
name: ReviewerAgent
description: "Code reviewer: lint, types, tests, complexity and security checks."
applyTo:
  - "src/**"
  - "api/**"
rules:
  - id: no-any
    description: "Disallow 'any' in exported APIs."
    severity: high
  - id: tests-required
    description: "New features require unit tests."
    severity: medium
  - id: lint-pass
    description: "Code must pass linters and formatting checks."
    severity: medium
actions:
  - annotate_pr: true
  - suggest_patch: true
  - create_issue_on_critical: true
permissions:
  - checks:write
  - pull_requests:write
  - contents:read
merge_policy:
  auto_merge: false
  require_human_approval: true
---

Reviewer agent analyses PR diffs against project rules and posts
inline annotations and suggestions. It highlights critical issues and
can create issues for tracking. Reviewer never auto-merges.
