"""
Samrat Yantra Instrument Geometry Kernel for KalaGanaka.
Maps astronomical solar hour angles to physical quadrant arcs,
computes shadow angles, quadrant wing selection, and fine 6-second scale graduations.
"""

from typing import Dict, Any, Optional


def calculate_yantra_metrics(
    latitude: float,
    altitude_deg: float,
    ha_hours: float,
    last_decimal_hours: float
) -> Dict[str, Any]:
    """
    Computes the physical shadow metrics on the Samrat Yantra.

    In the Samrat Yantra:
    - Gnomon is aligned along the local North-South meridian, inclined at angle = latitude.
    - The quadrants are perpendicular to the gnomon (parallel to the celestial equator).
    - As Earth rotates, the gnomon edge casts a shadow that sweeps uniformly across
      the circular quadrant arcs at 15 degrees per solar hour (0.25 degrees per minute).

    Args:
        latitude: Observer latitude in degrees.
        altitude_deg: Topocentric solar altitude in degrees.
        ha_hours: Solar hour angle in decimal hours [0, 24) past culmination.
        last_decimal_hours: Local Apparent Solar Time in decimal hours [0, 24).

    Returns:
        Structured dictionary matching YantraMetrics schema.
    """
    # Gnomon hypotenuse inclination is always matched to local latitude
    gnomon_inclination = round(latitude, 4)

    # 1. Night check: If Sun is below the horizon, no shadow is cast
    if altitude_deg <= 0.0:
        return {
            "gnomon_inclination_deg": gnomon_inclination,
            "shadow_quadrant": "none",
            "shadow_angle_deg": 0.0,
            "quadrant_side": "night",
            "scale_reading": None
        }

    # 2. Solar Noon check: Within ~18 seconds of meridian crossing (ha ~ 0 or ~ 24)
    # The shadow lies directly on the central gnomon base / noon line
    if ha_hours < 0.005 or ha_hours > 23.995:
        scale_reading = {
            "hours": 12,
            "minutes": 0,
            "seconds": 0,
            "scale_interval_seconds": 6,
            "uncertainty_seconds": 3,
            "formatted": "12:00:00 (Solar Noon)"
        }
        return {
            "gnomon_inclination_deg": gnomon_inclination,
            "shadow_quadrant": "noon_line",
            "shadow_angle_deg": 0.0,
            "quadrant_side": "solar_noon",
            "scale_reading": scale_reading
        }

    # 3. Afternoon vs Morning quadrant selection
    # In equinoctial sundials:
    # - Morning: Sun in East -> Shadow cast onto Western edge of Gnomon / Eastern Quadrant
    # - Afternoon: Sun in West -> Shadow cast onto Eastern edge of Gnomon / Western Quadrant
    if ha_hours < 12.0:
        # Afternoon: ha_hours is hours past noon (e.g., 2.52 hours)
        shadow_quadrant = "west"
        quadrant_side = "afternoon"
        hours_from_noon = ha_hours
    else:
        # Morning: 24 - ha_hours is hours until noon (e.g., 2.5 hours before noon)
        shadow_quadrant = "east"
        quadrant_side = "morning"
        hours_from_noon = 24.0 - ha_hours

    # Shadow angle along circular arc: 15 degrees per hour
    shadow_angle_deg = round(hours_from_noon * 15.0, 4)

    # 4. Generate scale reading (hours, minutes, seconds)
    # On the Yantra quadrant, markings are graduated in hours from 12 (at base) to 6 (at top)
    hours_int = int(last_decimal_hours)
    rem_min = (last_decimal_hours - hours_int) * 60.0
    min_int = int(rem_min)
    sec_int = int(round((rem_min - min_int) * 60.0))

    if sec_int >= 60:
        sec_int = 0
        min_int += 1
    if min_int >= 60:
        min_int = 0
        hours_int = (hours_int + 1) % 24

    scale_reading = {
        "hours": hours_int,
        "minutes": min_int,
        "seconds": sec_int,
        "scale_interval_seconds": 6,
        "uncertainty_seconds": 3,
        "formatted": f"{hours_int:02d}:{min_int:02d}:{sec_int:02d}"
    }

    return {
        "gnomon_inclination_deg": gnomon_inclination,
        "shadow_quadrant": shadow_quadrant,
        "shadow_angle_deg": shadow_angle_deg,
        "quadrant_side": quadrant_side,
        "scale_reading": scale_reading
    }

