"""Lab 0 minimal API for the SYSEN 5151 Wayly / the-goat repository.

Returns a hard-coded response only. This is not itinerary generation,
and it does not call an LLM or map provider.
"""

from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

HARD_CODED_ITINERARY = {
    "source": "the-goat Lab 0 hard-coded API",
    "product": "Wayly / 途鉴",
    "message": "Hello from the-goat API!",
    "city": "New York",
    "note": "Course readiness-check response only. Not a live itinerary.",
    "stops": [
        {
            "name": "Placeholder published place",
            "reason": "Hard-coded candidate for Lab 0",
        }
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
    return jsonify(HARD_CODED_ITINERARY)


@app.get("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/<path:filename>")
def static_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
