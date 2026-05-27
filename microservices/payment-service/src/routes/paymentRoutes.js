const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');

// Validation rules
const createPaymentValidation = [
  body('auction_id').isInt({ min: 1 }).withMessage('auction_id must be a positive integer'),
  body('user_id').isInt({ min: 1 }).withMessage('user_id must be a positive integer'),
  body('amount').isFloat({ min: 0.01 }).withMessage('amount must be greater than 0'),
  body('payment_method').isIn(['credit_card', 'debit_card', 'bank_transfer', 'paypal'])
    .withMessage('Invalid payment_method'),
];

const updatePaymentValidation = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
  body('status').isIn(['pending', 'completed', 'failed', 'cancelled'])
    .withMessage('Invalid status'),
];

const paymentIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
];

const auctionIdValidation = [
  param('auctionId').isInt({ min: 1 }).withMessage('auctionId must be a positive integer'),
];

// Routes

// Create payment (protected)
router.post(
  '/payments',
  authMiddleware,
  createPaymentValidation,
  validate,
  async (req, res, next) => {
    try {
      const payment = await paymentController.createPayment(req.body, req.user.sub || req.user.id);
      res.status(201).json({
        success: true,
        data: payment,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get payment by ID (protected)
router.get(
  '/payments/:id',
  authMiddleware,
  paymentIdValidation,
  validate,
  async (req, res, next) => {
    try {
      const payment = await paymentController.getPaymentById(
        req.params.id,
        req.user.sub || req.user.id
      );
      res.json({
        success: true,
        data: payment,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get payments by auction ID
router.get(
  '/payments/auction/:auctionId',
  auctionIdValidation,
  validate,
  async (req, res, next) => {
    try {
      const payments = await paymentController.getPaymentsByAuction(req.params.auctionId);
      res.json({
        success: true,
        data: payments,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Update payment status (protected)
router.put(
  '/payments/:id',
  authMiddleware,
  updatePaymentValidation,
  validate,
  async (req, res, next) => {
    try {
      const payment = await paymentController.updatePaymentStatus(
        req.params.id,
        req.body.status,
        req.user.sub || req.user.id
      );
      res.json({
        success: true,
        data: payment,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get payment logs (protected)
router.get(
  '/payments/:id/logs',
  authMiddleware,
  paymentIdValidation,
  validate,
  async (req, res, next) => {
    try {
      const logs = await paymentController.getPaymentLogs(req.params.id);
      res.json({
        success: true,
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
