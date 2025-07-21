#!/bin/bash

# SVJ Development Server Startup Script
echo "🚀 Starting Sri Vasavi Jewels Development Servers..."

# Function to kill existing processes
cleanup() {
    echo "🛑 Stopping servers..."
    pkill -f "react-scripts start"
    pkill -f "node index.js"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Start backend server
echo "📡 Starting Backend Server (Port 4000)..."
cd server && node index.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "🌐 Starting Frontend Server (Port 3000)..."
cd ../client && npm start &
FRONTEND_PID=$!

echo "✅ Servers started successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:4000"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
