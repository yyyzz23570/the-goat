# AGENTS.md

Guidance for AI assistants working in this SYSEN 5151 repository.

## What this repository is

`the-goat` is the Cornell SYSEN 5151 **course project repository** for Wayly / 途鉴 in **New York**. The teammate implementation source is a Beijing prototype and should be adapted to New York when migrated here.

It currently contains:

- Course documentation
- A Lab 0 readiness-check app (hard-coded Flask API + static HTML + pytest CI)

A teammate will later migrate the full application from:

- https://github.com/13haodeH/Wayly-mvp1

## Do

- Preserve existing correct files, including Lab 0 files and any later migrated application code.
- Keep `docs/context.md` consistent with Traveler, Wayly System, LLM API, and Map Provider API.
- Mark unverified information as `TBD / To be confirmed`.
- Record AI help truthfully in `docs/prompt-log.md`.

## Do not

- Replace the Lab 0 hard-coded API with a real LLM, map API, database, or authentication unless a human teammate explicitly asks.
- Reimplement or redesign the full Wayly application in parallel with the teammate migration.
- Invent APIs, requirements, or architecture that are not already in the team documents.
- Claim that this repository currently runs the full Wayly product.

## Current layout

See `README.md` for the file tree and `docs/README.md` for the documentation index.
