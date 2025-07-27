import React, { useState } from 'react';
import ResponsiveImage from '../common/ResponsiveImage';

const ProductList = ({ products, onEdit, onDelete, onBulkAction, loading }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedProducts.length > 0) {
      onBulkAction(bulkAction, selectedProducts);
      setSelectedProducts([]);
      setBulkAction('');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStockStatus = (quantity) => {
    if (quantity > 10) return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
    if (quantity > 0) return { text: 'Limited', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-yellow-800">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-3">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="text-sm border border-yellow-300 rounded px-3 py-1 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Select Action</option>
                <option value="activate">Activate</option>
                <option value="deactivate">Deactivate</option>
                <option value="feature">Mark as Featured</option>
                <option value="unfeature">Remove Featured</option>
                <option value="delete">Delete</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="bg-yellow-600 text-white px-4 py-1 rounded text-sm hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedProducts.length === products.length && products.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">Product</span>
          </div>
          <div className="ml-auto flex items-center space-x-8 text-sm font-medium text-gray-500">
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="divide-y divide-gray-200">
        {products.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Get started by adding your first product.</p>
          </div>
        ) : (
          products.map((product) => {
            const stockStatus = getStockStatus(product.stock?.quantity || 0);
            
            return (
              <div key={product._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  {/* Checkbox and Product Info */}
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    
                    <div className="ml-4 flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <ResponsiveImage
                          image={product.images?.[0]}
                          alt={product.name}
                          size="thumbnail"
                          className="w-full h-full"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>
                          {product.isFeatured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">{product.metal}</span>
                          {product.purity && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">{product.purity}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="w-24 text-sm text-gray-900 text-center">
                    {product.category}
                  </div>

                  {/* Price */}
                  <div className="w-32 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(product.finalPrice)}
                    </div>
                    {product.discountPercentage > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </div>
                        <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {product.discountPercentage}% OFF
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="w-24 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Qty: {product.stock?.quantity || 0}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="w-20 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="w-32 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-yellow-600 hover:text-yellow-700 transition-colors"
                      title="Edit Product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => onDelete(product._id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Delete Product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    
                    <a
                      href={`/product/${product._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      title="View Product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductList;
