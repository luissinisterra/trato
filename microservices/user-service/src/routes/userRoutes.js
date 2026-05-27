const router = require('express').Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const userValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('phone').optional().trim(),
];

const requiredUserValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim(),
];

router.get('/',        getAllUsers);
router.get('/:id',    param('id').isInt(), validate, getUserById);
router.post('/',      requiredUserValidation, validate, createUser);
router.put('/:id',   [param('id').isInt(), ...userValidation], validate, updateUser);
router.delete('/:id', param('id').isInt(), validate, deleteUser);

module.exports = router;
