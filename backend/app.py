"""Chapter 2 walking-skeleton API for the SYSEN 5151 Wayly repository.

The stub follows the approved Innoslate sequence: resolve curated candidates,
let the LLM stub select a route, build the itinerary, and validate the route.
No external service or production data is used.
"""

from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"


def stub_curated_candidates():
    """UC.1.3: hard-coded governed candidate set."""
    return [
        {"id": "poi-central-park", "name": "Central Park"},
        {"id": "poi-met", "name": "The Metropolitan Museum of Art"},
    ]


def stub_llm_api(candidates):
    """UC.1.4: select a route only from supplied candidates."""
    return {
        "stub": True,
        "participant": "LLM API",
        "uses_only_supplied_facts": True,
        "selected_candidate_ids": [item["id"] for item in candidates],
    }


def stub_map_provider(stops):
    """UC.1.6-UC.1.7: validate the built route with hard-coded data."""
    return {
        "stub": True,
        "participant": "Map Provider API",
        "city": "New York",
        "route_valid": True,
        "validated_stop_ids": [stop["id"] for stop in stops],
        "estimate": "Hard-coded static transport estimate",
    }


def build_itinerary():
    candidates = stub_curated_candidates()
    llm_data = stub_llm_api(candidates)
    selected_ids = llm_data["selected_candidate_ids"]
    stops = [item for item in candidates if item["id"] in selected_ids]
    map_data = stub_map_provider(stops)

    return {
        "source": "the-goat walking-skeleton stubs",
        "product": "Wayly / 途鉴",
        "message": "Hello from the-goat API!",
        "city": "New York",
        "status": "trusted" if map_data["route_valid"] else "rejected",
        "note": "Walking-skeleton stub response only. Not a live itinerary.",
        "llm_stub": llm_data,
        "map_stub": map_data,
        "stops": stops,
        "call_sequence": [
            "UC.1.1 Submit Planning Request",
            "UC.1.3 Resolve Curated Candidates",
            "UC.1.4 Select Candidate Route",
            "UC.1.5 Build Candidate Itinerary",
            "UC.1.6 Request Route Validation",
            "UC.1.7 Validate Route Data",
            "UC.1.9 Return Trusted Itinerary",
        ],
    }


app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    if request.path.startswith("/api/"):
        response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/api/itinerary")
def itinerary():
    return jsonify(build_itinerary())


@app.get("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/<path:filename>")
def static_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
