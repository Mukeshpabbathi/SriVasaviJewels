const express = require('express');
const {
  getPublicProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getPublicProductById
} = require('../controllers/publicProductController');

const router = express.Router();

// Public product routes (no authentication required)
router.get('/', getPublicProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getProductsByCategory);
router.get('/:id', getPublicProductById);

module.exports = router;
