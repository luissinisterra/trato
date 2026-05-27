import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import router
from src.config import settings
from src.db import Base, engine

os.environ.setdefault("GOOGLE_API_KEY", settings.google_api_key)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="AI Auction Advisor - TRATO", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


def main():
    import uvicorn
    uvicorn.run("src.app:app", host="0.0.0.0", port=settings.port, reload=True)


if __name__ == "__main__":
    main()
