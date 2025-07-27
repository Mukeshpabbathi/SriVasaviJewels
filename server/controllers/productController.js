const Product = require('../models/Product');
const { deleteImage, processUploadedImages, getImageUrl, hasCloudinaryCredentials } = require('../config/cloudinary');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

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

// Helper function to process uploaded files with image processing
const processUploadedFiles = async (req) => {
  let images = [];
  
  if (req.files) {
    try {
      // Handle primary image
      if (req.files.primaryImage && req.files.primaryImage.length > 0) {
        console.log('Processing primary image...');
        const processedPrimary = await processUploadedImages(req.files.primaryImage, 'primary');
        
        if (processedPrimary.length > 0) {
          images.push({
            ...processedPrimary[0],
            isPrimary: true,
            alt: `${req.body.name || 'Product'} - Primary Image`
          });
        }
      }
      
      // Handle gallery images
      if (req.files.galleryImages && req.files.galleryImages.length > 0) {
        console.log(`Processing ${req.files.galleryImages.length} gallery images...`);
        const processedGallery = await processUploadedImages(req.files.galleryImages, 'gallery');
        
        processedGallery.forEach((processedImage, index) => {
          images.push({
            ...processedImage,
            isPrimary: false,
            alt: `${req.body.name || 'Product'} - Gallery Image ${index + 1}`
          });
        });
      }
      
      console.log(`Successfully processed ${images.length} images`);
      
    } catch (error) {
      console.error('Error processing uploaded files:', error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }
  
  return images;
};

// Helper function to safely parse JSON with number conversion
const safeJSONParse = (jsonString, defaultValue = {}) => {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Convert string numbers to actual numbers
    if (parsed && typeof parsed === 'object') {
      Object.keys(parsed).forEach(key => {
        if (typeof parsed[key] === 'string' && !isNaN(parsed[key]) && parsed[key] !== '') {
          parsed[key] = parseFloat(parsed[key]);
        }
      });
    }
    
    return parsed;
  } catch (e) {
    console.log(`JSON parse error for: ${jsonString}`, e.message);
    return defaultValue;
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', {
      name: req.body.name,
      category: req.body.category,
      metal: req.body.metal,
      price: req.body.price,
      hasFiles: !!req.files,
      filesCount: req.files ? Object.keys(req.files).length : 0
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
          value: err.value
        }))
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
      discountPercentage,
      stock,
      dimensions,
      features,
      tags,
      isActive,
      isFeatured,
      seoTitle,
      seoDescription,
      pricing
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !metal || !purity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        errors: [
          { field: 'required', message: 'Name, description, category, metal, and purity are required' }
        ]
      });
    }
    
    // Process uploaded images with automatic format conversion
    let images = [];
    try {
      images = await processUploadedFiles(req);
      console.log(`Processed ${images.length} images for product`);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Image processing failed',
        errors: [{ field: 'images', message: error.message }]
      });
    }
    
    // Parse JSON fields safely with number conversion
    let parsedWeight = { value: 0, unit: 'grams' };
    if (weight) {
      parsedWeight = safeJSONParse(weight, { value: 0, unit: 'grams' });
    }
    
    let parsedStock = { quantity: 0 };
    if (stock) {
      parsedStock = safeJSONParse(stock, { quantity: 0 });
    } else if (req.body['stock.quantity']) {
      parsedStock = { quantity: parseInt(req.body['stock.quantity']) || 0 };
    }
    
    let parsedDimensions = undefined;
    if (dimensions) {
      parsedDimensions = safeJSONParse(dimensions, undefined);
    }
    
    let parsedFeatures = [];
    if (features) {
      parsedFeatures = safeJSONParse(features, []);
    }
    
    let parsedTags = [];
    if (tags) {
      parsedTags = safeJSONParse(tags, []);
    }
    
    // Parse pricing data
    let parsedPricing = { wastage: 0, makingCharges: 0 };
    if (pricing) {
      parsedPricing = safeJSONParse(pricing, { wastage: 0, makingCharges: 0 });
      parsedPricing.wastage = parseFloat(parsedPricing.wastage) || 0;
      parsedPricing.makingCharges = parseFloat(parsedPricing.makingCharges) || 0;
    }

    // Create product
    const productData = {
      name,
      description,
      category,
      subcategory: subcategory || '',
      metal,
      purity,
      weight: parsedWeight,
      price: 0, // Will be calculated dynamically
      discountPercentage: discountPercentage ? parseFloat(discountPercentage) : 0,
      images,
      stock: parsedStock,
      dimensions: parsedDimensions,
      features: parsedFeatures,
      tags: parsedTags,
      isActive: isActive === 'true' || isActive === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      createdBy: req.user._id,
      pricing: parsedPricing
    };

    console.log('Creating product with processed data:', {
      ...productData,
      images: images.map(img => ({ url: img.url, isPrimary: img.isPrimary })),
      weight: parsedWeight,
      stock: parsedStock
    });
    
    const product = await Product.create(productData);
    
    // Calculate price based on current metal rates
    try {
      await product.updatePriceFromRates();
      await product.save();
      console.log(`Price calculated for new product: ${product.name} = ₹${product.finalPrice}`);
    } catch (priceError) {
      console.error('Price calculation error for new product:', priceError.message);
      // Continue even if price calculation fails
    }
    
    await product.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully with optimized images',
      data: product
    });
    
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      return res.status(400).json({
        success: false,
        message: 'Database validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
          value: err.value
        }))
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
      discountPercentage,
      stock,
      dimensions,
      features,
      tags,
      isActive,
      isFeatured,
      seoTitle,
      seoDescription,
      removeImages,
      pricing
    } = req.body;
    
    // Handle image removal
    if (removeImages) {
      const imagesToRemove = JSON.parse(removeImages);
      for (const imageUrl of imagesToRemove) {
        try {
          await deleteImage(imageUrl);
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
    let newImages = [];
    try {
      newImages = await processUploadedFiles(req);
      console.log(`Processed ${newImages.length} new images for product update`);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Image processing failed',
        errors: [{ field: 'images', message: error.message }]
      });
    }
    
    // Add new images to existing ones
    if (newImages.length > 0) {
      // If new primary image is uploaded, set all existing images as non-primary
      if (newImages.some(img => img.isPrimary)) {
        product.images.forEach(img => img.isPrimary = false);
      }
      
      product.images.push(...newImages);
    }
    
    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (metal) product.metal = metal;
    if (purity) product.purity = purity;
    if (weight) {
      product.weight = safeJSONParse(weight, { value: 0, unit: 'grams' });
    }
    // Price is calculated dynamically, not set manually
    if (discountPercentage !== undefined) {
      product.discountPercentage = discountPercentage ? parseFloat(discountPercentage) : 0;
    }
    if (stock) {
      product.stock = safeJSONParse(stock, { quantity: 0 });
    }
    if (dimensions) {
      product.dimensions = safeJSONParse(dimensions, undefined);
    }
    if (features) {
      product.features = safeJSONParse(features, []);
    }
    if (tags) {
      product.tags = safeJSONParse(tags, []);
    }
    if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (seoTitle !== undefined) product.seoTitle = seoTitle;
    if (seoDescription !== undefined) product.seoDescription = seoDescription;
    
    // Update pricing fields
    if (pricing) {
      const pricingData = safeJSONParse(pricing, {});
      if (pricingData.wastage !== undefined) {
        product.pricing.wastage = parseFloat(pricingData.wastage);
      }
      if (pricingData.makingCharges !== undefined) {
        product.pricing.makingCharges = parseFloat(pricingData.makingCharges);
      }
    }
    
    // Recalculate price if pricing fields or weight/metal/purity changed
    if (pricing || weight || metal || purity) {
      try {
        await product.updatePriceFromRates();
        console.log(`Price recalculated for product: ${product.name}`);
      } catch (priceError) {
        console.error('Price recalculation error:', priceError.message);
        // Continue with save even if price calculation fails
      }
    }
    
    product.updatedBy = req.user._id;
    
    await product.save();
    await product.populate('createdBy updatedBy', 'name email');
    
    res.json({
      success: true,
      message: 'Product updated successfully with optimized images',
      data: product
    });
    
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      return res.status(400).json({
        success: false,
        message: 'Database validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error updating product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
    
    // Delete all associated images
    for (const image of product.images) {
      try {
        await deleteImage(image.url);
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
        
        // Delete images
        for (const product of productsToDelete) {
          for (const image of product.images) {
            try {
              await deleteImage(image.url);
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
