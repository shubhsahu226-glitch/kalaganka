/**
 * Sundial vs Civil Clock Time Comparison Card.
 * Computes exact discrepancy, displays Equation of Time & Longitude corrections,
 * and provides a clear educational explanation of why sundials differ from modern watches.
 */

import React from 'react';
import { Scale, HelpCircle } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';
import { formatMinutes } from '../../lib/format';

export function ComparisonCard() {
  const solarData = useKalaStore((state) => state.solarData);
  const openInfoModal = useKalaStore((state) => state.openInfoModal);

  const timeSystems = solarData?.time_systems;
  const diff = timeSystems?.difference_minutes;
  const eot = timeSystems?.equation_of_time_minutes;
  const longCorr = timeSystems?.longitude_correction_minutes;

  return (
    <div className="museum-plaque p-4 rounded-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-heritage-border pb-2">
        <h4 className="font-serif text-sm font-bold text-heritage-charcoal uppercase tracking-wider flex items-center gap-1.5">
          <Scale size={16} className="text-heritage-terracotta" /> समय अन्तर · Time Difference
        </h4>
        <button
          onClick={() => openInfoModal(2)}
          className="text-[11px] text-heritage-gold hover:text-heritage-gold-dark flex items-center gap-1 font-medium transition-colors"
        >
          <HelpCircle size={13} /> Why do they differ?
        </button>
      </div>

      {/* Difference Headline Metric */}
      <div className="p-3 bg-heritage-bg rounded-lg border border-heritage-border flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-heritage-secondary block">
            Civil Clock − Sundial Time
          </span>
          <span className="font-mono text-xl font-black text-heritage-terracotta">
            {formatMinutes(diff)}
          </span>
        </div>
        <div className="text-right text-xs text-heritage-secondary max-w-[180px] leading-snug">
          {diff && diff > 0
            ? 'Civil clock runs ahead of the local sundial'
            : 'Sundial runs ahead of the civil clock'}
        </div>
      </div>

      {/* Breakdown: Equation of Time & Longitude */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-heritage-bg p-2.5 rounded-lg border border-heritage-border">
          <span className="text-[10px] text-heritage-secondary block uppercase">
            Equation of Time (EoT)
          </span>
          <span className="font-mono text-sm font-bold text-heritage-charcoal">
            {formatMinutes(eot)}
          </span>
          <span className="text-[9px] text-heritage-muted block mt-0.5">
            Earth's elliptical orbit & axial tilt
          </span>
        </div>

        <div className="bg-heritage-bg p-2.5 rounded-lg border border-heritage-border">
          <span className="text-[10px] text-heritage-secondary block uppercase">
            Longitude Offset
          </span>
          <span className="font-mono text-sm font-bold text-heritage-charcoal">
            {formatMinutes(longCorr)}
          </span>
          <span className="text-[9px] text-heritage-muted block mt-0.5">
            Offset from standard meridian
          </span>
        </div>
      </div>

      {/* Brief educational takeaway */}
      <p className="text-[11px] text-heritage-secondary italic bg-heritage-gold/10 p-2 rounded border border-heritage-gold/20 leading-relaxed">
        The Samrat Yantra measures true <strong>Local Apparent Solar Time</strong>. Modern civil clocks measure standardized <strong>Mean Solar Time</strong> for an entire country or region.
      </p>
    </div>
  );
}

