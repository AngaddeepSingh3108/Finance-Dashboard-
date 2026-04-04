const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getUsers, createUser, loginUser, updateUserStatus, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validate');

const userValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role must be Viewer, Analyst, or Admin').optional().isIn(['Viewer', 'Analyst', 'Admin']),
];

router.route('/')
  .get(protect, authorize('Admin'), getUsers)
  .post(userValidation, validateRequest, createUser); 

router.route('/:id')
  .put(protect, authorize('Admin'), updateUserStatus)
  .delete(protect, authorize('Admin'), deleteUser);

router.post('/login', loginUser);

module.exports = router;
