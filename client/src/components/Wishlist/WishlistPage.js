import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ResponsiveImage from '../common/ResponsiveImage';
import AddToWishlistButton from './AddToWishlistButton';
import CartIcon from '../Cart/CartIcon';
import ShoppingCart from '../Cart/ShoppingCart';

const WishlistPage = () => {
  const { wishlist, loading, clearWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart({ ...addedToCart, [product._id]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [product._id]: false });
    }, 2000);
  };

  const handleMoveToCart = (product) => {
    const result = moveToCart(product._id, addToCart);
    if (result.success) {
      setAddedToCart({ ...addedToCart, [product._id]: true });
      setTimeout(() => {
        setAddedToCart({ ...addedToCart, [product._id]: false });
      }, 2000);
    }
  };

  const handleClearWishlist = async () => {
    await clearWishlist();
    setShowClearConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">💎</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                  Sri Vasavi Jewels
                </span>
              </Link>
              <CartIcon onClick={() => setIsCartOpen(true)} />
            </div>
          </div>
        </nav>

        {/* Loading State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">💎</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                Sri Vasavi Jewels
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/collections" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                Collections
              </Link>
              <Link to="/wishlist" className="text-red-600 font-medium">
                Wishlist
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                Contact
              </Link>
            </div>
            
            <CartIcon onClick={() => setIsCartOpen(true)} />
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">Wishlist</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Wishlist Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          
          {wishlist.length > 0 && (
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-6">❤️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon. We'll keep them safe here for you.
            </p>
            <Link 
              to="/collections" 
              className="bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative">
                  <Link to={`/product/${product._id}`}>
                    <div className="w-full h-48">
                      <ResponsiveImage
                        image={product.images?.[0]}
                        alt={product.name}
                        size="medium"
                        className="w-full h-full"
                      />
                    </div>
                  </Link>
                  
                  {/* Wishlist Button */}
                  <div className="absolute top-2 right-2">
                    <AddToWishlistButton 
                      product={product} 
                      variant="icon" 
                      size="medium"
                    />
                  </div>
                  
                  {/* Discount Badge */}
                  {product.discountPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{product.category}</span>
                    <span className="text-sm text-gray-500">{product.metal}</span>
                  </div>
                  
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-yellow-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(product.finalPrice)}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {product.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                      {product.discountPercentage > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          Original: {formatPrice(product.price)}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Stock: {product.stock?.quantity || 0}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addedToCart[product._id] || product.stock?.quantity === 0}
                      className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
                        product.stock?.quantity === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : addedToCart[product._id]
                          ? 'bg-green-500 text-white'
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}
                    >
                      {product.stock?.quantity === 0
                        ? 'Out of Stock'
                        : addedToCart[product._id]
                        ? 'Added!'
                        : 'Add to Cart'
                      }
                    </button>
                    
                    <Link
                      to={`/product/${product._id}`}
                      className="px-3 py-2 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-600 hover:text-white transition-colors text-sm font-semibold"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlist.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              to="/collections" 
              className="inline-flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Continue Shopping</span>
            </Link>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clear Wishlist</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your wishlist? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearWishlist}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default WishlistPage;
