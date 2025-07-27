# Sri Vasavi Jewels - Backend API

Node.js/Express backend for Sri Vasavi Jewels e-commerce platform with MongoDB database.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Test database connection
npm run test-db

# Create admin user
npm run create-admin

# Start development server
npm run dev
```

Server runs on: http://localhost:4000

## 🌐 Deploy to Railway (Free)

Railway offers a generous free tier perfect for development and small projects.

### Step 1: Prepare for Deployment

First, ensure your project is ready:

```bash
# Make sure all dependencies are in package.json
npm install

# Test locally first
npm run dev
```

### Step 2: Setup MongoDB Atlas (Free Database)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Create free account** and cluster (M0 tier - free forever)
3. **Create database user**:
   - Username: `svj_admin`
   - Password: Generate secure password
4. **Whitelist IP addresses**: Add `0.0.0.0/0` (allow all IPs)
5. **Get connection string**:
   ```
   mongodb+srv://svj_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/srivasavijewels?retryWrites=true&w=majority
   ```

### Step 3: Deploy to Railway

#### Option A: Using Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway (opens browser)
railway login

# Initialize project from server directory
cd server
railway init

# When prompted:
# - Choose "Create new project"
# - Name: "sri-vasavi-jewels-backend"
# - Choose "Deploy from current directory"

# Set environment variables
railway variables set MONGO_URI="mongodb+srv://svj_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/srivasavijewels?retryWrites=true&w=majority"
railway variables set JWT_SECRET="your_super_secure_jwt_secret_key_make_it_very_long_and_random"
railway variables set NODE_ENV="production"
railway variables set PORT="4000"
railway variables set CORS_ORIGIN="*"

# Deploy
railway up
```

#### Option B: Using GitHub Integration

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Connect to Railway**:
   - Go to https://railway.app
   - Sign up/Login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `server` folder as root directory

3. **Set Environment Variables** in Railway dashboard:
   ```
   MONGO_URI=mongodb+srv://svj_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/srivasavijewels?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_jwt_secret_key_make_it_very_long_and_random
   NODE_ENV=production
   PORT=4000
   CORS_ORIGIN=*
   ```

### Step 4: Configure Railway Settings

In your Railway project dashboard:

1. **Settings → Environment**:
   - Add all environment variables listed above

2. **Settings → Networking**:
   - Your app will get a free domain like: `https://your-project-name.railway.app`

3. **Settings → Deploy**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `/server` (if deploying from repo root)

### Step 5: Test Deployment

```bash
# Test your deployed API
curl https://your-project-name.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔧 Railway Configuration Files

### package.json (ensure these scripts exist)
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "echo 'No build step needed'"
  }
}
```

### Optional: railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 💰 Railway Free Tier Limits

- **Execution Time**: 500 hours/month (enough for small projects)
- **Memory**: 512MB RAM
- **Storage**: 1GB
- **Bandwidth**: 100GB/month
- **Custom Domain**: Available on free tier
- **Sleep Policy**: Apps sleep after 30 minutes of inactivity

## 🔒 Environment Variables Required

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/srivasavijewels

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key

# Server
NODE_ENV=production
PORT=4000

# CORS (set to your frontend domain after frontend deployment)
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## 📊 API Endpoints

Once deployed, your API will be available at: `https://your-project-name.railway.app`

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/admin/products` - Create product (admin only)
- `PUT /api/admin/products/:id` - Update product (admin only)
- `DELETE /api/admin/products/:id` - Delete product (admin only)

### Chat
- `POST /api/chat` - Send chat message
- `GET /api/chat/history` - Get chat history (protected)

## 🐛 Troubleshooting Railway Deployment

### Common Issues:

**1. Build Fails**
```bash
# Check build logs in Railway dashboard
# Ensure package.json has correct scripts
# Verify Node.js version compatibility
```

**2. App Crashes on Start**
```bash
# Check deployment logs
# Verify environment variables are set
# Test MongoDB connection string
```

**3. Database Connection Issues**
```bash
# Verify MongoDB Atlas connection string
# Check if IP whitelist includes 0.0.0.0/0
# Ensure database user has correct permissions
```

**4. CORS Errors**
```bash
# Update CORS_ORIGIN environment variable
# Set to your frontend domain or "*" for development
```

## 📈 Monitoring & Logs

- **Railway Dashboard**: View real-time logs and metrics
- **Health Check**: Add `/health` endpoint for monitoring
- **Error Tracking**: Check Railway logs for errors

## 🔄 Continuous Deployment

Railway automatically redeploys when you:
- Push to connected GitHub branch
- Use `railway up` command
- Update environment variables

## 🚀 Post-Deployment Steps

1. **Test all API endpoints**
2. **Create admin user** via API call
3. **Upload sample products** 
4. **Update frontend** with your Railway API URL
5. **Configure custom domain** (optional)

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **MongoDB Atlas Support**: https://www.mongodb.com/support

---

**Your backend will be live at**: `https://your-project-name.railway.app` 🚀

**Estimated deployment time**: 10-15 minutes
