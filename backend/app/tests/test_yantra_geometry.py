"""
Unit Tests for Samrat Yantra Physical Geometry Mapping.
"""

from app.core.yantra_geometry import calculate_yantra_metrics


def test_night_time_handling():
    """Verify that when altitude <= 0, no shadow is cast and quadrant is 'none'."""
    result = calculate_yantra_metrics(
        latitude=26.9124,
        altitude_deg=-15.0,  # Below horizon
        ha_hours=18.0,
        last_decimal_hours=6.0
    )
    assert result["quadrant_side"] == "night"
    assert result["shadow_quadrant"] == "none"
    assert result["shadow_angle_deg"] == 0.0
    assert result["scale_reading"] is None


def test_solar_noon_alignment():
    """Verify that at solar noon (hour angle = 0), shadow aligns with noon line."""
    result = calculate_yantra_metrics(
        latitude=26.9124,
        altitude_deg=55.0,
        ha_hours=0.001,  # Culmination
        last_decimal_hours=12.0
    )
    assert result["quadrant_side"] == "solar_noon"
    assert result["shadow_quadrant"] == "noon_line"
    assert result["shadow_angle_deg"] == 0.0
    assert result["scale_reading"]["hours"] == 12


def test_morning_east_quadrant():
    """Verify that in the morning (e.g. 09:00 AM, 3 hours before noon), shadow is on East quadrant."""
    result = calculate_yantra_metrics(
        latitude=26.9124,
        altitude_deg=35.0,
        ha_hours=21.0,  # 3 hours before culmination
        last_decimal_hours=9.0
    )
    assert result["quadrant_side"] == "morning"
    assert result["shadow_quadrant"] == "east"
    assert abs(result["shadow_angle_deg"] - 45.0) < 0.1  # 3 hours * 15 deg/hr = 45 deg
    assert result["scale_reading"]["hours"] == 9

