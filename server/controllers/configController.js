const Configuration = require('../models/Configuration');

// @desc    Get all configurations
// @route   GET /api/admin/config
// @access  Private/Admin
const getAllConfigurations = async (req, res) => {
  try {
    const configurations = await Configuration.find({ isActive: true })
      .populate('createdBy updatedBy', 'name email')
      .sort({ key: 1 });
    
    res.json({
      success: true,
      data: configurations
    });
  } catch (error) {
    console.error('Get configurations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting configurations'
    });
  }
};

// @desc    Get configuration by key
// @route   GET /api/admin/config/:key
// @access  Private/Admin
const getConfigurationByKey = async (req, res) => {
  try {
    const configuration = await Configuration.findOne({ 
      key: req.params.key, 
      isActive: true 
    });
    
    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }
    
    res.json({
      success: true,
      data: configuration
    });
  } catch (error) {
    console.error('Get configuration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting configuration'
    });
  }
};

// @desc    Update configuration
// @route   PUT /api/admin/config/:key
// @access  Private/Admin
const updateConfiguration = async (req, res) => {
  try {
    const { value, description } = req.body;
    
    if (!value) {
      return res.status(400).json({
        success: false,
        message: 'Configuration value is required'
      });
    }
    
    const configuration = await Configuration.setConfig(
      req.params.key,
      value,
      description || `Configuration for ${req.params.key}`,
      req.user._id
    );
    
    await configuration.populate('createdBy updatedBy', 'name email');
    
    res.json({
      success: true,
      message: 'Configuration updated successfully',
      data: configuration
    });
  } catch (error) {
    console.error('Update configuration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating configuration'
    });
  }
};

// @desc    Get public configurations (for frontend)
// @route   GET /api/config/public
// @access  Public
const getPublicConfigurations = async (req, res) => {
  try {
    const publicKeys = [
      'categories',
      'metals',
      'purities',
      'weight_units',
      'dimension_units'
    ];
    
    const configurations = await Configuration.find({ 
      key: { $in: publicKeys },
      isActive: true 
    }).select('key value');
    
    // Convert to object format for easier frontend consumption
    const configObject = {};
    configurations.forEach(config => {
      configObject[config.key] = config.value;
    });
    
    res.json({
      success: true,
      data: configObject
    });
  } catch (error) {
    console.error('Get public configurations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting public configurations'
    });
  }
};

// @desc    Initialize default configurations
// @route   POST /api/admin/config/initialize
// @access  Private/Admin
const initializeConfigurations = async (req, res) => {
  try {
    const defaultConfigs = [
      {
        key: 'categories',
        value: [
          'Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Bangles',
          'Chains', 'Pendants', 'Wedding Sets', 'Traditional', 'Modern', 'Other'
        ],
        description: 'Product categories for jewelry items'
      },
      {
        key: 'metals',
        value: ['Gold', 'Silver', 'Platinum', 'Diamond', 'Mixed'],
        description: 'Available metal types'
      },
      {
        key: 'purities',
        value: ['14K', '18K', '22K', '24K', '925 Silver', 'Platinum 950', 'Not Applicable'],
        description: 'Metal purity options'
      },
      {
        key: 'weight_units',
        value: ['grams', 'carats'],
        description: 'Weight measurement units'
      },
      {
        key: 'dimension_units',
        value: ['mm', 'cm', 'inches'],
        description: 'Dimension measurement units'
      },
      {
        key: 'stock_statuses',
        value: ['In Stock', 'Limited Stock', 'Out of Stock'],
        description: 'Product stock status options'
      },
      {
        key: 'order_statuses',
        value: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        description: 'Order status options'
      },
      {
        key: 'payment_methods',
        value: ['COD', 'Online', 'Bank Transfer'],
        description: 'Available payment methods'
      },
      {
        key: 'site_settings',
        value: {
          siteName: 'Sri Vasavi Jewels',
          siteDescription: 'Premium Jewelry Collection',
          contactEmail: 'info@srivasavijewels.com',
          contactPhone: '+91 9876543210',
          address: 'Jewelry Street, Gold Market, India',
          currency: 'INR',
          currencySymbol: '₹',
          taxRate: 3, // 3% GST
          shippingCost: 100
        },
        description: 'General site settings and information'
      }
    ];
    
    const results = [];
    for (const config of defaultConfigs) {
      const result = await Configuration.setConfig(
        config.key,
        config.value,
        config.description,
        req.user._id
      );
      results.push(result);
    }
    
    res.json({
      success: true,
      message: 'Default configurations initialized successfully',
      data: results
    });
  } catch (error) {
    console.error('Initialize configurations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error initializing configurations'
    });
  }
};

module.exports = {
  getAllConfigurations,
  getConfigurationByKey,
  updateConfiguration,
  getPublicConfigurations,
  initializeConfigurations
};
