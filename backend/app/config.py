"""
Application Configuration Settings.
Loads environment variables and sets defaults for CORS, service metadata, and caches.
"""

import os
from typing import List
from pydantic import BaseModel


class Settings(BaseModel):
    """Central configuration class for KalaGanaka backend."""
    app_name: str = "KalaGanaka Astronomical Engine"
    app_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    
    # Allowed origins for CORS (React frontend development and production)
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]
    
    # In-memory cache limits
    cache_maxsize: int = 1024
    
    # External geocoding service configuration
    nominatim_base_url: str = "https://nominatim.openstreetmap.org/search"
    user_agent: str = "KalaGanaka/1.0 (Indian Timekeeping & Astronomy Lab)"


settings = Settings()

