const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Simple file storage
const usersFile = path.join(__dirname, 'users.json');

// Initialize users file
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}

const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

const generateToken = (id) => {
  return jwt.sign({ id }, 'svj_secret_key_2025', { expiresIn: '30d' });
};

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SVJ Server is running!', status: 'OK' });
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('Signup request:', req.body);
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const users = readUsers();
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // First user is admin
    const role = users.length === 0 ? 'admin' : 'customer';

    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    console.log('User created:', { name, email, role });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id)
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful:', { email, role: user.role });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get users (admin)
app.get('/api/admin/users', (req, res) => {
  try {
    const users = readUsers().map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 SVJ Server running on http://localhost:${PORT}`);
  console.log(`📱 Test: curl http://localhost:${PORT}`);
});
