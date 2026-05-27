from mirascope import llm
from mirascope.llm.content import Text
from mirascope.llm.messages import UserMessage

from src.agent.prompts import SYSTEM_PROMPT
from src.tools.auction_tools import get_active_auctions, get_auction, get_auction_events
from src.tools.bid_tools import (
    analyze_competition,
    estimate_fair_price,
    get_auction_bids,
    get_user_bid_history,
)
from src.tools.product_tools import get_product, get_similar_products
from src.tools.user_tools import get_user_notifications, get_user_rating

TOOLS = [
    get_auction,
    get_auction_bids,
    get_active_auctions,
    get_product,
    get_user_rating,
    analyze_competition,
    estimate_fair_price,
    get_similar_products,
    get_user_bid_history,
    get_user_notifications,
    get_auction_events,
]


async def process_chat(
    query: str,
    history: list[dict],
    model_id: str,
) -> tuple[str, list[dict]]:
    toolkit = llm.AsyncToolkit(tools=TOOLS)
    model = llm.Model(model_id)

    history_context = ""
    for msg in history:
        role = "Usuario" if msg["role"] == "user" else "Asistente"
        history_context += f"{role}: {msg['content']}\n"
    if history_context:
        history_context = "Historial de la conversación:\n" + history_context

    content = f"{SYSTEM_PROMPT}\n\n{history_context}" if history_context else SYSTEM_PROMPT
    messages = [
        UserMessage(content=[Text(text=content)]),
        UserMessage(content=[Text(text=query)]),
    ]

    try:
        response = await model.call_async(messages, tools=toolkit)
    except Exception as e:
        error_msg = f"Error al contactar el modelo de IA: {e}"
        return error_msg, history + [
            {"role": "user", "content": query},
            {"role": "assistant", "content": error_msg},
        ]

    max_iterations = 10
    iteration = 0
    while response.tool_calls:
        iteration += 1
        if iteration > max_iterations:
            response.text = "⚠️ Demasiadas iteraciones de herramientas. Por favor simplifica tu pregunta."
            break
        try:
            tool_outputs = await response.execute_tools()
            output_texts = [str(t.output) for t in tool_outputs]
            response = await model.call_async(
                response.messages + [
                    UserMessage(content=[Text(text="Resultados de herramientas:\n" + "\n".join(output_texts))])
                ],
                tools=toolkit,
            )
        except Exception as e:
            error_msg = f"Error ejecutando herramientas: {e}"
            return error_msg, history + [
                {"role": "user", "content": query},
                {"role": "assistant", "content": error_msg},
            ]

    updated_history = list(history)
    updated_history.append({"role": "user", "content": query})
    updated_history.append({"role": "assistant", "content": response.text})

    return response.text, updated_history
