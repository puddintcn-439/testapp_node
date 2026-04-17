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
