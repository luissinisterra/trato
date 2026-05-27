const Notification = require('../models/Notification');

function buildTitle(payload) {
  const type = payload.eventType || payload.type;
  const map = {
    OUTBID: 'Superaron tu puja',
    WINNING: 'Tu puja va ganando',
    AUCTION_ENDING: 'La subasta termina pronto',
    AUCTION_WON: 'Ganaste la subasta',
    AUCTION_LOST: 'Perdiste la subasta',
    LOGIN_ALERT: 'Nuevo inicio de sesión',
    AUCTION_CREATED: 'Subasta publicada',
    BID_CREATED: 'Nueva puja registrada',
    BID_ACCEPTED: 'Tu puja fue aceptada',
    BID_REJECTED: 'Tu puja fue rechazada',
    AUCTION_STARTED: 'Subasta iniciada',
    AUCTION_CLOSED: 'Subasta cerrada',
  };
  return map[type] || payload.title || 'Nueva notificación';
}

function buildMessage(payload) {
  const type = payload.eventType || payload.type;
  const amount = payload.amount != null ? ` por $${payload.amount}` : '';
  const auctionId = payload.auctionId || '';
  const map = {
    OUTBID: `Alguien ofertó${amount} y superó tu puja en la subasta #${auctionId}.`,
    WINNING: `Tu puja${amount} va ganando en la subasta #${auctionId}.`,
    AUCTION_ENDING: `La subasta #${auctionId} termina pronto.`,
    AUCTION_WON: `Ganaste la subasta #${auctionId}${amount}.`,
    AUCTION_LOST: `Perdiste la subasta #${auctionId}.`,
    LOGIN_ALERT: 'Se detectó un nuevo inicio de sesión en tu cuenta.',
    AUCTION_CREATED: `Tu subasta #${auctionId} fue publicada exitosamente.`,
    BID_CREATED: `Se registró una puja${amount} en la subasta #${auctionId}.`,
    BID_ACCEPTED: `Tu puja${amount} fue aceptada en la subasta #${auctionId}.`,
    BID_REJECTED: `Tu puja${amount} fue rechazada en la subasta #${auctionId}.`,
    AUCTION_STARTED: `La subasta #${auctionId} ha comenzado.`,
    AUCTION_CLOSED: `La subasta #${auctionId} ha finalizado.`,
  };
  return map[type] || payload.message || `Evento ${type} procesado correctamente.`;
}

const createNotificationFromEvent = async (payload) => {
  const type = payload.eventType || payload.type;
  const notification = await Notification.create({
    user_id: String(payload.userId ?? payload.user_id ?? ''),
    type,
    title: payload.title || buildTitle(payload),
    message: payload.message || buildMessage(payload),
    metadata: {
      ...(payload.metadata || {}),
      ...(payload.auctionId ? { auctionId: payload.auctionId } : {}),
      ...(payload.amount != null ? { amount: payload.amount } : {}),
    },
  });
  return notification;
};

const handleNotificationEvent = async (payload) => {
  await createNotificationFromEvent(payload);
};

module.exports = { createNotificationFromEvent, handleNotificationEvent, buildTitle, buildMessage };
