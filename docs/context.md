# System context and boundary

This document describes the Wayly system boundary and external entities for the SYSEN 5151 course repository.

It is a text counterpart to the team's Innoslate context model and course report. **If Innoslate and this file disagree, Innoslate / the course report should be treated as the modeling authority until the team reconciles them.** This repository does not contain an Innoslate export, so provider names and message formats that are not already written down here are marked TBD.

This file does **not** define new APIs or implementation details.

## System of interest

**Wayly System** (途鉴): the planned trusted local-exploration system for **New York** short-trip travelers. It accepts traveler trip preferences and returns an explainable, adjustable, traceable itinerary, with an operations-console concept for verification, feedback, evaluation, and release gates.

## External entities

| Entity | Type | Role (course-level) |
| --- | --- | --- |
| Traveler | Human actor | Requests a short-trip itinerary and reviews/adjusts the result |
| Wayly System | System of interest | Validates inputs, applies product rules, and returns itinerary information |
| LLM API | External service | Controlled language-model reasoning used only inside product rules |
| Map Provider API | External service | Map / location / routing support used by the Wayly System |

## Interactions

Direction uses the source → destination convention. Formats are recorded only when already known in this repository or clearly stated in the linked implementation README; otherwise they are TBD.

### 1. Traveler submits trip preferences

| Field | Value |
| --- | --- |
| Source | Traveler |
| Destination | Wayly System |
| Direction | Traveler → Wayly System |
| Information exchanged | Concept-level trip preferences: date, duration, number of travelers, total itinerary budget, interests, natural-language intent, transport/walking preference, dining constraints, and accessibility needs |
| Data / message format | Current walking skeleton: implied New York default request via `GET /api/itinerary` with no body. Full preference fields remain TBD / To be confirmed. |

### 2. Wayly System returns an itinerary

| Field | Value |
| --- | --- |
| Source | Wayly System |
| Destination | Traveler |
| Direction | Wayly System → Traveler |
| Information exchanged | Candidate itinerary information: published-place placeholder, source note, static transport estimate stub, and adjustable-itinerary placeholder |
| Data / message format | Current walking-skeleton JSON from `GET /api/itinerary`: `message`, `city`, `map_stub`, `llm_stub`, `stops`. This is a course stub, not a production contract. |

### 3. Wayly System requests controlled LLM reasoning

| Field | Value |
| --- | --- |
| Source | Wayly System |
| Destination | LLM API |
| Direction | Wayly System → LLM API (request), LLM API → Wayly System (response) |
| Information exchanged | A controlled planning/reasoning request and a structured model response. Product principle: the model may only reason over information supplied by the Wayly System; it is not the source of place facts. |
| Data / message format | Current walking skeleton: local Python stub `stub_llm_api(map_data)` returns hard-coded JSON with `participant: LLM API`. No real model is called. Production schema TBD / To be confirmed. |

Notes already present in team materials (not treated as a final course-model decision):

- `docs/jingbo-plan/jingbo-demo.md` proposes **OpenAI API** as the LLM API.

Which provider is canonical for the SYSEN 5151 Innoslate model remains **TBD / To be confirmed**.

### 4. Wayly System requests map / location information

| Field | Value |
| --- | --- |
| Source | Wayly System |
| Destination | Map Provider API |
| Direction | Wayly System → Map Provider API (request), Map Provider API → Wayly System (response) |
| Information exchanged | Map, location, or transport-estimate information needed to support itinerary presentation or static travel estimates |
| Data / message format | Current walking skeleton: local Python stub `stub_map_provider()` returns hard-coded JSON with `participant: Map Provider API` and a New York placeholder place. No real map vendor is called. Production provider and payload TBD / To be confirmed. |

## Boundary notes

Inside the Wayly System boundary (concept level):

- Traveler-facing itinerary planning
- Operations-console concept (place verification, feedback, evaluation, release gates)
- Product rules that constrain what an LLM may return

Outside the Wayly System boundary:

- Traveler
- LLM API
- Map Provider API
- Official ticketing, live hours, turn-by-turn navigation, ride-hailing, and payment services (the product concept does not replace these)

## Sources used

- This repository: `README.md`, `docs/walking-skeleton.md`, `docs/jingbo-plan/jingbo-demo.md`
- Innoslate model / course report: **not present in this repository** (alignment TBD)
