const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

app.post('/api/auth/signup', (req, res) => {
  console.log('Signup request received:', req.body);
  res.json({
    _id: '123',
    name: req.body.name,
    email: req.body.email,
    role: 'admin',
    token: 'test-token'
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  res.json({
    _id: '123',
    name: 'Test User',
    email: req.body.email,
    role: 'admin',
    token: 'test-token'
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
