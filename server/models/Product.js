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
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Necklaces',
      'Rings', 
      'Earrings',
      'Bracelets',
      'Bangles',
      'Chains',
      'Pendants',
      'Wedding Sets',
      'Traditional',
      'Modern',
      'Other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  metal: {
    type: String,
    required: [true, 'Metal type is required'],
    enum: ['Gold', 'Silver', 'Platinum', 'Diamond', 'Mixed']
  },
  purity: {
    type: String,
    enum: ['14K', '18K', '22K', '24K', '925 Silver', 'Platinum 950', 'Not Applicable']
  },
  weight: {
    value: {
      type: Number,
      min: [0, 'Weight cannot be negative']
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
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(value) {
        return !value || value < this.price;
      },
      message: 'Discount price must be less than original price'
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
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    status: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Limited Stock'],
      default: function() {
        return this.stock.quantity > 10 ? 'In Stock' : 
               this.stock.quantity > 0 ? 'Limited Stock' : 'Out of Stock';
      }
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['mm', 'cm', 'inches'],
      default: 'mm'
    }
  },
  features: [String],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seoTitle: String,
  seoDescription: String,
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for final price (considering discount)
productSchema.virtual('finalPrice').get(function() {
  return this.discountPrice || this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  tags: 'text'
});

// Index for filtering
productSchema.index({ category: 1, metal: 1, price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

// Pre-save middleware to update stock status
productSchema.pre('save', function(next) {
  if (this.isModified('stock.quantity')) {
    this.stock.status = this.stock.quantity > 10 ? 'In Stock' : 
                       this.stock.quantity > 0 ? 'Limited Stock' : 'Out of Stock';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
