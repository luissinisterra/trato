from mirascope import llm

from src.tools.client import trato


@llm.tool
async def get_product(product_id: int) -> str:
    """Obtiene información de un producto por su ID."""
    data = await trato.get(f"/products/{product_id}")
    product = data.get("data", data)
    if isinstance(product, dict) and "data" in product:
        product = product["data"]
    return (
        f"ID: {product.get('id')}\n"
        f"Nombre: {product.get('name')}\n"
        f"Descripción: {product.get('description', 'Sin descripción')}\n"
        f"Precio base: ${product.get('base_price')}\n"
        f"Estado: {product.get('status')}\n"
        f"Vendedor ID: {product.get('owner_id')}"
    )


@llm.tool
async def get_similar_products(product_id: int) -> str:
    """Encuentra productos similares al dado, por precio o nombre."""
    data = await trato.get("/products")
    items = data.get("data", data)
    if isinstance(items, dict):
        items = items.get("data", [items])

    current_raw = await trato.get(f"/products/{product_id}")
    current = current_raw.get("data", current_raw)
    if isinstance(current, dict) and "data" in current:
        current = current["data"]

    current_price = float(current.get("base_price", 0))
    current_name = str(current.get("name", "")).lower()

    similar = []
    for p in items:
        if p.get("id") == product_id:
            continue
        p_price = float(p.get("base_price", 0))
        p_name = str(p.get("name", "")).lower()
        price_similar = abs(p_price - current_price) / max(current_price, 1) < 0.5
        name_similar = any(w in p_name for w in current_name.split()[:3]) if current_name else False
        if price_similar or name_similar:
            similar.append(p)

    if not similar:
        return "No se encontraron productos similares."

    lines = ["=== PRODUCTOS SIMILARES ==="]
    for p in similar[:5]:
        lines.append(
            f"ID: {p.get('id')} | {p.get('name')} | ${p.get('base_price')} | {p.get('status')}"
        )
    return "\n".join(lines)
