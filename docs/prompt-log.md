# AI assistance log

Truthful record of AI / Cursor help on the SYSEN 5151 `the-goat` repository. This log does not claim application implementation work that is not in the repository.

| Date | Task | Tool | What was actually done |
| --- | --- | --- | --- |
| 2026-08-27 | Initial course scaffold | Cursor | Created the technology-neutral repository layout: `README.md`, `frontend/README.md`, `backend/README.md`, `docs/README.md`, and `.gitignore`. No application runtime or dependencies were added. |
| 2026-08-28 | GitHub / course setup support | Cursor | Inspected local Git state and course GitHub-setup materials; advised on collaborators, README team/product text, branch protection, and that GitHub Actions were not yet present. No application code was added. |
| 2026-09-19 | Repository inspection and course documentation | Cursor | Inspected this repository and added/updated course documentation: `README.md`, `docs/context.md`, `SPEC.md`, `docs/environment.md`, `docs/decisions/0001-initial-toolchain.md`, `docs/prompt-log.md`, `AGENTS.md`, and `docs/README.md`. |
| 2026-09-19 | Clarify project-repo plan | Cursor | Updated documentation to treat `the-goat` as the SYSEN 5151 project repository for Wayly in New York. |
| 2026-09-19 | Lab 0 readiness-check app | Cursor | Added a Wayly-themed hard-coded Flask API (`GET /api/itinerary`), a minimal HTML page that renders `Hello from the-goat API!`, pytest checks, and GitHub Actions CI. Did not connect a real LLM or map API. |
| 2026-09-19 | Change course city to New York | Cursor | Updated this repository's product scope, hard-coded itinerary, and docs to New York. |
| 2026-09-19 | Chapter 2 Walking Skeleton stubs | Cursor | Added local hard-coded `stub_map_provider()` and `stub_llm_api(...)` calls inside `GET /api/itinerary`, created `docs/walking-skeleton.md`, and renamed Lab 0 page wording to Walking Skeleton. No real LLM or map API was connected. |
| 2026-09-19 | Remove migration framing | Cursor | Removed language that described this New York course repository as a migration or copy of another project. |

## Out of scope for this log

- Cursor UI layout questions (editor vs. chat panel) are not project work.
- A local model / model runner is still TBD and was not set up in this session.


## Chapter 2 alignment update — 2026-09-20

**Task:** Align the runnable Walking Skeleton with the approved Innoslate primary sequence.

**Tool:** Codex.

**Prompt:** Update the stubbed end-to-end flow to follow UC.1.1, UC.1.3, UC.1.4, UC.1.5, UC.1.6, UC.1.7, and UC.1.9. Keep all participants local and hard-coded; do not add real model, map, POI, authentication, retry, or logging behavior. Update the tests and walking-skeleton documentation to verify the same order.

**Result used:** Updated `backend/app.py`, `backend/test_app.py`, and `docs/walking-skeleton.md`. The LLM stub now selects from governed candidates before Wayly builds the itinerary; the Map Provider stub validates the built route afterward.
