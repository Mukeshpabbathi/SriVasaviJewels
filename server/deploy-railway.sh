#!/bin/bash

# 🚀 Sri Vasavi Jewels - Railway Deployment Script

echo "🚀 Deploying Sri Vasavi Jewels Backend to Railway..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
else
    echo "✅ Railway CLI found"
fi

echo ""
echo "📋 Follow these steps to deploy:"
echo ""

echo "1️⃣  Login to Railway:"
echo "   railway login"
echo ""

echo "2️⃣  Initialize Railway project:"
echo "   railway init"
echo "   (Choose: Create new project → sri-vasavi-jewels-backend)"
echo ""

echo "3️⃣  Set environment variables:"
echo "   railway variables set MONGO_URI=\"your-mongodb-atlas-connection-string\""
echo "   railway variables set JWT_SECRET=\"$(openssl rand -base64 32)\""
echo "   railway variables set NODE_ENV=\"production\""
echo "   railway variables set PORT=\"4000\""
echo "   railway variables set CORS_ORIGIN=\"*\""
echo ""

echo "4️⃣  Deploy:"
echo "   railway up"
echo ""

echo "📝 MongoDB Atlas Setup Required:"
echo "   1. Go to https://www.mongodb.com/atlas"
echo "   2. Create free M0 cluster"
echo "   3. Create database user"
echo "   4. Whitelist IP: 0.0.0.0/0"
echo "   5. Get connection string"
echo ""

echo "🔗 After deployment:"
echo "   • Your API will be at: https://your-project-name.railway.app"
echo "   • Test with: curl https://your-project-name.railway.app/api/auth/signup"
echo "   • Update frontend with your Railway URL"
echo ""

echo "💡 Need help? Check server/README.md for detailed instructions"

# Generate a secure JWT secret for convenience
echo ""
echo "🔐 Generated JWT Secret (use this in Railway):"
echo "$(openssl rand -base64 32)"
