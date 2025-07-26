const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const database = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to database
let dbConnected = false;
(async () => {
  dbConnected = await database.connect();
  if (!dbConnected) {
    console.log('⚠️ Server starting without database connection');
  }
})();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbHealth = await database.healthCheck();
  
  res.json({
    status: 'ok',
    message: 'Sri Vasavi Jewels API Server is running!',
    timestamp: new Date().toISOString(),
    database: dbHealth,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '💎 Welcome to Sri Vasavi Jewels API',
    version: '2.0.0',
    status: 'active',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      admin: '/api/admin'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n🚀 ===================================');
  console.log(`🏪 Sri Vasavi Jewels Server Started`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`💾 Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ===================================\n');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await database.disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  server.close(async () => {
    await database.disconnect();
    process.exit(0);
  });
});

module.exports = app;
