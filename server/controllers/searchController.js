const Product = require('../models/Product');

// @desc    Get search suggestions
// @route   GET /api/products/search/suggestions
// @access  Public
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchRegex = new RegExp(q, 'i');
    
    // Get product suggestions
    const productSuggestions = await Product.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ]
    })
    .select('name category')
    .limit(5);

    // Get category suggestions
    const categorySuggestions = await Product.aggregate([
      {
        $match: {
          isActive: true,
          category: searchRegex
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $limit: 3
      }
    ]);

    // Get metal suggestions
    const metalSuggestions = await Product.aggregate([
      {
        $match: {
          isActive: true,
          metal: searchRegex
        }
      },
      {
        $group: {
          _id: '$metal',
          count: { $sum: 1 }
        }
      },
      {
        $limit: 3
      }
    ]);

    // Format suggestions
    const suggestions = [];

    // Add product suggestions
    productSuggestions.forEach(product => {
      suggestions.push({
        type: 'product',
        name: product.name,
        category: product.category,
        id: product._id
      });
    });

    // Add category suggestions
    categorySuggestions.forEach(category => {
      suggestions.push({
        type: 'category',
        name: category._id,
        count: category.count
      });
    });

    // Add metal suggestions
    metalSuggestions.forEach(metal => {
      suggestions.push({
        type: 'metal',
        name: metal._id,
        count: metal.count
      });
    });

    // Add tag suggestions
    const tagSuggestions = await Product.aggregate([
      {
        $match: {
          isActive: true,
          tags: { $regex: searchRegex }
        }
      },
      {
        $unwind: '$tags'
      },
      {
        $match: {
          tags: searchRegex
        }
      },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      {
        $limit: 3
      }
    ]);

    tagSuggestions.forEach(tag => {
      suggestions.push({
        type: 'tag',
        name: tag._id,
        count: tag.count
      });
    });

    res.json({
      success: true,
      data: suggestions.slice(0, 8) // Limit to 8 suggestions
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching search suggestions'
    });
  }
};

// @desc    Advanced search with filters
// @route   GET /api/products/search
// @access  Public
const advancedSearch = async (req, res) => {
  try {
    const {
      q,
      category,
      metal,
      purity,
      minPrice,
      maxPrice,
      tags,
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let query = { isActive: true };
    let sortOptions = {};

    // Text search
    if (q && q.length >= 2) {
      const searchRegex = new RegExp(q, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { metal: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Metal filter
    if (metal && metal !== 'all') {
      query.metal = metal;
    }

    // Purity filter
    if (purity && purity !== 'all') {
      query.purity = purity;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Sorting
    switch (sortBy) {
      case 'price':
        sortOptions.price = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'name':
        sortOptions.name = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'popular':
        sortOptions.isFeatured = -1;
        sortOptions.createdAt = -1;
        break;
      case 'relevance':
      default:
        // For relevance, we'll use a combination of featured status and creation date
        sortOptions.isFeatured = -1;
        sortOptions.createdAt = -1;
        break;
    }

    // Execute search
    const products = await Product.find(query)
      .select('-createdBy -updatedBy -__v')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    // Get search facets for filters
    const facets = await Product.aggregate([
      { $match: query },
      {
        $facet: {
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          metals: [
            { $group: { _id: '$metal', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          purities: [
            { $group: { _id: '$purity', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          priceRanges: [
            {
              $bucket: {
                groupBy: '$price',
                boundaries: [0, 25000, 50000, 100000, 200000, 500000],
                default: '500000+',
                output: { count: { $sum: 1 } }
              }
            }
          ],
          tags: [
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        facets: facets[0],
        query: {
          q,
          category,
          metal,
          purity,
          minPrice,
          maxPrice,
          tags,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search'
    });
  }
};

// @desc    Get popular search terms
// @route   GET /api/products/search/popular
// @access  Public
const getPopularSearches = async (req, res) => {
  try {
    // In a real application, you would track search queries and their frequency
    // For now, we'll return popular categories and products
    
    const popularCategories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const popularTags = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const popularSearches = [
      ...popularCategories.map(cat => cat._id),
      ...popularTags.map(tag => tag._id)
    ].slice(0, 8);

    res.json({
      success: true,
      data: popularSearches
    });

  } catch (error) {
    console.error('Popular searches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular searches'
    });
  }
};

// @desc    Save search query (for analytics)
// @route   POST /api/products/search/track
// @access  Public
const trackSearch = async (req, res) => {
  try {
    const { query, results, userId } = req.body;
    
    // In a real application, you would save this to a SearchAnalytics collection
    // For now, we'll just acknowledge the request
    
    console.log('Search tracked:', { query, results: results?.length || 0, userId });
    
    res.json({
      success: true,
      message: 'Search tracked successfully'
    });

  } catch (error) {
    console.error('Track search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking search'
    });
  }
};

module.exports = {
  getSearchSuggestions,
  advancedSearch,
  getPopularSearches,
  trackSearch
};
