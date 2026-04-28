---
name: security
user-invocable: true
description: "SECURITY SKILL — Guidance for dependency, secret and SAST scanning. Use when: adding dependencies, handling secrets, or preparing a release. Keywords: security, codeql, dependabot, secret-scanning, sast"
---

# Security Skill

## Goal

Help developers add security checks and follow best-practices when changing code or dependencies.

## When to use
- Adding/updating dependencies
- Handling secrets or env vars
- Preparing a release for production

## Steps
1. Run `npm audit` locally and review critical findings.
2. Ensure secrets are stored in env vars and not committed.
3. Use CodeQL (CI) for SAST and enable Dependabot for dependency updates.
4. Add automated secret scanning (GitHub Advanced Security or other tools) for PRs.
5. For high-risk changes, request a security review in PR.

## Checklist
- [ ] No secrets in commits
- [ ] Dependabot configured or dependencies reviewed
- [ ] CodeQL (or equivalent SAST) enabled in CI
- [ ] Vulnerabilities triaged or patched before release

## Useful workflows
- `.github/workflows/codeql-analysis.yml` — CodeQL analysis for PRs and pushes
- `.github/dependabot.yml` — dependency update configuration (optional)
