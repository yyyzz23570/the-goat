# AI assistance log

Truthful record of AI / Cursor help on the SYSEN 5151 `the-goat` repository. This log does not claim application implementation work that is not in the repository.

| Date | Task | Tool | What was actually done |
| --- | --- | --- | --- |
| 2026-08-27 | Initial course scaffold | Cursor | Created the technology-neutral repository layout: `README.md`, `frontend/README.md`, `backend/README.md`, `docs/README.md`, and `.gitignore`. No application runtime or dependencies were added. |
| 2026-08-28 | GitHub / course setup support | Cursor | Inspected local Git state and course GitHub-setup materials; advised on collaborators, README team/product text, branch protection, and that GitHub Actions were not yet present. No application code was added. |
| 2026-09-19 | Repository inspection and course documentation | Cursor | Inspected this repository (tracked files, README, `docs/jingbo-plan`, placeholders). Compared the named implementation repo [Wayly-mvp1](https://github.com/13haodeH/Wayly-mvp1) only to write an accurate product description. Added/updated course documentation: `README.md`, `docs/context.md`, `SPEC.md`, `docs/environment.md`, `docs/decisions/0001-initial-toolchain.md`, `docs/prompt-log.md`, `AGENTS.md`, and `docs/README.md`. No application logic, APIs, LLM connection, map connection, database, or authentication was implemented. |
| 2026-09-19 | Clarify project-repo plan | Cursor | Updated documentation after the team confirmed that `the-goat` **will** be the project repository and a teammate will migrate the working implementation here. No application files were migrated or reimplemented in that step. |
| 2026-09-19 | Lab 0 readiness-check app | Cursor | Added a Wayly-themed hard-coded Flask API (`GET /api/itinerary`), a minimal HTML page that renders `Hello from the-goat API!`, pytest checks, and GitHub Actions CI. Did not connect a real LLM or map API, and did not migrate Wayly-mvp1. |
| 2026-09-19 | Change course city to New York | Cursor | Updated this repository's product scope, Lab 0 hard-coded itinerary, and docs from Beijing to New York. Left the separate Beijing implementation repository untouched. |

## Out of scope for this log

- Cursor UI layout questions (editor vs. chat panel) are not project work.
- Work inside [Wayly-mvp1](https://github.com/13haodeH/Wayly-mvp1) is not claimed as work performed in `the-goat`.
- A local model / model runner is still TBD and was not set up in this session.
