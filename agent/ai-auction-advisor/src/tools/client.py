import httpx

from src.config import settings


class TratoClient:
    def __init__(self):
        self.base_url = settings.trato_gateway_url.rstrip("/")
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                timeout=30.0,
                headers={"Content-Type": "application/json"},
            )
        return self._client

    async def get(self, path: str) -> dict:
        client = await self._get_client()
        resp = await client.get(f"/api{path}")
        resp.raise_for_status()
        return resp.json()

    async def close(self):
        if self._client:
            await self._client.aclose()
            self._client = None


trato = TratoClient()
