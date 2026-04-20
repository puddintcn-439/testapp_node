---
name: Security Instructions
description: "Guidance for SecurityAgent: dependency, secret and SAST scanning."
applyTo:
  - "**"
---

Checks

- Run dependency vulnerability scan: `npm audit` / dependency scanner.
- Run secret detection on PR diffs (gitleaks/git-secrets).
- Run static analyzers if configured (SAST).
- For critical vulnerabilities or secret exposures, block merge and create an issue with remediation steps.
- For dependency issues, suggest minimal safe upgrades and notify maintainers.
