/**
 * Sun Position Card.
 * Displays calculated topocentric coordinates: Altitude, Azimuth, Declination, and Daylight status.
 */

import React from 'react';
import { Sun, Compass } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';
import { formatAngle } from '../../lib/format';

export function SunPositionCard() {
  const solarData = useKalaStore((state) => state.solarData);
  const sun = solarData?.sun;
  const events = solarData?.sun_events;

  const isDaylight = sun?.is_above_horizon ?? false;
  const altitude = sun?.altitude_deg ?? 0;
  const azimuth = sun?.azimuth_deg ?? 0;
  const declination = sun?.declination_deg ?? 0;

  return (
    <div className="museum-plaque p-4 rounded-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-heritage-border pb-2">
        <h4 className="font-serif text-sm font-bold text-heritage-charcoal uppercase tracking-wider flex items-center gap-1.5">
          <Sun size={16} className="text-heritage-gold" /> सूर्य स्थिति · Sun Position
        </h4>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
            isDaylight
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-indigo-900/10 text-indigo-900 border border-indigo-200'
          }`}
        >
          {isDaylight ? '☀️ Daylight' : '🌙 Night (Below Horizon)'}
        </span>
      </div>

      {/* Grid Coordinates */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-heritage-bg p-2 rounded-lg border border-heritage-border text-center">
          <span className="text-[10px] text-heritage-secondary block uppercase">Altitude</span>
          <span className="font-mono text-sm font-bold text-heritage-charcoal">
            {formatAngle(altitude)}
          </span>
          <span className="text-[9px] text-heritage-muted block">Above horizon</span>
        </div>

        <div className="bg-heritage-bg p-2 rounded-lg border border-heritage-border text-center">
          <span className="text-[10px] text-heritage-secondary block uppercase">Azimuth</span>
          <span className="font-mono text-sm font-bold text-heritage-charcoal">
            {formatAngle(azimuth)}
          </span>
          <span className="text-[9px] text-heritage-muted block">From True North</span>
        </div>

        <div className="bg-heritage-bg p-2 rounded-lg border border-heritage-border text-center">
          <span className="text-[10px] text-heritage-secondary block uppercase">Declination</span>
          <span className="font-mono text-sm font-bold text-heritage-charcoal">
            {formatAngle(declination)}
          </span>
          <span className="text-[9px] text-heritage-muted block">From equator</span>
        </div>
      </div>

      {/* Daily Sun Events */}
      {events && (
        <div className="flex justify-between items-center text-[10px] text-heritage-secondary bg-heritage-bg/70 px-2.5 py-1.5 rounded border border-heritage-border">
          <span>Sunrise: <strong className="text-heritage-ink font-mono">{events.sunrise || '--'}</strong></span>
          <span>Noon: <strong className="text-heritage-ink font-mono">{events.solar_noon || '--'}</strong></span>
          <span>Sunset: <strong className="text-heritage-ink font-mono">{events.sunset || '--'}</strong></span>
        </div>
      )}
    </div>
  );
}

