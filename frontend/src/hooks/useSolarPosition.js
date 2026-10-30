/**
 * Custom hook to calculate solar position and yantra metrics with debouncing.
 */

import { useEffect, useRef } from 'react';
import { useKalaStore } from '../store/useKalaStore';
import { fetchSolarPosition } from '../lib/api';
import { calculateFallbackSolar } from '../lib/solarFallback';

export function useSolarPosition() {
  const latitude = useKalaStore((state) => state.latitude);
  const longitude = useKalaStore((state) => state.longitude);
  const date = useKalaStore((state) => state.date);
  const time = useKalaStore((state) => state.time);
  const timezone = useKalaStore((state) => state.timezone);
  const isLiveMode = useKalaStore((state) => state.isLiveMode);

  const setSolarData = useKalaStore((state) => state.setSolarData);
  const setLoading = useKalaStore((state) => state.setLoading);
  const setError = useKalaStore((state) => state.setError);

  const lastBackendFetchRef = useRef(0);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // 1. Immediately update solar calculations on client so shadow and readings update live every second
    const immediateData = calculateFallbackSolar(latitude, longitude, date, time);
    setSolarData(immediateData);

    // 2. Fetch from FastAPI backend:
    // If in live mode, throttle backend requests to once every 20 seconds to prevent network flood;
    // in manual scrub mode, debounce by 150ms.
    const now = Date.now();
    const shouldFetchBackend = !isLiveMode || (now - lastBackendFetchRef.current > 20000);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (shouldFetchBackend) {
      const delay = isLiveMode ? 300 : 150;
      debounceTimerRef.current = setTimeout(async () => {
        try {
          if (!isLiveMode) setLoading(true);
          const data = await fetchSolarPosition({
            latitude,
            longitude,
            date,
            time,
            timezone
          });
          lastBackendFetchRef.current = Date.now();
          setSolarData(data);
        } catch (err) {
          // If backend is offline or restarting, client-side live fallback is already active
        } finally {
          setLoading(false);
        }
      }, delay);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [latitude, longitude, date, time, timezone, isLiveMode, setSolarData, setLoading, setError]);
}

