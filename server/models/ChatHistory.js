const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One chat history per user
  },
  messages: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    quickReplies: [String],
    products: [{
      id: String,
      name: String,
      price: Number,
      originalPrice: Number,
      category: String,
      metal: String,
      image: String,
      url: String,
      inStock: Boolean
    }],
    suggestions: [String],
    isError: {
      type: Boolean,
      default: false
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
chatHistorySchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Index for efficient queries (userId already has unique index from schema definition)
chatHistorySchema.index({ lastUpdated: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
