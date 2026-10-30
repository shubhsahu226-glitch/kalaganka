/**
 * 3D Scene View & Camera Preset Controls.
 */

import React from 'react';
import { Eye, Camera, RotateCcw } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';
import { CAMERA_PRESETS } from '../../lib/constants';

export function ViewControl() {
  const viewOptions = useKalaStore((state) => state.viewOptions);
  const toggleViewOption = useKalaStore((state) => state.toggleViewOption);
  const setCameraPreset = useKalaStore((state) => state.setCameraPreset);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-heritage-border pb-2">
        <h4 className="font-serif text-sm font-bold text-heritage-charcoal uppercase tracking-wider flex items-center gap-1.5">
          <Eye size={15} className="text-heritage-secondary" /> दृश्य · View & Camera
        </h4>
      </div>

      {/* Camera View Presets */}
      <div>
        <label className="text-[11px] text-heritage-secondary block mb-1.5 font-medium flex items-center gap-1">
          <Camera size={13} /> Camera Viewpoints:
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => setCameraPreset(key)}
              className={`text-xs py-1.5 px-2 rounded border text-left transition-colors truncate ${
                viewOptions.cameraPreset === key
                  ? 'bg-heritage-charcoal text-white font-medium border-heritage-charcoal shadow-sm'
                  : 'bg-heritage-bg border-heritage-border text-heritage-ink hover:bg-heritage-card'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-2 pt-1 text-xs">
        <label className="flex items-center justify-between p-2 rounded bg-heritage-bg border border-heritage-border cursor-pointer hover:bg-heritage-card">
          <span className="text-heritage-ink">Show Sun Diurnal Path</span>
          <input
            type="checkbox"
            checked={viewOptions.showSunPath}
            onChange={() => toggleViewOption('showSunPath')}
            className="rounded text-heritage-terracotta focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded bg-heritage-bg border border-heritage-border cursor-pointer hover:bg-heritage-card">
          <span className="text-heritage-ink">Show Celestial Pole Axis</span>
          <input
            type="checkbox"
            checked={viewOptions.showCelestialPole}
            onChange={() => toggleViewOption('showCelestialPole')}
            className="rounded text-heritage-terracotta focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded bg-heritage-bg border border-heritage-border cursor-pointer hover:bg-heritage-card">
          <span className="text-heritage-ink">Show Anatomical Labels</span>
          <input
            type="checkbox"
            checked={viewOptions.showHourLabels}
            onChange={() => toggleViewOption('showHourLabels')}
            className="rounded text-heritage-terracotta focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between p-2 rounded bg-heritage-bg border border-heritage-border cursor-pointer hover:bg-heritage-card">
          <span className="text-heritage-ink">Show Compass Markers</span>
          <input
            type="checkbox"
            checked={viewOptions.showCompass}
            onChange={() => toggleViewOption('showCompass')}
            className="rounded text-heritage-terracotta focus:ring-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}

