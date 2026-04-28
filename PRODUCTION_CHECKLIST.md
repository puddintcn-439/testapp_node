# Production Release Checklist

Before creating a production release tag, verify the following:

- [ ] All CI checks pass (lint, unit tests, integration tests, e2e where applicable)
- [ ] Migrations are written and tested on staging; a rollback plan exists
- [ ] Backups are configured and recent backups validated
- [ ] Vulnerability scans (Dependabot, CodeQL) are reviewed and addressed
- [ ] Sentry/monitoring configured and alerted recipients set
- [ ] Release notes / changelog updated
- [ ] Database maintenance window scheduled if needed
- [ ] Feature flags toggled as needed for canary rollout
- [ ] Post-deploy smoke tests defined and verified
