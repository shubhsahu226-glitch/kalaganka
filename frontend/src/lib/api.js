/**
 * REST API client for KalaGanaka backend astronomical services.
 */

const BASE_URL = '/api/v1';

export async function fetchSolarPosition(payload) {
  const response = await fetch(`${BASE_URL}/solar-position`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error (${response.status})`);
  }

  return response.json();
}

export async function fetchBatchSolarPositions(payload) {
  const response = await fetch(`${BASE_URL}/solar-position/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Batch calculation error (${response.status})`);
  }

  return response.json();
}

export async function searchPlaces(query) {
  const response = await fetch(`${BASE_URL}/places/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Places search failed');
  }
  return response.json();
}

