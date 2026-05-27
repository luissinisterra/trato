from mirascope import llm

from src.tools.client import trato


@llm.tool
async def get_auction(auction_id: int) -> str:
    """Obtiene información detallada de una subasta por su ID."""
    data = await trato.get(f"/auctions/{auction_id}")
    auction = data.get("data", data)
    return (
        f"ID: {auction.get('id')}\n"
        f"Producto ID: {auction.get('productId')}\n"
        f"Vendedor ID: {auction.get('sellerId')}\n"
        f"Precio inicial: ${auction.get('startPrice')}\n"
        f"Precio actual: ${auction.get('currentPrice')}\n"
        f"Incremento mínimo: ${auction.get('minIncrement')}\n"
        f"Estado: {auction.get('status')}\n"
        f"Inicio: {auction.get('startTime')}\n"
        f"Fin: {auction.get('endTime')}"
    )


@llm.tool
async def get_active_auctions() -> str:
    """Lista todas las subastas activas actualmente."""
    data = await trato.get("/auctions")
    items = data.get("data", data)
    if isinstance(items, dict):
        items = items.get("data", [items])
    auctions = [a for a in items if a.get("status") == "ACTIVE"]
    if not auctions:
        return "No hay subastas activas en este momento."
    lines = ["=== SUBASTAS ACTIVAS ==="]
    for a in auctions:
        lines.append(
            f"ID: {a.get('id')} | Producto: {a.get('productId')} | "
            f"Actual: ${a.get('currentPrice')} | "
            f"Fin: {str(a.get('endTime', ''))[:19]}"
        )
    return "\n".join(lines)


@llm.tool
async def get_auction_events(auction_id: int | None = None) -> str:
    """Obtiene eventos del sistema de subastas. Opcionalmente filtrar por auction_id."""
    data = await trato.get("/auction-events")
    items = data.get("data", data)
    if isinstance(items, dict):
        items = items.get("data", [items])
    if auction_id:
        items = [e for e in items if e.get("auctionId") == auction_id]
    if not items:
        return "No hay eventos registrados."
    lines = ["=== EVENTOS ==="]
    for e in items[-20:]:
        lines.append(
            f"[{str(e.get('createdAt', ''))[:19]}] "
            f"Subasta {e.get('auctionId')}: {e.get('eventType')} - {e.get('description', '')}"
        )
    return "\n".join(lines)
