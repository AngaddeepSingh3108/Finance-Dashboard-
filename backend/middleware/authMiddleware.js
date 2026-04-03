const User = require('../models/User');

const protect = async (req, res, next) => {
  let userId = req.headers['x-user-id'];

  if (userId) {
    try {
      req.user = await User.findById(userId);
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, invalid token/ID format' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no x-user-id header provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
