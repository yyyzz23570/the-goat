# the-goat

Cornell SYSEN 5151 team project repository.

**Product:** Wayly / 途鉴（可信本地探索）

This repository is the team's **SYSEN 5151 course project repository**. It currently contains course documentation plus a **Lab 0 readiness-check** app: a hard-coded API and a minimal page that renders that response.

A teammate already has a working/implementable version of the full product in a separate repository. **That teammate will migrate the full implementation into this repository.** The Lab 0 files are only the course baseline. They are not the full Wayly product and should not be treated as a redesign of the teammate's work.

- Current full implementation source (to be migrated here): [https://github.com/13haodeH/Wayly-mvp1](https://github.com/13haodeH/Wayly-mvp1)

## Project description

Wayly (途鉴) is a trusted local-exploration concept for short-trip travelers in **New York**. The intended service generates **explainable, adjustable, and traceable itineraries**, and includes an operations-console concept for place verification, feedback, evaluation, and release gates.

The separate implementation source [Wayly-mvp1](https://github.com/13haodeH/Wayly-mvp1) is a Beijing prototype. In **this** course repository, the target city is New York. After migration, that implementation should be adapted to New York rather than kept as a Beijing product.

Core product principle (from the implementation repository): **data determines facts, code enforces rules, and the model is used only for controlled reasoning.**

## Current OpsCon / project concept

**Operational concept (high level):** a traveler provides trip preferences (such as date, duration, party size, total budget, interests, and related constraints). The Wayly system returns a candidate itinerary based on published/verified place information. External services may support controlled language-model reasoning and map/location information. The traveler remains responsible for confirming tickets, hours, navigation, and payments through official or third-party services.

**Lab 0 scope in this repository:** the traveler-facing page calls `GET /api/itinerary` and displays a **hard-coded** New York placeholder. No LLM, map provider, database, or live POI lookup is used.

System-boundary details are in [`docs/context.md`](docs/context.md). The specification outline is in [`SPEC.md`](SPEC.md).

## Repository structure

```text
the-goat/
├── README.md                 # Project overview (this file)
├── AGENTS.md                 # Guidance for AI assistants working in this repo
├── SPEC.md                   # Course-stage specification outline
├── pytest.ini                # Test path for Lab 0 checks
├── .github/workflows/ci.yml  # GitHub Actions: install deps and run pytest
├── frontend/                 # Minimal page that renders the API response
│   ├── index.html
│   └── README.md
├── backend/                  # Minimal hard-coded API
│   ├── app.py
│   ├── test_app.py
│   ├── requirements.txt
│   └── README.md
├── docs/                     # SYSEN 5151 project documentation
│   ├── README.md
│   ├── context.md
│   ├── environment.md
│   ├── prompt-log.md
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

Then open `http://127.0.0.1:8000/`. The page should show **Hello from the-goat API!** from the hard-coded `GET /api/itinerary` response.

Run the Lab 0 checks:

```bash
python -m pytest -q
```

GitHub Actions runs the same pytest job on push and pull request.

## Current status

- Course documentation is in place.
- Lab 0 readiness check is in this repository: hard-coded API, minimal frontend, and CI.
- This is **not** the full Wayly application. It does not call an LLM or map API.
- Jingbo He has recorded a proposed later backend/deployment note under `docs/jingbo-plan/`.
- A full product implementation currently lives in a separate repository and will be **migrated into this repository by a teammate**.

## Next steps

1. Teammate migrates the working Wayly implementation into this repository without discarding the course docs.
2. After migration, update setup/start instructions and `docs/environment.md` to match the files that actually arrive.
3. Align `docs/context.md` with the Innoslate model and course report (provider names and message formats still TBD).
4. Fill specification sections in `SPEC.md` only when the corresponding need/requirement is agreed.

## Team

SYSEN 5151 — team repository: `the-goat`

## Member

Yuzheng Liu, Jingbo He, Siyuan Chen, Yunkuan Liu
