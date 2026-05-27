from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    port: int = 3009
    google_api_key: str = ""
    gemini_model: str = "google/gemini-2.0-flash"
    trato_gateway_url: str = "http://localhost:3000"
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5437/agent_service_db"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
