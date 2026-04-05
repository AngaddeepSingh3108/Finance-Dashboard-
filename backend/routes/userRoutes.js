const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getUsers, createUser, loginUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validate');

const userValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

router.route('/')
  .get(protect, authorize('Admin'), getUsers)
  .post(userValidation, validateRequest, createUser); 

router.route('/:id')
  .put(protect, authorize('Admin'), updateUser)
  .delete(protect, authorize('Admin'), deleteUser);

router.post('/login', loginUser);

module.exports = router;
