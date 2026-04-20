# Agent Personas

This folder contains agent persona files describing roles, rules,
actions and required permissions. Use these as the source-of-truth for
agent behavior and to generate agent configuration for the runner.

Included agents:

- Coordinator: coordinates events and enqueues tasks.
- DeveloperAgent: generates code suggestions and draft PRs.
- ReviewerAgent: static/semantic review and annotations.
- TesterAgent: runs tests and uploads reports.
- CICDAgent: build/deploy orchestration and promotion.
- SecurityAgent: vulnerability scanning and secret detection.
- ReleaseAgent: changelog and release publishing.
- OpsAgent: monitoring-driven incidents and rollback suggestions.

Edit the corresponding `.agent.md` files to tune rules and actions.
