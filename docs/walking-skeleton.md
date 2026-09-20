# Walking Skeleton

Course demo for SYSEN 5151 Chapter 2. This is one stubbed end-to-end path, not the full Wayly product.

## Purpose

Show one Traveler request passing through the participants in the approved Innoslate sequence and returning a response of the correct shape.

## Scope

All participants use hard-coded local data. The demonstration makes no real LLM, map, POI, database, or authentication call. Retries, production logging, and complete itinerary logic remain outside this increment.

## Numbered call list

1. **UC.1.1** — Traveler → Wayly System: Submit Planning Request.
2. **UC.1.3** — Wayly System resolves a hard-coded curated candidate set.
3. **UC.1.4** — Wayly System → LLM API stub: Select Candidate Route from that set.
4. **UC.1.5** — Wayly System: Build Candidate Itinerary from the selected route.
5. **UC.1.6** — Wayly System → Map Provider API stub: Request Route Validation.
6. **UC.1.7** — Map Provider API stub → Wayly System: Validate Route Data.
7. **UC.1.9** — Wayly System → Traveler: Return Trusted Itinerary.

The order matches the final Action, Activity, and Sequence Diagrams. UC.1.5 is internal Wayly processing, so it may not appear as a message between lifelines in the Sequence Diagram.

## Participant implementation

| Participant | Implementation | Real external call? |
|---|---|---|
| Traveler | Browser page in `frontend/index.html` | No preference form |
| Wayly System | Flask `GET /api/itinerary` | Local process only |
| LLM API | `stub_llm_api(candidates)` | No |
| Map Provider API | `stub_map_provider(stops)` | No |

## Example request

```http
GET /api/itinerary HTTP/1.1
Host: 127.0.0.1:8000
```

## Expected response evidence

The JSON response includes `status: trusted`, a hard-coded New York stop list, LLM and map stub records, and a `call_sequence` array containing UC.1.1, UC.1.3, UC.1.4, UC.1.5, UC.1.6, UC.1.7, and UC.1.9 in order.

## Run and verify

```bash
python -m pip install -r backend/requirements.txt
python backend/app.py
```

Open `http://127.0.0.1:8000/` and click **Request stub itinerary**. In another terminal, run:

```bash
python -m pytest -q
```
