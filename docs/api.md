# KalaGanaka API Documentation
**Version:** 1.0.0  
**Base URL:** `http://localhost:8000/api/v1`

---

## 1. System Health

### `GET /health`
Returns system status, service identification, and runtime version.

#### Response
```json
{
  "status": "ok",
  "service": "kalaganaka-api",
  "version": "1.0.0"
}
```

---

## 2. Solar Position & Samrat Yantra Metrics

### `POST /api/v1/solar-position`
Calculates instantaneous solar position, local apparent solar time, Samrat Yantra shadow geometry, and solar events for any geographical coordinate and timestamp.

#### Request Body
```json
{
  "latitude": 26.9124,
  "longitude": 75.7873,
  "date": "2026-10-29",
  "time": "14:45:00",
  "timezone": "Asia/Kolkata"
}
```

#### Field Constraints
- `latitude`: Float between `-90.0` and `90.0`
- `longitude`: Float between `-180.0` and `180.0`
- `date`: ISO format `YYYY-MM-DD`
- `time`: 24-hour format `HH:MM:SS`
- `timezone`: Valid IANA Timezone string (e.g. `Asia/Kolkata`, `UTC`, `America/New_York`)

#### Response Body
```json
{
  "utc_time": "2026-10-29T09:15:00Z",
  "julian_date": 2461342.885416667,
  "sun": {
    "altitude_deg": 43.82,
    "azimuth_deg": 214.63,
    "declination_deg": -13.72,
    "is_above_horizon": true
  },
  "time_systems": {
    "local_clock_time": "14:45:00",
    "local_apparent_solar_time": "14:31:24",
    "equation_of_time_minutes": 16.3,
    "difference_minutes": -13.6,
    "traditional_indian": {
      "ghatis": 36,
      "palas": 18,
      "vipalas": 30,
      "formatted": "36 घटी 18 पल 30 विपल"
    }
  },
  "yantra": {
    "gnomon_inclination_deg": 26.9124,
    "shadow_quadrant": "west",
    "shadow_angle_deg": 37.85,
    "quadrant_side": "afternoon",
    "scale_reading": {
      "hours": 14,
      "minutes": 31,
      "seconds": 24,
      "scale_interval_seconds": 6,
      "uncertainty_seconds": 3
    }
  },
  "sun_events": {
    "sunrise": "06:35:12",
    "solar_noon": "12:20:00",
    "sunset": "18:04:48"
  }
}
```

---

## 3. Batch Solar Position (Time-Lapse Mode)

### `POST /api/v1/solar-position/batch`
Calculates an array of timestamped solar positions throughout the day for smooth time-lapse animation without hammering the backend per animation frame.

#### Request Body
```json
{
  "latitude": 26.9124,
  "longitude": 75.7873,
  "date": "2026-10-29",
  "start_time": "06:00:00",
  "end_time": "18:30:00",
  "interval_minutes": 5,
  "timezone": "Asia/Kolkata"
}
```

#### Response Body
```json
{
  "count": 151,
  "points": [
    {
      "time": "06:00:00",
      "altitude_deg": -6.5,
      "azimuth_deg": 94.2,
      "is_above_horizon": false,
      "shadow_angle_deg": null
    },
    {
      "time": "12:20:00",
      "altitude_deg": 49.37,
      "azimuth_deg": 180.0,
      "is_above_horizon": true,
      "shadow_angle_deg": 0.0
    }
  ]
}
```

---

## 4. Place Geocoding Search

### `GET /api/v1/places/search?q=Jaipur`
Queries OpenStreetMap Nominatim with an in-memory cache and returns sanitized geographic coordinates and detected IANA timezones.

#### Response Body
```json
{
  "results": [
    {
      "name": "Jaipur",
      "region": "Rajasthan, India",
      "latitude": 26.9124,
      "longitude": 75.7873,
      "timezone": "Asia/Kolkata"
    }
  ]
}
```

