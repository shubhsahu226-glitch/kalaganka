/**
 * Time and Simulation Speed Control Panel.
 * Supports date/time pickers, live clock toggle, manual slider scrubbing,
 * and simulation speed multipliers (1x, 60x, 600x).
 */

import React from 'react';
import { Clock, Play, Pause, FastForward, RotateCcw } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';
import { SIMULATION_SPEEDS } from '../../lib/constants';
import { timeToSeconds, secondsToTime } from '../../lib/format';

export function TimeControl() {
  const date = useKalaStore((state) => state.date);
  const time = useKalaStore((state) => state.time);
  const isLiveMode = useKalaStore((state) => state.isLiveMode);
  const simulationSpeed = useKalaStore((state) => state.simulationSpeed);

  const setDate = useKalaStore((state) => state.setDate);
  const setTime = useKalaStore((state) => state.setTime);
  const setLiveMode = useKalaStore((state) => state.setLiveMode);
  const setSimulationSpeed = useKalaStore((state) => state.setSimulationSpeed);
  const syncToLiveNow = useKalaStore((state) => state.syncToLiveNow);

  const totalSeconds = timeToSeconds(time);

  // Quick preset shortcuts (switches to manual mode)
  const handleSetNoon = () => {
    setLiveMode(false);
    setTime('12:00:00');
  };
  const handleSetMorning = () => {
    setLiveMode(false);
    setTime('09:00:00');
  };
  const handleSetAfternoon = () => {
    setLiveMode(false);
    setTime('15:00:00');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-heritage-border pb-2">
        <h4 className="font-serif text-sm font-bold text-heritage-charcoal uppercase tracking-wider flex items-center gap-1.5">
          <Clock size={15} className="text-heritage-gold" /> काल · Time & Date
        </h4>
        <div className="flex items-center gap-1.5">
          <button
            onClick={syncToLiveNow}
            title="Synchronize to current live real-time clock"
            className="text-[11px] px-2 py-0.5 rounded bg-heritage-bg border border-heritage-border hover:border-heritage-gold text-heritage-charcoal flex items-center gap-1 transition-all"
          >
            <RotateCcw size={11} className="text-heritage-gold" />
            <span>Live Now</span>
          </button>
          <button
            onClick={() => setLiveMode(!isLiveMode)}
            className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium transition-colors ${
              isLiveMode
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-heritage-bg text-heritage-secondary border border-heritage-border hover:bg-heritage-card'
            }`}
          >
            {isLiveMode ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live
              </>
            ) : (
              'Manual'
            )}
          </button>
        </div>
      </div>

      {/* Date & Time Picker */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-heritage-secondary uppercase block mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setLiveMode(false);
              setDate(e.target.value);
            }}
            className="w-full text-xs bg-heritage-bg border border-heritage-border rounded p-1.5 font-mono text-heritage-charcoal"
          />
        </div>
        <div>
          <label className="text-[10px] text-heritage-secondary uppercase block mb-1">
            Civil Time (24h)
          </label>
          <input
            type="time"
            step="1"
            value={time}
            onChange={(e) => {
              setLiveMode(false);
              setTime(e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value);
            }}
            className="w-full text-xs bg-heritage-bg border border-heritage-border rounded p-1.5 font-mono text-heritage-charcoal"
          />
        </div>
      </div>

      {/* Manual Time Slider */}
      <div>
        <div className="flex justify-between items-center text-[11px] text-heritage-secondary mb-1">
          <span>06:00 (Dawn)</span>
          <span className="font-mono font-bold text-heritage-terracotta">{time}</span>
          <span>18:00 (Dusk)</span>
        </div>
        <input
          type="range"
          min="0"
          max="86399"
          value={totalSeconds}
          onChange={(e) => {
            if (isLiveMode) setLiveMode(false);
            setTime(secondsToTime(Number(e.target.value)));
          }}
          className="w-full h-1.5 bg-heritage-border rounded-lg appearance-none cursor-pointer accent-heritage-terracotta"
        />
      </div>

      {/* Simulation Speed Buttons */}
      <div>
        <label className="text-[11px] text-heritage-secondary block mb-1.5 font-medium">
          Simulation Speed:
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {SIMULATION_SPEEDS.map((spd) => (
            <button
              key={spd.value}
              onClick={() => {
                setSimulationSpeed(spd.value);
                if (!isLiveMode) setLiveMode(true);
              }}
              className={`text-xs py-1.5 rounded border transition-all text-center flex flex-col items-center justify-center ${
                simulationSpeed === spd.value && isLiveMode
                  ? 'bg-heritage-gold text-heritage-charcoal font-bold border-heritage-gold shadow-sm'
                  : 'bg-heritage-bg border-heritage-border text-heritage-ink hover:bg-heritage-card'
              }`}
            >
              <span>{spd.label}</span>
              <span className="text-[9px] opacity-75">{spd.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fast Time Presets */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSetMorning}
          className="flex-1 text-[11px] py-1 bg-heritage-bg border border-heritage-border rounded hover:bg-heritage-card text-heritage-secondary"
        >
          09:00 AM
        </button>
        <button
          onClick={handleSetNoon}
          className="flex-1 text-[11px] py-1 bg-heritage-bg border border-heritage-border rounded hover:bg-heritage-card text-heritage-secondary"
        >
          12:00 PM
        </button>
        <button
          onClick={handleSetAfternoon}
          className="flex-1 text-[11px] py-1 bg-heritage-bg border border-heritage-border rounded hover:bg-heritage-card text-heritage-secondary"
        >
          03:00 PM
        </button>
      </div>
    </div>
  );
}

