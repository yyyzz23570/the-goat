from app import app, build_itinerary, stub_llm_api, stub_map_provider


def test_health_returns_ok():
    client = app.test_client()
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_itinerary_passes_through_stub_participants():
    client = app.test_client()
    response = client.get("/api/itinerary")
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Hello from the-goat API!"
    assert data["product"] == "Wayly / 途鉴"
    assert data["city"] == "New York"
    assert data["map_stub"]["participant"] == "Map Provider API"
    assert data["map_stub"]["stub"] is True
    assert data["llm_stub"]["participant"] == "LLM API"
    assert data["llm_stub"]["stub"] is True
    assert data == build_itinerary()


def test_stubs_are_local_and_hard_coded():
    map_data = stub_map_provider()
    llm_data = stub_llm_api(map_data)
    assert map_data["city"] == "New York"
    assert llm_data["uses_only_supplied_facts"] is True
    assert llm_data["supplied_place_names"] == ["Placeholder published place"]


def test_frontend_renders_api_hook():
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Wayly" in html
    assert "New York" in html
    assert "Walking Skeleton" in html
    assert "/api/itinerary" in html
