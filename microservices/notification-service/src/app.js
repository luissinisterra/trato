require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');
const { allowInternalOrSecret } = require('./middleware/auth');
const { initRabbitMQ, consumeNotificationEvents } = require('./services/rabbitmqService');
const { handleNotificationEvent } = require('./services/notificationProcessor');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));

app.post('/notify', allowInternalOrSecret, require('./controllers/notificationController').createEvent);
app.use('/notifications', notificationRoutes);

app.use(errorHandler);

const start = async () => {
  await connectDB();
  try {
    await initRabbitMQ();
    await consumeNotificationEvents(handleNotificationEvent);
  } catch (err) {
    console.warn('RabbitMQ initialization failed, continuing without queue:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Notification Service startup failed:', err);
  process.exit(1);
});
