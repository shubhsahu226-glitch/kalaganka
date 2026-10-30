"""
Location Schemas for Place Geocoding and Coordinates.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class PlaceResult(BaseModel):
    """Normalized geocoding search result."""
    name: str = Field(..., description="City or place name.")
    region: str = Field(..., description="State, province, or administrative region and country.")
    latitude: float = Field(..., description="Latitude in decimal degrees.")
    longitude: float = Field(..., description="Longitude in decimal degrees.")
    timezone: str = Field(default="Asia/Kolkata", description="Inferred or standard IANA timezone.")


class PlaceSearchResponse(BaseModel):
    """List of matched locations."""
    results: List[PlaceResult]

