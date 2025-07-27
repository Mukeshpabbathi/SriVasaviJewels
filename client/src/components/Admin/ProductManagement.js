import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import { API_ENDPOINTS } from '../../utils/api';
import ProductList from './ProductList';
import ProductFilters from './ProductFilters';

const ProductManagement = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    metal: '',
    minPrice: '',
    maxPrice: '',
    stockStatus: '',
    isActive: '',
    isFeatured: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Statistics
  const [stats, setStats] = useState({
    categories: [],
    metals: []
  });

  // Fetch products
  const fetchProducts = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...currentFilters
      });
      
      // Remove empty filters
      Object.keys(currentFilters).forEach(key => {
        if (!currentFilters[key]) {
          params.delete(key);
        }
      });
      
      const response = await axios.get(
        `${API_ENDPOINTS.ADMIN.PRODUCTS}?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setProducts(response.data.data.products);
        setCurrentPage(response.data.data.pagination.page);
        setTotalPages(response.data.data.pagination.pages);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchProducts(1, newFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  // Handle product creation/update
  const handleProductSave = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Append text fields
      Object.keys(productData).forEach(key => {
        if (key !== 'primaryImage' && key !== 'galleryImages') {
          if (typeof productData[key] === 'object' && productData[key] !== null) {
            formData.append(key, JSON.stringify(productData[key]));
          } else if (productData[key] !== undefined && productData[key] !== '') {
            formData.append(key, productData[key]);
          }
        }
      });
      
      // Append files
      if (productData.primaryImage) {
        formData.append('primaryImage', productData.primaryImage);
      }
      
      if (productData.galleryImages) {
        Array.from(productData.galleryImages).forEach(file => {
          formData.append('galleryImages', file);
        });
      }
      
      let response;
      if (editingProduct) {
        // Update product
        response = await axios.put(
          `${API_ENDPOINTS.ADMIN.PRODUCTS}/${editingProduct._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Create product
        response = await axios.post(
          API_ENDPOINTS.ADMIN.PRODUCTS,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
      
      if (response.data.success) {
        setShowForm(false);
        setEditingProduct(null);
        fetchProducts(currentPage);
        alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  // Handle product deletion
  const handleProductDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_ENDPOINTS.ADMIN.PRODUCTS}/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        fetchProducts(currentPage);
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  // Handle bulk operations
  const handleBulkOperation = async (action, updateData = null) => {
    if (selectedProducts.length === 0) {
      alert('Please select products first');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to ${action} ${selectedProducts.length} product(s)?`)) {
      return;
    }
    
    try {
      setBulkLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_ENDPOINTS.ADMIN.PRODUCTS}/bulk`,
        {
          action,
          productIds: selectedProducts,
          updateData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setSelectedProducts([]);
        fetchProducts(currentPage);
        alert(`Bulk ${action} completed successfully!`);
      }
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      alert(error.response?.data?.message || 'Failed to perform bulk operation');
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your jewelry products, inventory, and pricing
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingProduct(null);
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          stats={stats}
        />

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedProducts.length} product(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkOperation('activate')}
                  disabled={bulkLoading}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 disabled:opacity-50"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkOperation('deactivate')}
                  disabled={bulkLoading}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 disabled:opacity-50"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkOperation('feature')}
                  disabled={bulkLoading}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 disabled:opacity-50"
                >
                  Feature
                </button>
                <button
                  onClick={() => handleBulkOperation('delete')}
                  disabled={bulkLoading}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Product List */}
        <ProductList
          products={products}
          loading={loading}
          selectedProducts={selectedProducts}
          onSelectionChange={setSelectedProducts}
          onEdit={(product) => {
            setEditingProduct(product);
            setShowForm(true);
          }}
          onDelete={handleProductDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleProductSave}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;
