const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const memoryDB = require('./config/memoryDB');
const bcrypt = require('bcryptjs');

dotenv.config();

// Connect to MongoDB
let dbConnected = false;
(async () => {
  dbConnected = await connectDB();
})();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint for login
app.post('/api/test/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Test login attempt:', { email, password });

    // Find user in memory DB
    const user = memoryDB.findUserByEmail(email);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    console.log('Stored password hash:', user.password);
    
    // Test password comparison
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (isMatch) {
      return res.json({ 
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      return res.status(400).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ message: 'Server error during test login' });
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sri Vasavi Jewels API Server is running!',
    dbStatus: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 SVJ Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}`);
});
