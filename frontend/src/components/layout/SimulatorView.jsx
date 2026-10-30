/**
 * Live 3D Simulator Layout.
 * 3-column desktop layout (Left: Controls, Center: 3D Yantra Canvas, Right: Readings)
 * with mobile-responsive stacked bottom sheet.
 */

import React, { useState } from 'react';
import { Sliders, BarChart2, Eye, Compass, Sun, Clock } from 'lucide-react';
import { YantraScene } from '../../three/YantraScene';
import { LocationControl } from '../controls/LocationControl';
import { TimeControl } from '../controls/TimeControl';
import { ViewControl } from '../controls/ViewControl';
import { SunPositionCard } from '../readings/SunPositionCard';
import { ShadowTimeCard } from '../readings/ShadowTimeCard';
import { CivilTimeCard } from '../readings/CivilTimeCard';
import { ComparisonCard } from '../readings/ComparisonCard';
import { useKalaStore } from '../../store/useKalaStore';

export function SimulatorView() {
  const [mobileTab, setMobileTab] = useState('canvas'); // 'controls', 'canvas', 'readings'
  const isLoading = useKalaStore((state) => state.isLoading);
  const error = useKalaStore((state) => state.error);
  const locationName = useKalaStore((state) => state.locationName);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-heritage-charcoal/90 text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm pointer-events-none">
          <div className="w-2.5 h-2.5 border-2 border-white/30 border-t-heritage-gold rounded-full animate-spin" />
          <span>Calculating celestial mechanics...</span>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="bg-rose-900 text-white text-xs px-4 py-2 text-center font-medium shadow-md z-30 flex items-center justify-center gap-2">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Desktop 3-Column Layout */}
      <div className="flex-1 hidden md:grid md:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Control Column (3 cols) */}
        <div className="col-span-3 border-r border-heritage-border bg-heritage-card/90 overflow-y-auto p-4 space-y-6">
          <LocationControl />
          <div className="gold-divider" />
          <TimeControl />
          <div className="gold-divider" />
          <ViewControl />
        </div>

        {/* Center 3D Samrat Yantra Canvas (6 cols) */}
        <div className="col-span-6 relative bg-heritage-bg h-full">
          <YantraScene />

          {/* Location / Status Badge overlay */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none bg-heritage-card/90 backdrop-blur-sm border border-heritage-border/80 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="text-[10px] text-heritage-secondary block uppercase tracking-wider">Active Digital Twin</span>
            <span className="text-xs font-serif font-bold text-heritage-charcoal">{locationName}</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex justify-center">
            <span className="text-[11px] bg-heritage-bg/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-heritage-border text-heritage-secondary shadow-sm">
              Use mouse / touch to orbit & pan · Scroll to zoom
            </span>
          </div>
        </div>

        {/* Right Readings Column (3 cols) */}
        <div className="col-span-3 border-l border-heritage-border bg-heritage-card/90 overflow-y-auto p-4 space-y-4">
          <ShadowTimeCard />
          <CivilTimeCard />
          <ComparisonCard />
          <SunPositionCard />
        </div>
      </div>

      {/* Mobile Stacked Layout with Bottom Navigation */}
      <div className="flex-1 flex flex-col md:hidden overflow-hidden relative">
        {mobileTab === 'canvas' && (
          <div className="flex-1 relative bg-heritage-bg">
            <YantraScene />
          </div>
        )}

        {mobileTab === 'controls' && (
          <div className="flex-1 bg-heritage-card overflow-y-auto p-4 space-y-5">
            <LocationControl />
            <div className="gold-divider" />
            <TimeControl />
            <div className="gold-divider" />
            <ViewControl />
          </div>
        )}

        {mobileTab === 'readings' && (
          <div className="flex-1 bg-heritage-card overflow-y-auto p-4 space-y-4">
            <ShadowTimeCard />
            <CivilTimeCard />
            <ComparisonCard />
            <SunPositionCard />
          </div>
        )}

        {/* Mobile Tab Bar */}
        <div className="h-14 bg-heritage-bg border-t border-heritage-border flex justify-around items-center px-2 z-20">
          <button
            onClick={() => setMobileTab('controls')}
            className={`flex flex-col items-center gap-1 text-xs py-1 px-4 rounded-lg ${
              mobileTab === 'controls'
                ? 'text-heritage-terracotta font-bold'
                : 'text-heritage-secondary'
            }`}
          >
            <Sliders size={18} />
            <span>Controls</span>
          </button>
          <button
            onClick={() => setMobileTab('canvas')}
            className={`flex flex-col items-center gap-1 text-xs py-1 px-4 rounded-lg ${
              mobileTab === 'canvas'
                ? 'text-heritage-terracotta font-bold'
                : 'text-heritage-secondary'
            }`}
          >
            <Compass size={18} />
            <span>3D Yantra</span>
          </button>
          <button
            onClick={() => setMobileTab('readings')}
            className={`flex flex-col items-center gap-1 text-xs py-1 px-4 rounded-lg ${
              mobileTab === 'readings'
                ? 'text-heritage-terracotta font-bold'
                : 'text-heritage-secondary'
            }`}
          >
            <BarChart2 size={18} />
            <span>Readings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

