const pool = require('../config/database');

// ── Helpers ───────────────────────────────────────────────

const insertLog = async (client, { bid_id, action, previous_amount, new_amount }) => {
  await client.query(
    `INSERT INTO bid_logs (bid_id, action, previous_amount, new_amount)
     VALUES ($1, $2, $3, $4)`,
    [bid_id, action, previous_amount ?? null, new_amount]
  );
};

// ── Controllers ───────────────────────────────────────────

// GET /bids  (opcionalmente filtrar por auction_id o user_id)
const getAllBids = async (req, res, next) => {
  try {
    const { auction_id, user_id, status } = req.query;
    const filters = [];
    const values  = [];

    if (auction_id) { values.push(auction_id); filters.push(`auction_id = $${values.length}`); }
    if (user_id)    { values.push(user_id);    filters.push(`user_id = $${values.length}`); }
    if (status)     { values.push(status);     filters.push(`status = $${values.length}`); }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT * FROM bids ${where} ORDER BY created_at DESC`,
      values
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

// GET /bids/:id
const getBidById = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bids WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Bid not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

// POST /bids  — crea bid y registra log automáticamente
const createBid = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { auction_id, user_id, amount } = req.body;
    const { rows } = await client.query(
      `INSERT INTO bids (auction_id, user_id, amount)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [auction_id, user_id, amount]
    );
    const bid = rows[0];

    await insertLog(client, {
      bid_id: bid.id,
      action: 'created',
      previous_amount: null,
      new_amount: bid.amount,
    });

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: bid });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// PUT /bids/:id/amount  — actualiza monto (solo si está en pending)
const updateBidAmount = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { amount } = req.body;

    const current = await client.query('SELECT * FROM bids WHERE id = $1', [id]);
    if (!current.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    const bid = current.rows[0];
    if (bid.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: `Cannot update amount of a bid with status "${bid.status}"`,
      });
    }

    const { rows } = await client.query(
      `UPDATE bids SET amount = $1 WHERE id = $2 RETURNING *`,
      [amount, id]
    );

    await insertLog(client, {
      bid_id: id,
      action: 'updated',
      previous_amount: bid.amount,
      new_amount: amount,
    });

    await client.query('COMMIT');
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// PATCH /bids/:id/status  — cambia status con log automático
const updateBidStatus = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { status } = req.body;

    const VALID_TRANSITIONS = {
      pending:   ['accepted', 'rejected', 'cancelled'],
      accepted:  ['cancelled'],
      rejected:  [],
      cancelled: [],
    };

    const current = await client.query('SELECT * FROM bids WHERE id = $1', [id]);
    if (!current.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    const bid = current.rows[0];
    if (!VALID_TRANSITIONS[bid.status].includes(status)) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: `Cannot transition from "${bid.status}" to "${status}"`,
      });
    }

    const { rows } = await client.query(
      `UPDATE bids SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    await insertLog(client, {
      bid_id: id,
      action: status,          // action coincide con el nuevo status
      previous_amount: bid.amount,
      new_amount: bid.amount,
    });

    await client.query('COMMIT');
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// DELETE /bids/:id  — solo permite borrar bids cancelados o rechazados
const deleteBid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await pool.query('SELECT status FROM bids WHERE id = $1', [id]);
    if (!current.rows.length) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }
    if (!['cancelled', 'rejected'].includes(current.rows[0].status)) {
      return res.status(409).json({
        success: false,
        message: 'Only cancelled or rejected bids can be deleted',
      });
    }
    await pool.query('DELETE FROM bids WHERE id = $1', [id]);
    res.json({ success: true, message: 'Bid deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAllBids, getBidById, createBid, updateBidAmount, updateBidStatus, deleteBid };
