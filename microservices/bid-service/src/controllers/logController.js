const pool = require('../config/database');

// GET /bids/:bidId/logs
const getLogsByBid = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const bid = await pool.query('SELECT id FROM bids WHERE id = $1', [bidId]);
    if (!bid.rows.length) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    const { rows } = await pool.query(
      `SELECT * FROM bid_logs WHERE bid_id = $1 ORDER BY created_at ASC`,
      [bidId]
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

// GET /logs  — todos los logs (útil para auditoría)
const getAllLogs = async (req, res, next) => {
  try {
    const { action } = req.query;
    const values  = [];
    const filters = [];

    if (action) { values.push(action); filters.push(`action = $${values.length}`); }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT * FROM bid_logs ${where} ORDER BY created_at DESC`,
      values
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

module.exports = { getLogsByBid, getAllLogs };
