/**
 * Custom hook managing the live simulation clock and speed multipliers.
 */

import { useEffect, useRef } from 'react';
import { useKalaStore } from '../store/useKalaStore';
import { getLiveDateStr, getLiveTimeStr } from '../lib/constants';
import { timeToSeconds, secondsToTime } from '../lib/format';

export function useLiveClock() {
  const isLiveMode = useKalaStore((state) => state.isLiveMode);
  const simulationSpeed = useKalaStore((state) => state.simulationSpeed);
  const setTime = useKalaStore((state) => state.setTime);
  const setDate = useKalaStore((state) => state.setDate);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!isLiveMode) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (simulationSpeed === 1) {
        // True 1:1 real-time clock synced directly to current local time
        const liveDate = getLiveDateStr();
        const liveTime = getLiveTimeStr();
        const curDate = useKalaStore.getState().date;
        if (curDate !== liveDate) {
          setDate(liveDate);
        }
        setTime(liveTime);
      } else {
        // Accelerated time-lapse simulation (60x, 600x)
        const currentTimeStr = useKalaStore.getState().time;
        let currentSeconds = timeToSeconds(currentTimeStr);
        currentSeconds += simulationSpeed;

        if (currentSeconds >= 86400) {
          currentSeconds -= 86400;
          const currentDate = new Date(useKalaStore.getState().date);
          currentDate.setDate(currentDate.getDate() + 1);
          setDate(currentDate.toISOString().split('T')[0]);
        }
        setTime(secondsToTime(currentSeconds));
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLiveMode, simulationSpeed, setTime, setDate]);
}

