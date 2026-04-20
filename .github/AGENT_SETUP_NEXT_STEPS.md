# Agent Setup Next Steps (manual)

If automated steps failed (missing permissions), follow these manual instructions to finish setup.

1. Create a GitHub App (recommended):
   - Go to Settings → Developer settings → GitHub Apps → New GitHub App.
   - Set "Webhook URL" to your runner endpoint (e.g., https://runner.example.com/webhook) and provide a secure `WEBHOOK_SECRET`.
   - Grant minimal permissions: Checks (read/write), Pull requests (read/write), Issues (read/write), Contents (read), Deployments (read/write) as needed.
   - Install the GitHub App on the target repository or organization.
   - Download the generated private key; save it as `GITHUB_PRIVATE_KEY` in your secrets store.

2. Add repository secrets (Settings → Secrets):
   - `GITHUB_APP_ID` — numeric app id
   - `GITHUB_PRIVATE_KEY` — private key (PEM)
   - `LLM_API_KEY` — your LLM provider key
   - `WEBHOOK_SECRET` — webhook secret used by runner
   - `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER`, `REMOTE_PATH` (for remote deploy via Actions)

3. Register webhook (optional automated):
   - Locally: `cd agent-runner && npm ci && npm run register-webhook` (requires env vars `GITHUB_OWNER`, `GITHUB_REPO`, `WEBHOOK_URL`, and auth).

4. Deploy runner to staging:
   - Use the `deploy-staging` workflow (Actions → Run workflow) after setting SSH secrets, or run `docker compose -f docker-compose.agent-runner.yml up --build -d` on a staging host.

5. Run pilot:
   - Set `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` in env (or in Secrets/Actions) and run `cd agent-runner && npm run pilot` to create a test issue and trigger the agent flow.
