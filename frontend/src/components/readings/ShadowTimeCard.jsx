/**
 * Shadow Time Card.
 * Displays the traditional solar time indicated by the Samrat Yantra shadow,
 * provides one-click access to the Shadow Reading Loupe, and displays Panchanga Ghatis/Palas.
 */

import React from 'react';
import { Eye } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';
import { formatTime12h } from '../../lib/format';

export function ShadowTimeCard() {
  const solarData = useKalaStore((state) => state.solarData);
  const openLoupe = useKalaStore((state) => state.openLoupe);

  const timeSystems = solarData?.time_systems;
  const yantra = solarData?.yantra;
  const traditional = timeSystems?.traditional_indian;
  const lastTime = timeSystems?.local_apparent_solar_time || '--:--:--';
  const isNight = (solarData?.sun?.altitude_deg ?? 0) <= 0;

  return (
    <div className="museum-plaque p-4 rounded-xl space-y-3 border-l-4 border-l-heritage-gold">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-heritage-border pb-2">
        <h4 className="font-serif text-sm font-bold text-heritage-charcoal uppercase tracking-wider flex items-center gap-1.5">
          <span className="text-heritage-gold">🕰</span> छाया समय · Shadow Solar Time
        </h4>
        <span className="text-[10px] font-mono text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded font-semibold">
          Traditional Method
        </span>
      </div>

      {/* Main Solar Time Display */}
      <div className="flex items-baseline justify-between bg-heritage-bg p-3 rounded-lg border border-heritage-border">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-heritage-secondary block">
            Local Apparent Solar Time (LAST)
          </span>
          <span className="font-mono text-2xl font-extrabold text-heritage-charcoal tracking-tight">
            {isNight ? 'Sun Below Horizon' : lastTime}
          </span>
          {!isNight && (
            <span className="text-xs text-heritage-terracotta block font-medium mt-0.5">
              {formatTime12h(lastTime)}
            </span>
          )}
        </div>

        {/* Read Scale Loupe Trigger Button */}
        <button
          onClick={openLoupe}
          disabled={isNight}
          className="text-xs px-3 py-1.5 rounded-lg bg-heritage-charcoal hover:bg-heritage-ink text-white font-medium flex items-center gap-1.5 transition-all shadow hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Eye size={14} className="text-heritage-gold" />
          <span>Read Scale</span>
        </button>
      </div>

      {/* Quadrant Indicator */}
      {!isNight && yantra && (
        <div className="flex justify-between items-center text-xs text-heritage-secondary px-1">
          <span>Active Quadrant:</span>
          <strong className="text-heritage-charcoal capitalize font-serif text-sm">
            {yantra.shadow_quadrant} Quadrant ({yantra.quadrant_side})
          </strong>
        </div>
      )}

      {/* Traditional Indian Units (Panchanga Horology) */}
      {traditional && (
        <div className="p-2.5 rounded-lg bg-heritage-gold/10 border border-heritage-gold/20 text-xs">
          <span className="text-[10px] uppercase tracking-wider text-heritage-gold-dark block font-bold mb-1">
            इष्ट काल · Traditional Vedic Horology:
          </span>
          <div className="font-devanagari text-heritage-charcoal text-sm font-semibold">
            {traditional.formatted}
          </div>
          <span className="text-[10px] text-heritage-secondary block mt-0.5">
            ({traditional.total_ghatis} Ghatis elapsed since sunrise · 1 Ghati = 24 min)
          </span>
        </div>
      )}
    </div>
  );
}

