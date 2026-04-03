const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Public (for now)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      role: role || 'Viewer',
    });

    if (user) {
      res.status(201).json(user);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
};
