const Product = require('../models/Product');
const { deleteImage } = require('../config/cloudinary');
const { validationResult } = require('express-validator');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query object
    let query = {};
    
    // Search functionality
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by metal
    if (req.query.metal) {
      query.metal = req.query.metal;
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Filter by stock status
    if (req.query.stockStatus) {
      query['stock.status'] = req.query.stockStatus;
    }
    
    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }
    
    // Filter by featured status
    if (req.query.isFeatured !== undefined) {
      query.isFeatured = req.query.isFeatured === 'true';
    }
    
    // Sorting
    let sortBy = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortBy[sortField] = sortOrder;
    } else {
      sortBy = { createdAt: -1 }; // Default sort by newest first
    }
    
    // Execute query
    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    // Get category and metal statistics
    const categoryStats = await Product.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const metalStats = await Product.aggregate([
      { $match: query },
      { $group: { _id: '$metal', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          categories: categoryStats,
          metals: metalStats
        }
      }
    });
    
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting products'
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/admin/products/:id
// @access  Private/Admin
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting product'
    });
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const {
      name,
      description,
      category,
      subcategory,
      metal,
      purity,
      weight,
      price,
      discountPrice,
      stock,
      dimensions,
      features,
      tags,
      isActive,
      isFeatured,
      seoTitle,
      seoDescription
    } = req.body;
    
    // Process uploaded images
    let images = [];
    if (req.files) {
      if (req.files.primaryImage) {
        images.push({
          url: req.files.primaryImage[0].path,
          alt: `${name} - Primary Image`,
          isPrimary: true
        });
      }
      
      if (req.files.galleryImages) {
        req.files.galleryImages.forEach((file, index) => {
          images.push({
            url: file.path,
            alt: `${name} - Gallery Image ${index + 1}`,
            isPrimary: false
          });
        });
      }
    }
    
    // Create product
    const product = await Product.create({
      name,
      description,
      category,
      subcategory,
      metal,
      purity,
      weight: weight ? JSON.parse(weight) : undefined,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      images,
      stock: stock ? JSON.parse(stock) : { quantity: 0 },
      dimensions: dimensions ? JSON.parse(dimensions) : undefined,
      features: features ? JSON.parse(features) : [],
      tags: tags ? JSON.parse(tags) : [],
      isActive: isActive === 'true',
      isFeatured: isFeatured === 'true',
      seoTitle,
      seoDescription,
      createdBy: req.user._id
    });
    
    await product.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
    
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating product'
    });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const {
      name,
      description,
      category,
      subcategory,
      metal,
      purity,
      weight,
      price,
      discountPrice,
      stock,
      dimensions,
      features,
      tags,
      isActive,
      isFeatured,
      seoTitle,
      seoDescription,
      removeImages
    } = req.body;
    
    // Handle image removal
    if (removeImages) {
      const imagesToRemove = JSON.parse(removeImages);
      for (const imageUrl of imagesToRemove) {
        // Extract public_id from Cloudinary URL for deletion
        const publicId = imageUrl.split('/').pop().split('.')[0];
        try {
          await deleteImage(publicId);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
      
      // Remove images from product
      product.images = product.images.filter(
        img => !imagesToRemove.includes(img.url)
      );
    }
    
    // Process new uploaded images
    if (req.files) {
      if (req.files.primaryImage) {
        // Set all existing images as non-primary
        product.images.forEach(img => img.isPrimary = false);
        
        product.images.push({
          url: req.files.primaryImage[0].path,
          alt: `${name || product.name} - Primary Image`,
          isPrimary: true
        });
      }
      
      if (req.files.galleryImages) {
        req.files.galleryImages.forEach((file, index) => {
          product.images.push({
            url: file.path,
            alt: `${name || product.name} - Gallery Image ${index + 1}`,
            isPrimary: false
          });
        });
      }
    }
    
    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (metal) product.metal = metal;
    if (purity) product.purity = purity;
    if (weight) product.weight = JSON.parse(weight);
    if (price) product.price = parseFloat(price);
    if (discountPrice !== undefined) {
      product.discountPrice = discountPrice ? parseFloat(discountPrice) : undefined;
    }
    if (stock) product.stock = JSON.parse(stock);
    if (dimensions) product.dimensions = JSON.parse(dimensions);
    if (features) product.features = JSON.parse(features);
    if (tags) product.tags = JSON.parse(tags);
    if (isActive !== undefined) product.isActive = isActive === 'true';
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true';
    if (seoTitle) product.seoTitle = seoTitle;
    if (seoDescription) product.seoDescription = seoDescription;
    
    product.updatedBy = req.user._id;
    
    await product.save();
    await product.populate('createdBy updatedBy', 'name email');
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
    
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Delete all associated images from Cloudinary
    for (const image of product.images) {
      const publicId = image.url.split('/').pop().split('.')[0];
      try {
        await deleteImage(publicId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product'
    });
  }
};

// @desc    Bulk operations on products
// @route   POST /api/admin/products/bulk
// @access  Private/Admin
const bulkOperations = async (req, res) => {
  try {
    const { action, productIds, updateData } = req.body;
    
    if (!action || !productIds || !Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bulk operation data'
      });
    }
    
    let result;
    
    switch (action) {
      case 'delete':
        // Delete multiple products
        const productsToDelete = await Product.find({ _id: { $in: productIds } });
        
        // Delete images from Cloudinary
        for (const product of productsToDelete) {
          for (const image of product.images) {
            const publicId = image.url.split('/').pop().split('.')[0];
            try {
              await deleteImage(publicId);
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          }
        }
        
        result = await Product.deleteMany({ _id: { $in: productIds } });
        break;
        
      case 'activate':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { isActive: true, updatedBy: req.user._id }
        );
        break;
        
      case 'deactivate':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { isActive: false, updatedBy: req.user._id }
        );
        break;
        
      case 'feature':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { isFeatured: true, updatedBy: req.user._id }
        );
        break;
        
      case 'unfeature':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { isFeatured: false, updatedBy: req.user._id }
        );
        break;
        
      case 'update':
        if (!updateData) {
          return res.status(400).json({
            success: false,
            message: 'Update data is required for bulk update'
          });
        }
        
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { ...updateData, updatedBy: req.user._id }
        );
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid bulk action'
        });
    }
    
    res.json({
      success: true,
      message: `Bulk ${action} operation completed successfully`,
      data: {
        modifiedCount: result.modifiedCount || result.deletedCount,
        matchedCount: result.matchedCount || productIds.length
      }
    });
    
  } catch (error) {
    console.error('Bulk operations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error performing bulk operation'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkOperations
};
