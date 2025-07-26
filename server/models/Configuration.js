const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'categories',
      'metals', 
      'purities',
      'weight_units',
      'dimension_units',
      'stock_statuses',
      'order_statuses',
      'payment_methods',
      'shipping_methods',
      'site_settings'
    ]
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
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
  timestamps: true
});

// Index for quick lookups
configurationSchema.index({ key: 1, isActive: 1 });

// Static method to get configuration by key
configurationSchema.statics.getConfig = async function(key) {
  const config = await this.findOne({ key, isActive: true });
  return config ? config.value : null;
};

// Static method to set configuration
configurationSchema.statics.setConfig = async function(key, value, description, userId) {
  return await this.findOneAndUpdate(
    { key },
    { 
      value, 
      description, 
      updatedBy: userId,
      isActive: true
    },
    { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true
    }
  );
};

module.exports = mongoose.model('Configuration', configurationSchema);
