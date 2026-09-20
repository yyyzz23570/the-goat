# the-goat

Cornell SYSEN 5151 team project repository.

**Product:** Wayly / 途鉴（可信本地探索）

This repository is the team's **SYSEN 5151 course project repository**. It currently contains a **minimal, technology-neutral scaffold** plus course documentation. It is intended to establish a shared project structure, toolchain baseline, and systems-engineering records (context, specification outline, environment, and decisions).

A teammate already has a working/implementable version of the product in a separate repository. **That teammate will migrate the implementation into this repository.** Until that migration lands, this repository should not claim a running app, and the existing working code should not be redesigned here.

- Current implementation source (to be migrated here): [https://github.com/13haodeH/Wayly-mvp1](https://github.com/13haodeH/Wayly-mvp1)

## Project description

Wayly (途鉴) is a trusted local-exploration concept for short-trip travelers in Beijing. The intended service generates **explainable, adjustable, and traceable itineraries**, and includes an operations-console concept for place verification, feedback, evaluation, and release gates.

Core product principle (from the implementation repository): **data determines facts, code enforces rules, and the model is used only for controlled reasoning.**

This repository records that concept for SYSEN 5151. Until the teammate migration is complete, it does **not** claim that the full product is running from `frontend/` or `backend/` here.

## Current OpsCon / project concept

**Operational concept (high level):** a traveler provides trip preferences (such as date, duration, party size, total budget, interests, and related constraints). The Wayly system returns a candidate itinerary based on published/verified place information. External services may support controlled language-model reasoning and map/location information. The traveler remains responsible for confirming tickets, hours, navigation, and payments through official or third-party services.

System-boundary details are in [`docs/context.md`](docs/context.md). The specification outline is in [`SPEC.md`](SPEC.md).

## Repository structure

```text
the-goat/
├── README.md                 # Project overview (this file)
├── AGENTS.md                 # Guidance for AI assistants working in this repo
├── SPEC.md                   # Course-stage specification outline
├── frontend/                 # Placeholder for client / UI application code
├── backend/                  # Placeholder for server, API, and related services
├── docs/                     # SYSEN 5151 project documentation
│   ├── README.md             # Documentation index
│   ├── context.md            # System boundary and external entities
│   ├── environment.md        # Verified development environment notes
│   ├── prompt-log.md         # AI assistance log
│   ├── decisions/            # Architecture Decision Records
│   │   └── 0001-initial-toolchain.md
│   └── jingbo-plan/          # Backend/deployment notes from Jingbo He
│       └── jingbo-demo.md
└── .gitignore                # Common ignore rules for future web/app work
```

## Setup / start instructions

This repository **does not currently contain a runnable application**. `frontend/` and `backend/` are placeholders only. There is no `package.json`, runtime configuration, or start script here that can be verified.

To inspect the course documentation now:

1. Clone this repository.
2. Open the files listed above. No install or build step is required.

Until the teammate migrates the working code into this repository, run the current implementation from [Wayly-mvp1](https://github.com/13haodeH/Wayly-mvp1). After migration, start instructions in this README should be updated to match the files that actually land here.

## Current status

- Course scaffold and README are in place.
- SYSEN 5151 documentation files for context, specification outline, environment, toolchain ADR, and AI prompt log are in `docs/` / repository root as listed above.
- No application code is present in this repository.
- No framework or runtime dependencies are present in this repository.
- Jingbo He has recorded a proposed backend/deployment note under `docs/jingbo-plan/`.
- A working product implementation currently lives in a separate repository and will be **migrated into this repository by a teammate**. That migration has not landed yet.

## Next steps

1. Teammate migrates the working implementation into this repository (do not reimplement it in parallel).
2. After migration, update setup/start instructions and `docs/environment.md` to match the files that actually arrive.
3. Align `docs/context.md` with the Innoslate model and course report (provider names and message formats still TBD).
4. Fill specification sections in `SPEC.md` only when the corresponding need/requirement is agreed.

## Team

SYSEN 5151 — team repository: `the-goat`

## Member

Yuzheng Liu, Jingbo He, Siyuan Chen, Yunkuan Liu
