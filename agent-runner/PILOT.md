# Pilot plan and metrics

Follow this checklist to run a small pilot and collect metrics.

Steps:

1. Add secrets: `LLM_API_KEY` in repo secrets (or locally in `.env`).
2. Start the runner locally: `cd agent-runner && npm ci && npm run dev`.
3. Create a test issue and post comment `/implement <description>` or open a PR to trigger reviewer automation.
4. Observe `agent-runner/logs/audit.log` for audit entries.

Metrics to collect:

- `avg_review_latency_ms`: time from PR open to review comment.
- `llm_calls_per_pr`: number of LLM completions per PR.
- `accepted_suggestions_pct`: percent of agent-suggested PRs/patches accepted by humans.
- `cost_per_pr_usd`: LLM cost per PR.

Iteration

- Start with mock LLM (no secrets) to validate flows.
- Enable real LLM for small sample of PRs and measure acceptance/accuracy.
- Tighten guardrails: disable auto-merge, require human approval for production.
