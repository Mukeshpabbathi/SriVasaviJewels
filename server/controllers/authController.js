const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const memoryDB = require('../config/memoryDB');

// Global variable to track if we're using MongoDB or in-memory DB
let usingMongoDB = true;

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Check if MongoDB is available
const checkMongoDBAvailability = async () => {
  try {
    await User.findOne();
    usingMongoDB = true;
    return true;
  } catch (err) {
    usingMongoDB = false;
    console.log('⚠️ MongoDB not available, using in-memory database');
    return false;
  }
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    await checkMongoDBAvailability();
    
    const { name, email, password } = req.body;
    console.log('Signup attempt:', { name, email });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    let userExists;
    
    if (usingMongoDB) {
      userExists = await User.findOne({ email });
    } else {
      userExists = memoryDB.findUserByEmail(email);
    }
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    let role = 'customer';
    
    if (usingMongoDB) {
      // Check if this is the first user (make them admin)
      const userCount = await User.countDocuments();
      role = userCount === 0 ? 'admin' : 'customer';

      // Create user
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
    } else {
      // For in-memory DB, check if this is the first user
      role = memoryDB.getAllUsers().length === 0 ? 'admin' : 'customer';
      
      // Create user in memory DB
      user = memoryDB.createUser({
        name,
        email,
        password: hashedPassword,
        role,
      });
    }

    if (user) {
      const token = generateToken(user._id || user.id);
      
      res.status(201).json({
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    await checkMongoDBAvailability();
    
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    // Validation
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email
    let user;
    
    if (usingMongoDB) {
      console.log('Using MongoDB to find user');
      user = await User.findOne({ email });
    } else {
      console.log('Using in-memory DB to find user');
      user = memoryDB.findUserByEmail(email);
      console.log('In-memory user found:', user ? 'Yes' : 'No');
      if (user) {
        console.log('User details:', { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role,
          passwordHash: user.password.substring(0, 10) + '...'
        });
      }
    }

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    console.log('Comparing password...');
    console.log('Input password:', password);
    console.log('Stored hash:', user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    console.log('Login successful');
    
    // Generate token
    const token = generateToken(user._id || user.id);
    
    // Return user data and token
    res.json({
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    await checkMongoDBAvailability();
    
    let user;
    
    if (usingMongoDB) {
      user = await User.findById(req.user.id).select('-password');
    } else {
      const foundUser = memoryDB.findUserById(req.user.id);
      if (foundUser) {
        // Create a copy without the password
        user = { ...foundUser };
        delete user.password;
      }
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error getting profile' });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
};
