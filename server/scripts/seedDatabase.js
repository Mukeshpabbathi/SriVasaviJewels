const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Configuration = require('../models/Configuration');
const database = require('../config/database');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@srivasavijewels.com' });
    
    if (!adminExists) {
      // Create admin user
      const adminUser = new User({
        name: 'SVJ Admin',
        email: 'admin@srivasavijewels.com',
        password: 'Admin@123!', // Strong password
        role: 'admin',
        phone: '9876543210',
        emailVerified: true,
        phoneVerified: true
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@srivasavijewels.com');
      console.log('🔑 Password: Admin@123!');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create sample customer (optional - can be removed in production)
    const customerExists = await User.findOne({ email: 'customer@example.com' });
    
    if (!customerExists) {
      const customerUser = new User({
        name: 'Sample Customer',
        email: 'customer@example.com',
        password: 'Customer@123!',
        role: 'customer',
        phone: '9876543211',
        addresses: [{
          type: 'home',
          fullName: 'Sample Customer',
          phone: '9876543211',
          addressLine1: '123 Sample Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true
        }]
      });

      await customerUser.save();
      console.log('✅ Sample customer created successfully');
    } else {
      console.log('ℹ️ Sample customer already exists');
    }

  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
  }
};

const seedConfigurations = async () => {
  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('⚠️ Admin user not found. Please run user seeding first.');
      return;
    }

    const configCount = await Configuration.countDocuments();
    
    if (configCount === 0) {
      const defaultConfigs = [
        {
          key: 'categories',
          value: [
            'Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Bangles',
            'Chains', 'Pendants', 'Wedding Sets', 'Traditional', 'Modern', 'Other'
          ],
          description: 'Product categories for jewelry items',
          createdBy: admin._id
        },
        {
          key: 'metals',
          value: ['Gold', 'Silver', 'Platinum', 'Diamond', 'Mixed'],
          description: 'Available metal types',
          createdBy: admin._id
        },
        {
          key: 'purities',
          value: ['14K', '18K', '22K', '24K', '925 Silver', 'Platinum 950', 'Not Applicable'],
          description: 'Metal purity options',
          createdBy: admin._id
        },
        {
          key: 'weight_units',
          value: ['grams', 'carats'],
          description: 'Weight measurement units',
          createdBy: admin._id
        },
        {
          key: 'dimension_units',
          value: ['mm', 'cm', 'inches'],
          description: 'Dimension measurement units',
          createdBy: admin._id
        },
        {
          key: 'stock_statuses',
          value: ['In Stock', 'Limited Stock', 'Out of Stock'],
          description: 'Product stock status options',
          createdBy: admin._id
        },
        {
          key: 'order_statuses',
          value: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
          description: 'Order status options',
          createdBy: admin._id
        },
        {
          key: 'payment_methods',
          value: ['COD', 'Online', 'Bank Transfer'],
          description: 'Available payment methods',
          createdBy: admin._id
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
          description: 'General site settings and information',
          createdBy: admin._id
        }
      ];

      await Configuration.insertMany(defaultConfigs);
      console.log('✅ Default configurations created successfully');
    } else {
      console.log('ℹ️ Configurations already exist');
    }

  } catch (error) {
    console.error('❌ Error seeding configurations:', error.message);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    const connected = await database.connect();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Seed users first (admin is required for configurations)
    await seedUsers();
    
    // Seed configurations
    await seedConfigurations();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Admin user ready');
    console.log('✅ Sample customer ready (optional)');
    console.log('✅ System configurations initialized');
    console.log('\n🚀 You can now:');
    console.log('1. Login as admin and start adding products');
    console.log('2. Customize categories/metals via Settings tab');
    console.log('3. Build your jewelry catalog from scratch');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
  } finally {
    await database.disconnect();
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedUsers, seedConfigurations };
