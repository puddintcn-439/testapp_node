# Project Summary — TestApp

TestApp is a small full-stack example application (TypeScript + Node + React) used for demoing feature development and CI/CD workflows.

High-level components:
- Server: `src/` — Express + TypeScript. Routes in `src/routes`, controllers in `src/controllers`, services in `src/services`, DB init in `src/config/db.ts`.
- Client: `client/` — Vite + React components in `client/src/components`, API wrappers in `client/src/api`.
- Agent tooling: `agent-runner/` — agent utilities and tests used for automation and analysis.

Key scripts:
- `npm run dev` — run backend in dev using ts-node
- `npm run dev:client` — run client dev server
- `npm run dev:all` — run both concurrently
- `npm run build` — TypeScript build for server
- `client/npm run build` — produce production frontend assets

Docs and tooling:
- SKILL files (agent guidance): `.github/skills/*/SKILL.md`
- Auto-generated project map: `docs/project_map.md` (maintained by workflow)
- CI workflows: `.github/workflows/*.yml`

Purpose of this file:
- Provide a concise entrypoint for agents and humans to understand the repository layout and where to start.
