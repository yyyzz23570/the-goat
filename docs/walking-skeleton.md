# Walking Skeleton

Course demo for SYSEN 5151 Chapter 1–2. This is a stubbed end-to-end path, not the full Wayly product.

## Purpose

Show one Traveler request passing through the current Sequence Diagram participants, using hard-coded stubs only.

## Scope

In scope:

- Traveler requests a New York itinerary placeholder
- Wayly System receives the request
- Wayly System calls a Map Provider API stub
- Wayly System calls an LLM API stub
- Wayly System returns a combined hard-coded JSON page

Out of scope:

- Real LLM calls
- Real map APIs
- Real POI data
- Databases
- Authentication
- Retries, production logging, or full itinerary logic

## User action

The Traveler opens `http://127.0.0.1:8000/` and clicks **Request stub itinerary** (the page also loads once automatically).

The current stub request does **not** collect date, budget, or other preference fields. It is an implied New York default request. Full preference fields remain TBD / To be confirmed.

## Sequence of component calls

```text
Traveler
  → Wayly System          GET /api/itinerary
    → Map Provider API    stub_map_provider()   hard-coded
    → LLM API             stub_llm_api(...)     hard-coded
  ← Wayly System          JSON itinerary placeholder
Traveler sees the page
```

Call order in `backend/app.py` is Map Provider API stub, then LLM API stub. If the Innoslate diagram uses the opposite order, that remains TBD / To be confirmed.

The stubs are local Python functions inside the Wayly System process. They are not separate hosted services and they do not make network calls.

## What is stubbed

| Participant | Implementation | Real call? |
| --- | --- | --- |
| Traveler | Browser page `frontend/index.html` | No preference form |
| Wayly System | Flask `GET /api/itinerary` | Yes, local process only |
| Map Provider API | `stub_map_provider()` | No |
| LLM API | `stub_llm_api(map_data)` | No |

## Example request

```http
GET /api/itinerary HTTP/1.1
Host: 127.0.0.1:8000
```

No request body. Implied city: New York.

## Example response

The body is JSON. It always includes:

- `message`: `Hello from the-goat API!`
- `city`: `New York`
- `map_stub`: hard-coded Map Provider API participant
- `llm_stub`: hard-coded LLM API participant
- `stops`: placeholder published place

Provider product names (OpenAI, DeepSeek, a named map vendor) are not claimed. Those remain TBD / To be confirmed.

## Run / demo steps

```bash
python -m pip install -r backend/requirements.txt
python backend/app.py
```

Open `http://127.0.0.1:8000/`. Confirm the page shows `Hello from the-goat API!`, `New York`, `Map Provider API`, and `LLM API`.

```bash
python -m pytest -q
```
