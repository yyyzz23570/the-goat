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

1. Treat `the-goat` as the course **project** repository. Documentation/scaffold is here now; application code will arrive by teammate migration.
2. Use **Git + GitHub** as the shared version-control toolchain.
3. Use **Cursor** for AI-assisted documentation and repository organization in this workspace.
4. Do **not** reimplement or replace the teammate's application while they migrate it here.
5. Record Jingbo's SQLite / Netlify / OpenAI note as a **proposal only**, not as an implemented stack in this repository.
6. Record Wayly-mvp1 technologies as the current implementation's observed stack. After migration, update this ADR / `docs/environment.md` to match what is actually in `the-goat`.

## Rationale

- The course repository needed a shared, low-risk first commit and a place for systems-engineering documents.
- Reimplementing Wayly here in parallel would interfere with the teammate's working codebase and migration.
- Claiming a full web stack here would be false until those files actually land in this repository.
- Cursor is the assistant already used for scaffold and documentation work in this project.

## Consequences

- This repository cannot be started as the Wayly application **until the migration lands**.
- Readers must use `README.md` and `docs/environment.md` to distinguish current scaffold/docs from the source implementation.
- Two toolchain notes now exist (Jingbo proposal vs. Wayly-mvp1 observed stack) and must not be silently merged.
- After migration, environment and start instructions in this repository should be updated from the files that arrive, not guessed in advance.

## TBD items

- Canonical LLM provider for the SYSEN Innoslate model (OpenAI proposal vs. DeepSeek in Wayly-mvp1)
- Canonical Map Provider API
- Whether VS Code is an official team editor in addition to Cursor
- Whether a local model / model runner will be used
- Whether Lab 0 minimal API/frontend or CI workflows will later be added to this repository
- Exact layout of the migrated application inside `the-goat` (to be confirmed by the teammate doing the migration)
