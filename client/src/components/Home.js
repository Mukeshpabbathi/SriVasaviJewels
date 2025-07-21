import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartIcon from './Cart/CartIcon';
import ShoppingCart from './Cart/ShoppingCart';

const Home = ({ user, onLogout }) => {
  const { addToCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart({ ...addedToCart, [product.id]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [product.id]: false });
    }, 2000);
  };
  const jewelryCategories = [
    {
      id: 1,
      name: 'Gold Necklaces',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      description: 'Exquisite gold necklaces crafted with precision',
      price: '₹25,000 - ₹1,50,000'
    },
    {
      id: 2,
      name: 'Diamond Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop',
      description: 'Stunning diamond rings for special occasions',
      price: '₹45,000 - ₹3,00,000'
    },
    {
      id: 3,
      name: 'Gold Earrings',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop',
      description: 'Elegant gold earrings for every style',
      price: '₹15,000 - ₹75,000'
    },
    {
      id: 4,
      name: 'Bracelets',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop',
      description: 'Beautiful bracelets in gold and silver',
      price: '₹20,000 - ₹1,00,000'
    },
    {
      id: 5,
      name: 'Wedding Sets',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
      description: 'Complete bridal jewelry collections',
      price: '₹1,00,000 - ₹5,00,000'
    },
    {
      id: 6,
      name: 'Traditional Jewelry',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=300&fit=crop',
      description: 'Classic Indian traditional jewelry',
      price: '₹30,000 - ₹2,00,000'
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Royal Gold Necklace',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop',
      price: '₹85,000',
      originalPrice: '₹95,000',
      discount: '10% OFF'
    },
    {
      id: 2,
      name: 'Diamond Solitaire Ring',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop',
      price: '₹1,25,000',
      originalPrice: '₹1,40,000',
      discount: '12% OFF'
    },
    {
      id: 3,
      name: 'Pearl Drop Earrings',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop',
      price: '₹35,000',
      originalPrice: '₹40,000',
      discount: '15% OFF'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gold-600">Sri Vasavi Jewels</h1>
                <p className="text-sm text-gray-500">Crafting Dreams Since 1985</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gold-600 font-medium">Home</Link>
              <Link to="/collections" className="text-gray-700 hover:text-gold-600 font-medium">Collections</Link>
              <Link to="/about" className="text-gray-700 hover:text-gold-600 font-medium">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-gold-600 font-medium">Contact</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <CartIcon onClick={() => setIsCartOpen(true)} />
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  {user.role === 'admin' && (
                    <>
                      <Link
                        to="/admin"
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs hover:bg-red-200 transition duration-300"
                      >
                        Admin Dashboard
                      </Link>
                      <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded-full text-xs">
                        Admin
                      </span>
                    </>
                  )}
                  {user.role === 'customer' && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Customer
                    </span>
                  )}
                  <button
                    onClick={onLogout}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium">Login</Link>
                  <Link to="/signup" className="bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-md text-sm transition duration-300">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gold-50 to-gold-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Timeless
                <span className="text-gold-600"> Elegance</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Discover our exquisite collection of handcrafted jewelry, where tradition meets modern sophistication.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/collections"
                  className="bg-gold-600 hover:bg-gold-700 text-white px-8 py-3 rounded-md text-lg font-medium transition duration-300 text-center"
                >
                  Explore Collections
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-gold-600 text-gold-600 hover:bg-gold-600 hover:text-white px-8 py-3 rounded-md text-lg font-medium transition duration-300 text-center"
                >
                  Visit Store
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop"
                alt="Luxury Jewelry"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600">Trusted by</p>
                <p className="text-2xl font-bold text-gold-600">10,000+</p>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h3>
            <p className="text-lg text-gray-600">Handpicked selections from our premium collection</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                    {product.discount}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gold-600">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm transition duration-300"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`px-3 py-2 rounded-md text-sm transition duration-300 ${
                          addedToCart[product.id]
                            ? 'bg-green-500 text-white'
                            : 'bg-gold-600 hover:bg-gold-700 text-white'
                        }`}
                      >
                        {addedToCart[product.id] ? '✓ Added' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jewelry Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Collections</h3>
            <p className="text-lg text-gray-600">Explore our diverse range of jewelry categories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jewelryCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h4>
                  <p className="text-gray-600 mb-3">{category.description}</p>
                  <p className="text-gold-600 font-medium mb-4">{category.price}</p>
                  <div className="flex space-x-2">
                    <Link
                      to="/collections"
                      className="flex-1 bg-gold-600 hover:bg-gold-700 text-white py-2 rounded-md transition duration-300 text-center"
                    >
                      Explore
                    </Link>
                    <button
                      onClick={() => handleAddToCart({
                        id: category.id + 100, // Offset to avoid conflicts
                        name: category.name,
                        price: parseInt(category.price.split(' - ')[0].replace('₹', '').replace(',', '')),
                        image: category.image
                      })}
                      className="flex-1 border border-gold-600 text-gold-600 hover:bg-gold-600 hover:text-white py-2 rounded-md transition duration-300"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Sri Vasavi Jewels?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Certified Quality</h4>
              <p className="text-gray-600">All our jewelry comes with proper certification and quality assurance</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Best Prices</h4>
              <p className="text-gray-600">Competitive pricing with transparent gold rates and no hidden charges</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Handcrafted</h4>
              <p className="text-gray-600">Each piece is carefully handcrafted by skilled artisans with love</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Lifetime Support</h4>
              <p className="text-gray-600">Free cleaning, polishing, and maintenance services for life</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold text-gold-400 mb-4">Sri Vasavi Jewels</h4>
              <p className="text-gray-300 mb-4">
                Your trusted partner for exquisite jewelry since 1985. Creating memories that last a lifetime.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-gold-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-gold-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-gold-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><Link to="/collections" className="text-gray-300 hover:text-gold-400">Collections</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-gold-400">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-gold-400">Contact</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-gold-400">Services</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Categories</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-gold-400">Gold Jewelry</a></li>
                <li><a href="#" className="text-gray-300 hover:text-gold-400">Diamond Jewelry</a></li>
                <li><a href="#" className="text-gray-300 hover:text-gold-400">Silver Jewelry</a></li>
                <li><a href="#" className="text-gray-300 hover:text-gold-400">Wedding Collections</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact Info</h5>
              <div className="space-y-2 text-gray-300">
                <p>📍 123 Jewelry Street, Gold Market, City</p>
                <p>📞 +91 98765 43210</p>
                <p>✉️ info@srivasavijewels.com</p>
                <p>🕒 Mon-Sat: 10AM-8PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 Sri Vasavi Jewels. All rights reserved. | Designed with ❤️ by Mukesh Pabbathi
            </p>
          </div>
        </div>
      </footer>

      {/* Shopping Cart */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Home;
