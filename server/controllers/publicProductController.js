const Product = require('../models/Product');

// @desc    Get all active products for public display
// @route   GET /api/products
// @access  Public
const getPublicProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Build query object - only active products
    let query = { isActive: true };
    
    // Search functionality
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }
    
    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }
    
    // Filter by metal
    if (req.query.metal && req.query.metal !== 'all') {
      query.metal = req.query.metal;
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Filter by featured status
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }
    
    // Sorting
    let sortBy = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortBy[sortField] = sortOrder;
    } else {
      sortBy = { isFeatured: -1, createdAt: -1 }; // Featured first, then newest
    }
    
    // Execute query
    const products = await Product.find(query)
      .select('-createdBy -updatedBy -__v') // Exclude admin fields
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    // Get category statistics
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get metal statistics
    const metalStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$metal', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get price range
    const priceStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
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
          metals: metalStats,
          priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 }
        }
      }
    });
    
  } catch (error) {
    console.error('Get public products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting products'
    });
  }
};

// @desc    Get featured products for home page
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .select('-createdBy -updatedBy -__v')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      data: products
    });
    
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting featured products'
    });
  }
};

// @desc    Get products by category for home page
// @route   GET /api/products/categories
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          sampleProduct: { $first: '$$ROOT' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting products by category'
    });
  }
};

// @desc    Get single product by ID for public display
// @route   GET /api/products/:id
// @access  Public
const getPublicProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).select('-createdBy -updatedBy -__v');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Get related products (same category, different product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .select('-createdBy -updatedBy -__v')
      .limit(4)
      .sort({ isFeatured: -1, createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
    
  } catch (error) {
    console.error('Get public product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting product'
    });
  }
};

module.exports = {
  getPublicProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getPublicProductById
};
