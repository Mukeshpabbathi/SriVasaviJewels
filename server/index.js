const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const database = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sri-vasavi-jewels-git-main-mukesh-pabbathis-projects.vercel.app',
    'https://sri-vasavi-jewels.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (for local image uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/admin/products', require('./routes/productRoutes'));
app.use('/api/admin/config', require('./routes/configRoutes'));
app.use('/api/admin/rates', require('./routes/rateRoutes')); // Rate management routes
app.use('/api/config', require('./routes/configRoutes'));
app.use('/api/products', require('./routes/publicProductRoutes')); // Public product routes
app.use('/api/rates', require('./routes/rateRoutes')); // Public rate routes
app.use('/api/chat', require('./routes/chatRoutes')); // AI Chat routes

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
      admin: '/api/admin',
      adminProducts: '/api/admin/products',
      config: '/api/config',
      products: '/api/products',
      chat: '/api/chat'
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
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB per file.'
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files. Maximum 10 files allowed.'
    });
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed. Supported formats: JPG, JPEG, PNG, WEBP'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 4000;

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
