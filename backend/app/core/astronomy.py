"""
Astronomical Calculation Kernel for KalaGanaka.
Wraps 'astronomy-engine' to compute topocentric solar coordinates,
Julian Date, solar declination, azimuth, altitude, and event times (sunrise, noon, sunset).
"""

from datetime import datetime, timezone
from typing import Dict, Any, Tuple, Optional
import pytz
import astronomy


def parse_datetime_to_utc(date_str: str, time_str: str, timezone_str: str) -> datetime:
    """
    Converts a local date, time, and IANA timezone into a UTC datetime object.

    Args:
        date_str: Date string in 'YYYY-MM-DD' format.
        time_str: Time string in 'HH:MM:SS' or 'HH:MM' format.
        timezone_str: IANA timezone identifier (e.g. 'Asia/Kolkata').

    Returns:
        timezone-aware datetime in UTC.
    """
    # Normalize time string to include seconds if omitted
    parts = time_str.split(":")
    if len(parts) == 2:
        time_str = f"{time_str}:00"

    local_dt_naive = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
    tz = pytz.timezone(timezone_str)
    local_dt = tz.localize(local_dt_naive)
    return local_dt.astimezone(timezone.utc)


def get_astronomy_time_from_utc(utc_dt: datetime) -> astronomy.Time:
    """
    Constructs an astronomy.Time object from a UTC datetime.
    """
    return astronomy.Time.Make(
        utc_dt.year,
        utc_dt.month,
        utc_dt.day,
        utc_dt.hour,
        utc_dt.minute,
        utc_dt.second + utc_dt.microsecond / 1_000_000.0
    )


def calculate_solar_position(
    latitude: float,
    longitude: float,
    utc_dt: datetime
) -> Dict[str, Any]:
    """
    Computes precise topocentric solar coordinates for an observer on Earth.

    Uses astronomy.Equator and astronomy.Horizon to correct for:
    - Topocentric parallax (observer's position on Earth's surface)
    - Atmospheric refraction (standard 34 arcminutes near horizon)
    - Aberration of light

    Args:
        latitude: Observer latitude in decimal degrees.
        longitude: Observer longitude in decimal degrees.
        utc_dt: Observation time in UTC.

    Returns:
        Dictionary containing altitude, azimuth, declination, RA, JD, and daylight flag.
    """
    # 0 meters elevation above mean sea level as baseline
    observer = astronomy.Observer(latitude, longitude, 0.0)
    astro_time = get_astronomy_time_from_utc(utc_dt)

    # Calculate equatorial coordinates of date (apparent RA and Dec with topocentric correction)
    equator = astronomy.Equator(
        astronomy.Body.Sun,
        astro_time,
        observer,
        ofdate=True,
        aberration=True
    )

    # Convert to topocentric horizontal coordinates (Altitude and Azimuth)
    horizon = astronomy.Horizon(
        astro_time,
        observer,
        equator.ra,
        equator.dec,
        astronomy.Refraction.Normal
    )

    # Julian Date: astro_time.ut is days since J2000.0 (JD 2451545.0)
    julian_date = 2451545.0 + astro_time.ut

    altitude = horizon.altitude
    azimuth = horizon.azimuth
    is_above_horizon = altitude > -0.833  # -0.833 deg accounts for Sun's semi-diameter and refraction

    return {
        "altitude_deg": round(altitude, 4),
        "azimuth_deg": round(azimuth, 4),
        "declination_deg": round(equator.dec, 4),
        "right_ascension_hours": round(equator.ra, 4),
        "distance_au": round(equator.dist, 6),
        "is_above_horizon": is_above_horizon,
        "zenith_angle_deg": round(max(0.0, 90.0 - altitude), 4),
        "julian_date": round(julian_date, 6),
        "astro_time": astro_time,
        "observer": observer
    }


def find_daily_solar_events(
    latitude: float,
    longitude: float,
    local_date_str: str,
    timezone_str: str
) -> Dict[str, Optional[str]]:
    """
    Finds local civil times for Sunrise, Solar Noon, and Sunset on the requested date.

    Args:
        latitude: Observer latitude.
        longitude: Observer longitude.
        local_date_str: Date string 'YYYY-MM-DD'.
        timezone_str: IANA timezone.

    Returns:
        Dictionary with 'sunrise', 'solar_noon', 'sunset' in 'HH:MM:SS' format (or None if polar day/night).
    """
    tz = pytz.timezone(timezone_str)
    # Search starting from 00:00:00 local time
    start_local = datetime.strptime(f"{local_date_str} 00:00:00", "%Y-%m-%d %H:%M:%S")
    start_local = tz.localize(start_local)
    start_utc = start_local.astimezone(timezone.utc)

    observer = astronomy.Observer(latitude, longitude, 0.0)
    t_start = get_astronomy_time_from_utc(start_utc)

    # 1. Sunrise (search within 1.2 days forward)
    rise_time = astronomy.SearchRiseSet(
        astronomy.Body.Sun,
        observer,
        astronomy.Direction.Rise,
        t_start,
        1.2
    )

    # 2. Solar Noon (Sun culminates, hour angle = 0)
    noon_event = astronomy.SearchHourAngle(
        astronomy.Body.Sun,
        observer,
        0.0,
        t_start,
        1
    )

    # 3. Sunset
    set_time = astronomy.SearchRiseSet(
        astronomy.Body.Sun,
        observer,
        astronomy.Direction.Set,
        t_start,
        1.2
    )

    def format_event(astro_t: Optional[astronomy.Time]) -> Optional[str]:
        if not astro_t:
            return None
        dt_utc = astro_t.Utc()
        dt_local = dt_utc.replace(tzinfo=timezone.utc).astimezone(tz)
        return dt_local.strftime("%H:%M:%S")

    return {
        "sunrise": format_event(rise_time),
        "solar_noon": format_event(noon_event.time) if noon_event else None,
        "sunset": format_event(set_time)
    }

