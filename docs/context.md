# System context and boundary

This document describes the Wayly system boundary and external entities for the SYSEN 5151 course repository.

It is a text counterpart to the team's Innoslate context model and course report. **If Innoslate and this file disagree, Innoslate / the course report should be treated as the modeling authority until the team reconciles them.** This repository does not contain an Innoslate export, so provider names and message formats that are not already written down here are marked TBD.

This file does **not** define new APIs or implementation details.

## System of interest

**Wayly System** (途鉴): the planned trusted local-exploration system that accepts traveler trip preferences and returns an explainable, adjustable, traceable itinerary, with an operations-console concept for verification, feedback, evaluation, and release gates.

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
| Information exchanged | Trip preferences already described at concept level: date, duration, number of travelers, total itinerary budget, interests, natural-language intent, transport/walking preference, dining constraints, and accessibility needs |
| Data / message format | TBD / To be confirmed. Not specified in this course repository. |

### 2. Wayly System returns an itinerary

| Field | Value |
| --- | --- |
| Source | Wayly System |
| Destination | Traveler |
| Direction | Wayly System → Traveler |
| Information exchanged | Candidate itinerary information already described at concept level: published places, source snapshots, static transport estimates, and adjustable itinerary content |
| Data / message format | TBD / To be confirmed. Not specified in this course repository. |

### 3. Wayly System requests controlled LLM reasoning

| Field | Value |
| --- | --- |
| Source | Wayly System |
| Destination | LLM API |
| Direction | Wayly System → LLM API (request), LLM API → Wayly System (response) |
| Information exchanged | A controlled planning/reasoning request and a structured model response. Product principle: the model may only reason over information supplied by the Wayly System; it is not the source of place facts. |
| Data / message format | TBD / To be confirmed for the Innoslate/course model. This repository does not define an LLM request schema. |

Notes already present in team materials (not treated as a final course-model decision):

- `docs/jingbo-plan/jingbo-demo.md` proposes **OpenAI API** as the LLM API.
- The separate implementation repository [Wayly-mvp1](https://github.com/13haodeH/Wayly-mvp1) documents an optional **DeepSeek** path and a strict JSON response when that path is used.

Which provider is canonical for the SYSEN 5151 Innoslate model remains **TBD / To be confirmed**.

### 4. Wayly System requests map / location information

| Field | Value |
| --- | --- |
| Source | Wayly System |
| Destination | Map Provider API |
| Direction | Wayly System → Map Provider API (request), Map Provider API → Wayly System (response) |
| Information exchanged | Map, location, or transport-estimate information needed to support itinerary presentation or static travel estimates |
| Data / message format | TBD / To be confirmed. No map-provider name, endpoint, or payload is defined in this course repository. |

The implementation repository README describes **static transport estimates** and does not document a named Map Provider API in its public environment example. The course model still includes this external entity; the concrete provider is TBD.

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

- This repository: `README.md`, `docs/jingbo-plan/jingbo-demo.md`
- Implementation repository description: [Wayly-mvp1 README](https://github.com/13haodeH/Wayly-mvp1)
- Innoslate model / course report: **not present in this repository** (alignment TBD)
