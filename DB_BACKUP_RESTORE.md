# Database Backup & Restore

This document describes recommended backup and restore steps for Postgres.

Prerequisites
- `DATABASE_URL` environment variable or connection details.

Backup (ad-hoc)

```bash
# create a compressed custom-format dump
pg_dump "$DATABASE_URL" -Fc -f backup.dump
gzip backup.dump
```

Restore (to empty database)

```bash
gunzip backup.dump.gz
pg_restore -d postgres://user:pass@host:5432/dbname --clean --no-owner backup.dump
```

Automated Backups
- A GitHub Actions workflow (`.github/workflows/scheduled-db-backup.yml`) is included to create daily backups and store them as Actions artifacts. For production use you should upload backups to durable off-site storage (S3, GCS) and rotate retention.

Notes
- Test your restores periodically on a staging copy.
- Secure backup storage and encryption at rest is recommended.
