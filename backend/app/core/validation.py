"""
Input Validation and Error Formatter.
"""

from typing import Tuple
import pytz


def validate_coordinates(latitude: float, longitude: float) -> Tuple[bool, str]:
    """Ensures coordinates lie within geographic boundaries."""
    if not (-90.0 <= latitude <= 90.0):
        return False, f"Latitude {latitude} must be between -90.0 and +90.0 degrees."
    if not (-180.0 <= longitude <= 180.0):
        return False, f"Longitude {longitude} must be between -180.0 and +180.0 degrees."
    return True, ""


def validate_timezone(tz_name: str) -> Tuple[bool, str]:
    """Validates that the timezone name exists in IANA timezone database."""
    if tz_name not in pytz.all_timezones_set:
        return False, f"Invalid IANA timezone: '{tz_name}'. Example valid timezones: 'Asia/Kolkata', 'UTC', 'America/New_York'."
    return True, ""

