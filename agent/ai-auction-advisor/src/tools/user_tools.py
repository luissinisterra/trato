from mirascope import llm

from src.tools.client import trato


@llm.tool
async def get_user_rating(user_id: int) -> str:
    """Obtiene la calificación y perfil de un usuario."""
    data = await trato.get(f"/users/{user_id}/profile")
    profile = data.get("data", data)
    if isinstance(profile, dict) and "data" in profile:
        profile = profile["data"]
    if not profile or profile.get("id") is None:
        return "El usuario no tiene perfil público."
    return (
        f"Usuario ID: {user_id}\n"
        f"Calificación: {profile.get('rating', 'Sin calificación')}/5.0\n"
        f"Bio: {profile.get('bio', 'Sin descripción')}"
    )


@llm.tool
async def get_user_notifications(user_id: int) -> str:
    """Obtiene notificaciones recientes de un usuario."""
    data = await trato.get("/notifications?limit=15")
    items = data.get("data", data)
    if isinstance(items, dict):
        items = items.get("data", [items])
    if not items:
        return "No hay notificaciones recientes."
    recent = [n for n in items if str(n.get("user_id")) == str(user_id)][:10]
    if not recent:
        return "No hay notificaciones para este usuario."
    lines = ["=== NOTIFICACIONES RECIENTES ==="]
    for n in recent:
        lines.append(
            f"[{str(n.get('created_at', ''))[:19]}] "
            f"{n.get('type')}: {n.get('title')} - {n.get('message', '')[:80]}"
        )
    return "\n".join(lines)
