const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

dotenv.config();

// Initialize database
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set default data
db.defaults({ users: [] }).write();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Auth middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = db.get('users').find({ _id: decoded.id }).value();
      
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
      next();
    } catch (error) {
      console.error('Auth error:', error);
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

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sri Vasavi Jewels API Server is running!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const userExists = db.get('users').find({ email }).value();
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if this is the first user (make them admin)
    const userCount = db.get('users').size().value();
    const role = userCount === 0 ? 'admin' : 'customer';

    // Create user
    const newUser = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    db.get('users').push(newUser).write();

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = db.get('users').find({ email }).value();

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get profile
app.get('/api/auth/profile', protect, (req, res) => {
  res.json(req.user);
});

// Get all users (Admin only)
app.get('/api/admin/users', protect, admin, (req, res) => {
  try {
    const users = db.get('users').map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }).value();
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error getting users' });
  }
});

// Get dashboard stats (Admin only)
app.get('/api/admin/stats', protect, admin, (req, res) => {
  try {
    const users = db.get('users').value();
    const totalUsers = users.length;
    const totalCustomers = users.filter(user => user.role === 'customer').length;
    const totalAdmins = users.filter(user => user.role === 'admin').length;

    const stats = {
      totalUsers,
      totalCustomers,
      totalAdmins,
      totalProducts: 12, // Mock
      totalOrders: 45,   // Mock
      revenue: 125000    // Mock
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error getting stats' });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 SVJ Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔧 Backend API: http://localhost:${PORT}`);
  console.log(`✅ Database: Local JSON file`);
});
