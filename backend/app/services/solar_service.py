"""
Solar Calculation Service.
Orchestrates the calculation pipeline for single and batch solar requests.
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List
import pytz

from app.schemas.solar import (
    SolarPositionRequest,
    SolarPositionResponse,
    BatchSolarPositionRequest,
    BatchSolarPositionResponse,
    BatchPoint
)
from app.core.astronomy import (
    parse_datetime_to_utc,
    calculate_solar_position,
    find_daily_solar_events,
    get_astronomy_time_from_utc
)
from app.core.solar_time import calculate_solar_time_systems
from app.core.yantra_geometry import calculate_yantra_metrics
from app.services.cache_service import solar_cache
import astronomy


def get_solar_position_and_metrics(req: SolarPositionRequest) -> SolarPositionResponse:
    """
    Main pipeline for single-point solar calculation and Samrat Yantra metrics.
    Checks in-memory cache first before executing full astronomical calculations.
    """
    cache_key = f"{req.latitude:.4f}:{req.longitude:.4f}:{req.date}:{req.time}:{req.timezone}"
    cached = solar_cache.get(cache_key)
    if cached:
        return cached

    # 1. Convert local time to UTC
    utc_dt = parse_datetime_to_utc(req.date, req.time, req.timezone)

    # 2. Compute astronomical solar position (Alt, Az, Dec, RA, JD)
    solar_pos = calculate_solar_position(req.latitude, req.longitude, utc_dt)

    # 3. Compute daily sunrise, solar noon, and sunset events
    events = find_daily_solar_events(req.latitude, req.longitude, req.date, req.timezone)

    # 4. Compute solar time systems (LAST, EoT, Difference, Ghatis)
    time_systems = calculate_solar_time_systems(
        astro_time=solar_pos["astro_time"],
        observer=solar_pos["observer"],
        utc_dt=utc_dt,
        local_time_str=req.time,
        sunrise_time_str=events.get("sunrise")
    )

    # 5. Map hour angle to Samrat Yantra quadrant metrics
    yantra = calculate_yantra_metrics(
        latitude=req.latitude,
        altitude_deg=solar_pos["altitude_deg"],
        ha_hours=time_systems["hour_angle_hours"],
        last_decimal_hours=time_systems["last_decimal_hours"]
    )

    # 6. Build response schema
    response = SolarPositionResponse(
        utc_time=utc_dt.strftime("%Y-%m-%dT%H:%M:%SZ"),
        julian_date=solar_pos["julian_date"],
        sun={
            "altitude_deg": solar_pos["altitude_deg"],
            "azimuth_deg": solar_pos["azimuth_deg"],
            "declination_deg": solar_pos["declination_deg"],
            "right_ascension_hours": solar_pos["right_ascension_hours"],
            "is_above_horizon": solar_pos["is_above_horizon"],
            "zenith_angle_deg": solar_pos["zenith_angle_deg"]
        },
        time_systems={
            "local_clock_time": time_systems["local_clock_time"],
            "local_apparent_solar_time": time_systems["local_apparent_solar_time"],
            "equation_of_time_minutes": time_systems["equation_of_time_minutes"],
            "difference_minutes": time_systems["difference_minutes"],
            "longitude_correction_minutes": time_systems["longitude_correction_minutes"],
            "traditional_indian": time_systems["traditional_indian"]
        },
        yantra=yantra,
        sun_events=events
    )

    solar_cache.set(cache_key, response)
    return response


def get_batch_solar_positions(req: BatchSolarPositionRequest) -> BatchSolarPositionResponse:
    """
    Computes an array of timestamped points between start_time and end_time.
    Used for smooth frontend daytime scrub / time-lapse animation.
    """
    tz = pytz.timezone(req.timezone)
    start_dt = datetime.strptime(f"{req.date} {req.start_time}", "%Y-%m-%d %H:%M:%S")
    end_dt = datetime.strptime(f"{req.date} {req.end_time}", "%Y-%m-%d %H:%M:%S")

    points: List[BatchPoint] = []
    current_dt = start_dt
    interval = timedelta(minutes=req.interval_minutes)

    observer = astronomy.Observer(req.latitude, req.longitude, 0.0)

    while current_dt <= end_dt:
        time_str = current_dt.strftime("%H:%M:%S")
        local_aware = tz.localize(current_dt)
        utc_dt = local_aware.astimezone(timezone.utc)
        astro_t = get_astronomy_time_from_utc(utc_dt)

        eq = astronomy.Equator(astronomy.Body.Sun, astro_t, observer, ofdate=True, aberration=True)
        hor = astronomy.Horizon(astro_t, observer, eq.ra, eq.dec, astronomy.Refraction.Normal)

        ha = astronomy.HourAngle(astronomy.Body.Sun, astro_t, observer)
        last_hours = (ha + 12.0) % 24.0

        yantra = calculate_yantra_metrics(
            latitude=req.latitude,
            altitude_deg=hor.altitude,
            ha_hours=ha,
            last_decimal_hours=last_hours
        )

        points.append(BatchPoint(
            time=time_str,
            altitude_deg=round(hor.altitude, 2),
            azimuth_deg=round(hor.azimuth, 2),
            is_above_horizon=hor.altitude > -0.833,
            shadow_angle_deg=yantra["shadow_angle_deg"] if yantra["shadow_quadrant"] != "none" else None,
            shadow_quadrant=yantra["shadow_quadrant"]
        ))

        current_dt += interval

    return BatchSolarPositionResponse(
        count=len(points),
        points=points
    )

