---
name: bootstrap
description: "Scaffold a multi-agent runner, personas, CI, tests and docs in a repo"
---

One-shot prompt (tiếng Việt)

```
You are an expert automation agent for GitHub repositories. Your task: scaffold a complete multi-agent developer workflow (agent personas, runner, CI workflows, tests, docs, pilot) inside the target repository. Do the work on a new feature branch and do not push directly to protected branches.

Parameters (fill before running):
- REPO_ROOT: path to repo root (or '.' meaning current repo)
- BRANCH_NAME: agent/bootstrap/{{YYYYMMDDHHMM}} (create this branch)
- RUNTIME: Node.js 18 + TypeScript
- LLM_PROVIDER: 'openai' (default) or 'mock'
- GITHUB_AUTH: use GitHub App (GITHUB_APP_ID + GITHUB_PRIVATE_KEY) if available; otherwise use `GITHUB_TOKEN`
- SKELETON_ONLY: true|false (when true create minimal skeleton; when false create full scaffold)

Work to perform (ordered):
1. Create and checkout branch `BRANCH_NAME`.
2. Create `.github/agents/` persona files for Coordinator, DeveloperAgent, ReviewerAgent, TesterAgent, CICDAgent, SecurityAgent, ReleaseAgent, OpsAgent and add `AGENTS.md`. Use YAML frontmatter with keys: `name`, `description`, `applyTo`, `rules`, `actions`, `permissions`, `merge_policy`.
3. Create workspace instructions and prompts:
   - `.github/copilot-instructions.md`
   - `.github/instructions/{developer,reviewer,tester,security}.instructions.md`
   - `.github/prompts/{implement,review,test}.prompt.md`
4. Scaffold `agent-runner/` (TypeScript) containing:
   - `package.json`, `tsconfig.json`, `.env.example`, `README.md`
   - `src/index.ts` (Express webhook receiver), `src/manifestLoader.ts`, `src/coordinator.ts`, `src/audit.ts`
   - `src/github.ts` (Octokit helpers: get default branch, create branch, create/update file, create draft PR, create PR comment)
   - `src/llmAdapter.ts` with real-call code if `LLM_PROVIDER=openai` (use env `LLM_API_KEY`, `LLM_MODEL`), fallback to mock when not set
   - `src/agents/` with example handlers: `developer.ts`, `reviewer.ts`, and `agents/index.ts`
   - `src/analysis.ts` (simple analyzer mock)
   - `src/cli-reviewer.ts` to run reviewer in CI using `GITHUB_EVENT_PATH`
   - `src/scripts/demo.ts` to exercise DeveloperAgent locally
   - `src/__tests__/` unit tests for developer + reviewer and `jest.config.cjs`
   - `src/audit.ts` that appends audit logs to `agent-runner/logs/audit.log`
5. Add CI workflows:
   - `.github/workflows/agent-runner-ci.yml` — install, run tests, build when `agent-runner/**` changes
   - `.github/workflows/reviewer-automation.yml` — run ReviewerAgent on `pull_request` events (use `GITHUB_TOKEN` for comments)
   - `.github/workflows/verify-secrets.yml` — manual workflow to check required secrets
6. Add docs & governance:
   - `.github/SECRETS.md`, `.github/GITHUB_APP.md`, `agent-runner/PILOT.md`
7. Add test support:
   - `jest` config, tests, `npm run test:ci` in `agent-runner/package.json`
8. Add `.env.example` with `PORT`, `GITHUB_TOKEN`, `WEBHOOK_SECRET`, `LLM_API_KEY`.
9. Make sure all TypeScript compiles: run `npm ci` and `npm run build` in `agent-runner`. Fix type errors if any.
10. Run unit tests: `npm run test` and `npm run test:ci` (CI-mode).
11. Commit all changes to branch `BRANCH_NAME` and push to remote.
12. Create a draft PR from `BRANCH_NAME` to repo default branch with a clear PR body describing deliverables and how to enable LLM/GitHub App secrets (if permissions allow). If agent lacks permission, leave clear instructions in a file `AGENT_SETUP_NEXT_STEPS.md`.
13. Return a concise report listing:
    - Files created/changed
    - Commands run and their results (tests, build)
    - PR URL (if created) or next steps if not
    - Verification checklist pass/fail

Constraints & guardrails:
- Never write secrets into repo. Create `.env.example` only.
- Do not auto-merge to default/protected branches.
- If creating PR or writing to remote requires elevated permission and agent doesn't have it, stop and produce `AGENT_SETUP_NEXT_STEPS.md` with commands for the maintainer to run.
- Sanitize any code or content sent to external LLM (mask PII) and log only hashed filenames in audit logs.
- Use branch naming `agent/bootstrap/<timestamp>`; include an audit entry for every automated action.

Verification steps (run locally / CI):
```bash
# in agent-runner
npm ci
npm run test
npm run build
# run dev server (mock mode if no secrets)
npm run dev
# run demo
npm run demo
```

Expected outputs:
- New branch pushed with all scaffold files
- Draft PR or `AGENT_SETUP_NEXT_STEPS.md`
- CI job passing tests and build on the new branch
- A short summary report printed at end by the agent

If `SKELETON_ONLY=true` then create minimal file contents and README notes explaining where to extend implementations.
```

Gợi ý nhanh sử dụng
- Để tạo nhanh: thay `REPO_ROOT` là `.` rồi paste prompt vào chat agent (Copilot), set `SKELETON_ONLY=false`.
- Sau khi agent tạo xong, chạy:
```bash
cd agent-runner
npm ci
npm run test:ci
npm run build
```

Muốn mình chuyển prompt này thành file `.github/prompts/bootstrap.prompt.md` trong repo hiện tại không?
