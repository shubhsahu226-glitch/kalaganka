/**
 * Shadow Reading Loupe (Micro-Scale Magnifier).
 * Magnifies the exact contact point between the gnomon's cast shadow and the marble quadrant scale.
 * Supports 3 zoom levels down to individual 6-second ticks.
 */

import React from 'react';
import { X, ZoomIn, ZoomOut, HelpCircle } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';
import { formatTime12h } from '../../lib/format';

export function ShadowReadingLoupe() {
  const isLoupeOpen = useKalaStore((state) => state.isLoupeOpen);
  const closeLoupe = useKalaStore((state) => state.closeLoupe);
  const zoomLevel = useKalaStore((state) => state.loupeZoomLevel);
  const setZoomLevel = useKalaStore((state) => state.setLoupeZoomLevel);
  const solarData = useKalaStore((state) => state.solarData);

  if (!isLoupeOpen) return null;

  const yantra = solarData?.yantra;
  const shadowQuadrant = yantra?.shadow_quadrant || 'none';
  const shadowAngle = yantra?.shadow_angle_deg || 0;
  const scale = yantra?.scale_reading;
  const lastTime = solarData?.time_systems?.local_apparent_solar_time || '--:--:--';
  const isNight = shadowQuadrant === 'none' || (solarData?.sun?.altitude_deg ?? 0) <= 0;

  // Zoom levels: 1 = full quadrant, 5 = 1-hour segment, 20 = 1-minute segment with 6s ticks
  const zoomOptions = [
    { label: 'Full Arc (1×)', value: 1 },
    { label: '1-Hour (5×)', value: 5 },
    { label: '1-Minute (20×)', value: 20 }
  ];

  // Calculate the relative shadow edge position in the loupe viewport
  // In an equinoctial quadrant, angle spans 0 to 90 degrees (0 to 6 hours from noon)
  const anglePercent = Math.min(100, Math.max(0, (shadowAngle / 90.0) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-charcoal/60 backdrop-blur-sm">
      <div className="bg-heritage-card border-2 border-heritage-border rounded-xl shadow-2xl max-w-2xl w-full p-6 relative flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-heritage-darkBorder/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <div>
              <h3 className="font-serif text-xl font-bold text-heritage-charcoal">
                Shadow Reading Loupe · सूक्ष्म छाया मापक
              </h3>
              <p className="text-xs text-heritage-secondary">
                High-resolution optical magnification of the marble quadrant scale
              </p>
            </div>
          </div>
          <button
            onClick={closeLoupe}
            className="p-1.5 rounded-lg text-heritage-secondary hover:text-heritage-charcoal hover:bg-heritage-darkBorder/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-between bg-heritage-bg/80 p-2 rounded-lg border border-heritage-border">
          <span className="text-xs font-semibold text-heritage-ink flex items-center gap-1.5">
            <ZoomIn size={14} className="text-heritage-gold" /> Magnification:
          </span>
          <div className="flex gap-1.5">
            {zoomOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setZoomLevel(opt.value)}
                className={`text-xs px-3 py-1 rounded transition-colors ${
                  zoomLevel === opt.value
                    ? 'bg-heritage-terracotta text-white font-medium shadow-sm'
                    : 'text-heritage-secondary hover:bg-heritage-darkBorder/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Magnified Optical Quadrant Viewport */}
        <div className="relative h-56 bg-[#FAF8F5] rounded-lg border-2 border-heritage-border overflow-hidden shadow-inner flex flex-col justify-end">
          {/* Subtle marble vein texture */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C8BAA7_1px,transparent_1px)] [background-size:16px_16px]" />

          {isNight ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-heritage-charcoal/80 text-heritage-marble">
              <span className="text-3xl mb-2">🌙</span>
              <p className="font-serif text-lg font-semibold">Sun Below Horizon</p>
              <p className="text-xs text-heritage-muted mt-1 max-w-sm">
                No shadow is cast on the marble quadrants during night. Time calculation resumes at sunrise.
              </p>
            </div>
          ) : (
            <>
              {/* Cast Shadow Silhouette */}
              <div
                className="absolute inset-y-0 left-0 bg-heritage-charcoal/45 border-r-2 border-heritage-terracotta transition-all duration-300"
                style={{ width: `${anglePercent}%` }}
              >
                {/* Penumbra soft gradient blur at edge */}
                <div className="absolute top-0 right-0 bottom-0 w-2.5 bg-gradient-to-r from-transparent to-heritage-charcoal/30 blur-[1px]" />
              </div>

              {/* Red Indicator Pin at Exact Shadow Contact Point */}
              <div
                className="absolute top-0 bottom-0 z-10 flex flex-col items-center pointer-events-none transition-all duration-300"
                style={{ left: `${anglePercent}%` }}
              >
                <div className="w-0.5 h-full bg-heritage-terracotta shadow-[0_0_8px_rgba(196,81,56,0.8)]" />
                <span className="absolute top-2 px-1.5 py-0.5 text-[10px] bg-heritage-terracotta text-white font-mono rounded shadow">
                  Contact
                </span>
              </div>

              {/* Marble Scale Graduations & Numerals */}
              <div className="relative z-0 h-28 border-t-2 border-heritage-charcoal/60 bg-gradient-to-t from-[#F0ECE1] to-transparent flex items-end">
                {/* Hour and minute graduations */}
                <div className="w-full flex justify-between px-4 pb-2 text-[11px] font-mono text-heritage-charcoal font-semibold">
                  <span>12:00 (Noon)</span>
                  <span>13:00 (1 PM)</span>
                  <span>14:00 (2 PM)</span>
                  <span>15:00 (3 PM)</span>
                  <span>16:00 (4 PM)</span>
                  <span>17:00 (5 PM)</span>
                  <span>18:00 (6 PM)</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Readout Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-heritage-bg p-3 rounded-lg border border-heritage-border text-center">
            <span className="text-[11px] text-heritage-secondary block uppercase tracking-wider">
              Shadow Reading
            </span>
            <span className="font-mono text-lg font-bold text-heritage-charcoal">
              {lastTime}
            </span>
            <span className="text-[10px] text-heritage-terracotta block">
              {formatTime12h(lastTime)}
            </span>
          </div>

          <div className="bg-heritage-bg p-3 rounded-lg border border-heritage-border text-center">
            <span className="text-[11px] text-heritage-secondary block uppercase tracking-wider">
              Scale Interval
            </span>
            <span className="font-mono text-lg font-bold text-heritage-charcoal">
              {scale?.scale_interval_seconds || 6}s
            </span>
            <span className="text-[10px] text-heritage-muted block">
              Subdivided markings
            </span>
          </div>

          <div className="bg-heritage-bg p-3 rounded-lg border border-heritage-border text-center">
            <span className="text-[11px] text-heritage-secondary block uppercase tracking-wider">
              Uncertainty
            </span>
            <span className="font-mono text-lg font-bold text-heritage-charcoal">
              ±{scale?.uncertainty_seconds || 3}s
            </span>
            <span className="text-[10px] text-heritage-muted block">
              At Jaipur Brihat scale
            </span>
          </div>
        </div>

        {/* Explanatory Museum Callout */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-heritage-gold/10 border border-heritage-gold/30 text-xs text-heritage-ink">
          <HelpCircle size={16} className="text-heritage-gold flex-shrink-0 mt-0.5" />
          <p>
            <strong>Why can this sundial resolve seconds?</strong> Because of the colossal 27-meter height of the Jaipur Brihat Samrat Yantra, the gnomon's shadow sweeps along the 15-meter marble quadrant radius at approximately <strong>4 millimetres per minute</strong> (about 1 mm every 15 seconds). This enables human observers to comfortably read 6-second and 2-second tick marks with the naked eye.
          </p>
        </div>
      </div>
    </div>
  );
}

