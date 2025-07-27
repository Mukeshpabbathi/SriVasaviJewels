import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../utils/api';

const WishlistContext = createContext();

// Wishlist actions
const WISHLIST_ACTIONS = {
  SET_WISHLIST: 'SET_WISHLIST',
  ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
  REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST',
  SET_LOADING: 'SET_LOADING'
};

// Wishlist reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.SET_WISHLIST:
      return {
        ...state,
        items: action.payload,
        loading: false
      };
    
    case WISHLIST_ACTIONS.ADD_TO_WISHLIST:
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        return state; // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    
    case WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    
    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return {
        ...state,
        items: []
      };
    
    case WISHLIST_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  loading: false
};

// Wishlist Provider
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (state.items.length >= 0) {
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    }
  }, [state.items]);

  // Load wishlist from localStorage or server
  const loadWishlist = async () => {
    try {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: true });
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (token && user._id) {
        // Load from server for logged-in users
        try {
          const response = await axios.get(API_ENDPOINTS.WISHLIST.BASE, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            dispatch({ 
              type: WISHLIST_ACTIONS.SET_WISHLIST, 
              payload: response.data.data 
            });
            return;
          }
        } catch (error) {
          console.log('Server wishlist not available, using local storage');
        }
      }
      
      // Fallback to localStorage
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      dispatch({ 
        type: WISHLIST_ACTIONS.SET_WISHLIST, 
        payload: localWishlist 
      });
      
    } catch (error) {
      console.error('Error loading wishlist:', error);
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Add item to wishlist
  const addToWishlist = async (product) => {
    try {
      // Check if already in wishlist
      const existingItem = state.items.find(item => item._id === product._id);
      if (existingItem) {
        return { success: false, message: 'Item already in wishlist' };
      }

      // Add to local state
      dispatch({ type: WISHLIST_ACTIONS.ADD_TO_WISHLIST, payload: product });

      // Sync with server if user is logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post(API_ENDPOINTS.WISHLIST.BASE, 
            { productId: product._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.log('Server sync failed, using local storage only');
        }
      }

      return { success: true, message: 'Added to wishlist' };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: 'Failed to add to wishlist' };
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      // Remove from local state
      dispatch({ type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST, payload: productId });

      // Sync with server if user is logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.delete(API_ENDPOINTS.WISHLIST.BY_ID(productId), {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.log('Server sync failed, using local storage only');
        }
      }

      return { success: true, message: 'Removed from wishlist' };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: 'Failed to remove from wishlist' };
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    try {
      dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });

      // Clear from server if user is logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.delete(API_ENDPOINTS.WISHLIST.BASE, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.log('Server sync failed, using local storage only');
        }
      }

      return { success: true, message: 'Wishlist cleared' };
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return { success: false, message: 'Failed to clear wishlist' };
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return state.items.some(item => item._id === productId);
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return state.items.length;
  };

  // Move wishlist item to cart
  const moveToCart = (productId, addToCartFunction) => {
    const item = state.items.find(item => item._id === productId);
    if (item) {
      addToCartFunction(item);
      removeFromWishlist(productId);
      return { success: true, message: 'Moved to cart' };
    }
    return { success: false, message: 'Item not found in wishlist' };
  };

  const value = {
    wishlist: state.items,
    loading: state.loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
    moveToCart,
    loadWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
