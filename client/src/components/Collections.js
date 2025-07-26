import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartIcon from './Cart/CartIcon';
import ShoppingCart from './Cart/ShoppingCart';
import axios from 'axios';

const Collections = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});
  
  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [metals, setMetals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  // Fetch products based on filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: '1',
        limit: '12'
      });
      
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedMetal !== 'all') params.append('metal', selectedMetal);
      
      // Handle price range
      if (priceRange !== 'all') {
        const ranges = {
          'under-25000': { max: 25000 },
          '25000-50000': { min: 25000, max: 50000 },
          '50000-100000': { min: 50000, max: 100000 },
          'above-100000': { min: 100000 }
        };
        
        if (ranges[priceRange]) {
          if (ranges[priceRange].min) params.append('minPrice', ranges[priceRange].min);
          if (ranges[priceRange].max) params.append('maxPrice', ranges[priceRange].max);
        }
      }
      
      // Handle sorting
      const sortOptions = {
        'featured': { sortBy: 'isFeatured', sortOrder: 'desc' },
        'price-low': { sortBy: 'price', sortOrder: 'asc' },
        'price-high': { sortBy: 'price', sortOrder: 'desc' },
        'newest': { sortBy: 'createdAt', sortOrder: 'desc' },
        'name': { sortBy: 'name', sortOrder: 'asc' }
      };
      
      if (sortOptions[sortBy]) {
        params.append('sortBy', sortOptions[sortBy].sortBy);
        params.append('sortOrder', sortOptions[sortBy].sortOrder);
      }
      
      const response = await axios.get(`http://localhost:4000/api/products?${params}`);
      
      if (response.data.success) {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
        
        // Set categories and metals from stats
        if (response.data.data.stats) {
          setCategories(response.data.data.stats.categories);
          setMetals(response.data.data.stats.metals);
        }
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedMetal, priceRange, sortBy]);

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

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedMetal('all');
    setPriceRange('all');
    setSortBy('featured');
  };

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
              <Link to="/collections" className="text-yellow-600 font-medium">
                Collections
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Collections</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our exquisite range of handcrafted jewelry pieces, each telling a unique story of elegance and craftsmanship.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category._id}
                        checked={selectedCategory === category._id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category._id} ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metal Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Metal</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="metal"
                      value="all"
                      checked={selectedMetal === 'all'}
                      onChange={(e) => setSelectedMetal(e.target.value)}
                      className="text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Metals</span>
                  </label>
                  {metals.map((metal) => (
                    <label key={metal._id} className="flex items-center">
                      <input
                        type="radio"
                        name="metal"
                        value={metal._id}
                        checked={selectedMetal === metal._id}
                        onChange={(e) => setSelectedMetal(e.target.value)}
                        className="text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {metal._id} ({metal.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'under-25000', label: 'Under ₹25,000' },
                    { value: '25000-50000', label: '₹25,000 - ₹50,000' },
                    { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
                    { value: 'above-100000', label: 'Above ₹1,00,000' }
                  ].map((range) => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={priceRange === range.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-gray-600 mb-4 sm:mb-0">
                {loading ? 'Loading...' : `Showing ${products.length} products`}
              </p>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3 mb-4"></div>
                    <div className="bg-gray-200 h-8 rounded"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img
                        src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {product.discountPrice && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                          {product.discountPercentage}% OFF
                        </div>
                      )}
                      {product.isFeatured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{product.category}</span>
                        <span className="text-sm text-gray-500">{product.metal}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
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
                        <div className="text-sm text-gray-500">
                          Stock: {product.stock.quantity}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addedToCart[product._id] || product.stock.quantity === 0}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                          product.stock.quantity === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : addedToCart[product._id]
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        }`}
                      >
                        {product.stock.quantity === 0
                          ? 'Out of Stock'
                          : addedToCart[product._id]
                          ? 'Added to Cart!'
                          : 'Add to Cart'
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shopping Cart */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default Collections;
