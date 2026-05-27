const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE || 'notification_events';

let connection;
let channel;

const initRabbitMQ = async () => {
  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(RABBITMQ_QUEUE, { durable: true });
  channel.prefetch(1);
  console.log(`RabbitMQ connected to ${RABBITMQ_URL}, queue=${RABBITMQ_QUEUE}`);
};

const publishNotificationEvent = async (payload) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }

  const message = Buffer.from(JSON.stringify(payload));
  const ok = channel.sendToQueue(RABBITMQ_QUEUE, message, { persistent: true });
  if (!ok) {
    throw new Error('Failed to enqueue notification event');
  }
};

const consumeNotificationEvents = async (handler) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }

  await channel.consume(
    RABBITMQ_QUEUE,
    async (msg) => {
      if (!msg) return;
      let payload;
      try {
        payload = JSON.parse(msg.content.toString());
      } catch (err) {
        console.error('RabbitMQ invalid JSON payload:', err.message);
        channel.nack(msg, false, false);
        return;
      }

      try {
        await handler(payload);
        channel.ack(msg);
      } catch (err) {
        console.error('RabbitMQ notification handler failed:', err.message);
        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
};

module.exports = { initRabbitMQ, publishNotificationEvent, consumeNotificationEvents };
