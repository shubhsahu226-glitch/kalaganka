/**
 * Formatting helpers for astronomical angles, times, and difference metrics.
 */

export function formatAngle(deg, decimals = 1) {
  if (deg === null || deg === undefined || isNaN(deg)) return '--';
  return `${Number(deg).toFixed(decimals)}°`;
}

export function formatMinutes(mins) {
  if (mins === null || mins === undefined || isNaN(mins)) return '--';
  const val = Number(mins);
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)} min`;
}

export function formatTime12h(timeStr) {
  if (!timeStr) return '--:--:--';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let h = parseInt(parts[0], 10);
  const m = parts[1];
  const s = parts[2] ? parts[2].padStart(2, '0') : '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2, '0')}:${m}:${s} ${ampm}`;
}

export function timeToSeconds(timeStr) {
  if (!timeStr) return 0;
  const [h, m, s] = timeStr.split(':').map(Number);
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
}

export function secondsToTime(totalSec) {
  const normSec = ((totalSec % 86400) + 86400) % 86400;
  const h = Math.floor(normSec / 3600);
  const m = Math.floor((normSec % 3600) / 60);
  const s = Math.floor(normSec % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

