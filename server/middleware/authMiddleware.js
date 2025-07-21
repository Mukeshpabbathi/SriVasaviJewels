const jwt = require('jsonwebtoken');
const User = require('../models/User');
const memoryDB = require('../config/memoryDB');

// Global variable to track if we're using MongoDB or in-memory DB
let usingMongoDB = true;

// Check if MongoDB is available
const checkMongoDBAvailability = async () => {
  try {
    await User.findOne();
    usingMongoDB = true;
    return true;
  } catch (err) {
    usingMongoDB = false;
    console.log('⚠️ MongoDB not available, using in-memory database in middleware');
    return false;
  }
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Check MongoDB availability
      await checkMongoDBAvailability();
      
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      if (usingMongoDB) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const user = memoryDB.findUserById(decoded.id);
        if (user) {
          // Create a copy without the password
          req.user = { ...user, id: user.id };
          delete req.user.password;
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };
