---
name: Reviewer Instructions
description: "Automatic reviewer guidance for PRs touching source and API code."
applyTo:
  - "src/**"
  - "api/**"
---

Checklist (when reviewing a PR)

1. Run TypeScript build: `npm run build` or `tsc --noEmit`.
2. Run linters: `npm run lint` and apply formatting rules.
3. Run tests related to changed files: `npm run test -- --findRelatedTests`.
4. Flag uses of `any` in exported APIs as high severity.
5. Annotate security or secret findings immediately and create a blocking issue for critical leaks.
6. Summarize issues with counts by severity and suggest minimal patches where feasible.

Behavior

- Prefer annotating PRs using GitHub Checks / reviewdog for inline comments.
- Do not auto-merge; always leave a human-review step for final approval.
