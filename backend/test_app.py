from app import HARD_CODED_ITINERARY, app


def test_health_returns_ok():
    client = app.test_client()
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_itinerary_returns_hard_coded_message():
    client = app.test_client()
    response = client.get("/api/itinerary")
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Hello from the-goat API!"
    assert data["product"] == "Wayly / 途鉴"
    assert data["city"] == "New York"
    assert data == HARD_CODED_ITINERARY


def test_frontend_renders_api_hook():
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Wayly" in html
    assert "New York" in html
    assert "/api/itinerary" in html
