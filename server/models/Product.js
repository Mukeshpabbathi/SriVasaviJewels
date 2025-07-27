const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  metal: {
    type: String,
    required: [true, 'Metal type is required'],
    trim: true
  },
  purity: {
    type: String,
    enum: {
      values: ['14K', '18K', '22K', '24K', '925 Silver', 'Platinum 950', 'Not Applicable'],
      message: 'Invalid purity value. Please select from available options.'
    },
    required: [true, 'Purity is required']
  },
  weight: {
    value: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      default: 0
    },
    unit: {
      type: String,
      enum: ['grams', 'carats'],
      default: 'grams'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  // Dynamic pricing fields
  pricing: {
    // Raw material costs
    wastage: {
      type: Number,
      default: 0,
      min: 0,
      description: 'Wastage in grams/carats'
    },
    makingCharges: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      description: 'Making charges in INR'
    },
    
    // Calculated prices (auto-updated when rates change)
    metalRate: {
      type: Number,
      default: 0,
      description: 'Current metal rate per gram/carat'
    },
    metalCost: {
      type: Number,
      default: 0,
      description: 'Cost of metal (weight + wastage) × rate'
    },
    calculatedPrice: {
      type: Number,
      default: 0,
      description: 'Auto-calculated price based on current rates'
    },
    
    // Manual price override (optional)
    manualPrice: {
      type: Number,
      min: 0,
      description: 'Manual price override (if set, ignores calculated price)'
    },
    
    // Price calculation details
    priceCalculation: {
      type: String,
      description: 'Human-readable price calculation'
    },
    
    lastPriceUpdate: {
      type: Date,
      default: Date.now
    }
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(v) {
        return !v || v < this.price;
      },
      message: 'Discount price must be less than regular price'
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0
    },
    status: {
      type: String,
      enum: ['In Stock', 'Limited Stock', 'Out of Stock'],
      default: function() {
        if (this.stock.quantity > 10) return 'In Stock';
        if (this.stock.quantity > 0) return 'Limited Stock';
        return 'Out of Stock';
      }
    }
  },
  dimensions: {
    length: {
      type: Number,
      min: [0, 'Length cannot be negative']
    },
    width: {
      type: Number,
      min: [0, 'Width cannot be negative']
    },
    height: {
      type: Number,
      min: [0, 'Height cannot be negative']
    },
    unit: {
      type: String,
      enum: ['mm', 'cm', 'inches'],
      default: 'mm'
    }
  },
  features: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO title cannot exceed 60 characters']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO description cannot exceed 160 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Calculate final price (with discount if applicable)
      ret.finalPrice = ret.discountPrice || ret.price;
      
      // Calculate discount percentage
      if (ret.discountPrice && ret.price > ret.discountPrice) {
        ret.discountPercentage = Math.round(((ret.price - ret.discountPrice) / ret.price) * 100);
      } else {
        ret.discountPercentage = 0;
      }
      
      // Update stock status based on quantity
      if (ret.stock && typeof ret.stock.quantity === 'number') {
        if (ret.stock.quantity > 10) {
          ret.stock.status = 'In Stock';
        } else if (ret.stock.quantity > 0) {
          ret.stock.status = 'Limited Stock';
        } else {
          ret.stock.status = 'Out of Stock';
        }
      }
      
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, metal: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to ensure only one primary image
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    let primaryCount = 0;
    this.images.forEach((image, index) => {
      if (image.isPrimary) {
        primaryCount++;
        if (primaryCount > 1) {
          image.isPrimary = false;
        }
      }
    });
    
    // If no primary image is set, make the first one primary
    if (primaryCount === 0 && this.images.length > 0) {
      this.images[0].isPrimary = true;
    }
  }
  
  next();
});

// Virtual for search text
productSchema.virtual('searchText').get(function() {
  return `${this.name} ${this.description} ${this.category} ${this.metal} ${this.tags.join(' ')}`;
});

// Virtual for final price (uses manual price if set, otherwise calculated price)
productSchema.virtual('finalPrice').get(function() {
  if (this.pricing && this.pricing.manualPrice > 0) {
    return this.pricing.manualPrice;
  }
  if (this.pricing && this.pricing.calculatedPrice > 0) {
    return this.pricing.calculatedPrice;
  }
  return this.price; // Fallback to original price
});

// Method to update price based on current metal rates
productSchema.methods.updatePriceFromRates = async function() {
  const MetalRates = require('./MetalRates');
  
  try {
    const priceData = await MetalRates.calculateProductPrice({
      metal: this.metal,
      purity: this.purity,
      weight: this.weight.value,
      wastage: this.pricing?.wastage || 0,
      makingCharges: this.pricing?.makingCharges || 0
    });
    
    // Update pricing fields
    this.pricing = this.pricing || {};
    this.pricing.metalRate = priceData.metalRate;
    this.pricing.metalCost = priceData.metalCost;
    this.pricing.calculatedPrice = priceData.totalPrice;
    this.pricing.priceCalculation = priceData.calculation;
    this.pricing.lastPriceUpdate = new Date();
    
    // Update main price field if no manual override
    if (!this.pricing.manualPrice) {
      this.price = priceData.totalPrice;
    }
    
    return priceData;
  } catch (error) {
    console.error('Error updating price from rates:', error);
    throw error;
  }
};

// Static method to update all product prices
productSchema.statics.updateAllPricesFromRates = async function() {
  const products = await this.find({ 
    metal: { $in: ['Gold', 'Silver', 'Platinum'] },
    isActive: true 
  });
  
  const results = {
    updated: 0,
    errors: 0,
    details: []
  };
  
  for (const product of products) {
    try {
      await product.updatePriceFromRates();
      await product.save();
      results.updated++;
      results.details.push({
        id: product._id,
        name: product.name,
        status: 'updated',
        newPrice: product.finalPrice
      });
    } catch (error) {
      results.errors++;
      results.details.push({
        id: product._id,
        name: product.name,
        status: 'error',
        error: error.message
      });
    }
  }
  
  return results;
};

module.exports = mongoose.model('Product', productSchema);
