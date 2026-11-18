# backend

Wayly System API for the Chapter 2 Walking Skeleton.

`app.py` exposes:

- `GET /api/health` — service check
- `GET /api/itinerary` — calls `stub_llm_api(...)` to select a route, builds the itinerary, then calls `stub_map_provider(...)` to validate that route, and returns hard-coded JSON

This is a course demo. It does not generate live itineraries or call a real LLM or map API.
