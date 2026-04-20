# Agent Runner (MVP)

This folder contains a minimal TypeScript-based agent runner used to demo the multi-agent workflow.

Features:

- Loads agent persona manifests from `.github/agents`.
- Simple HTTP server that accepts `POST /webhook` events.
- Lightweight coordinator that dispatches events to sample handlers.
- Example `DeveloperAgent` and `ReviewerAgent` handlers (mock implementations).

Quick start

```bash
cd agent-runner
npm ci
npm run dev
```

Then POST a GitHub webhook-like payload:

```bash
curl -X POST http://localhost:3333/webhook -H "x-github-event: issue_comment" -H "Content-Type: application/json" -d '{"comment": {"body": "/implement add endpoint"}}'
```

Notes

- Handlers are mock implementations; replace LLM adapter and GitHub wrapper for real usage.
- Add `GITHUB_TOKEN` and `WEBHOOK_SECRET` to `.env` for integrations.

Docker

Build and run locally with Docker:

```bash
cd agent-runner
docker build -t agent-runner:latest .
docker run -e GITHUB_TOKEN=... -e LLM_API_KEY=... -e WEBHOOK_SECRET=... -p 3333:3333 agent-runner:latest
```

Or use the provided docker-compose:

```bash
docker compose -f ../docker-compose.agent-runner.yml up --build
```

Logs are persisted to `agent-runner/logs` when using the compose file.
