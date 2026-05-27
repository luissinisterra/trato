const axios = require('axios');

const WORKER_URL = process.env.WORKER_URL || 'https://trato-notifications.luchoporst.workers.dev';
const NOTIFY_SECRET = process.env.NOTIFY_SECRET;

const sendNotification = async ({ userId, type: eventType, title, message, metadata = {} }) => {
  if (!NOTIFY_SECRET) {
    console.warn('NOTIFY_SECRET not configured, skipping notification');
    return;
  }

  const body = {
    eventType,
    userId,
    title,
    message,
    metadata,
  };

  if (metadata.auctionId) body.auctionId = metadata.auctionId;
  if (metadata.amount) body.amount = metadata.amount;

  try {
    await axios.post(
      `${WORKER_URL}/notify`,
      body,
      { headers: { 'x-notify-secret': NOTIFY_SECRET } },
    );
  } catch (err) {
    console.error('Failed to send notification via Worker:', err.message);
  }
};

module.exports = { sendNotification };
