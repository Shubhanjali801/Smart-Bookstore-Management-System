const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Check if Authorization header exists and starts with Bearer
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from decoded token ID
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found, token invalid' });
    }

    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error.message);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = protect;