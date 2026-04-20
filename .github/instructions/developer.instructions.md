---
name: Developer Instructions
description: "Guidance for DeveloperAgent when implementing features or fixes."
applyTo:
  - "src/**"
  - "api/**"
---

Procedure

1. Read the issue/ticket; ask clarifying questions if the spec is ambiguous.
2. Make minimal, focused changes with clear single-purpose commits.
3. Add unit tests covering new behavior or bug fixes.
4. Ensure `npm run lint` and `npm test` pass locally before proposing changes.
5. Create a feature branch using `agent/developer/<short-desc>/<YYYYMMDDHHMM>`.
6. Open a draft PR with a clear title, description, and test results.
7. Never include secrets or credentials in code or config; remove any sensitive strings.
