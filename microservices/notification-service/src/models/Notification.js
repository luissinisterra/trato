const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'OUTBID',
        'WINNING',
        'AUCTION_ENDING',
        'AUCTION_WON',
        'AUCTION_LOST',
        'LOGIN_ALERT',
        'AUCTION_CREATED',
        'BID_CREATED',
        'BID_ACCEPTED',
        'BID_REJECTED',
        'AUCTION_STARTED',
        'AUCTION_CLOSED',
      ],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

notificationSchema.index({ user_id: 1, read: 1 });
notificationSchema.index({ user_id: 1, created_at: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
