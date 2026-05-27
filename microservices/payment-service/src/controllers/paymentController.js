const axios = require('axios');
const pool = require('../config/database');

class PaymentService {
  async createPayment(paymentData, userId) {
    const client = await pool.connect();
    try {
      // Validate auction exists via HTTP call
      const auctionUrl = `${process.env.AUCTIONS_SERVICE_URL}/auctions/${paymentData.auction_id}`;
      try {
        await axios.get(auctionUrl, {
          timeout: 5000,
        });
      } catch (err) {
        throw {
          statusCode: 400,
          message: `Auction with id ${paymentData.auction_id} not found`,
        };
      }

      // Verify user_id matches (only buyer can create payment)
      if (paymentData.user_id !== userId) {
        throw {
          statusCode: 403,
          message: 'You can only create payments for yourself',
        };
      }

      // Begin transaction
      await client.query('BEGIN');

      // Insert payment
      const paymentResult = await client.query(
        `INSERT INTO payments (auction_id, user_id, amount, payment_method, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          paymentData.auction_id,
          paymentData.user_id,
          paymentData.amount,
          paymentData.payment_method,
          'pending',
        ]
      );

      // Commit transaction
      await client.query('COMMIT');

      return paymentResult.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getPaymentById(paymentId, userId) {
    const result = await pool.query(
      `SELECT * FROM payments WHERE id = $1 AND user_id = $2`,
      [paymentId, userId]
    );

    if (result.rows.length === 0) {
      throw {
        statusCode: 404,
        message: `Payment with id ${paymentId} not found`,
      };
    }

    return result.rows[0];
  }

  async getPaymentsByAuction(auctionId) {
    const result = await pool.query(
      `SELECT * FROM payments WHERE auction_id = $1 ORDER BY created_at DESC`,
      [auctionId]
    );

    return result.rows;
  }

  async updatePaymentStatus(paymentId, newStatus, userId) {
    const client = await pool.connect();
    try {
      // Verify payment belongs to user
      const paymentResult = await client.query(
        `SELECT * FROM payments WHERE id = $1`,
        [paymentId]
      );

      if (paymentResult.rows.length === 0) {
        throw {
          statusCode: 404,
          message: `Payment with id ${paymentId} not found`,
        };
      }

      const payment = paymentResult.rows[0];
      if (payment.user_id !== userId) {
        throw {
          statusCode: 403,
          message: 'You can only update your own payments',
        };
      }

      // Begin transaction
      await client.query('BEGIN');

      // Update payment status (trigger will log the change)
      const updateResult = await client.query(
        `UPDATE payments SET status = $1, paid_at = CASE WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP ELSE paid_at END
         WHERE id = $2
         RETURNING *`,
        [newStatus, paymentId]
      );

      // Commit transaction
      await client.query('COMMIT');

      return updateResult.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getPaymentLogs(paymentId) {
    const result = await pool.query(
      `SELECT * FROM payment_logs WHERE payment_id = $1 ORDER BY created_at DESC`,
      [paymentId]
    );

    return result.rows;
  }
}

module.exports = new PaymentService();
