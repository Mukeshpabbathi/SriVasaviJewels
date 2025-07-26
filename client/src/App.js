import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ChatProvider } from './context/ChatContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/Home';
import Collections from './components/Collections';
import ProductDetail from './components/ProductDetail';
import WishlistPage from './components/Wishlist/WishlistPage';
import About from './components/About';
import Contact from './components/Contact';
import AdminDashboard from './components/Admin/AdminDashboard';
import ChatBubble from './components/Chat/ChatBubble';
import ChatWindow from './components/Chat/ChatWindow';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Auto-redirect admin users to dashboard
    if (userData.role === 'admin') {
      window.location.href = '/admin';
    }
  };

  const handleSignup = (userData) => {
    setUser(userData);
    // Auto-redirect admin users to dashboard
    if (userData.role === 'admin') {
      window.location.href = '/admin';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <WishlistProvider>
        <ChatProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route 
                  path="/" 
                  element={<Home user={user} onLogout={handleLogout} />} 
                />
                <Route 
                  path="/collections" 
                  element={<Collections />} 
                />
                <Route 
                  path="/product/:id" 
                  element={<ProductDetail />} 
                />
                <Route 
                  path="/wishlist" 
                  element={<WishlistPage />} 
                />
                <Route 
                  path="/about" 
                  element={<About />} 
                />
                <Route 
                  path="/contact" 
                  element={<Contact />} 
                />
                <Route 
                  path="/login" 
                  element={
                    user ? (
                      user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />
                    ) : (
                      <Login onLogin={handleLogin} />
                    )
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    user ? (
                      user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />
                    ) : (
                      <Signup onSignup={handleSignup} />
                    )
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    user && user.role === 'admin' 
                      ? <AdminDashboard user={user} onLogout={handleLogout} />
                      : <Navigate to="/login" />
                  } 
                />
              </Routes>
              
              {/* AI Chat System - Available on all pages */}
              <ChatBubble />
              <ChatWindow />
            </div>
          </Router>
        </ChatProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
