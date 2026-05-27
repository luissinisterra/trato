require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));

app.use('/notifications', notificationRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
