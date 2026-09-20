# ADR 0001 — Initial toolchain

- Status: Accepted for the current course-repository stage
- Date: 2026-09-19
- Course: SYSEN 5151
- Repository: `the-goat`

## Context

This is a student team repository for the New York Wayly / 途鉴 course project. The first committed state was a **technology-neutral scaffold** (README, `frontend/`, `backend/`, `docs/`, `.gitignore`) so the team could share a GitHub baseline before locking an application stack.

Jingbo He later recorded a proposed backend/deployment note: SQLite, Netlify, and OpenAI API. The current course demo only needs a Walking Skeleton with hard-coded stubs.

## Decision

For the current SYSEN 5151 stage of **this** repository:

1. Treat `the-goat` as the course **project** repository for Wayly in New York.
2. Use **Git + GitHub** as the shared version-control toolchain.
3. Use **Cursor** for AI-assisted documentation and course setup in this workspace.
4. For the current course demo, use **Python + Flask + static HTML + pytest + GitHub Actions**. The Wayly System calls local **Map Provider API** and **LLM API** stubs; responses are hard-coded.
5. Record Jingbo's SQLite / Netlify / OpenAI note as a **later proposal**, not as the walking skeleton.

## Rationale

- The course repository needed a shared, low-risk first commit and a place for systems-engineering documents.
- Chapter 2 needs a Walking Skeleton through Traveler, Wayly System, Map Provider API, and LLM API. Local hard-coded stubs are enough for this stage.
- Cursor is already used for scaffold, documentation, and this course demo.

## Consequences

- This repository can run the walking-skeleton page at `http://127.0.0.1:8000/`.
- Map Provider API and LLM API are stubs, not production services.
- Later product work should update `docs/environment.md` from files that actually exist in this repository.

## TBD items

- Canonical LLM provider for the SYSEN Innoslate model (Jingbo's note proposes OpenAI API)
- Canonical Map Provider API
- Whether VS Code is an official team editor in addition to Cursor
- Whether a local model / model runner will be used
