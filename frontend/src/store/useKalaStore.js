/**
 * Zustand Global State Store for KalaGanaka.
 * Centralized state for location, time, 3D scene toggles, loupe, and astronomical calculations.
 */

import { create } from 'zustand';
import { DEFAULT_STATE, CAMERA_PRESETS, getLiveDateStr, getLiveTimeStr } from '../lib/constants';
import { calculateFallbackSolar } from '../lib/solarFallback';

const initialDate = getLiveDateStr();
const initialTime = getLiveTimeStr();

export const useKalaStore = create((set, get) => ({
  // Observer Location & Coordinates
  latitude: DEFAULT_STATE.latitude,
  longitude: DEFAULT_STATE.longitude,
  locationName: DEFAULT_STATE.locationName,
  timezone: DEFAULT_STATE.timezone,

  // Time & Simulation State (Always initialized to current real-world clock)
  date: initialDate,
  time: initialTime,
  isLiveMode: true,
  simulationSpeed: 1,

  // Calculation Results (Pre-populated with live solar data on load)
  solarData: calculateFallbackSolar(
    DEFAULT_STATE.latitude,
    DEFAULT_STATE.longitude,
    initialDate,
    initialTime
  ),
  isLoading: false,
  error: null,

  // 3D Scene View Options
  viewOptions: {
    showSunPath: true,
    showCelestialPole: true,
    showHourLabels: true,
    showCompass: true,
    cameraPreset: 'VISITOR'
  },

  // Shadow Reading Loupe (Magnifier) State
  isLoupeOpen: false,
  loupeZoomLevel: 5, // 1 = full quadrant, 5 = 1-hour segment, 20 = 1-minute with 6-second ticks

  // Educational Info Modal State
  isInfoModalOpen: false,
  infoModalTab: 0,

  // Active Main View: 'GUIDE' (Museum Heritage Scroll) or 'SIMULATOR' (Interactive Lab)
  activeAppView: 'GUIDE',

  // Actions
  setLocation: (loc) => set({
    latitude: loc.latitude,
    longitude: loc.longitude,
    locationName: loc.name,
    timezone: loc.timezone || 'Asia/Kolkata'
  }),

  setCoordinates: (lat, lon) => set({
    latitude: lat,
    longitude: lon,
    locationName: `Lat ${lat.toFixed(2)}°, Lon ${lon.toFixed(2)}°`
  }),

  setDate: (date) => set({ date }),

  setTime: (time) => set({ time }),

  setLiveMode: (isLive) => {
    if (isLive) {
      const liveDate = getLiveDateStr();
      const liveTime = getLiveTimeStr();
      const state = get();
      const solar = calculateFallbackSolar(state.latitude, state.longitude, liveDate, liveTime);
      set({
        isLiveMode: true,
        date: liveDate,
        time: liveTime,
        simulationSpeed: 1,
        solarData: solar
      });
    } else {
      set({ isLiveMode: false });
    }
  },

  syncToLiveNow: () => {
    const liveDate = getLiveDateStr();
    const liveTime = getLiveTimeStr();
    const state = get();
    const solar = calculateFallbackSolar(state.latitude, state.longitude, liveDate, liveTime);
    set({
      date: liveDate,
      time: liveTime,
      isLiveMode: true,
      simulationSpeed: 1,
      solarData: solar
    });
  },

  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

  setSolarData: (data) => set({ solarData: data, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  toggleViewOption: (key) => set((state) => ({
    viewOptions: {
      ...state.viewOptions,
      [key]: !state.viewOptions[key]
    }
  })),

  setCameraPreset: (presetKey) => set((state) => ({
    viewOptions: {
      ...state.viewOptions,
      cameraPreset: presetKey
    }
  })),

  openLoupe: () => set({ isLoupeOpen: true }),
  closeLoupe: () => set({ isLoupeOpen: false }),
  setLoupeZoomLevel: (level) => set({ loupeZoomLevel: level }),

  openInfoModal: (tab = 0) => set({ isInfoModalOpen: true, infoModalTab: tab }),
  closeInfoModal: () => set({ isInfoModalOpen: false }),
  setInfoModalTab: (tab) => set({ infoModalTab: tab }),

  setActiveAppView: (view) => set({ activeAppView: view })
}));

if (typeof window !== 'undefined') {
  window.useKalaStore = useKalaStore;
}


