const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getUsers, createUser, loginUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validate');

const userValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('role', 'Role must be Viewer, Analyst, or Admin').optional().isIn(['Viewer', 'Analyst', 'Admin']),
];

router.route('/')
  .get(protect, authorize('Admin'), getUsers)
  .post(userValidation, validateRequest, createUser); 

router.post('/login', loginUser);

module.exports = router;
