---
name: Tester Instructions
description: "Guidance for running test suites and reporting results via TesterAgent."
applyTo:
  - "**"
---

Steps

- Install dependencies: `npm ci`.
- Run tests in CI mode: `npm run test -- --ci`.
- Generate test reports (JUnit) and coverage artifacts and upload them to the PR.
- Enforce default coverage threshold: 80% (configurable per repo).
- On failures, annotate failing tests with stack traces and suggested fixes.
