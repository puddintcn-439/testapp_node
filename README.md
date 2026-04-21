# TestApp — Project Layout

Short overview and cleanup instructions.

Structure
- `src/` — backend (Express + TypeScript)
- `api/` — Vercel serverless handler that exports `app` from `src/index.ts`
- `client/` — frontend (Vite + React + static files)

Cleanup notes
- `client/dist/` is build output and should be ignored by git. If it exists in the repository, remove it with:

```powershell
git rm -r --cached client/dist
git commit -m "chore: remove client/dist from repo"
```

- `.gitignore` already updated to ignore common files (node_modules, env, logs, client/dist).

If you want, run the tests or start dev servers:

```powershell
npm install
npm run dev      # backend dev (ts-node)
npm run dev:client   # frontend dev (vite)
```

## Repository tree (overview)

```
TestApp/
├─ .github/
│  └─ workflows/ (CI workflows, includes prod-structure-check.yml)
├─ agent-runner/
├─ api/                 # (empty - previous vercel handler removed)
├─ client/              # Frontend + Vercel deploy root
│  ├─ package.json
│  ├─ vercel.json
│  ├─ public/           # static HTML and assets copied to dist
│  │  ├─ menu.html
│  │  ├─ about.html
│  │  ├─ book.html
│  │  ├─ css/
│  │  ├─ images/
│  │  ├─ fonts/
│  │  └─ js/
│  ├─ src/              # React app (Vite)
│  ├─ dist/             # build output (generated)
│  ├─ api/              # Vercel function files (serverless entry)
│  └─ server/           # Express app adapted for serverless (imported by client/api)
├─ dist/                # backend build output (compiled JS)
├─ scripts/
├─ src/                 # backend source for local dev (Express + TypeScript)
│  ├─ index.ts
│  ├─ config/
│  ├─ controllers/
│  ├─ routes/
│  └─ services/
├─ tools/
│  ├─ checkProdStructure.js
│  └─ PROD_STRUCTURE_CHECKER.md
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Component notes (detailed)

- `client/` — Frontend project and Vercel deploy root.
	- `client/public/`: Static files that Vite copies into the final `dist/`. Put any HTML you expect to serve directly (e.g., `menu.html`) here.
	- `client/src/`: Vite + React source files for the frontend SPA/MPA.
	- `client/dist/`: Generated production build (do not commit; add to `.gitignore`).
	- `client/vercel.json`: Vercel routing and functions configuration used when Vercel builds from `client/`.
	- `client/api/index.ts`: Serverless function entry that imports the Express app from `client/server` and adapts it for Vercel.
	- `client/server/`: A copy of the Express backend adapted for serverless execution (contains `index.ts`, `config/`, `routes/`, `controllers/`, `services/`). This is used only by Vercel functions in the current layout.

- `src/` — Backend server source used for local development.
	- `src/index.ts`: Local server entry. Starts an HTTP server when not running on Vercel.
	- `src/config/`: DB and swagger configuration (`db.ts`, `swagger.ts`).
	- `src/routes/`, `src/controllers/`, `src/services/`: API route handlers and business logic.

- `tools/` — Developer tooling and checks
	- `tools/checkProdStructure.js`: Script that validates `vercel.json` patterns, detects misplaced HTML/assets, and warns about `__dirname` usage that can break in serverless bundles.
	- `tools/PROD_STRUCTURE_CHECKER.md`: Instructions on reusing the checker in other repos.

- `.github/workflows/prod-structure-check.yml` — CI workflow which runs the production-structure checker on pushes and pull requests.

## Notes & recommendations

- Currently the backend code is duplicated: `src/` (local dev) and `client/server/` (for Vercel). This works but increases maintenance burden and risk of drift. Recommended actions:
	1. Consolidate the backend into a single source-of-truth (e.g., `backend/` or keep `src/`) and update Vercel config to use the same code (change Vercel project root or move a small adapter into `client/`).
	2. Add a CI step to run `npm --prefix client run build` so the repository validates frontend artifacts before deployment.

- Avoid using `path.join(__dirname, '..', '...')` to reach project files from within serverless functions; prefer `process.cwd()` or use `includeFiles` in `vercel.json`.

If you want, I can:
- consolidate the backend into a single folder now, or
- add a CI build step to the prod-structure workflow, or
- add an automated backup-tag workflow (tags `backup/<sha>` before merges) — tell me which and I'll implement it.
