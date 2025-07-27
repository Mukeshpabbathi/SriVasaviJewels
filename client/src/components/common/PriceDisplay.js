import React from 'react';

const PriceDisplay = ({ 
  product, 
  size = 'medium', 
  showSavings = false,
  className = '' 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const sizeClasses = {
    small: {
      finalPrice: 'text-lg font-bold',
      originalPrice: 'text-sm line-through',
      badge: 'text-xs px-1.5 py-0.5',
      savings: 'text-xs'
    },
    medium: {
      finalPrice: 'text-xl font-bold',
      originalPrice: 'text-sm line-through',
      badge: 'text-xs px-2 py-1',
      savings: 'text-sm'
    },
    large: {
      finalPrice: 'text-3xl font-bold',
      originalPrice: 'text-lg line-through',
      badge: 'text-sm px-3 py-1',
      savings: 'text-sm'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Final Price and Discount Badge */}
      <div className="flex items-center space-x-2">
        <span className={`text-gray-900 ${classes.finalPrice}`}>
          {formatPrice(product.finalPrice)}
        </span>
        {product.discountPercentage > 0 && (
          <span className={`bg-red-500 text-white rounded-full font-medium ${classes.badge}`}>
            {product.discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Original Price and Savings */}
      {product.discountPercentage > 0 && (
        <div className="flex items-center space-x-2">
          <span className={`text-gray-500 ${classes.originalPrice}`}>
            Original: {formatPrice(product.price)}
          </span>
          {showSavings && product.discountAmount && (
            <span className={`text-green-600 font-medium ${classes.savings}`}>
              Save: {formatPrice(product.discountAmount)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
