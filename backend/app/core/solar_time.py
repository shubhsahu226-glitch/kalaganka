"""
Solar Time and Panchanga Horological Kernel for KalaGanaka.
Computes Local Apparent Solar Time (LAST), Equation of Time (EoT),
Longitude Correction, and traditional Indian horological units (Ghati, Pala, Vipala).
"""

from datetime import datetime, timezone
from typing import Dict, Any, Optional
import astronomy


def calculate_solar_time_systems(
    astro_time: astronomy.Time,
    observer: astronomy.Observer,
    utc_dt: datetime,
    local_time_str: str,
    sunrise_time_str: Optional[str]
) -> Dict[str, Any]:
    """
    Computes apparent solar time, equation of time, and traditional Indian time metrics.

    Args:
        astro_time: astronomy.Time instance of observation.
        observer: astronomy.Observer instance (contains latitude and longitude).
        utc_dt: UTC datetime of observation.
        local_time_str: Local civil clock time 'HH:MM:SS'.
        sunrise_time_str: Local civil time of sunrise 'HH:MM:SS' (if available).

    Returns:
        Structured dictionary matching TimeSystems schema.
    """
    # 1. Calculate Sun's Hour Angle at observer's meridian
    # astronomy.HourAngle returns value in [0, 24) sidereal hours past culmination
    ha_hours = astronomy.HourAngle(astronomy.Body.Sun, astro_time, observer)

    # 2. Local Apparent Solar Time (LAST):
    # At solar noon culmination (ha = 0), LAST is 12:00:00.
    last_decimal = (ha_hours + 12.0) % 24.0

    last_h = int(last_decimal)
    last_rem_m = (last_decimal - last_h) * 60.0
    last_m = int(last_rem_m)
    last_s = int(round((last_rem_m - last_m) * 60.0))
    if last_s >= 60:
        last_s = 0
        last_m += 1
    if last_m >= 60:
        last_m = 0
        last_h = (last_h + 1) % 24

    last_formatted = f"{last_h:02d}:{last_m:02d}:{last_s:02d}"

    # 3. Local Mean Solar Time (LMST):
    # Based strictly on uniform rotation from UTC and longitude: LMST = UTC + (longitude / 15 deg/hr)
    utc_decimal = (
        utc_dt.hour +
        utc_dt.minute / 60.0 +
        (utc_dt.second + utc_dt.microsecond / 1_000_000.0) / 3600.0
    )
    lmst_decimal = (utc_decimal + (observer.longitude / 15.0)) % 24.0

    # 4. Equation of Time (EoT):
    # EoT = Apparent Solar Time - Mean Solar Time
    eot_hours = last_decimal - lmst_decimal
    # Adjust for 24-hour wraparound
    if eot_hours > 12.0:
        eot_hours -= 24.0
    elif eot_hours < -12.0:
        eot_hours += 24.0
    eot_minutes = round(eot_hours * 60.0, 2)

    # 5. Difference between Modern Civil Clock Time and Apparent Solar Time:
    # Difference = Clock Time - Sundial Time
    clock_parts = [float(p) for p in local_time_str.split(":")]
    clock_decimal = clock_parts[0] + clock_parts[1] / 60.0 + (clock_parts[2] if len(clock_parts) > 2 else 0) / 3600.0

    diff_hours = clock_decimal - last_decimal
    if diff_hours > 12.0:
        diff_hours -= 24.0
    elif diff_hours < -12.0:
        diff_hours += 24.0
    difference_minutes = round(diff_hours * 60.0, 2)

    # Longitude correction: Difference between local clock and LMST
    long_corr_hours = clock_decimal - lmst_decimal
    if long_corr_hours > 12.0:
        long_corr_hours -= 24.0
    elif long_corr_hours < -12.0:
        long_corr_hours += 24.0
    longitude_correction_minutes = round(long_corr_hours * 60.0, 2)

    # 6. Traditional Indian Panchanga Time (Ishta Kala / इष्ट काल):
    # Measures time elapsed since local sunrise in Ghatis (1 day = 60 Ghatis; 1 Ghati = 24 minutes)
    traditional_time = None
    if sunrise_time_str:
        sr_parts = [float(p) for p in sunrise_time_str.split(":")]
        sunrise_decimal = sr_parts[0] + sr_parts[1] / 60.0 + sr_parts[2] / 3600.0
        elapsed_hours = clock_decimal - sunrise_decimal
        if elapsed_hours < 0:
            elapsed_hours += 24.0  # Before sunrise (measured from yesterday's sunrise)

        total_ghatis = elapsed_hours * 2.5  # 60 ghatis / 24 hours = 2.5 ghatis/hr
        ghatis = int(total_ghatis)
        rem_palas = (total_ghatis - ghatis) * 60.0  # 1 Ghati = 60 Palas (24 seconds each)
        palas = int(rem_palas)
        vipalas = round((rem_palas - palas) * 60.0, 1)  # 1 Pala = 60 Vipalas (0.4s each)

        traditional_time = {
            "ghatis": ghatis,
            "palas": palas,
            "vipalas": vipalas,
            "total_ghatis": round(total_ghatis, 3),
            "formatted": f"{ghatis} घटी {palas} पल {vipalas} विपल"
        }

    return {
        "local_clock_time": local_time_str,
        "local_apparent_solar_time": last_formatted,
        "equation_of_time_minutes": eot_minutes,
        "difference_minutes": difference_minutes,
        "longitude_correction_minutes": longitude_correction_minutes,
        "traditional_indian": traditional_time,
        "last_decimal_hours": last_decimal,
        "hour_angle_hours": ha_hours
    }

