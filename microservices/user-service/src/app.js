require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const userRoutes    = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const errorHandler  = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares ───────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'user-service' }));

app.use('/users',                   userRoutes);
app.use('/users/:userId/profile',   profileRoutes);

// ── Error handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 User Service running on port ${PORT}`);
});
