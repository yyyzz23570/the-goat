# AGENTS.md

Guidance for AI assistants working in this SYSEN 5151 repository.

## What this repository is

`the-goat` is the Cornell SYSEN 5151 **course project repository**. It currently holds a technology-neutral scaffold and systems-engineering documentation for the Wayly / 途鉴 project.

A teammate already has a working application in a separate repository and **will migrate that implementation into this repository**:

- https://github.com/13haodeH/Wayly-mvp1

## Do

- Preserve existing correct files, including any application code after it is migrated here.
- Prefer documentation and repository-organization changes until the migration lands.
- Keep `docs/context.md` consistent with the listed entities: Traveler, Wayly System, LLM API, Map Provider API.
- Mark unverified information as `TBD / To be confirmed`.
- Record AI help truthfully in `docs/prompt-log.md`.

## Do not

- Reimplement or redesign the application in parallel with the teammate migration.
- Implement itinerary generation, Walking Skeleton, LLM calls, map APIs, POI retrieval, databases, or authentication here unless a human teammate is explicitly migrating or maintaining that work.
- Invent APIs, requirements, or architecture that are not already in the team documents.
- Claim that this repository can run the Wayly product before the migrated files are present.

## Current layout

See `README.md` for the file tree and `docs/README.md` for the documentation index.
