/**
 * Location Control Panel.
 * Supports place search, preset Indian heritage observatories,
 * manual latitude/longitude input, and browser geolocation.
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Search, Check } from 'lucide-react';
import { useKalaStore } from '../../store/useKalaStore';
import { PRESET_LOCATIONS } from '../../lib/constants';
import { searchPlaces } from '../../lib/api';

export function LocationControl() {
  const latitude = useKalaStore((state) => state.latitude);
  const longitude = useKalaStore((state) => state.longitude);
  const locationName = useKalaStore((state) => state.locationName);
  const setLocation = useKalaStore((state) => state.setLocation);
  const setCoordinates = useKalaStore((state) => state.setCoordinates);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [geoError, setGeoError] = useState(null);

  // Search places using backend Nominatim proxy
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const res = await searchPlaces(searchQuery);
      setSearchResults(res.results || []);
    } catch (err) {
      console.error('Place search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Browser Geolocation ("Use my location")
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        setLocation({
          name: 'My Current Location',
          latitude: lat,
          longitude: lon,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
        });
      },
      (err) => {
        setGeoError('Location permission was denied. You can search for a city instead.');
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-heritage-border pb-2">
        <h4 className="font-serif text-sm font-bold text-heritage-charcoal uppercase tracking-wider flex items-center gap-1.5">
          <MapPin size={15} className="text-heritage-terracotta" /> देश · Location
        </h4>
        <span className="text-[11px] font-mono text-heritage-secondary font-medium">
          {latitude.toFixed(2)}°N, {longitude.toFixed(2)}°E
        </span>
      </div>

      {/* Preset Observatory Chips */}
      <div>
        <label className="text-[11px] text-heritage-secondary block mb-1.5 font-medium">
          Heritage Observatories:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_LOCATIONS.map((preset) => {
            const isSelected = Math.abs(preset.latitude - latitude) < 0.005;
            return (
              <button
                key={preset.id}
                onClick={() => setLocation(preset)}
                className={`text-xs px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-heritage-terracotta text-white font-medium shadow-sm'
                    : 'bg-heritage-bg border border-heritage-border text-heritage-ink hover:bg-heritage-card'
                }`}
              >
                {isSelected && <Check size={12} />}
                {preset.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Place Search */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search global city or place..."
          className="w-full text-xs bg-heritage-bg border border-heritage-border rounded-lg pl-8 pr-16 py-2 text-heritage-ink focus:outline-none focus:border-heritage-gold transition-colors"
        />
        <Search size={14} className="absolute left-2.5 top-2.5 text-heritage-secondary" />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-1 top-1 bottom-1 px-2.5 bg-heritage-charcoal text-white rounded text-[11px] hover:bg-heritage-ink transition-colors"
        >
          {isSearching ? '...' : 'Find'}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="bg-heritage-bg border border-heritage-border rounded-lg max-h-36 overflow-y-auto divide-y divide-heritage-border text-xs">
          {searchResults.map((result, idx) => (
            <button
              key={idx}
              onClick={() => {
                setLocation(result);
                setSearchResults([]);
                setSearchQuery('');
              }}
              className="w-full text-left p-2 hover:bg-heritage-card text-heritage-ink flex flex-col"
            >
              <span className="font-semibold text-heritage-charcoal">{result.name}</span>
              <span className="text-[10px] text-heritage-secondary truncate">{result.region}</span>
            </button>
          ))}
        </div>
      )}

      {/* Geolocation Button */}
      <button
        onClick={handleUseMyLocation}
        className="w-full text-xs py-2 px-3 border border-heritage-border rounded-lg bg-heritage-bg hover:bg-heritage-card text-heritage-ink flex items-center justify-center gap-1.5 transition-colors font-medium shadow-sm"
      >
        <Navigation size={13} className="text-heritage-gold" /> Use My Exact Location
      </button>

      {/* Geolocation Error Alert */}
      {geoError && (
        <p className="text-[11px] text-heritage-terracotta bg-heritage-terracotta/10 p-2 rounded border border-heritage-terracotta/20">
          {geoError}
        </p>
      )}

      {/* Manual Latitude & Longitude Inputs */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div>
          <label className="text-[10px] text-heritage-secondary uppercase block mb-1">
            Latitude (°N)
          </label>
          <input
            type="number"
            step="0.0001"
            min="-90"
            max="90"
            value={latitude}
            onChange={(e) => setCoordinates(parseFloat(e.target.value) || 0, longitude)}
            className="w-full text-xs bg-heritage-bg border border-heritage-border rounded p-1.5 font-mono text-heritage-charcoal"
          />
        </div>
        <div>
          <label className="text-[10px] text-heritage-secondary uppercase block mb-1">
            Longitude (°E)
          </label>
          <input
            type="number"
            step="0.0001"
            min="-180"
            max="180"
            value={longitude}
            onChange={(e) => setCoordinates(latitude, parseFloat(e.target.value) || 0)}
            className="w-full text-xs bg-heritage-bg border border-heritage-border rounded p-1.5 font-mono text-heritage-charcoal"
          />
        </div>
      </div>
    </div>
  );
}

