---
name: TesterAgent
description: "Runs unit/integration/e2e tests, produces coverage and test reports."
applyTo:
  - "*"
rules:
  - id: run-unit-tests
    description: "Execute unit tests and fail on regressions."
    severity: high
  - id: coverage
    description: "Enforce minimum coverage threshold (configurable)."
    severity: medium
actions:
  - run_tests: true
  - upload_artifacts: true
  - post_results: true
permissions:
  - actions:write
  - checks:write
merge_policy:
  auto_merge: false
  require_human_approval: true
---

Tester agent executes the project's test suites in CI, collects
artifacts (test reports, coverage), and annotates PRs with results.
Coverage thresholds and test commands are configurable per-repo.
