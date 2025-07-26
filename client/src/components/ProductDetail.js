import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ResponsiveImage from './common/ResponsiveImage';
import CartIcon from './Cart/CartIcon';
import ShoppingCart from './Cart/ShoppingCart';
import WishlistIcon from './Wishlist/WishlistIcon';
import AddToWishlistButton from './Wishlist/AddToWishlistButton';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getWishlistCount } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/products/${id}`);
        
        if (response.data.success) {
          setProduct(response.data.data.product);
          setRelatedProducts(response.data.data.relatedProducts || []);
        } else {
          navigate('/collections');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/collections');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
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
              <div className="flex items-center space-x-4">
                <Link to="/wishlist">
                  <WishlistIcon />
                </Link>
                <CartIcon onClick={() => setIsCartOpen(true)} />
              </div>
            </div>
          </div>
        </nav>

        {/* Loading State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded animate-pulse"></div>
              <div className="bg-gray-200 h-4 rounded animate-pulse"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3 animate-pulse"></div>
              <div className="bg-gray-200 h-12 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link 
            to="/collections" 
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Back to Collections
          </Link>
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
              <Link to="/about" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                Contact
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/wishlist">
                <WishlistIcon />
              </Link>
              <CartIcon onClick={() => setIsCartOpen(true)} />
            </div>
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
              <Link to="/collections" className="text-gray-500 hover:text-gray-700">Collections</Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
              <ResponsiveImage
                image={product.images?.[selectedImageIndex]}
                alt={product.name}
                size="large"
                className="w-full h-full"
              />
            </div>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-yellow-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ResponsiveImage
                      image={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      size="small"
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500">{product.category}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{product.metal}</span>
                {product.purity && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{product.purity}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.finalPrice)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                      {product.discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  product.stock.quantity > 10 ? 'bg-green-500' :
                  product.stock.quantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {product.stock.quantity > 10 ? 'In Stock' :
                   product.stock.quantity > 0 ? `Only ${product.stock.quantity} left` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 text-gray-900">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Metal:</span>
                  <span className="ml-2 text-gray-900">{product.metal}</span>
                </div>
                {product.purity && (
                  <div>
                    <span className="text-gray-500">Purity:</span>
                    <span className="ml-2 text-gray-900">{product.purity}</span>
                  </div>
                )}
                {product.weight && product.weight.value > 0 && (
                  <div>
                    <span className="text-gray-500">Weight:</span>
                    <span className="ml-2 text-gray-900">{product.weight.value} {product.weight.unit}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock.quantity, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addedToCart || product.stock.quantity === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    product.stock.quantity === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {product.stock.quantity === 0
                    ? 'Out of Stock'
                    : addedToCart
                    ? 'Added to Cart!'
                    : `Add ${quantity} to Cart`
                  }
                </button>
                
                <AddToWishlistButton 
                  product={product} 
                  size="large"
                  className="px-6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <Link to={`/product/${relatedProduct._id}`}>
                      <div className="aspect-square">
                        <ResponsiveImage
                          image={relatedProduct.images?.[0]}
                          alt={relatedProduct.name}
                          size="medium"
                          className="w-full h-full"
                        />
                      </div>
                    </Link>
                    
                    {/* Wishlist Button */}
                    <div className="absolute top-2 right-2">
                      <AddToWishlistButton 
                        product={relatedProduct} 
                        variant="icon" 
                        size="small"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <Link to={`/product/${relatedProduct._id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-yellow-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <p className="text-yellow-600 font-bold">
                      {formatPrice(relatedProduct.finalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shopping Cart */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default ProductDetail;
