import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartIcon from './Cart/CartIcon';
import ShoppingCart from './Cart/ShoppingCart';

const Collections = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart({ ...addedToCart, [product.id]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [product.id]: false });
    }, 2000);
  };

  const products = [
    {
      id: 1,
      name: 'Royal Gold Necklace Set',
      category: 'necklaces',
      price: 85000,
      originalPrice: 95000,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 124,
      description: 'Exquisite handcrafted gold necklace with traditional motifs'
    },
    {
      id: 2,
      name: 'Diamond Solitaire Ring',
      category: 'rings',
      price: 125000,
      originalPrice: 140000,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 89,
      description: 'Brilliant cut diamond solitaire in 18k white gold'
    },
    {
      id: 3,
      name: 'Pearl Drop Earrings',
      category: 'earrings',
      price: 35000,
      originalPrice: 40000,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 156,
      description: 'Elegant freshwater pearl earrings with gold accents'
    },
    {
      id: 4,
      name: 'Gold Tennis Bracelet',
      category: 'bracelets',
      price: 65000,
      originalPrice: 75000,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 78,
      description: 'Classic tennis bracelet with premium gold links'
    },
    {
      id: 5,
      name: 'Bridal Jewelry Set',
      category: 'sets',
      price: 250000,
      originalPrice: 280000,
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
      rating: 5.0,
      reviews: 45,
      description: 'Complete bridal set with necklace, earrings, and maang tikka'
    },
    {
      id: 6,
      name: 'Traditional Bangles',
      category: 'bracelets',
      price: 45000,
      originalPrice: 50000,
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 92,
      description: 'Set of 6 traditional gold bangles with intricate designs'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'necklaces', name: 'Necklaces', count: products.filter(p => p.category === 'necklaces').length },
    { id: 'rings', name: 'Rings', count: products.filter(p => p.category === 'rings').length },
    { id: 'earrings', name: 'Earrings', count: products.filter(p => p.category === 'earrings').length },
    { id: 'bracelets', name: 'Bracelets', count: products.filter(p => p.category === 'bracelets').length },
    { id: 'sets', name: 'Jewelry Sets', count: products.filter(p => p.category === 'sets').length }
  ];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    let priceMatch = true;
    
    if (priceRange === 'under-50k') priceMatch = product.price < 50000;
    else if (priceRange === '50k-100k') priceMatch = product.price >= 50000 && product.price < 100000;
    else if (priceRange === '100k-200k') priceMatch = product.price >= 100000 && product.price < 200000;
    else if (priceRange === 'above-200k') priceMatch = product.price >= 200000;
    
    return categoryMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="text-2xl font-bold text-gold-600">Sri Vasavi Jewels</Link>
            <div className="flex items-center space-x-4">
              <CartIcon onClick={() => setIsCartOpen(true)} />
              <nav className="flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-gold-600">Home</Link>
                <Link to="/collections" className="text-gold-600 font-medium">Collections</Link>
                <Link to="/about" className="text-gray-700 hover:text-gold-600">About</Link>
                <Link to="/contact" className="text-gray-700 hover:text-gold-600">Contact</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Collections</h1>
          <p className="text-lg text-gray-600">Discover our exquisite range of handcrafted jewelry</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-gold-100 text-gold-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-50k', label: 'Under ₹50,000' },
                    { id: '50k-100k', label: '₹50,000 - ₹1,00,000' },
                    { id: '100k-200k', label: '₹1,00,000 - ₹2,00,000' },
                    { id: 'above-200k', label: 'Above ₹2,00,000' }
                  ].map(range => (
                    <button
                      key={range.id}
                      onClick={() => setPriceRange(range.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition duration-200 ${
                        priceRange === range.id
                          ? 'bg-gold-100 text-gold-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Customer Rating</option>
                <option>Newest First</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded-md">
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gold-600">₹{product.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-1 bg-gold-600 hover:bg-gold-700 text-white py-2 px-4 rounded-md text-sm font-medium transition duration-300 text-center"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-300 ${
                          addedToCart[product.id]
                            ? 'bg-green-500 text-white'
                            : 'border border-gold-600 text-gold-600 hover:bg-gold-600 hover:text-white'
                        }`}
                      >
                        {addedToCart[product.id] ? '✓ Added' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange('all');
                  }}
                  className="mt-4 bg-gold-600 hover:bg-gold-700 text-white px-6 py-2 rounded-md transition duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shopping Cart */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Collections;
