import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartIcon from './Cart/CartIcon';
import ShoppingCart from './Cart/ShoppingCart';
import ResponsiveImage from './common/ResponsiveImage';
import AdvancedSearch from './common/AdvancedSearch';
import axios from 'axios';

const Collections = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedMetal, setSelectedMetal] = useState(searchParams.get('metal') || 'all');
  const [selectedPurity, setSelectedPurity] = useState(searchParams.get('purity') || 'all');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'all');
  const [selectedTags, setSelectedTags] = useState(searchParams.get('tags')?.split(',') || []);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Data states
  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({});
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
      
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedMetal !== 'all') params.append('metal', selectedMetal);
      if (selectedPurity !== 'all') params.append('purity', selectedPurity);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      
      // Handle price range
      if (priceRange !== 'all') {
        const ranges = {
          'under-25000': { max: 25000 },
          '25000-50000': { min: 25000, max: 50000 },
          '50000-100000': { min: 50000, max: 100000 },
          '100000-200000': { min: 100000, max: 200000 },
          'above-200000': { min: 200000 }
        };
        
        if (ranges[priceRange]) {
          if (ranges[priceRange].min) params.append('minPrice', ranges[priceRange].min);
          if (ranges[priceRange].max) params.append('maxPrice', ranges[priceRange].max);
        }
      }
      
      // Handle sorting
      params.append('sortBy', sortBy);
      
      const endpoint = searchQuery ? 
        `http://localhost:4000/api/products/search?${params}` :
        `http://localhost:4000/api/products?${params}`;
      
      const response = await axios.get(endpoint);
      
      if (response.data.success) {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
        
        // Set facets for advanced filtering
        if (response.data.data.facets) {
          setFacets(response.data.data.facets);
        } else if (response.data.data.stats) {
          // Fallback to stats format
          setFacets({
            categories: response.data.data.stats.categories,
            metals: response.data.data.stats.metals
          });
        }
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedMetal !== 'all') params.set('metal', selectedMetal);
    if (selectedPurity !== 'all') params.set('purity', selectedPurity);
    if (priceRange !== 'all') params.set('priceRange', priceRange);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (sortBy !== 'relevance') params.set('sortBy', sortBy);
    
    setSearchParams(params);
    fetchProducts();
  }, [selectedCategory, selectedMetal, selectedPurity, priceRange, selectedTags, sortBy, searchQuery]);

  // Handle search from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

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
    setSelectedPurity('all');
    setPriceRange('all');
    setSelectedTags([]);
    setSortBy('relevance');
    setSearchQuery('');
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedMetal !== 'all') count++;
    if (selectedPurity !== 'all') count++;
    if (priceRange !== 'all') count++;
    if (selectedTags.length > 0) count += selectedTags.length;
    if (searchQuery) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
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
            
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
                title="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <CartIcon onClick={() => setIsCartOpen(true)} />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Collections</h1>
            {searchQuery && (
              <p className="text-gray-600">
                Search results for "<span className="font-medium">{searchQuery}</span>"
              </p>
            )}
          </div>
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 mt-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span>Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-yellow-600 text-white text-xs rounded-full px-2 py-1">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Clear All ({getActiveFiltersCount()})
                  </button>
                )}
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
                  {facets.categories?.map((category) => (
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
                  {facets.metals?.map((metal) => (
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

              {/* Purity Filter */}
              {facets.purities && facets.purities.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Purity</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="purity"
                        value="all"
                        checked={selectedPurity === 'all'}
                        onChange={(e) => setSelectedPurity(e.target.value)}
                        className="text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">All Purities</span>
                    </label>
                    {facets.purities.map((purity) => (
                      <label key={purity._id} className="flex items-center">
                        <input
                          type="radio"
                          name="purity"
                          value={purity._id}
                          checked={selectedPurity === purity._id}
                          onChange={(e) => setSelectedPurity(e.target.value)}
                          className="text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {purity._id} ({purity.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'under-25000', label: 'Under ₹25,000' },
                    { value: '25000-50000', label: '₹25,000 - ₹50,000' },
                    { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
                    { value: '100000-200000', label: '₹1,00,000 - ₹2,00,000' },
                    { value: 'above-200000', label: 'Above ₹2,00,000' }
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

              {/* Tags Filter */}
              {facets.tags && facets.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {facets.tags.map((tag) => (
                      <button
                        key={tag._id}
                        onClick={() => toggleTag(tag._id)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag._id)
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag._id} ({tag.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-gray-600 mb-4 sm:mb-0">
                {loading ? 'Loading...' : `Showing ${products.length} of ${pagination.total || 0} products`}
              </p>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price">Price: Low to High</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {getActiveFiltersCount() > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-yellow-800">Active filters:</span>
                  
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Category: {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {selectedMetal !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Metal: {selectedMetal}
                      <button
                        onClick={() => setSelectedMetal('all')}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {selectedTags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Tag: {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                      <div className="w-full h-48">
                        <ResponsiveImage
                          image={product.images?.[0]}
                          alt={product.name}
                          size="medium"
                          className="w-full h-full"
                        />
                      </div>
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
                      
                      {/* Tags */}
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{product.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      
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
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={addedToCart[product._id] || product.stock.quantity === 0}
                          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
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
                            ? 'Added!'
                            : 'Add to Cart'
                          }
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
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No products found for your search' : 'No products found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? `Try searching for different keywords or adjust your filters.`
                    : 'Try adjusting your filters or search criteria.'
                  }
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearch 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Shopping Cart */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default Collections;
