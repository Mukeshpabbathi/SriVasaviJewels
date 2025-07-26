const express = require('express');
const {
  getPublicProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getPublicProductById
} = require('../controllers/publicProductController');

const {
  getSearchSuggestions,
  advancedSearch,
  getPopularSearches,
  trackSearch
} = require('../controllers/searchController');

const router = express.Router();

// Search routes
router.get('/search/suggestions', getSearchSuggestions);
router.get('/search', advancedSearch);
router.get('/search/popular', getPopularSearches);
router.post('/search/track', trackSearch);

// Public product routes (no authentication required)
router.get('/featured', getFeaturedProducts);
router.get('/categories', getProductsByCategory);
router.get('/:id', getPublicProductById);
router.get('/', getPublicProducts);

module.exports = router;
