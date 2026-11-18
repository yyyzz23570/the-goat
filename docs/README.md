# docs

Project documentation for the SYSEN 5151 team project. This index covers the course documents and the Wayly NYC MVP preview.

## Index

| Document | Purpose |
| --- | --- |
| [context.md](context.md) | System boundary and external-entity interactions |
| [walking-skeleton.md](walking-skeleton.md) | Chapter 2 stubbed end-to-end path |
| [environment.md](environment.md) | Verified development-environment notes |
| [prompt-log.md](prompt-log.md) | AI / Cursor assistance log |
| [decisions/0001-initial-toolchain.md](decisions/0001-initial-toolchain.md) | Initial toolchain ADR |
| [jingbo-plan/jingbo-demo.md](jingbo-plan/jingbo-demo.md) | Backend and deployment plan notes (Jingbo He) |
| [SPEC.md](SPEC.md) | Wayly NYC MVP specification |
| [DATA_PROVENANCE.md](DATA_PROVENANCE.md) | NYC catalog provenance |
| [AI_PROVENANCE.md](AI_PROVENANCE.md) | NYC MVP AI-assisted work record |
| [MILESTONE_1_TRACEABILITY.md](MILESTONE_1_TRACEABILITY.md) | Milestone 1 traceability |

Related repository-root documents:

- [`../README.md`](../README.md) — project overview
- [`../SPEC.md`](../SPEC.md) — course specification outline
- [`../AGENTS.md`](../AGENTS.md) — assistant working rules

Place additional requirements, design notes, meeting notes, and other project documents here as they become available.

## Wayly NYC MVP

### Product boundary

The NYC MVP plans short visits from a fixed, source-linked catalog. The current implementation intentionally uses a deterministic planner so that selections, USD allowances, and planning assumptions can be inspected locally.

### Evidence available in the repository

- `data/nyc-poi-v1.json`: the 200-place published NYC catalog.
- `lib/nyc-plan-contract.ts`: input contract and validation boundary.
- `lib/nyc-planner.ts`: deterministic scoring (interests, free-text request, walking, dining, and accessibility preferences), compact route building within the available hours and budget, adjustment handling, replacement suggestions, and static transport estimates.
- `app/page.tsx`: the mobile-first user flow, place detail view, adjustment flow, feedback interface, and map handoff preview.

### Evidence boundary

This repository proves a local build and the behavior of the included catalog. It does not prove real-world place availability, live transit performance, ticket inventory, or user outcomes.
