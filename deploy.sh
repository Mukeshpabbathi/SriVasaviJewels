#!/bin/bash

echo "🚀 Deploying Sri Vasavi Jewels Website..."

# Build frontend
echo "📦 Building frontend..."
cd client
npm run build
cd ..

# Prepare backend for deployment
echo "🔧 Preparing backend..."
cd server
npm install --production
cd ..

echo "✅ Build complete! Ready for deployment."
echo ""
echo "📋 Next steps:"
echo "1. Frontend: Deploy 'client/build' folder to Netlify"
echo "2. Backend: Deploy 'server' folder to Railway"
echo "3. Update API URLs in frontend"
echo ""
echo "🌐 Your website will be live at:"
echo "Frontend: https://srivasavijewels.netlify.app"
echo "Backend: https://svj-backend.railway.app"
