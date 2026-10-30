/**
 * Top Museum Navigation Header.
 * Displays KalaGanaka branding, active view toggle (Museum Guide vs 3D Simulator),
 * and the circular ℹ️ educational modal trigger.
 */

import React from 'react';
import { Compass, Info, Eye, BookOpen, Layers } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';

export function Header() {
  const activeAppView = useKalaStore((state) => state.activeAppView);
  const setActiveAppView = useKalaStore((state) => state.setActiveAppView);
  const openInfoModal = useKalaStore((state) => state.openInfoModal);
  const openLoupe = useKalaStore((state) => state.openLoupe);
  const locationName = useKalaStore((state) => state.locationName);
  const latitude = useKalaStore((state) => state.latitude);

  return (
    <header className="h-16 border-b border-heritage-border bg-heritage-bg/95 backdrop-blur-md px-4 md:px-8 flex items-center justify-between z-40 sticky top-0 shadow-sm">
      {/* Brand & Invocation */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-heritage-terracotta text-white flex items-center justify-center shadow-md font-serif text-xl font-bold">
          क
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-lg md:text-xl font-bold text-heritage-charcoal tracking-wide">
              KalaGanaka
            </h1>
            <span className="text-xs font-devanagari text-heritage-terracotta font-semibold">
              कालगणक
            </span>
          </div>
          <p className="text-[10px] md:text-xs text-heritage-secondary hidden sm:block">
            Interactive Indian Timekeeping & Astronomy Lab · Samrat Yantra
          </p>
        </div>
      </div>

      {/* Middle Pill: Location & Latitude indicator */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-heritage-card border border-heritage-border rounded-full text-xs text-heritage-secondary shadow-sm">
        <Compass size={14} className="text-heritage-gold" />
        <span className="font-medium text-heritage-charcoal truncate max-w-[180px]">{locationName}</span>
        <span className="text-heritage-border">|</span>
        <span className="font-mono text-heritage-terracotta font-semibold">Gnomon {latitude.toFixed(1)}°</span>
      </div>

      {/* View Switcher & Action Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* View Toggle */}
        <div className="bg-heritage-card p-1 rounded-xl border border-heritage-border flex text-xs">
          <button
            onClick={() => setActiveAppView('GUIDE')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
              activeAppView === 'GUIDE'
                ? 'bg-heritage-charcoal text-heritage-marble shadow-sm'
                : 'text-heritage-secondary hover:text-heritage-charcoal'
            }`}
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Museum Guide</span>
          </button>
          <button
            onClick={() => setActiveAppView('SIMULATOR')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
              activeAppView === 'SIMULATOR'
                ? 'bg-heritage-terracotta text-white shadow-sm'
                : 'text-heritage-secondary hover:text-heritage-charcoal'
            }`}
          >
            <Layers size={14} />
            <span className="hidden sm:inline">3D Simulator</span>
          </button>
        </div>

        {/* Read Scale Loupe Quick Button */}
        <button
          onClick={openLoupe}
          title="Open Shadow Reading Loupe"
          className="p-2 rounded-xl bg-heritage-card border border-heritage-border text-heritage-charcoal hover:bg-heritage-cardHover hover:border-heritage-gold transition-colors shadow-sm flex items-center gap-1"
        >
          <Eye size={16} className="text-heritage-gold" />
          <span className="text-xs font-medium hidden md:inline">Loupe</span>
        </button>

        {/* Circular ℹ️ Info Modal Button */}
        <button
          onClick={() => openInfoModal(0)}
          title="What is the Samrat Yantra?"
          className="w-9 h-9 rounded-full bg-heritage-card border border-heritage-border text-heritage-terracotta hover:bg-heritage-terracotta hover:text-white transition-all shadow-sm flex items-center justify-center font-bold text-sm"
        >
          <Info size={18} />
        </button>
      </div>
    </header>
  );
}

