"""Chapter 2 walking-skeleton API for the SYSEN 5151 Wayly / the-goat repository.

The Wayly System calls local Map Provider API and LLM API stubs, then returns
a hard-coded New York placeholder. This is not live itinerary generation.
"""

from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"


def stub_map_provider():
    """Hard-coded Map Provider API participant. No real map call."""
    return {
        "stub": True,
        "participant": "Map Provider API",
        "city": "New York",
        "estimate": "Hard-coded static transport estimate",
        "places": [
            {
                "name": "Placeholder published place",
            }
        ],
    }


def stub_llm_api(map_data):
    """Hard-coded LLM API participant. No real model call."""
    place_names = [place["name"] for place in map_data.get("places", [])]
    return {
        "stub": True,
        "participant": "LLM API",
        "mode": "controlled reasoning stub",
        "uses_only_supplied_facts": True,
        "supplied_place_names": place_names,
        "summary": "Hard-coded reasoning over the Map Provider API stub only.",
    }


def build_itinerary():
    map_data = stub_map_provider()
    llm_data = stub_llm_api(map_data)
    return {
        "source": "the-goat walking-skeleton stubs",
        "product": "Wayly / 途鉴",
        "message": "Hello from the-goat API!",
        "city": "New York",
        "note": "Walking-skeleton stub response only. Not a live itinerary.",
        "map_stub": map_data,
        "llm_stub": llm_data,
        "stops": [
            {
                "name": place["name"],
                "reason": "Hard-coded candidate from Map Provider API stub",
            }
            for place in map_data["places"]
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
