# Sample User Credentials (for testing)

Stored: 2026-04-22

Use email as username. These accounts are for local/testing only — do NOT use in production.

- Alice Nguyen — alice@example.com — password123
- Bob Tran — bob@example.com — hunter2
- Carol Le — carol@example.com — qwerty123
- David Pham — david@example.com — letmein
- Eve Hoang — eve@example.com — password

Related files:
- `data/users_sample.csv` — CSV with bcrypt password_hash values
- `tools/generate_users_csv.js` — script to regenerate the CSV
- `client/public/login.html` — static login page
- `client/src/components/LoginForm.tsx` — React login form

Import instructions (Supabase):
1. Dashboard → Table Editor → `users` table → Import data → upload `data/users_sample.csv`.
2. Map columns `name`, `email`, `password_hash`, `created_at` and run import.

Security note: rotate or remove these accounts before publishing to production and set a strong `JWT_SECRET`.
