/**
 * Cloudflare Worker — Notification Service
 *
 * Endpoints:
 *   GET  /health
 *   POST /notify   — recibe eventos de microservicios, valida y reenvía
 *
 * Flujo:
 *   Microservicio → Worker (validate) → Express notification-service → MongoDB
 *                                      → (opcional) Webhook externo (Discord, Slack)
 *
 * Env vars requeridas:
 *   NOTIFICATION_SERVICE_URL   — URL del Express notification-service (ej: http://localhost:3008)
 *   INTERNAL_API_KEY           — API key del Express service
 *
 * Env vars opcionales:
 *   NOTIFY_SECRET              — secreto para validar x-notify-secret
 *   NOTIFY_WEBHOOK_URL         — webhook externo (Discord, Slack, etc.)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ── Health ────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/health') {
      return json(
        { success: true, data: { status: 'ok', service: 'notification-worker' } },
        200,
      );
    }

    // ── Recibir evento de microservicio ───────────────
    if (request.method === 'POST' && (url.pathname === '/notify' || url.pathname === '/notifications/event')) {
      // Validar secreto interno
      const secret = request.headers.get('x-notify-secret');
      if (!secret || secret !== env.NOTIFY_SECRET) {
        return json({ success: false, message: 'Unauthorized' }, 401);
      }

      // Parsear body
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ success: false, message: 'Invalid JSON body' }, 400);
      }

      // Validar payload
      const validation = validateNotification(body);
      if (!validation.ok) {
        return json({ success: false, errors: validation.errors }, 400);
      }

      // Construir documento para el Express service
      const notification = {
        user_id: body.userId ?? null,
        type: body.eventType ?? body.type,
        title: buildTitle(body),
        message: buildMessage(body),
        metadata: body.metadata ?? {},
        read: false,
      };

      // ── Reenviar al Express notification-service ────
      const notifServiceUrl = env.NOTIFICATION_SERVICE_URL;
      const internalApiKey = env.INTERNAL_API_KEY;

      if (notifServiceUrl && internalApiKey) {
        ctx.waitUntil(
          fetch(`${notifServiceUrl}/notifications`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'x-api-key': internalApiKey,
            },
            body: JSON.stringify(notification),
          }).catch((err) => {
            console.error('notification_service_error', err.message);
          }),
        );
      } else {
        console.warn('NOTIFICATION_SERVICE_URL or INTERNAL_API_KEY not configured');
      }

      // ── Reenviar opcional a webhook externo ─────────
      const webhookUrl =
        env.NOTIFY_WEBHOOK_URL ||
        'https://webhook.site/8aa663b5-a2c5-49fb-8de5-ac46d9a4e955';

      if (webhookUrl) {
        ctx.waitUntil(
          fetch(webhookUrl, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(notification),
          }).catch((err) => {
            console.error('webhook_send_error', err.message);
          }),
        );
      }

      return json({ success: true, data: notification }, 202);
    }

    return json({ success: false, message: 'Not Found' }, 404);
  },
};

function validateNotification(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return {
      ok: false,
      errors: [{ field: 'body', message: 'Body is required' }],
    };
  }

  const eventType = payload.eventType || payload.type;

  if (!eventType || typeof eventType !== 'string') {
    errors.push({ field: 'eventType', message: 'eventType is required' });
  }

  if (!payload.userId) {
    errors.push({ field: 'userId', message: 'userId is required' });
  }

  if (eventType?.startsWith('BID_')) {
    if (!payload.auctionId) {
      errors.push({
        field: 'auctionId',
        message: 'auctionId is required for BID events',
      });
    }
  }

  if (eventType?.startsWith('AUCTION_')) {
    if (!payload.auctionId) {
      errors.push({
        field: 'auctionId',
        message: 'auctionId is required for AUCTION events',
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

function buildTitle(payload) {
  const type = payload.eventType || payload.type;
  switch (type) {
    case 'OUTBID':
      return 'Superaron tu puja';
    case 'WINNING':
      return 'Tu puja va ganando';
    case 'AUCTION_ENDING':
      return 'La subasta termina pronto';
    case 'AUCTION_WON':
      return 'Ganaste la subasta';
    case 'AUCTION_LOST':
      return 'Perdiste la subasta';
    case 'LOGIN_ALERT':
      return 'Nuevo inicio de sesión';
    case 'AUCTION_CREATED':
      return 'Subasta publicada';
    case 'BID_CREATED':
      return 'Nueva puja registrada';
    case 'BID_ACCEPTED':
      return 'Tu puja fue aceptada';
    case 'BID_REJECTED':
      return 'Tu puja fue rechazada';
    case 'AUCTION_STARTED':
      return 'Subasta iniciada';
    case 'AUCTION_CLOSED':
      return 'Subasta cerrada';
    default:
      return 'Nueva notificación';
  }
}

function buildMessage(payload) {
  const type = payload.eventType || payload.type;
  const amount = payload.amount != null ? ` por $${payload.amount}` : '';
  const auctionId = payload.auctionId || '';

  switch (type) {
    case 'OUTBID':
      return `Alguien ofertó${amount} y superó tu puja en la subasta #${auctionId}.`;
    case 'WINNING':
      return `Tu puja${amount} va ganando en la subasta #${auctionId}.`;
    case 'AUCTION_ENDING':
      return `La subasta #${auctionId} termina pronto.`;
    case 'AUCTION_WON':
      return `Ganaste la subasta #${auctionId}${amount}.`;
    case 'AUCTION_LOST':
      return `Perdiste la subasta #${auctionId}.`;
    case 'LOGIN_ALERT':
      return 'Se detectó un nuevo inicio de sesión en tu cuenta.';
    case 'AUCTION_CREATED':
      return `Tu subasta #${auctionId} fue publicada exitosamente.`;
    case 'BID_CREATED':
      return `Se registró una puja${amount} en la subasta #${auctionId}.`;
    case 'BID_ACCEPTED':
      return `Tu puja${amount} fue aceptada en la subasta #${auctionId}.`;
    case 'BID_REJECTED':
      return `Tu puja${amount} fue rechazada en la subasta #${auctionId}.`;
    case 'AUCTION_STARTED':
      return `La subasta #${auctionId} ha comenzado.`;
    case 'AUCTION_CLOSED':
      return `La subasta #${auctionId} ha finalizado.`;
    default:
      return `Evento ${type} procesado correctamente.`;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}
