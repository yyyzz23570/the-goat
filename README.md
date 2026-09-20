# the-goat

Cornell SYSEN 5151 team project repository.

**Product:** Wayly / 途鉴（可信本地探索）

This repository is the team's **SYSEN 5151 course project repository** for Wayly / 途鉴 in **New York**. It currently contains course documentation plus a **Chapter 2 Walking Skeleton**: a Traveler page, a Wayly System API, and hard-coded Map Provider API and LLM API stubs.

The walking-skeleton files are a course demo only. They are not the full Wayly product.

## Project description

Wayly (途鉴) is a trusted local-exploration concept for short-trip travelers in **New York**. The intended service generates **explainable, adjustable, and traceable itineraries**, and includes an operations-console concept for place verification, feedback, evaluation, and release gates.

Core product principle: **data determines facts, code enforces rules, and the model is used only for controlled reasoning.**

## Current OpsCon / project concept

**Operational concept (high level):** a traveler provides trip preferences (such as date, duration, party size, total budget, interests, and related constraints). The Wayly system returns a candidate itinerary based on published/verified place information. External services may support controlled language-model reasoning and map/location information. The traveler remains responsible for confirming tickets, hours, navigation, and payments through official or third-party services.

**Walking Skeleton in this repository:** the traveler-facing page calls `GET /api/itinerary`. The Wayly System then calls a **Map Provider API stub** and an **LLM API stub** and returns a hard-coded New York placeholder. No real LLM, map provider, database, or live POI lookup is used. See [`docs/walking-skeleton.md`](docs/walking-skeleton.md).

System-boundary details are in [`docs/context.md`](docs/context.md). The specification outline is in [`SPEC.md`](SPEC.md).

## Repository structure

```text
the-goat/
├── README.md                 # Project overview (this file)
├── AGENTS.md                 # Guidance for AI assistants working in this repo
├── SPEC.md                   # Course-stage specification outline
├── pytest.ini                # Test path for course checks
├── .github/workflows/ci.yml  # GitHub Actions: install deps and run pytest
├── frontend/                 # Traveler page that renders the stub itinerary
│   ├── index.html
│   └── README.md
├── backend/                  # Wayly System API plus Map/LLM stubs
│   ├── app.py
│   ├── test_app.py
│   ├── requirements.txt
│   └── README.md
├── docs/                     # SYSEN 5151 project documentation
│   ├── README.md
│   ├── context.md
│   ├── environment.md
│   ├── prompt-log.md
│   ├── walking-skeleton.md
│   ├── decisions/
│   │   └── 0001-initial-toolchain.md
│   └── jingbo-plan/
│       └── jingbo-demo.md
└── .gitignore
```

## Setup / start instructions

Requires Python 3.12+ (verified locally with Python 3.13).

```bash
python -m pip install -r backend/requirements.txt
python backend/app.py
```

Then open `http://127.0.0.1:8000/`. The page should show **Hello from the-goat API!**, **New York**, and the Map Provider API / LLM API stubs from `GET /api/itinerary`.

Run the course checks:

```bash
python -m pytest -q
```

GitHub Actions runs the same pytest job on push and pull request.

## Current status

- Course documentation is in place.
- Walking Skeleton is in this repository: Traveler page, Wayly System API, Map Provider API stub, LLM API stub, and CI.
- This is **not** the full Wayly application. The Map Provider API and LLM API are local hard-coded stubs.
- Jingbo He has recorded a proposed later backend/deployment note under `docs/jingbo-plan/`.

## Next steps

1. Align `docs/context.md` with the Innoslate model and course report (provider names and message formats still TBD).
2. Fill specification sections in `SPEC.md` only when the corresponding need/requirement is agreed.
3. Keep the Walking Skeleton stubbed until the team agrees to replace a stub with a real service.

## Team

SYSEN 5151 — team repository: `the-goat`

## Member

Yuzheng Liu, Jingbo He, Siyuan Chen, Yunkuan Liu, Qinyue Xie
