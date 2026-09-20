# ADR 0001 — Initial toolchain

- Status: Accepted for the current course-repository stage
- Date: 2026-09-19
- Course: SYSEN 5151
- Repository: `the-goat`

## Context

This is a student team repository. The first committed state was a **technology-neutral scaffold** (README, `frontend/`, `backend/`, `docs/`, `.gitignore`) so the team could share a GitHub baseline before locking an application stack.

A teammate (Jingbo He) later recorded a proposed backend/deployment note: SQLite, Netlify, and OpenAI API. Separately, another teammate maintains a working Wayly implementation in [Wayly-mvp1](https://github.com/13haodeH/Wayly-mvp1) and will migrate that implementation into this repository. Until that migration lands, this course repository must document toolchain choices without redesigning or replacing that implementation.

## Decision

For the current SYSEN 5151 stage of **this** repository:

1. Treat `the-goat` as the course **project** repository.
2. Use **Git + GitHub** as the shared version-control toolchain.
3. Use **Cursor** for AI-assisted documentation and Lab 0 setup in this workspace.
4. For Lab 0 only, use **Python + Flask + static HTML + pytest + GitHub Actions**. The API response is hard-coded.
5. Do **not** replace the teammate's full Wayly application with this Lab 0 baseline. The teammate will migrate the full implementation here later.
6. Record Jingbo's SQLite / Netlify / OpenAI note as a **later proposal**, not as Lab 0.
7. After the full migration, update this ADR / `docs/environment.md` to match what is actually in `the-goat`.

## Rationale

- The course repository needed a shared, low-risk first commit and a place for systems-engineering documents.
- Lab 0 requires a hard-coded API, a page that renders it, and CI. Python/Flask/HTML is enough and does not copy or redesign Wayly-mvp1.
- Reimplementing the full Wayly product here would interfere with the teammate migration.
- Cursor is already used for scaffold, documentation, and this Lab 0 baseline.

## Consequences

- This repository can run the Lab 0 page at `http://127.0.0.1:8000/`.
- It cannot yet be started as the full Wayly application.
- After migration, environment and start instructions should be updated from the files that arrive.

## TBD items

- Canonical LLM provider for the SYSEN Innoslate model (OpenAI proposal vs. DeepSeek in Wayly-mvp1)
- Canonical Map Provider API
- Whether VS Code is an official team editor in addition to Cursor
- Whether a local model / model runner will be used
- Exact layout of the migrated application inside `the-goat` (to be confirmed by the teammate doing the migration)
