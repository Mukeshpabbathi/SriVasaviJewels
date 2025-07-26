import React from 'react';
import { useWishlist } from '../../context/WishlistContext';

const WishlistIcon = ({ onClick, className = '' }) => {
  const { getWishlistCount } = useWishlist();
  const count = getWishlistCount();

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-red-600 transition-colors ${className}`}
      title="Wishlist"
    >
      {/* Heart Icon */}
      <svg 
        className="w-6 h-6" 
        fill={count > 0 ? "currentColor" : "none"} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={count > 0 ? 0 : 2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      
      {/* Count Badge */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

export default WishlistIcon;
