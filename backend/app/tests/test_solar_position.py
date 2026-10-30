"""
Automated Unit Tests for Solar Position Calculations and API Endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Verify system health endpoint returns 200 and expected status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "kalaganaka-api"


def test_jaipur_solar_position():
    """
    Verify solar calculations for Jaipur Jantar Mantar (26.9124 N, 75.7873 E).
    On 2026-10-29 at 14:45:00 IST (afternoon).
    """
    payload = {
        "latitude": 26.9124,
        "longitude": 75.7873,
        "date": "2026-10-29",
        "time": "14:45:00",
        "timezone": "Asia/Kolkata"
    }
    response = client.post("/api/v1/solar-position", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Sun is in the afternoon sky
    assert data["sun"]["is_above_horizon"] is True
    assert data["sun"]["altitude_deg"] > 20.0
    assert 200.0 < data["sun"]["azimuth_deg"] < 250.0  # South-West

    # Gnomon inclination matches latitude
    assert abs(data["yantra"]["gnomon_inclination_deg"] - 26.9124) < 0.001

    # In the afternoon, shadow must fall on the western quadrant
    assert data["yantra"]["shadow_quadrant"] == "west"
    assert data["yantra"]["quadrant_side"] == "afternoon"
    assert data["yantra"]["shadow_angle_deg"] > 0.0

    # Verify scale reading format
    scale = data["yantra"]["scale_reading"]
    assert scale is not None
    assert 12 <= scale["hours"] <= 17

    # Verify sunrise, noon, sunset are returned
    events = data["sun_events"]
    assert events["sunrise"] is not None
    assert events["solar_noon"] is not None
    assert events["sunset"] is not None


def test_invalid_coordinates():
    """Verify that latitude > 90 or < -90 is rejected with 400 Bad Request."""
    payload = {
        "latitude": 105.0,  # Invalid
        "longitude": 75.7873,
        "date": "2026-10-29",
        "time": "14:45:00",
        "timezone": "Asia/Kolkata"
    }
    response = client.post("/api/v1/solar-position", json=payload)
    assert response.status_code == 400 or response.status_code == 422


def test_places_search():
    """Verify place search returns predefined Jaipur observatory."""
    response = client.get("/api/v1/places/search?q=Jaipur")
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) >= 1
    first = data["results"][0]
    assert "Jaipur" in first["name"]
    assert abs(first["latitude"] - 26.9124) < 0.01

