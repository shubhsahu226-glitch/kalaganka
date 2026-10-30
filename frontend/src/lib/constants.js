/**
 * Astronomical and Architectural Constants for KalaGanaka.
 */

export const PRESET_LOCATIONS = [
  {
    id: 'jaipur',
    name: 'Jaipur (Jantar Mantar)',
    region: 'Rajasthan, India',
    latitude: 26.9124,
    longitude: 75.7873,
    timezone: 'Asia/Kolkata',
    notes: 'Home of the historic Brihat Samrat Yantra built in 1734 CE by Sawai Jai Singh II.'
  },
  {
    id: 'delhi',
    name: 'Delhi (Jantar Mantar)',
    region: 'Connaught Place, Delhi',
    latitude: 28.6271,
    longitude: 77.2166,
    timezone: 'Asia/Kolkata',
    notes: 'The first of five observatories commissioned by Maharaja Sawai Jai Singh II in 1724 CE.'
  },
  {
    id: 'ujjain',
    name: 'Ujjain (Dongla Observatory)',
    region: 'Madhya Pradesh, India',
    latitude: 23.1765,
    longitude: 75.7885,
    timezone: 'Asia/Kolkata',
    notes: 'The Greenwich of ancient India; historical prime meridian of Indian astronomical treatises.'
  },
  {
    id: 'varanasi',
    name: 'Varanasi (Man Mandir)',
    region: 'Ghats of Varanasi, UP',
    latitude: 25.3089,
    longitude: 83.0105,
    timezone: 'Asia/Kolkata',
    notes: 'Rooftop observatory overlooking the sacred Ganga, built in 1737 CE.'
  },
  {
    id: 'kolar',
    name: 'Kolar',
    region: 'Karnataka, India',
    latitude: 13.1367,
    longitude: 78.1291,
    timezone: 'Asia/Kolkata',
    notes: 'Southern peninsula location demonstrating lower latitude gnomon tilt.'
  }
];

export const SIMULATION_SPEEDS = [
  { label: '1×', value: 1, description: 'Real-time solar speed' },
  { label: '60×', value: 60, description: '1 minute per second' },
  { label: '600×', value: 600, description: '10 minutes per second' }
];

export const CAMERA_PRESETS = {
  VISITOR: { position: [38, 22, -18], target: [0, 7, 4], label: 'Visitor View' },
  INSTRUMENT: { position: [0, 24, -36], target: [0, 9, 2], label: 'Instrument View' },
  AERIAL: { position: [0, 68, 2], target: [0, 0, 2], label: 'Aerial View' },
  GNOMON: { position: [12, 16, -6], target: [0, 10, 4], label: 'Gnomon View' },
  SCALE_WEST: { position: [-22, 12, 12], target: [-10, 6, 12], label: 'West Scale' },
  SCALE_EAST: { position: [22, 12, 12], target: [10, 6, 12], label: 'East Scale' }
};

/**
 * Returns the user's current local date in YYYY-MM-DD format.
 */
export function getLiveDateStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns the user's current local time in HH:MM:SS format.
 */
export function getLiveTimeStr() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export const DEFAULT_STATE = {
  latitude: 26.9124,
  longitude: 75.7873,
  locationName: 'Jaipur (Jantar Mantar)',
  timezone: 'Asia/Kolkata',
  date: getLiveDateStr(),
  time: getLiveTimeStr(),
  isLiveMode: true,
  simulationSpeed: 1
};

