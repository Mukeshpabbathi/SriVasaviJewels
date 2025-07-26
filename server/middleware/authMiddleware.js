const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Protect routes - Authentication middleware
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, user not found' 
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({ 
          success: false,
          message: 'Account is deactivated' 
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, invalid token' 
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, token expired' 
        });
      }
      
      res.status(401).json({ 
        success: false,
        message: 'Not authorized, token failed' 
      });
    }
  } else {
    res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided' 
    });
  }
};

// @desc    Admin middleware - Check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

// @desc    Customer middleware - Check if user is customer or admin
const customer = (req, res, next) => {
  if (req.user && (req.user.role === 'customer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Access denied. Customer privileges required.' 
    });
  }
};

// @desc    Optional auth - Don't fail if no token, but set user if valid token
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Don't fail, just continue without user
      req.user = null;
    }
  }
  
  next();
};

module.exports = { protect, admin, customer, optionalAuth };
