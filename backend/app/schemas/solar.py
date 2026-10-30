"""
Pydantic Schemas for Solar Calculations and Samrat Yantra Metrics.
Defines strict type models, field validations, and JSON schema documentation.
"""

from typing import Optional, List
from pydantic import BaseModel, Field, field_validator
import re


class SolarPositionRequest(BaseModel):
    """Input payload for single-point solar calculation."""
    latitude: float = Field(
        ...,
        ge=-90.0,
        le=90.0,
        description="Observer latitude in decimal degrees (-90 to +90). Positive = North, Negative = South."
    )
    longitude: float = Field(
        ...,
        ge=-180.0,
        le=180.0,
        description="Observer longitude in decimal degrees (-180 to +180). Positive = East, Negative = West."
    )
    date: str = Field(
        ...,
        json_schema_extra={"example": "2026-10-29"},
        description="Calendar date in ISO format YYYY-MM-DD."
    )
    time: str = Field(
        ...,
        json_schema_extra={"example": "14:45:00"},
        description="24-hour civil clock time in format HH:MM:SS."
    )
    timezone: str = Field(
        default="Asia/Kolkata",
        json_schema_extra={"example": "Asia/Kolkata"},
        description="Valid IANA timezone identifier (e.g., Asia/Kolkata, UTC, Europe/London)."
    )

    @field_validator("date")
    @classmethod
    def validate_date_format(cls, v: str) -> str:
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", v):
            raise ValueError("date must be in ISO YYYY-MM-DD format")
        return v

    @field_validator("time")
    @classmethod
    def validate_time_format(cls, v: str) -> str:
        if not re.match(r"^\d{2}:\d{2}(:\d{2})?$", v):
            raise ValueError("time must be in HH:MM or HH:MM:SS format")
        return v


class BatchSolarPositionRequest(BaseModel):
    """Input payload for batch daytime solar interpolation (time-lapse)."""
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    date: str = Field(..., json_schema_extra={"example": "2026-10-29"})
    start_time: str = Field(default="06:00:00", json_schema_extra={"example": "06:00:00"})
    end_time: str = Field(default="18:30:00", json_schema_extra={"example": "18:30:00"})
    interval_minutes: int = Field(default=5, ge=1, le=60)
    timezone: str = Field(default="Asia/Kolkata")


class SunPosition(BaseModel):
    """Astronomical solar coordinates."""
    altitude_deg: float = Field(..., description="Topocentric altitude angle in degrees above horizon.")
    azimuth_deg: float = Field(..., description="Topocentric azimuth angle in degrees clockwise from True North (0=N, 90=E, 180=S, 270=W).")
    declination_deg: float = Field(..., description="Solar declination angle in degrees relative to celestial equator.")
    right_ascension_hours: float = Field(..., description="Solar right ascension in decimal hours.")
    is_above_horizon: bool = Field(..., description="True if altitude > 0 degrees (daylight).")
    zenith_angle_deg: float = Field(..., description="Angle from local zenith (90 - altitude).")


class TraditionalIndianTime(BaseModel):
    """Classical Vedic Panchanga horological units."""
    ghatis: int = Field(..., description="Ghatis elapsed since sunrise (1 ghati = 24 minutes).")
    palas: int = Field(..., description="Palas elapsed within the current ghati (1 pala = 24 seconds).")
    vipalas: float = Field(..., description="Vipalas elapsed within the current pala (1 vipala = 0.4 seconds).")
    total_ghatis: float = Field(..., description="Total decimal ghatis elapsed since solar sunrise.")
    formatted: str = Field(..., description="Formatted Devanagari string, e.g., '14 घटी 32 पल 15 विपल'.")


class TimeSystems(BaseModel):
    """Comparison of civil, apparent solar, and Vedic time systems."""
    local_clock_time: str = Field(..., description="Input modern civil clock time (HH:MM:SS).")
    local_apparent_solar_time: str = Field(..., description="True apparent sundial time at observer's meridian (HH:MM:SS).")
    equation_of_time_minutes: float = Field(..., description="Equation of Time in minutes (Apparent Solar Time - Mean Solar Time).")
    difference_minutes: float = Field(..., description="Net discrepancy between civil clock and sundial (Clock - Sundial in minutes).")
    longitude_correction_minutes: float = Field(..., description="Time shift due to observer offset from standard timezone meridian.")
    traditional_indian: Optional[TraditionalIndianTime] = None


class ScaleReading(BaseModel):
    """Graduated reading on the Samrat Yantra marble quadrant scale."""
    hours: int = Field(..., description="Hour marking indicated by shadow edge (1 to 12).")
    minutes: int = Field(..., description="Minute marking indicated by shadow edge (0 to 59).")
    seconds: int = Field(..., description="Second marking (0 to 59).")
    scale_interval_seconds: int = Field(default=6, description="Fine scale subdivision interval (6 seconds for Brihat scale).")
    uncertainty_seconds: int = Field(default=3, description="Estimated measurement precision (+/- 3 seconds).")
    formatted: str = Field(..., description="Formatted string, e.g., '14:31:24'.")


class YantraMetrics(BaseModel):
    """Physical alignment and shadow metrics on the 3D Samrat Yantra."""
    gnomon_inclination_deg: float = Field(..., description="Gnomon hypotenuse tilt angle (= local observer latitude).")
    shadow_quadrant: str = Field(..., description="'east' (morning), 'west' (afternoon), 'noon_line', or 'none'.")
    shadow_angle_deg: float = Field(..., description="Angular position of shadow along the circular quadrant arc (0 to 90 deg).")
    quadrant_side: str = Field(..., description="Instrument side: 'morning', 'afternoon', 'solar_noon', or 'night'.")
    scale_reading: Optional[ScaleReading] = None


class SunEvents(BaseModel):
    """Key solar events for the given day at the observer's location."""
    sunrise: Optional[str] = Field(None, description="Local civil time of sunrise (HH:MM:SS).")
    solar_noon: Optional[str] = Field(None, description="Local civil time when Sun crosses meridian (HH:MM:SS).")
    sunset: Optional[str] = Field(None, description="Local civil time of sunset (HH:MM:SS).")


class SolarPositionResponse(BaseModel):
    """Full comprehensive astronomical and yantra response."""
    utc_time: str
    julian_date: float
    sun: SunPosition
    time_systems: TimeSystems
    yantra: YantraMetrics
    sun_events: SunEvents


class BatchPoint(BaseModel):
    """Single time-lapse data point."""
    time: str
    altitude_deg: float
    azimuth_deg: float
    is_above_horizon: bool
    shadow_angle_deg: Optional[float] = None
    shadow_quadrant: Optional[str] = None


class BatchSolarPositionResponse(BaseModel):
    """Array of time-lapse solar coordinates."""
    count: int
    points: List[BatchPoint]
