require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const bidRoutes  = require('./routes/bidRoutes');
const logRoutes  = require('./routes/logRoutes');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3002;

// ── Middlewares ───────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'bid-service' }));

app.use('/bids', bidRoutes);
app.use('/logs', logRoutes);

// ── Error handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Bid Service running on port ${PORT}`);
});
