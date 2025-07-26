const { body } = require('express-validator');
const Configuration = require('../models/Configuration');

// Helper function to get valid options from configuration
const getValidOptions = async (configKey) => {
  try {
    const config = await Configuration.getConfig(configKey);
    return config || [];
  } catch (error) {
    console.error(`Error fetching ${configKey} configuration:`, error);
    return [];
  }
};

// Dynamic validation for category
const validateCategory = async (value) => {
  const validCategories = await getValidOptions('categories');
  if (validCategories.length > 0 && !validCategories.includes(value)) {
    throw new Error(`Invalid category. Valid options: ${validCategories.join(', ')}`);
  }
  return true;
};

// Dynamic validation for metal
const validateMetal = async (value) => {
  const validMetals = await getValidOptions('metals');
  if (validMetals.length > 0 && !validMetals.includes(value)) {
    throw new Error(`Invalid metal type. Valid options: ${validMetals.join(', ')}`);
  }
  return true;
};

// Dynamic validation for purity
const validatePurity = async (value) => {
  const validPurities = await getValidOptions('purities');
  if (validPurities.length > 0 && !validPurities.includes(value)) {
    throw new Error(`Invalid purity. Valid options: ${validPurities.join(', ')}`);
  }
  return true;
};

// Dynamic validation for weight unit
const validateWeightUnit = async (weightData) => {
  if (weightData) {
    const weight = JSON.parse(weightData);
    const validUnits = await getValidOptions('weight_units');
    if (validUnits.length > 0 && !validUnits.includes(weight.unit)) {
      throw new Error(`Invalid weight unit. Valid options: ${validUnits.join(', ')}`);
    }
  }
  return true;
};

// Dynamic validation for dimension unit
const validateDimensionUnit = async (dimensionData) => {
  if (dimensionData) {
    const dimensions = JSON.parse(dimensionData);
    const validUnits = await getValidOptions('dimension_units');
    if (validUnits.length > 0 && dimensions.unit && !validUnits.includes(dimensions.unit)) {
      throw new Error(`Invalid dimension unit. Valid options: ${validUnits.join(', ')}`);
    }
  }
  return true;
};

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
    .custom(validateCategory),
    
  body('metal')
    .custom(validateMetal),
    
  body('purity')
    .optional()
    .custom(validatePurity),
    
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
          if (typeof weight.value !== 'number' || weight.value < 0) {
            throw new Error('Weight value must be a positive number');
          }
          return validateWeightUnit(value);
        } catch (error) {
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
          throw new Error('Invalid stock format');
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
          throw new Error('Invalid features format');
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
          throw new Error('Invalid tags format');
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
          return validateDimensionUnit(value);
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
    .custom(validateCategory),
    
  body('metal')
    .optional()
    .custom(validateMetal),
    
  body('purity')
    .optional()
    .custom(validatePurity),
    
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
          if (typeof weight.value !== 'number' || weight.value < 0) {
            throw new Error('Weight value must be a positive number');
          }
          return validateWeightUnit(value);
        } catch (error) {
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
          const dimensions = JSON.parse(value);
          return validateDimensionUnit(value);
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
