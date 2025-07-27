const { body } = require('express-validator');

// Validation rules for creating a product
const validateCreateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
    
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
    
  body('category')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category is required'),
    
  body('metal')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Metal type is required'),
    
  body('purity')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Purity is required')
    .isIn(['14K', '18K', '22K', '24K', '925 Silver', 'Platinum 950', 'Not Applicable'])
    .withMessage('Invalid purity value. Please select from available options.'),
    
  body('discountPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount price must be a positive number'),
    
  body('weight')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const weight = JSON.parse(value);
          // Convert string numbers to actual numbers
          if (weight.value) {
            const numValue = parseFloat(weight.value);
            if (isNaN(numValue) || numValue < 0) {
              throw new Error('Weight value must be a positive number');
            }
          }
          if (weight.unit && !['grams', 'carats'].includes(weight.unit)) {
            throw new Error('Weight unit must be either grams or carats');
          }
        } catch (error) {
          if (error.message.includes('Weight')) {
            throw error;
          }
          throw new Error('Invalid weight format - must be valid JSON');
        }
      }
      return true;
    }),
    
  body('stock')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const stock = JSON.parse(value);
          // Convert string numbers to actual numbers
          if (stock.quantity !== undefined) {
            const numQuantity = parseInt(stock.quantity);
            if (isNaN(numQuantity) || numQuantity < 0) {
              throw new Error('Stock quantity must be a non-negative number');
            }
          }
        } catch (error) {
          if (error.message.includes('Stock')) {
            throw error;
          }
          throw new Error('Invalid stock format - must be valid JSON');
        }
      }
      return true;
    }),
    
  // Direct stock quantity validation (for form field)
  body('stock.quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
    
  body('features')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const features = JSON.parse(value);
          if (!Array.isArray(features)) {
            throw new Error('Features must be an array');
          }
        } catch (error) {
          if (error.message.includes('Features')) {
            throw error;
          }
          throw new Error('Invalid features format - must be valid JSON array');
        }
      }
      return true;
    }),
    
  body('tags')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const tags = JSON.parse(value);
          if (!Array.isArray(tags)) {
            throw new Error('Tags must be an array');
          }
        } catch (error) {
          if (error.message.includes('Tags')) {
            throw error;
          }
          throw new Error('Invalid tags format - must be valid JSON array');
        }
      }
      return true;
    }),
    
  body('dimensions')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const dimensions = JSON.parse(value);
          if (dimensions.length && (isNaN(parseFloat(dimensions.length)) || parseFloat(dimensions.length) < 0)) {
            throw new Error('Length must be a positive number');
          }
          if (dimensions.width && (isNaN(parseFloat(dimensions.width)) || parseFloat(dimensions.width) < 0)) {
            throw new Error('Width must be a positive number');
          }
          if (dimensions.height && (isNaN(parseFloat(dimensions.height)) || parseFloat(dimensions.height) < 0)) {
            throw new Error('Height must be a positive number');
          }
          if (dimensions.unit && !['mm', 'cm', 'inches'].includes(dimensions.unit)) {
            throw new Error('Dimension unit must be mm, cm, or inches');
          }
        } catch (error) {
          if (error.message.includes('must be') || error.message.includes('Length') || error.message.includes('Width') || error.message.includes('Height') || error.message.includes('Dimension')) {
            throw error;
          }
          throw new Error('Invalid dimensions format - must be valid JSON');
        }
      }
      return true;
    }),
    
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('SEO title must not exceed 60 characters'),
    
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description must not exceed 160 characters')
];

// Validation rules for updating a product
const validateUpdateProduct = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
    
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category cannot be empty'),
    
  body('metal')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Metal type cannot be empty'),
    
  body('purity')
    .optional()
    .trim()
    .isIn(['14K', '18K', '22K', '24K', '925 Silver', 'Platinum 950', 'Not Applicable'])
    .withMessage('Invalid purity value. Please select from available options.'),
    
  body('discountPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount price must be a positive number'),
    
  body('weight')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const weight = JSON.parse(value);
          if (weight.value) {
            const numValue = parseFloat(weight.value);
            if (isNaN(numValue) || numValue < 0) {
              throw new Error('Weight value must be a positive number');
            }
          }
          if (weight.unit && !['grams', 'carats'].includes(weight.unit)) {
            throw new Error('Weight unit must be either grams or carats');
          }
        } catch (error) {
          if (error.message.includes('Weight')) {
            throw error;
          }
          throw new Error('Invalid weight format');
        }
      }
      return true;
    }),
    
  body('stock')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const stock = JSON.parse(value);
          if (stock.quantity !== undefined) {
            const numQuantity = parseInt(stock.quantity);
            if (isNaN(numQuantity) || numQuantity < 0) {
              throw new Error('Stock quantity must be a non-negative number');
            }
          }
        } catch (error) {
          if (error.message.includes('Stock')) {
            throw error;
          }
          throw new Error('Invalid stock format');
        }
      }
      return true;
    }),
    
  body('stock.quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
    
  body('dimensions')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          JSON.parse(value);
        } catch (error) {
          throw new Error('Invalid dimensions format');
        }
      }
      return true;
    }),
    
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('SEO title must not exceed 60 characters'),
    
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description must not exceed 160 characters')
];

// Validation for bulk operations
const validateBulkOperation = [
  body('action')
    .isIn(['delete', 'activate', 'deactivate', 'feature', 'unfeature', 'update'])
    .withMessage('Invalid bulk action'),
    
  body('productIds')
    .isArray({ min: 1 })
    .withMessage('Product IDs must be a non-empty array')
    .custom((value) => {
      // Check if all IDs are valid MongoDB ObjectIds
      const mongoose = require('mongoose');
      for (const id of value) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid product ID format');
        }
      }
      return true;
    }),
    
  body('updateData')
    .optional()
    .isObject()
    .withMessage('Update data must be an object')
];

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  validateBulkOperation
};
