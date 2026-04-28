# Architecture — TestApp

Overview
--------
TestApp is a classic client-server web app:

- Client (React + Vite): UI components under `client/src/components` call thin API wrappers in `client/src/api`.
- Server (Express + TypeScript): routes under `src/routes/*` -> controllers under `src/controllers/*` -> services under `src/services/*` -> persistence via SQL (Postgres or MSSQL) managed in `src/config/db.ts`.
- Docs/API: Swagger is generated from route JSDoc and served at `/api-docs`.

Data flow
---------
Client UI → API wrapper → Server route → Controller → Service → DB (queries in services via `src/config/db.ts`).

Deployment & CI
---------------
- Backend build: TypeScript `npm run build` then run dist output.
- Frontend build: `client/npm run build` produces static assets for hosting.
- CI runs defined in `.github/workflows/ci.yml` (builds backend and frontend). New GitHub Actions may add test/lint/code-scan steps.

Extensibility
-------------
- New features should add routes → controllers → services and update `docs/project_map.md` via the generator.
- Security scans (CodeQL) and dependency updates (Dependabot) are enabled via workflows and SKILLs.
