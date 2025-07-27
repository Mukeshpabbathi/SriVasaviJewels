// API Configuration Utility for Sri Vasavi Jewels

// Get API base URL from environment variable or fallback to localhost
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Log the API URL being used (for debugging)
console.log('🔗 Sri Vasavi Jewels API URL:', API_BASE_URL);

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`
  },
  
  // Products
  PRODUCTS: {
    BASE: `${API_BASE_URL}/api/products`,
    FEATURED: `${API_BASE_URL}/api/products/featured`,
    CATEGORIES: `${API_BASE_URL}/api/products/categories`,
    SEARCH: `${API_BASE_URL}/api/products/search`,
    BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`
  },
  
  // Admin
  ADMIN: {
    PRODUCTS: `${API_BASE_URL}/api/admin/products`,
    STATS: `${API_BASE_URL}/api/admin/stats`,
    CONFIG: `${API_BASE_URL}/api/admin/config`,
    RATES: `${API_BASE_URL}/api/admin/rates`
  },
  
  // Chat
  CHAT: {
    MESSAGE: `${API_BASE_URL}/api/chat/message`,
    HISTORY: `${API_BASE_URL}/api/chat/history`
  },
  
  // Wishlist
  WISHLIST: {
    BASE: `${API_BASE_URL}/api/wishlist`,
    BY_ID: (id) => `${API_BASE_URL}/api/wishlist/${id}`
  },
  
  // Configuration
  CONFIG: {
    PUBLIC: `${API_BASE_URL}/api/config/public`
  },
  
  // Rates
  RATES: {
    CURRENT: `${API_BASE_URL}/api/rates/current`,
    CALCULATE: `${API_BASE_URL}/api/rates/calculate`
  }
};

// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('https')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

// Default export
export default {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: API_ENDPOINTS,
  getImageUrl
};
