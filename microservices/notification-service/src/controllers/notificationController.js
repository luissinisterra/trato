const Notification = require('../models/Notification');
const { publishNotificationEvent } = require('../services/rabbitmqService');
const { createNotificationFromEvent } = require('../services/notificationProcessor');

const createNotification = async (req, res, next) => {
  try {
    const { user_id, type, title, message, metadata } = req.body;

    const notification = await Notification.create({
      user_id,
      type,
      title,
      message,
      metadata: metadata || {},
    });

    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.sub || req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not found' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ user_id: userId })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ user_id: userId }),
    ]);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.sub || req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not found' });
    }

    const count = await Notification.countDocuments({ user_id: userId, read: false });

    res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.sub || req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not found' });
    }

    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user_id: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// ── Event relay (local Worker replacement) ───────────────────────────────
// Acepta el mismo formato que el Cloudflare Worker (eventType, userId, title, message, metadata)
// para que microservicios puedan llamar directo en desarrollo local.
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

const createEvent = async (req, res, next) => {
  try {
    const { eventType, userId, title, message, metadata, auctionId, amount } = req.body;
    const type = eventType || req.body.type;
    const eventPayload = {
      eventType: type,
      userId,
      title,
      message,
      metadata,
      auctionId,
      amount,
    };

    try {
      await publishNotificationEvent(eventPayload);
      return res.status(202).json({ success: true, data: eventPayload, message: 'Notification event queued' });
    } catch (publishErr) {
      console.warn('RabbitMQ unavailable, saving notification directly:', publishErr.message);
      const fallbackNotification = await createNotificationFromEvent(eventPayload);
      return res.status(201).json({ success: true, data: fallbackNotification, fallback: true });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { createNotification, createEvent, getNotifications, getUnreadCount, markAsRead };
