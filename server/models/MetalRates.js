const mongoose = require('mongoose');

const metalRatesSchema = new mongoose.Schema({
  // Gold rates (per gram for 24K - 100% purity)
  gold: {
    rate24K: {
      type: Number,
      required: true,
      min: 0
    },
    // Auto-calculated rates for different purities
    rate22K: {
      type: Number,
      default: function() {
        return this.gold.rate24K * 0.916; // 22K = 91.6% purity
      }
    },
    rate18K: {
      type: Number,
      default: function() {
        return this.gold.rate24K * 0.750; // 18K = 75% purity
      }
    },
    rate14K: {
      type: Number,
      default: function() {
        return this.gold.rate24K * 0.583; // 14K = 58.3% purity
      }
    }
  },
  
  // Silver rates (per gram for 999 - 99.9% purity)
  silver: {
    rate999: {
      type: Number,
      required: true,
      min: 0
    },
    rate925: {
      type: Number,
      default: function() {
        return this.silver.rate999 * 0.925; // Sterling silver = 92.5% purity
      }
    }
  },
  
  // Diamond rates (per carat)
  diamond: {
    ratePerCarat: {
      type: Number,
      required: true,
      min: 0
    }
  },
  
  // Platinum rates (per gram for 950 - 95% purity)
  platinum: {
    rate950: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  
  // Rate metadata
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate purity-based rates
metalRatesSchema.pre('save', function(next) {
  // Calculate gold rates based on purity
  if (this.gold && this.gold.rate24K) {
    this.gold.rate22K = Math.round(this.gold.rate24K * 0.916 * 100) / 100; // 91.6%
    this.gold.rate18K = Math.round(this.gold.rate24K * 0.750 * 100) / 100; // 75%
    this.gold.rate14K = Math.round(this.gold.rate24K * 0.583 * 100) / 100; // 58.3%
  }
  
  // Calculate silver rates based on purity
  if (this.silver && this.silver.rate999) {
    this.silver.rate925 = Math.round(this.silver.rate999 * 0.925 * 100) / 100; // 92.5%
  }
  
  next();
});

// Static method to get current active rates
metalRatesSchema.statics.getCurrentRates = async function() {
  return await this.findOne({ isActive: true }).sort({ createdAt: -1 });
};

// Static method to calculate product price
metalRatesSchema.statics.calculateProductPrice = async function(productData) {
  const currentRates = await this.getCurrentRates();
  if (!currentRates) {
    throw new Error('No active metal rates found. Please set current rates first.');
  }
  
  const { metal, purity, weight, wastage = 0, makingCharges = 0 } = productData;
  
  let metalRate = 0;
  
  // Get rate based on metal and purity
  switch (metal.toLowerCase()) {
    case 'gold':
      switch (purity) {
        case '24K':
          metalRate = currentRates.gold.rate24K;
          break;
        case '22K':
          metalRate = currentRates.gold.rate22K;
          break;
        case '18K':
          metalRate = currentRates.gold.rate18K;
          break;
        case '14K':
          metalRate = currentRates.gold.rate14K;
          break;
        default:
          throw new Error(`Unsupported gold purity: ${purity}`);
      }
      break;
      
    case 'silver':
      switch (purity) {
        case '999':
          metalRate = currentRates.silver.rate999;
          break;
        case '925':
          metalRate = currentRates.silver.rate925;
          break;
        default:
          throw new Error(`Unsupported silver purity: ${purity}`);
      }
      break;
      
    case 'platinum':
      if (purity === '950') {
        metalRate = currentRates.platinum.rate950;
      } else {
        throw new Error(`Unsupported platinum purity: ${purity}`);
      }
      break;
      
    case 'diamond':
      metalRate = currentRates.diamond.ratePerCarat;
      break;
      
    default:
      throw new Error(`Unsupported metal: ${metal}`);
  }
  
  // Calculate price: ((weight + wastage) * metalRate) + makingCharges
  const totalWeight = weight + wastage;
  const metalCost = totalWeight * metalRate;
  const totalPrice = metalCost + makingCharges;
  
  return {
    metalRate,
    totalWeight,
    metalCost: Math.round(metalCost * 100) / 100,
    makingCharges,
    totalPrice: Math.round(totalPrice * 100) / 100,
    calculation: `((${weight}g + ${wastage}g) × ₹${metalRate}) + ₹${makingCharges} = ₹${Math.round(totalPrice * 100) / 100}`
  };
};

// Index for efficient queries
metalRatesSchema.index({ isActive: 1, createdAt: -1 });
metalRatesSchema.index({ effectiveDate: -1 });

module.exports = mongoose.model('MetalRates', metalRatesSchema);
