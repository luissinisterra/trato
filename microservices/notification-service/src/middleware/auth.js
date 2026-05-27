const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const NOTIFY_SECRET = process.env.NOTIFY_SECRET;

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  const token = authHeader.substring(7);
  try {
    const { data } = await axios.post(
      `${AUTH_SERVICE_URL}/auth/validate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    req.user = data.user ?? data;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

const requireInternalApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== INTERNAL_API_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

const allowInternalOrSecret = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const notifySecret = req.headers['x-notify-secret'];
  if (apiKey && apiKey === INTERNAL_API_KEY) return next();
  if (NOTIFY_SECRET && notifySecret && notifySecret === NOTIFY_SECRET) return next();
  return res.status(401).json({ success: false, message: 'Unauthorized' });
};

module.exports = { authenticateUser, requireInternalApiKey, allowInternalOrSecret };
