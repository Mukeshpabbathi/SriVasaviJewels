const MetalRates = require('../models/MetalRates');
const Product = require('../models/Product');

class RateController {
  
  // Get current active rates
  static async getCurrentRates(req, res) {
    try {
      const currentRates = await MetalRates.getCurrentRates();
      
      if (!currentRates) {
        return res.json({
          success: true,
          data: null,
          message: 'No rates set yet. Please set initial rates.'
        });
      }
      
      res.json({
        success: true,
        data: currentRates
      });
    } catch (error) {
      console.error('Get current rates error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching current rates'
      });
    }
  }
  
  // Update metal rates (admin only)
  static async updateRates(req, res) {
    try {
      const { gold, silver, diamond, platinum, notes } = req.body;
      
      // Validation
      if (!gold?.rate24K || gold.rate24K <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Gold 24K rate is required and must be greater than 0'
        });
      }
      
      if (!silver?.rate999 || silver.rate999 <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Silver 999 rate is required and must be greater than 0'
        });
      }
      
      if (!diamond?.ratePerCarat || diamond.ratePerCarat <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Diamond rate per carat is required and must be greater than 0'
        });
      }
      
      // Deactivate previous rates
      await MetalRates.updateMany({ isActive: true }, { isActive: false });
      
      // Create new rates
      const newRates = new MetalRates({
        gold: {
          rate24K: gold.rate24K
        },
        silver: {
          rate999: silver.rate999
        },
        diamond: {
          ratePerCarat: diamond.ratePerCarat
        },
        platinum: {
          rate950: platinum?.rate950 || 0
        },
        updatedBy: req.user._id,
        notes: notes || '',
        isActive: true
      });
      
      await newRates.save();
      
      // Update all product prices in background
      setImmediate(async () => {
        try {
          const updateResults = await Product.updateAllPricesFromRates();
          console.log('Product prices updated:', updateResults);
        } catch (error) {
          console.error('Error updating product prices:', error);
        }
      });
      
      res.json({
        success: true,
        data: newRates,
        message: 'Metal rates updated successfully. Product prices are being updated in background.'
      });
    } catch (error) {
      console.error('Update rates error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating metal rates'
      });
    }
  }
  
  // Get rate history
  static async getRateHistory(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const rates = await MetalRates.find()
        .populate('updatedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      
      const total = await MetalRates.countDocuments();
      
      res.json({
        success: true,
        data: {
          rates,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      console.error('Get rate history error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching rate history'
      });
    }
  }
  
  // Calculate price for given parameters
  static async calculatePrice(req, res) {
    try {
      const { metal, purity, weight, wastage = 0, makingCharges = 0 } = req.body;
      
      // Validation
      if (!metal || !purity || !weight) {
        return res.status(400).json({
          success: false,
          message: 'Metal, purity, and weight are required'
        });
      }
      
      if (weight <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Weight must be greater than 0'
        });
      }
      
      const priceData = await MetalRates.calculateProductPrice({
        metal,
        purity,
        weight: parseFloat(weight),
        wastage: parseFloat(wastage),
        makingCharges: parseFloat(makingCharges)
      });
      
      res.json({
        success: true,
        data: priceData
      });
    } catch (error) {
      console.error('Calculate price error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error calculating price'
      });
    }
  }
  
  // Update all product prices manually
  static async updateAllProductPrices(req, res) {
    try {
      const results = await Product.updateAllPricesFromRates();
      
      res.json({
        success: true,
        data: results,
        message: `Updated ${results.updated} products successfully. ${results.errors} errors occurred.`
      });
    } catch (error) {
      console.error('Update all product prices error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating product prices'
      });
    }
  }
  
  // Get pricing summary for dashboard
  static async getPricingSummary(req, res) {
    try {
      const currentRates = await MetalRates.getCurrentRates();
      
      if (!currentRates) {
        return res.json({
          success: true,
          data: {
            ratesSet: false,
            message: 'No rates configured yet'
          }
        });
      }
      
      // Get product counts by metal
      const productStats = await Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$metal',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            totalValue: { $sum: '$price' }
          }
        }
      ]);
      
      // Get recent rate changes
      const recentRates = await MetalRates.find()
        .populate('updatedBy', 'name')
        .sort({ createdAt: -1 })
        .limit(5);
      
      res.json({
        success: true,
        data: {
          ratesSet: true,
          currentRates,
          productStats,
          recentRates,
          lastUpdate: currentRates.createdAt
        }
      });
    } catch (error) {
      console.error('Get pricing summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching pricing summary'
      });
    }
  }
}

module.exports = RateController;
