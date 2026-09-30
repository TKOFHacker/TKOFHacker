from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.database.session import Base, engine, SessionLocal
from app.database.seed import seed_database
import app.models # ensure all models are registered

# Import routers
from app.api.v1.auth import router as auth_router
from app.api.v1.beneficiaries import router as beneficiaries_router
from app.api.v1.assessment import router as assessment_router
from app.api.v1.ai import router as ai_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.training import router as training_router
from app.api.v1.schemes import router as schemes_router
from app.api.v1.roadmap import router as roadmap_router
from app.api.v1.voice import router as voice_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed demo persona
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers for unified API response standard
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "data": None,
            "message": "Validation Error",
            "error": {
                "code": "VALIDATION_ERROR",
                "details": exc.errors()
            }
        }
    )

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(beneficiaries_router, prefix=settings.API_V1_STR)
app.include_router(assessment_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
# Provide alias for /api/v1/recommendations
app.include_router(beneficiaries_router, prefix="/api/v1/recommendations", tags=["Recommendations Alias"])
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(training_router, prefix=settings.API_V1_STR)
app.include_router(schemes_router, prefix=settings.API_V1_STR)
app.include_router(roadmap_router, prefix=settings.API_V1_STR)
app.include_router(voice_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "success": True,
        "data": {
            "name": settings.PROJECT_NAME,
            "version": "1.0.0",
            "voice_channel": "Twilio / Exotel IVR compatible",
            "demo_persona": "Citizen (Farmer -> Certified Electrician)"
        },
        "message": "AI Livelihood Assistant API is operational",
        "error": None
    }
