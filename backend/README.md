# backend

Wayly System API for the Chapter 2 Walking Skeleton.

`app.py` exposes:

- `GET /api/health` — service check
- `GET /api/itinerary` — calls `stub_map_provider()` then `stub_llm_api(...)` and returns hard-coded JSON

This is a course demo. It does not generate live itineraries or call a real LLM or map API.
