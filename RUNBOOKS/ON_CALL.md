# On-call runbook (skeleton)

This file describes quick steps for the on-call engineer when incidents occur.

1. Identify service impacted (API, frontend, worker)
2. Check CI and deploy status (GitHub Actions)
3. Check recent deploys and release tags
4. Check monitoring dashboards / alert details (Sentry, Cloudwatch, Datadog)
5. If DB is impacted, follow DB restore checklist in `DB_BACKUP_RESTORE.md`
6. If rollbacks needed, create emergency PR following `release` workflow and tag `vX.Y.Z`

Add your provider-specific runbooks and escalation contacts here.
