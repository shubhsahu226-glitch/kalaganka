"""
Place and Geocoding Service.
Provides fast access to known Indian astronomical heritage observatories,
and queries OpenStreetMap Nominatim for worldwide place searches with caching.
"""

from typing import List, Dict, Any
import httpx
from app.config import settings
from app.schemas.location import PlaceResult, PlaceSearchResponse
from app.services.cache_service import place_cache

# Known astronomical observatories & reference sites across India
PRESET_HERITAGE_PLACES: List[Dict[str, Any]] = [
    {
        "name": "Jaipur (Jantar Mantar)",
        "region": "Rajasthan, India",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "timezone": "Asia/Kolkata"
    },
    {
        "name": "Delhi (Jantar Mantar)",
        "region": "Delhi, India",
        "latitude": 28.6271,
        "longitude": 77.2166,
        "timezone": "Asia/Kolkata"
    },
    {
        "name": "Ujjain (Dongla Observatory / Prime Meridian)",
        "region": "Madhya Pradesh, India",
        "latitude": 23.1765,
        "longitude": 75.7885,
        "timezone": "Asia/Kolkata"
    },
    {
        "name": "Varanasi (Man Mandir Observatory)",
        "region": "Uttar Pradesh, India",
        "latitude": 25.3089,
        "longitude": 83.0105,
        "timezone": "Asia/Kolkata"
    },
    {
        "name": "Kolar",
        "region": "Karnataka, India",
        "latitude": 13.1367,
        "longitude": 78.1291,
        "timezone": "Asia/Kolkata"
    }
]


async def search_places(query: str) -> PlaceSearchResponse:
    """
    Searches for geographic places by name.
    Matches presets first, then queries OSM Nominatim if needed.
    """
    clean_query = query.strip().lower()
    if not clean_query:
        return PlaceSearchResponse(results=[PlaceResult(**p) for p in PRESET_HERITAGE_PLACES])

    cached = place_cache.get(clean_query)
    if cached:
        return cached

    results: List[PlaceResult] = []

    # Check preset matches first
    for preset in PRESET_HERITAGE_PLACES:
        if clean_query in preset["name"].lower() or clean_query in preset["region"].lower():
            results.append(PlaceResult(**preset))

    # Query Nominatim if less than 3 preset results
    if len(results) < 5:
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                headers = {"User-Agent": settings.user_agent}
                params = {
                    "q": query,
                    "format": "json",
                    "limit": 5,
                    "addressdetails": 1
                }
                response = await client.get(settings.nominatim_base_url, params=params, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    for item in data:
                        name = item.get("name") or item.get("display_name", "").split(",")[0]
                        display_name = item.get("display_name", "")
                        lat = float(item["lat"])
                        lon = float(item["lon"])

                        # Heuristic timezone determination based on country/longitude
                        tz = "Asia/Kolkata" if "india" in display_name.lower() else "UTC"

                        # Avoid duplicate names from presets
                        if not any(abs(r.latitude - lat) < 0.01 and abs(r.longitude - lon) < 0.01 for r in results):
                            results.append(PlaceResult(
                                name=name,
                                region=display_name,
                                latitude=round(lat, 4),
                                longitude=round(lon, 4),
                                timezone=tz
                            ))
        except Exception:
            # On network timeout or rate limit, return whatever presets matched
            pass

    # If still empty, return the default presets
    if not results:
        results = [PlaceResult(**p) for p in PRESET_HERITAGE_PLACES]

    res = PlaceSearchResponse(results=results[:8])
    place_cache.set(clean_query, res)
    return res

