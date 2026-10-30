"""
FastAPI Dependencies.
Handles shared validation, query parsing, and rate limiting headers.
"""

from fastapi import HTTPException
from app.core.validation import validate_coordinates, validate_timezone


def verify_location_params(latitude: float, longitude: float, timezone_str: str):
    """Dependency validator for location queries."""
    ok_coords, err_coords = validate_coordinates(latitude, longitude)
    if not ok_coords:
        raise HTTPException(status_code=400, detail=err_coords)

    ok_tz, err_tz = validate_timezone(timezone_str)
    if not ok_tz:
        raise HTTPException(status_code=400, detail=err_tz)

