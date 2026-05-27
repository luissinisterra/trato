const router  = require('express').Router();
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const {
  getAllBids, getBidById, createBid,
  updateBidAmount, updateBidStatus, deleteBid,
} = require('../controllers/bidController');
const { getLogsByBid } = require('../controllers/logController');

const STATUSES = ['pending', 'accepted', 'rejected', 'cancelled'];

router.get('/',
  query('auction_id').optional().isInt(),
  query('user_id').optional().isInt(),
  query('status').optional().isIn(STATUSES),
  validate,
  getAllBids
);

router.get('/:id',
  param('id').isInt(),
  validate,
  getBidById
);

router.post('/',
  body('auction_id').isInt({ min: 1 }).withMessage('auction_id is required'),
  body('user_id').isInt({ min: 1 }).withMessage('user_id is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('amount must be greater than 0'),
  validate,
  createBid
);

router.put('/:id/amount',
  param('id').isInt(),
  body('amount').isFloat({ min: 0.01 }).withMessage('amount must be greater than 0'),
  validate,
  updateBidAmount
);

router.patch('/:id/status',
  param('id').isInt(),
  body('status').isIn(STATUSES).withMessage(`status must be one of: ${STATUSES.join(', ')}`),
  validate,
  updateBidStatus
);

router.delete('/:id',
  param('id').isInt(),
  validate,
  deleteBid
);

// Logs anidados bajo bid
router.get('/:bidId/logs',
  param('bidId').isInt(),
  validate,
  getLogsByBid
);

module.exports = router;
