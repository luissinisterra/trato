const { Pool } = require('pg');

const sslEnabled = String(process.env.DB_SSL || '').toLowerCase() === 'true';
const sslRejectUnauthorized =
  String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'false').toLowerCase() === 'true';

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'user_service_db',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '1234',
  ssl: sslEnabled ? { rejectUnauthorized: sslRejectUnauthorized } : undefined,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected DB error:', err);
  process.exit(-1);
});

module.exports = pool;
