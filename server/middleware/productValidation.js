const { body } = require('express-validator');

// Simplified validation rules for creating a product
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
    
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
    
  body('discountPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount price must be a positive number')
    .custom((value, { req }) => {
      if (value && parseFloat(value) >= parseFloat(req.body.price)) {
        throw new Error('Discount price must be less than original price');
      }
      return true;
    }),
    
  body('weight')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const weight = JSON.parse(value);
          if (weight.value && (typeof weight.value !== 'number' || weight.value < 0)) {
            throw new Error('Weight value must be a positive number');
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
          if (typeof stock.quantity !== 'number' || stock.quantity < 0) {
            throw new Error('Stock quantity must be a non-negative number');
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
          if (dimensions.length && typeof dimensions.length !== 'number') {
            throw new Error('Length must be a number');
          }
          if (dimensions.width && typeof dimensions.width !== 'number') {
            throw new Error('Width must be a number');
          }
          if (dimensions.height && typeof dimensions.height !== 'number') {
            throw new Error('Height must be a number');
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

// Validation rules for updating a product (similar to create but all fields optional)
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
    
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
    
  body('discountPrice')
    .optional()
    .custom((value, { req }) => {
      if (value && req.body.price && parseFloat(value) >= parseFloat(req.body.price)) {
        throw new Error('Discount price must be less than original price');
      }
      return true;
    }),
    
  body('weight')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const weight = JSON.parse(value);
          if (weight.value && (typeof weight.value !== 'number' || weight.value < 0)) {
            throw new Error('Weight value must be a positive number');
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
          if (typeof stock.quantity !== 'number' || stock.quantity < 0) {
            throw new Error('Stock quantity must be a non-negative number');
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
