const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticateUser, allowInternalOrSecret } = require('../middleware/auth');
const {
  createNotification,
  createEvent,
  getNotifications,
  getUnreadCount,
  markAsRead,
} = require('../controllers/notificationController');

const router = Router();

router.post(
  '/',
  allowInternalOrSecret,
  [
    body('user_id').notEmpty().withMessage('user_id is required'),
    body('type').isIn([
      'OUTBID', 'WINNING', 'AUCTION_ENDING', 'AUCTION_WON', 'AUCTION_LOST',
      'LOGIN_ALERT', 'AUCTION_CREATED', 'BID_CREATED', 'BID_ACCEPTED',
      'BID_REJECTED', 'AUCTION_STARTED', 'AUCTION_CLOSED',
    ]).withMessage('Invalid notification type'),
    body('title').notEmpty().withMessage('title is required'),
    body('message').notEmpty().withMessage('message is required'),
  ],
  validate,
  createNotification
);

router.post(
  '/event',
  allowInternalOrSecret,
  [
    body('eventType').notEmpty().withMessage('eventType is required'),
    body('userId').notEmpty().withMessage('userId is required'),
  ],
  validate,
  createEvent
);

// Endpoint compatible con Cloudflare Worker (/notify) para desarrollo local
router.post(
  '/notify',
  allowInternalOrSecret,
  [
    body('eventType').notEmpty().withMessage('eventType is required'),
    body('userId').notEmpty().withMessage('userId is required'),
  ],
  validate,
  createEvent
);

router.get('/', authenticateUser, getNotifications);

router.get('/unread-count', authenticateUser, getUnreadCount);

router.patch(
  '/:id/read',
  authenticateUser,
  [param('id').notEmpty().withMessage('id is required')],
  validate,
  markAsRead
);

module.exports = router;
