const router = require('express').Router({ mergeParams: true });
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} = require('../controllers/profileController');

const profileValidation = [
  body('avatar_url').optional().isURL().withMessage('avatar_url must be a valid URL'),
  body('bio').optional().trim(),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
];

const userIdParam = param('userId').isInt().withMessage('userId must be an integer');

router.get('/',    userIdParam, validate, getProfile);
router.post('/',  [userIdParam, ...profileValidation], validate, createProfile);
router.put('/',   [userIdParam, ...profileValidation], validate, updateProfile);
router.delete('/', userIdParam, validate, deleteProfile);

module.exports = router;
