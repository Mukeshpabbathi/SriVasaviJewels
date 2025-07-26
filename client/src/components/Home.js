import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CartIcon from './Cart/CartIcon';
import ShoppingCart from './Cart/ShoppingCart';
import WishlistIcon from './Wishlist/WishlistIcon';
import AddToWishlistButton from './Wishlist/AddToWishlistButton';
import ResponsiveImage from './common/ResponsiveImage';
import axios from 'axios';

const Home = ({ user, onLogout }) => {
  const { addToCart } = useCart();
  const { getWishlistCount } = useWishlist();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products and categories from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products
        const featuredResponse = await axios.get('http://localhost:4000/api/products/featured?limit=6');
        if (featuredResponse.data.success) {
          setFeaturedProducts(featuredResponse.data.data);
        }
        
        // Fetch categories with sample products
        const categoriesResponse = await axios.get('http://localhost:4000/api/products/categories');
        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart({ ...addedToCart, [product._id]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [product._id]: false });
    }, 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatPriceRange = (min, max) => {
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">💎</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                  Sri Vasavi Jewels
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/collections" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                Collections
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                Contact
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Wishlist Icon */}
              <Link to="/wishlist">
                <WishlistIcon />
              </Link>
              
              <CartIcon onClick={() => setIsCartOpen(true)} />
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={onLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-yellow-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-50 to-yellow-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Exquisite Jewelry Collection
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover our handcrafted jewelry pieces made with the finest materials. 
              From traditional designs to modern elegance, find the perfect piece for every occasion.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/collections" 
                className="bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-700 transition-colors"
              >
                Shop Now
              </Link>
              <Link 
                to="/about" 
                className="border-2 border-yellow-600 text-yellow-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 hover:text-white transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection of jewelry categories, each crafted with precision and care.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link 
                  key={category._id} 
                  to={`/collections?category=${encodeURIComponent(category._id)}`}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform group-hover:scale-105">
                    <div className="w-full h-64">
                      <ResponsiveImage
                        image={category.sampleProduct.images?.[0]}
                        alt={category._id}
                        size="medium"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">{category._id}</h3>
                        <p className="text-sm opacity-90 mb-2">
                          {category.count} {category.count === 1 ? 'item' : 'items'} available
                        </p>
                        <p className="text-sm font-semibold">
                          {formatPriceRange(category.minPrice, category.maxPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No categories available. Please add some products first.</p>
              {user && user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="inline-block mt-4 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Add Products
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium jewelry pieces.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                    
                    {product.discountPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        {product.discountPercentage}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-yellow-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(product.finalPrice)}
                        </span>
                        {product.discountPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{product.category}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addedToCart[product._id]}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                          addedToCart[product._id]
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        }`}
                      >
                        {addedToCart[product._id] ? 'Added to Cart!' : 'Add to Cart'}
                      </button>
                      
                      <Link
                        to={`/product/${product._id}`}
                        className="px-4 py-2 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-600 hover:text-white transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured products available.</p>
              {user && user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="inline-block mt-4 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Add Featured Products
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-yellow-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse our complete collection and discover jewelry that tells your story.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/collections" 
              className="bg-white text-yellow-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View All Collections
            </Link>
            <Link 
              to="/wishlist" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors"
            >
              View Wishlist ({getWishlistCount()})
            </Link>
          </div>
        </div>
      </section>

      {/* Shopping Cart */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default Home;
