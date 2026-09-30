import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Livora — AI Livelihood Platform"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./livelihood.db")
    
    # JWT Authentication
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-sih26097-livelihood-key-32char-min")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # AI Keys (Optional for local mock fallback)
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    STT_API_KEY: str = os.getenv("STT_API_KEY", "")
    TTS_API_KEY: str = os.getenv("TTS_API_KEY", "")
    
    # Twilio / Exotel Voice Keys (Optional for local mock fallback)
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "+9118005550199")
    EXOTEL_API_KEY: str = os.getenv("EXOTEL_API_KEY", "")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")

settings = Settings()
