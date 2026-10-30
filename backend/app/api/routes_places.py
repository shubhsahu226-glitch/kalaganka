"""
Places & Geocoding API Routes.
Exposes /places/search.
"""

from fastapi import APIRouter, Query
from app.schemas.location import PlaceSearchResponse
from app.services.place_service import search_places

router = APIRouter(prefix="/places", tags=["Places & Geocoding"])


@router.get("/search", response_model=PlaceSearchResponse, summary="Search Locations")
async def get_places(q: str = Query(default="", description="City, observatory, or location name")):
    """
    Searches for cities and observatories with cached OpenStreetMap Nominatim lookup
    and predefined Indian astronomical heritage observatories.
    """
    return await search_places(q)

