# the-goat

Cornell SYSEN 5151 team project repository.

**Product:** Wayly / 途鉴（可信本地探索）

This repository is the team's **SYSEN 5151 course project repository** for Wayly / 途鉴 in **New York**. It contains course documentation, a **Chapter 2 Walking Skeleton**, and a separate **Wayly NYC MVP preview**.

The walking-skeleton files are a course demo only. The NYC preview is a local catalog planner. Neither is the full Wayly product.

## Project description

Wayly (途鉴) is a trusted local-exploration concept for short-trip travelers in **New York**. The intended service generates **explainable, adjustable, and traceable itineraries**, and includes an operations-console concept for place verification, feedback, evaluation, and release gates.

Core product principle: **data determines facts, code enforces rules, and the model is used only for controlled reasoning.**

## Current OpsCon / project concept

**Operational concept (high level):** a traveler provides trip preferences (such as date, duration, party size, total budget, interests, and related constraints). The Wayly system returns a candidate itinerary based on published/verified place information. External services may support controlled language-model reasoning and map/location information. The traveler remains responsible for confirming tickets, hours, navigation, and payments through official or third-party services.

**Walking Skeleton in this repository:** the traveler-facing page calls `GET /api/itinerary`. The Wayly System then calls a **Map Provider API stub** and an **LLM API stub** and returns a hard-coded New York placeholder. No real LLM, map provider, database, or live POI lookup is used. See [`docs/walking-skeleton.md`](docs/walking-skeleton.md).

System-boundary details are in [`docs/context.md`](docs/context.md). The course specification outline is in [`SPEC.md`](SPEC.md).

## Repository structure

```text
the-goat/
├── README.md                 # Project overview (this file)
├── AGENTS.md                 # Guidance for AI assistants working in this repo
├── SPEC.md                   # Course-stage specification outline
├── pytest.ini                # Test path for course checks
├── package.json              # Wayly NYC MVP preview
├── .github/workflows/ci.yml  # GitHub Actions: install deps and run pytest
├── frontend/                 # Traveler page that renders the stub itinerary
│   ├── index.html
│   └── README.md
├── backend/                  # Wayly System API plus Map/LLM stubs
│   ├── app.py
│   ├── test_app.py
│   ├── requirements.txt
│   └── README.md
├── app/                      # Wayly NYC MVP preview routes
├── components/               # NYC preview UI
├── data/                     # Published NYC catalog used by the preview
│   └── nyc-poi-v1.json
├── lib/                      # NYC preview planner and contracts
├── docs/                     # SYSEN 5151 and NYC preview documentation
│   ├── README.md
│   ├── context.md
│   ├── environment.md
│   ├── prompt-log.md
│   ├── walking-skeleton.md
│   ├── SPEC.md
│   ├── decisions/
│   │   └── 0001-initial-toolchain.md
│   └── jingbo-plan/
│       └── jingbo-demo.md
└── .gitignore
```

## Setup / start instructions

### Walking Skeleton

Requires Python 3.12+ (verified locally with Python 3.13).

```bash
python3 -m pip install -r backend/requirements.txt
python3 backend/app.py
```

If your environment uses `python` instead of `python3`, replace it in the commands above.

Then open `http://127.0.0.1:8000/`. The page should show **Hello from the-goat API!**, **New York**, and the Map Provider API / LLM API stubs from `GET /api/itinerary`.

Run the course checks:

```bash
python -m pytest -q
```

GitHub Actions runs the same pytest job on push and pull request.

### Wayly NYC MVP preview

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local URL printed by the dev server.

Verify the preview build:

```bash
npm run lint
npm run build
```

The build validates that the application routes compile. It does not establish live availability or ticketing information.

## Local demo

1. In the repository root, install the backend dependencies:
   ```bash
   python3 -m pip install -r backend/requirements.txt
   ```
2. Start the Flask app:
   ```bash
   python3 backend/app.py
   ```
3. Open `http://127.0.0.1:8000/` in your browser.
4. The traveler page loads automatically and calls `GET /api/itinerary`.
5. If the page has not rendered the response yet, click **Request stub itinerary**.
6. Review the stubbed New York itinerary response, including the `status`, `city`, `stops`, and `call_sequence` fields.

This is a local preview and does not represent real-time availability, ticketing, or traffic conditions.

## Wayly NYC MVP preview

Wayly's NYC preview is a mobile-first trip-planning preview for short New York City visits. It uses an English-only interface, a USD planning budget, and a source-linked NYC catalog.

### Current scope

- Build a short NYC itinerary from a published catalog of 200 places.
- Collect date, available hours, party size, total USD budget, interests, free-text intent, transportation preference, walking pace, dining preference, and an accessibility request.
- Show place details, a reference image with a credit link, a primary place source, static route estimates, and explicit planning limitations.
- Allow a local preview of itinerary adjustment, feedback, profile, and map handoff flows.

### Boundary

The preview does not provide live hours, ticket inventory, reservation status, real-time routing, ride hailing, payment, or accessibility certification. Each stop links to a published source; travelers must confirm live conditions before departure.

### Data

[`data/nyc-poi-v1.json`](./data/nyc-poi-v1.json) is the single catalog used by the current planner. All 200 records have an official or venue source URL, a reviewed-on date, a USD planning allowance, coordinates, access notes, and a detail-image field.

See [`docs/README.md`](./docs/README.md) for the documentation index.

## Current status

- Course documentation is in place.
- Walking Skeleton is in this repository: Traveler page, Wayly System API, Map Provider API stub, LLM API stub, and CI.
- A local Wayly NYC MVP preview is also in this repository. It plans from the published catalog and is not the full Wayly application.
- The Map Provider API and LLM API in the Walking Skeleton are local hard-coded stubs.
- Jingbo He has recorded a proposed later backend/deployment note under `docs/jingbo-plan/`.

## Next steps

1. Align `docs/context.md` with the Innoslate model and course report (provider names and message formats still TBD).
2. Fill specification sections in `SPEC.md` only when the corresponding need/requirement is agreed.
3. Keep the Walking Skeleton stubbed until the team agrees to replace a stub with a real service.

## Team

SYSEN 5151 — team repository: `the-goat`

## Member

Yuzheng Liu, Jingbo He, Siyuan Chen, Yunkuan Liu, Qinyue Xie
