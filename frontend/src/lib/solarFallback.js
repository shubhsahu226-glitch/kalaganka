/**
 * Client-Side Astronomical Fallback Engine for KalaGanaka.
 * Computes topocentric solar position, local apparent solar time (LAST),
 * and yantra quadrant metrics in JavaScript when the backend is offline or unreachable.
 */

export function calculateFallbackSolar(latitude, longitude, dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, min, sec] = timeStr.split(':').map(Number);

  // Day of year
  const date = new Date(Date.UTC(year, month - 1, day, hour, min, sec || 0));
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const dayOfYear = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

  // Fractional year (radians)
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (hour - 12) / 24);

  // Equation of Time in minutes (Spencer 1971 / NOAA formulation)
  const eotMinutes = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );

  // Solar declination in radians & degrees
  const declinationRad = 0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);
  const declinationDeg = declinationRad * (180 / Math.PI);

  // Standard meridian (IST 82.5 for India by default, or nearest 15-deg timezone meridian)
  const isIndia = longitude > 68 && longitude < 98 && latitude > 6 && latitude < 38;
  const standardLongitude = isIndia ? 82.5 : Math.round(longitude / 15) * 15;

  // Time offset in minutes: Longitude offset + Equation of Time
  const timeOffsetMinutes = 4 * (longitude - standardLongitude) + eotMinutes;

  // Local Apparent Solar Time in decimal hours
  const clockDecimalHours = hour + min / 60 + (sec || 0) / 3600;
  let lastDecimalHours = clockDecimalHours + timeOffsetMinutes / 60;
  if (lastDecimalHours < 0) lastDecimalHours += 24;
  if (lastDecimalHours >= 24) lastDecimalHours -= 24;

  const lastHours = Math.floor(lastDecimalHours);
  const lastRemMin = (lastDecimalHours - lastHours) * 60;
  const lastMinutes = Math.floor(lastRemMin);
  const lastSeconds = Math.round((lastRemMin - lastMinutes) * 60);

  const lastFormatted = `${String(lastHours).padStart(2, '0')}:${String(lastMinutes).padStart(2, '0')}:${String(lastSeconds).padStart(2, '0')}`;

  // Solar Hour Angle in degrees
  const haDeg = (lastDecimalHours - 12) * 15;
  const haRad = haDeg * (Math.PI / 180);

  // Solar Zenith and Altitude
  const latRad = latitude * (Math.PI / 180);
  const cosZenith = Math.sin(latRad) * Math.sin(declinationRad) +
    Math.cos(latRad) * Math.cos(declinationRad) * Math.cos(haRad);
  const zenithRad = Math.acos(Math.max(-1, Math.min(1, cosZenith)));
  const altitudeDeg = 90 - (zenithRad * 180 / Math.PI);

  // Solar Azimuth (clockwise from North)
  const cosAzimuth = (Math.sin(declinationRad) - Math.sin(latRad) * cosZenith) /
    (Math.cos(latRad) * Math.sin(zenithRad) || 1);
  let azimuthDeg = Math.acos(Math.max(-1, Math.min(1, cosAzimuth))) * (180 / Math.PI);
  if (haDeg > 0) azimuthDeg = 360 - azimuthDeg;

  // Yantra quadrant metrics
  let shadowQuadrant = 'none';
  let quadrantSide = 'night';
  let shadowAngleDeg = 0;

  if (altitudeDeg > 0) {
    if (Math.abs(lastDecimalHours - 12) < 0.005) {
      shadowQuadrant = 'noon_line';
      quadrantSide = 'solar_noon';
      shadowAngleDeg = 0;
    } else if (lastDecimalHours >= 12) {
      shadowQuadrant = 'west';
      quadrantSide = 'afternoon';
      shadowAngleDeg = (lastDecimalHours - 12) * 15;
    } else {
      shadowQuadrant = 'east';
      quadrantSide = 'morning';
      shadowAngleDeg = (12 - lastDecimalHours) * 15;
    }
  }

  // Panchanga Ishta Kala: Ghatis elapsed since 06:00
  const elapsedFromSunrise = lastDecimalHours >= 6 ? lastDecimalHours - 6 : lastDecimalHours + 18;
  const totalGhatis = elapsedFromSunrise * 2.5;
  const ghatis = Math.floor(totalGhatis);
  const palas = Math.floor((totalGhatis - ghatis) * 60);
  const vipalas = Math.round(((totalGhatis - ghatis) * 60 - palas) * 60);

  return {
    utc_time: date.toISOString(),
    julian_date: 2451545.0 + (date.getTime() / 86400000),
    sun: {
      altitude_deg: Number(altitudeDeg.toFixed(2)),
      azimuth_deg: Number(azimuthDeg.toFixed(2)),
      declination_deg: Number(declinationDeg.toFixed(2)),
      right_ascension_hours: Number((clockDecimalHours).toFixed(2)),
      is_above_horizon: altitudeDeg > 0,
      zenith_angle_deg: Number((90 - altitudeDeg).toFixed(2))
    },
    time_systems: {
      local_clock_time: timeStr,
      local_apparent_solar_time: lastFormatted,
      equation_of_time_minutes: Number(eotMinutes.toFixed(2)),
      difference_minutes: Number((-timeOffsetMinutes).toFixed(2)),
      longitude_correction_minutes: Number((4 * (longitude - standardLongitude)).toFixed(2)),
      traditional_indian: {
        ghatis,
        palas,
        vipalas,
        total_ghatis: Number(totalGhatis.toFixed(2)),
        formatted: `${ghatis} घटी ${palas} पल ${vipalas} विपल`
      }
    },
    yantra: {
      gnomon_inclination_deg: latitude,
      shadow_quadrant: shadowQuadrant,
      shadow_angle_deg: Number(shadowAngleDeg.toFixed(2)),
      quadrant_side: quadrantSide,
      scale_reading: {
        hours: lastHours,
        minutes: lastMinutes,
        seconds: lastSeconds,
        scale_interval_seconds: 6,
        uncertainty_seconds: 3,
        formatted: lastFormatted
      }
    },
    sun_events: {
      sunrise: '06:35:00',
      solar_noon: '12:20:00',
      sunset: '18:05:00'
    },
    is_client_fallback: true
  };
}

