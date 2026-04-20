---
name: Workspace Agent Instructions
description: "Workspace-level instructions for multi-agent behavior. Applies to all agents interacting with this repository."
applyTo:
  - "**"
---

Overview

These instructions define default guardrails and expected behavior for all agents.

- Prefer producing draft PRs or suggested patches instead of committing directly to protected branches.
- Do not auto-merge to protected branches (main, release, production); require human approval.
- Mask or remove secrets from any prompts or context sent to LLMs; never persist credentials in repo.
- Include linter and test results with suggestions; use project scripts: `npm run lint`, `npm test`, `npm run build`.
- Respect per-agent persona files in `.github/agents/` as the source-of-truth for role-specific behavior.
- For destructive actions (force push, delete branch, rollback), require explicit human approval and an audit entry.
- Branch naming convention for agent work: `agent/<role>/<short-desc>/<YYYYMMDDHHMM>`.
- Record an audit entry with request id, agent id, action, and brief rationale for every automated action.

If an agent cannot confidently produce a safe patch, it should open a discussion comment and request human input.
