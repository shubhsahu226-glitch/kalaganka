/**
 * Modern Civil Clock Time Card.
 * Displays standardized civil time (IST or local timezone).
 */

import React from 'react';
import { Smartphone } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';
import { formatTime12h } from '../../lib/format';

export function CivilTimeCard() {
  const time = useKalaStore((state) => state.time);
  const date = useKalaStore((state) => state.date);
  const timezone = useKalaStore((state) => state.timezone);

  return (
    <div className="museum-plaque p-4 rounded-xl space-y-2 border-l-4 border-l-cyan-600">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-heritage-border pb-2">
        <h4 className="font-serif text-sm font-bold text-heritage-charcoal uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone size={16} className="text-cyan-700" /> मानक समय · Modern Clock Time
        </h4>
        <span className="text-[10px] font-mono text-cyan-800 bg-cyan-100/70 px-2 py-0.5 rounded font-semibold">
          Civil Standard
        </span>
      </div>

      {/* Clock Time */}
      <div className="bg-heritage-bg p-3 rounded-lg border border-heritage-border flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-heritage-secondary block">
            Standard Civil Clock ({timezone.split('/')[1] || timezone})
          </span>
          <span className="font-mono text-2xl font-extrabold text-heritage-charcoal tracking-tight">
            {time}
          </span>
          <span className="text-xs text-cyan-800 block font-medium mt-0.5">
            {formatTime12h(time)}
          </span>
        </div>
        <span className="text-xs font-mono text-heritage-secondary bg-heritage-card px-2 py-1 rounded border border-heritage-border">
          {date}
        </span>
      </div>
    </div>
  );
}

