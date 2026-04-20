# Secrets and Access Setup

Add the following GitHub repository secrets (or use an external secrets manager):

- `LLM_API_KEY` — API key for your LLM provider (OpenAI, Anthropic, etc.).
- `GITHUB_APP_ID` / `GITHUB_PRIVATE_KEY` — if using a GitHub App instead of `GITHUB_TOKEN`.
- `DOCKER_REGISTRY_TOKEN` — if publishing container images.

How to add secrets

1. Go to the repository Settings → Secrets and variables → Actions → New repository secret.
2. Add `LLM_API_KEY` with your provider key.
3. Add any deployment credentials your CI/CD needs.

CI verification

There is a workflow `.github/workflows/verify-secrets.yml` you can run manually to check presence of required secrets.
