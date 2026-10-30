"""
Solar Calculation API Routes.
Exposes /solar-position and /solar-position/batch.
"""

from fastapi import APIRouter, HTTPException, Depends
from app.schemas.solar import (
    SolarPositionRequest,
    SolarPositionResponse,
    BatchSolarPositionRequest,
    BatchSolarPositionResponse
)
from app.core.validation import validate_coordinates, validate_timezone
from app.services.solar_service import get_solar_position_and_metrics, get_batch_solar_positions

router = APIRouter(prefix="/solar-position", tags=["Solar Calculations"])


@router.post("", response_model=SolarPositionResponse, summary="Instantaneous Solar Position & Yantra Metrics")
def calculate_solar(payload: SolarPositionRequest):
    """
    Computes topocentric solar position (altitude, azimuth, declination),
    local apparent solar time, Samrat Yantra shadow quadrant and arc angle,
    Panchanga horological units (Ghatis, Palas), and sunrise/noon/sunset events.
    """
    ok_coords, err_coords = validate_coordinates(payload.latitude, payload.longitude)
    if not ok_coords:
        raise HTTPException(status_code=400, detail=err_coords)

    ok_tz, err_tz = validate_timezone(payload.timezone)
    if not ok_tz:
        raise HTTPException(status_code=400, detail=err_tz)

    try:
        return get_solar_position_and_metrics(payload)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Solar calculation failed: {str(exc)}")


@router.post("/batch", response_model=BatchSolarPositionResponse, summary="Batch Daytime Solar Positions (Time-lapse)")
def calculate_solar_batch(payload: BatchSolarPositionRequest):
    """
    Computes an array of timestamped solar positions and shadow angles
    between start_time and end_time for time-lapse animation.
    """
    ok_coords, err_coords = validate_coordinates(payload.latitude, payload.longitude)
    if not ok_coords:
        raise HTTPException(status_code=400, detail=err_coords)

    ok_tz, err_tz = validate_timezone(payload.timezone)
    if not ok_tz:
        raise HTTPException(status_code=400, detail=err_tz)

    try:
        return get_batch_solar_positions(payload)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Batch calculation failed: {str(exc)}")

