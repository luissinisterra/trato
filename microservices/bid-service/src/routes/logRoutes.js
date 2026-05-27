const router = require('express').Router();
const { query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { getAllLogs } = require('../controllers/logController');

const ACTIONS = ['created', 'updated', 'accepted', 'rejected', 'cancelled'];

router.get('/',
  query('action').optional().isIn(ACTIONS),
  validate,
  getAllLogs
);

module.exports = router;
