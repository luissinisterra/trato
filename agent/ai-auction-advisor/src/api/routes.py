import uuid
from datetime import datetime

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy import select

from src.agent.orchestrator import process_chat
from src.config import settings
from src.db import AsyncSessionLocal, Conversation, Message

router = APIRouter()


class ChatRequest(BaseModel):
    query: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    success: bool
    data: dict


def _extract_text(msg: dict) -> str:
    return msg.get("content", "")


@router.post("/chat")
async def chat(
    body: ChatRequest,
    x_user_id: str | None = Header(None),
):
    if not body.query.strip():
        raise HTTPException(status_code=400, detail="query is required")

    user_id = int(x_user_id) if x_user_id else 0
    session_id = body.session_id or str(uuid.uuid4())

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Conversation).where(Conversation.session_id == session_id)
        )
        conv = result.scalar_one_or_none()

        if conv:
            msg_result = await db.execute(
                select(Message)
                .where(Message.conversation_id == conv.id)
                .order_by(Message.created_at)
            )
            db_messages = msg_result.scalars().all()
            history = [
                {"role": m.role, "content": m.content or ""}
                for m in db_messages
            ]
        else:
            conv = Conversation(user_id=user_id, session_id=session_id)
            db.add(conv)
            await db.commit()
            await db.refresh(conv)
            history = []

        response_text, updated_history = await process_chat(
            query=body.query,
            history=history,
            model_id=settings.gemini_model,
        )

        user_msg = Message(
            conversation_id=conv.id,
            role="user",
            content=body.query,
        )
        db.add(user_msg)

        assistant_msg = Message(
            conversation_id=conv.id,
            role="assistant",
            content=response_text,
        )
        db.add(assistant_msg)

        conv.updated_at = datetime.utcnow()
        await db.commit()

    return ChatResponse(
        success=True,
        data={
            "response": response_text,
            "session_id": session_id,
        },
    ).model_dump()


@router.get("/health")
async def health():
    return {"status": "ok", "service": "ai-auction-advisor"}
