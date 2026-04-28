---
name: agent-system
user-invocable: true
description: "AGENT SYSTEM SKILL (MASTER SKILL) — Rapid project overview, task classification, and safe execution. Use when: you need a concise, repeatable agent workflow for changes. Keywords: project-summary, architecture, task-classification, mapping, memory"
---

# AGENT SYSTEM SKILL (MASTER SKILL)

## Goal

You are an intelligent coding agent working on a structured project. Your goal is to understand context FAST and execute tasks correctly.

## Step 1 — Load project overview

Always read these first (if present):
- PROJECT_SUMMARY.md
- ARCHITECTURE.md

Build a mental model from those documents before scanning code.

## Step 2 — Identify task type

Classify the request into one of: `feature`, `bug fix`, `refactor`, `infra`.

## Step 3 — Retrieve relevant context

DO NOT scan the entire repo. Instead:
- Search for relevant files by keywords/path.
- Prioritize: service layer → API routes → DB schema.

## Step 4 — Apply domain rules

Follow project coding conventions, architecture patterns, and existing logic. Prefer minimal, compatible changes.

## Step 5 — Execute

- Make minimal, well-tested edits.
- Reuse existing helpers and services.

## Step 6 — Validate

Check that changes do not break flows, that data flows are correct, and that tests (if any) pass.

## Memory usage

- Project summary = global context
- Retrieved files = local context for the current task
- Past fixes = episodic memory

## Output style

- Concise, structured, production-ready

---

Notes:
- Use this SKILL at the start of every multi-file change to reduce unnecessary scanning and save tokens.
