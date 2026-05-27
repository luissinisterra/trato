from collections import Counter
from datetime import datetime

from mirascope import llm

from src.tools.client import trato


@llm.tool
async def get_auction_bids(auction_id: int) -> str:
    """Obtiene todas las pujas de una subasta específica."""
    data = await trato.get(f"/bids?auction_id={auction_id}")
    items = data.get("data", data)
    if isinstance(items, dict):
        items = items.get("data", [items])
    if not items:
        return "No hay pujas registradas para esta subasta."
    lines = ["=== PUJAS ==="]
    for b in sorted(items, key=lambda x: x.get("amount", 0), reverse=True):
        lines.append(
            f"Usuario: {b.get('user_id')} | Monto: ${b.get('amount')} | "
            f"Estado: {b.get('status')} | Fecha: {str(b.get('created_at', ''))[:19]}"
        )
    return "\n".join(lines)


@llm.tool
async def analyze_competition(auction_id: int) -> str:
    """Analiza la competencia en una subasta: número de postores, frecuencia de pujas, etc."""
    auction_raw = await trato.get(f"/auctions/{auction_id}")
    auction = auction_raw.get("data", auction_raw)

    bids_raw = await trato.get(f"/bids?auction_id={auction_id}")
    bids = bids_raw.get("data", bids_raw)
    if isinstance(bids, dict):
        bids = bids.get("data", [bids])

    if not bids:
        return "No hay actividad aún en esta subasta. No hay competencia."

    accepted = [b for b in bids if b.get("status") == "accepted"]
    if not accepted:
        return "No hay pujas aceptadas aún."

    unique_bidders = set(b.get("user_id") for b in accepted)
    amounts = [float(b.get("amount", 0)) for b in accepted]
    start_price = float(auction.get("startPrice", 0))
    current_price = float(auction.get("currentPrice", 0))

    bidder_counts = Counter(b.get("user_id") for b in accepted)
    most_active = bidder_counts.most_common(3)

    times = [
        datetime.fromisoformat(str(b.get("created_at", "")).replace("Z", "+00:00"))
        for b in accepted if b.get("created_at")
    ]
    avg_gap = "N/A"
    if len(times) > 1:
        gaps = [(times[i] - times[i - 1]).total_seconds() for i in range(1, len(times))]
        avg_gap = f"{sum(gaps) / len(gaps):.0f}s"

    price_increase_pct = ((current_price - start_price) / start_price * 100) if start_price else 0

    return (
        f"=== ANÁLISIS DE COMPETENCIA ===\n"
        f"Subasta ID: {auction_id}\n"
        f"Postores únicos: {len(unique_bidders)}\n"
        f"Total pujas aceptadas: {len(accepted)}\n"
        f"Precio inicial: ${start_price:.2f} → Actual: ${current_price:.2f}\n"
        f"Incremento: {price_increase_pct:.1f}%\n"
        f"Postores más activos: {most_active}\n"
        f"Frecuencia promedio entre pujas: {avg_gap}\n"
        f"Rango de montos: ${min(amounts):.2f} - ${max(amounts):.2f}"
    )


@llm.tool
async def estimate_fair_price(auction_id: int) -> str:
    """Estima el precio justo de un producto en subasta basado en su precio base y la demanda."""
    auction_raw = await trato.get(f"/auctions/{auction_id}")
    auction = auction_raw.get("data", auction_raw)
    product_id = auction.get("productId")

    product_raw = await trato.get(f"/products/{product_id}")
    product = product_raw.get("data", product_raw)
    if isinstance(product, dict) and "data" in product:
        product = product["data"]

    base_price = float(product.get("base_price", 0))
    start_price = float(auction.get("startPrice", 0))
    current_price = float(auction.get("currentPrice", 0))

    bids_raw = await trato.get(f"/bids?auction_id={auction_id}")
    bids = bids_raw.get("data", bids_raw)
    if isinstance(bids, dict):
        bids = bids.get("data", [bids])
    accepted = [b for b in bids if b.get("status") == "accepted"]
    num_bids = len(accepted)

    avg_bid = 0
    if accepted:
        avg_bid = sum(float(b.get("amount", 0)) for b in accepted) / num_bids

    demand_factor = 1.0 + (num_bids * 0.02)
    if demand_factor > 1.3:
        demand_factor = 1.3

    fair_min = base_price * 0.8
    fair_max = base_price * 1.4
    fair_estimate = base_price * demand_factor

    return (
        f"=== ESTIMACIÓN DE PRECIO JUSTO ===\n"
        f"Producto: {product.get('name', 'N/A')}\n"
        f"Precio base del producto: ${base_price:.2f}\n"
        f"Precio inicial subasta: ${start_price:.2f}\n"
        f"Precio actual: ${current_price:.2f}\n"
        f"Pujas totales: {num_bids}\n"
        f"Puja promedio: ${avg_bid:.2f}\n"
        f"\n📊 Precio justo estimado: ${fair_estimate:.2f}\n"
        f"   Rango recomendado: ${fair_min:.2f} - ${fair_max:.2f}\n"
        f"\n💡 Si el precio actual está por debajo del justo estimado, "
        f"aún hay margen. Si lo supera, considera no pujar más."
    )


@llm.tool
async def get_user_bid_history(user_id: int) -> str:
    """Obtiene el historial de pujas de un usuario."""
    data = await trato.get(f"/bids?user_id={user_id}")
    items = data.get("data", data)
    if isinstance(items, dict):
        items = items.get("data", [items])
    if not items:
        return "El usuario no ha realizado pujas."
    accepted = [b for b in items if b.get("status") == "accepted"]
    lines = [f"=== HISTORIAL DE PUJAS (Usuario {user_id}) ==="]
    for b in sorted(accepted, key=lambda x: x.get("created_at", ""), reverse=True)[:20]:
        lines.append(
            f"Subasta: {b.get('auction_id')} | Monto: ${b.get('amount')} | "
            f"Estado: {b.get('status')} | {str(b.get('created_at', ''))[:19]}"
        )
    lines.append(f"\nTotal pujas: {len(items)} | Aceptadas: {len(accepted)}")
    return "\n".join(lines)
