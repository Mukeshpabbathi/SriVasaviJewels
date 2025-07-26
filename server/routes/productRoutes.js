const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkOperations
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadFields } = require('../config/cloudinary');
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateBulkOperation
} = require('../middleware/productValidation');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(admin);

// Product CRUD routes
router.route('/')
  .get(getAllProducts)
  .post(uploadFields, validateCreateProduct, createProduct);

router.route('/bulk')
  .post(validateBulkOperation, bulkOperations);

router.route('/:id')
  .get(getProductById)
  .put(uploadFields, validateUpdateProduct, updateProduct)
  .delete(deleteProduct);

module.exports = router;
