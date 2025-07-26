import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';

const AddToWishlistButton = ({ 
  product, 
  size = 'medium', 
  showText = true, 
  className = '',
  variant = 'button' // 'button' or 'icon'
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('');

  const inWishlist = isInWishlist(product._id);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);

    try {
      let result;
      if (inWishlist) {
        result = await removeFromWishlist(product._id);
      } else {
        result = await addToWishlist(product);
      }

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      setMessage('Something went wrong');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Size configurations
  const sizeConfig = {
    small: {
      icon: 'w-4 h-4',
      button: 'px-2 py-1 text-sm',
      text: 'text-xs'
    },
    medium: {
      icon: 'w-5 h-5',
      button: 'px-3 py-2 text-sm',
      text: 'text-sm'
    },
    large: {
      icon: 'w-6 h-6',
      button: 'px-4 py-2 text-base',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size];

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleToggleWishlist}
          className={`relative p-2 rounded-full transition-all duration-200 ${
            inWishlist 
              ? 'text-red-500 bg-red-50 hover:bg-red-100' 
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          } ${isAnimating ? 'scale-110' : 'scale-100'} ${className}`}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg 
            className={`${config.icon} transition-all duration-200`}
            fill={inWishlist ? "currentColor" : "none"} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={inWishlist ? 0 : 2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          
          {/* Animation effect */}
          {isAnimating && (
            <div className="absolute inset-0 rounded-full bg-red-200 animate-ping"></div>
          )}
        </button>

        {/* Message tooltip */}
        {message && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggleWishlist}
        className={`
          flex items-center justify-center space-x-2 rounded-lg font-medium transition-all duration-200
          ${config.button}
          ${inWishlist 
            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
            : 'bg-white text-gray-600 border border-gray-300 hover:border-red-300 hover:text-red-600'
          }
          ${isAnimating ? 'scale-105' : 'scale-100'}
          ${className}
        `}
        disabled={isAnimating}
      >
        <svg 
          className={`${config.icon} transition-all duration-200`}
          fill={inWishlist ? "currentColor" : "none"} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={inWishlist ? 0 : 2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
        
        {showText && (
          <span className={config.text}>
            {inWishlist ? 'Saved' : 'Save'}
          </span>
        )}
        
        {/* Animation effect */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-lg bg-red-100 animate-pulse"></div>
        )}
      </button>

      {/* Message tooltip */}
      {message && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap z-10">
          {message}
        </div>
      )}
    </div>
  );
};

export default AddToWishlistButton;
