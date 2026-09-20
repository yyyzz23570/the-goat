from app import (
    app,
    build_itinerary,
    stub_curated_candidates,
    stub_llm_api,
    stub_map_provider,
)


def test_health_returns_ok():
    client = app.test_client()
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_itinerary_follows_approved_stub_sequence():
    client = app.test_client()
    response = client.get("/api/itinerary")
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Hello from the-goat API!"
    assert data["product"] == "Wayly / 途鉴"
    assert data["city"] == "New York"
    assert data["status"] == "trusted"
    assert data["llm_stub"]["participant"] == "LLM API"
    assert data["map_stub"]["participant"] == "Map Provider API"
    assert data["call_sequence"] == [
        "UC.1.1 Submit Planning Request",
        "UC.1.3 Resolve Curated Candidates",
        "UC.1.4 Select Candidate Route",
        "UC.1.5 Build Candidate Itinerary",
        "UC.1.6 Request Route Validation",
        "UC.1.7 Validate Route Data",
        "UC.1.9 Return Trusted Itinerary",
    ]
    assert data == build_itinerary()


def test_stubs_are_local_hard_coded_and_whitelist_constrained():
    candidates = stub_curated_candidates()
    llm_data = stub_llm_api(candidates)
    stops = [item for item in candidates if item["id"] in llm_data["selected_candidate_ids"]]
    map_data = stub_map_provider(stops)
    assert llm_data["uses_only_supplied_facts"] is True
    assert llm_data["selected_candidate_ids"] == [item["id"] for item in candidates]
    assert map_data["route_valid"] is True
    assert map_data["validated_stop_ids"] == llm_data["selected_candidate_ids"]


def test_frontend_renders_api_hook():
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Wayly" in html
    assert "New York" in html
    assert "Walking Skeleton" in html
    assert "/api/itinerary" in html
