import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/Home';
import Collections from './components/Collections';
import About from './components/About';
import Contact from './components/Contact';
import ProductDetail from './components/ProductDetail';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <CartProvider>
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
                user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/signup" 
              element={
                user ? <Navigate to="/" /> : <Signup onSignup={handleSignup} />
              } 
            />
            <Route 
              path="/admin" 
              element={
                user && user.role === 'admin' 
                  ? <AdminDashboard user={user} onLogout={handleLogout} />
                  : <Navigate to="/" />
              } 
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
