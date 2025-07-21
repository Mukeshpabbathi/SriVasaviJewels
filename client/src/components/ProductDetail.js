import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  // Mock product data - in real app, this would come from API
  const product = {
    id: parseInt(id),
    name: 'Royal Gold Necklace Set',
    price: 85000,
    originalPrice: 95000,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=600&fit=crop'
    ],
    description: 'Exquisite handcrafted gold necklace set featuring traditional Indian motifs with contemporary design elements. This stunning piece is perfect for weddings, festivals, and special occasions.',
    features: [
      '22K Gold Purity',
      'Handcrafted by Master Artisans',
      'Traditional Indian Design',
      'Includes Matching Earrings',
      'BIS Hallmarked',
      'Lifetime Warranty'
    ],
    specifications: {
      'Metal': '22K Gold',
      'Weight': '45.5 grams',
      'Length': '18 inches',
      'Clasp': 'Secure Hook',
      'Occasion': 'Wedding, Festival',
      'Care': 'Store in soft cloth'
    },
    rating: 4.8,
    reviews: 124,
    inStock: true,
    category: 'necklaces'
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
    }
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const relatedProducts = [
    {
      id: 2,
      name: 'Diamond Solitaire Ring',
      price: 125000,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Pearl Drop Earrings',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Gold Tennis Bracelet',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="text-2xl font-bold text-gold-600">Sri Vasavi Jewels</Link>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gold-600">Home</Link>
              <Link to="/collections" className="text-gray-700 hover:text-gold-600">Collections</Link>
              <Link to="/about" className="text-gray-700 hover:text-gold-600">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-gold-600">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-gray-500">
          <Link to="/" className="hover:text-gold-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/collections" className="hover:text-gold-600">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-md overflow-hidden ${
                    selectedImage === index ? 'border-gold-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gold-600">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-l-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center border-t border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-r-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gold-600 hover:bg-gold-700 text-white py-3 px-6 rounded-md font-medium transition duration-300"
                >
                  Add to Cart
                </button>
                <button className="flex-1 border border-gold-600 text-gold-600 hover:bg-gold-600 hover:text-white py-3 px-6 rounded-md font-medium transition duration-300">
                  Buy Now
                </button>
              </div>

              {showAddedMessage && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-sm">
                  ✅ Added to cart successfully!
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-medium text-gray-700">{key}:</dt>
                    <dd className="text-gray-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h3>
                  <p className="text-gold-600 font-bold">₹{relatedProduct.price.toLocaleString()}</p>
                  <Link
                    to={`/product/${relatedProduct.id}`}
                    className="mt-3 block w-full bg-gold-600 hover:bg-gold-700 text-white py-2 px-4 rounded-md text-center transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
