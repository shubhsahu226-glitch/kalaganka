"""
Main FastAPI Application Entry Point for KalaGanaka.
Interactive Indian Timekeeping & Astronomy Lab.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes_solar import router as solar_router
from app.api.routes_places import router as places_router

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend astronomical engine for the Samrat Yantra Live Solar-Time Simulator.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["System"])
def health_check():
    """System health check endpoint."""
    return {
        "status": "ok",
        "service": "kalaganaka-api",
        "version": settings.app_version
    }


# Include versioned API routers
app.include_router(solar_router, prefix=settings.api_prefix)
app.include_router(places_router, prefix=settings.api_prefix)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

