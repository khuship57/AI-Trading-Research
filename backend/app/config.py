import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from .env file in backend directory
load_dotenv()

class Settings(BaseModel):
    app_name: str = "AI Trading Research Assistant API"
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "groq/compound-mini")

settings = Settings()
