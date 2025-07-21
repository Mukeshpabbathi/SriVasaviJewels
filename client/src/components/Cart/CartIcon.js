import React from 'react';
import { useCart } from '../../context/CartContext';

const CartIcon = ({ onClick }) => {
  const { getCartItemsCount } = useCart();
  const itemCount = getCartItemsCount();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-700 hover:text-gold-600 transition duration-300"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
