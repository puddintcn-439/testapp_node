# Production Secrets Management

Recommendations for managing production secrets:

- Keep secrets in a dedicated vault (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault).
- Do NOT commit secrets to git. Use environment variables or secret stores.
- For GitHub Actions, add secrets in the repository settings (Settings → Secrets → Actions).
- Common secrets used by this repository:
  - `DATABASE_URL` — production database connection
  - `JWT_SECRET` — JWT signing secret
  - `SENTRY_DSN` — Sentry project DSN
  - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — for Vercel deploys
  - `RENDER_DEPLOY_HOOK` — Render deploy webhook

Rotation & auditing
- Rotate secrets regularly and maintain a changelog.
- Enforce least-privilege for service accounts.
