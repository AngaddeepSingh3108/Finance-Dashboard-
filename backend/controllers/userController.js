const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Admin only
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Register a new user (pending approval)
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'Viewer',
      status: 'Pending',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        pending: true,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.status === 'Pending') {
        return res.status(403).json({ message: 'Your account is pending admin approval. Please wait for an administrator to approve your access.' });
      }
      if (user.status === 'Inactive') {
        return res.status(403).json({ message: 'Your account has been deactivated. Please contact an administrator.' });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user status and/or role (admin approval flow)
// @route   PUT /api/users/:id
// @access  Admin only
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (req.body.status) user.status = req.body.status;
      if (req.body.role) user.role = req.body.role;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
};
