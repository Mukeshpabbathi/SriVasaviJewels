const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
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

    // Create sample customer
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

const seedProducts = async () => {
  try {
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      const admin = await User.findOne({ role: 'admin' });
      
      const sampleProducts = [
        {
          name: 'Elegant Gold Necklace',
          description: 'Beautiful 22K gold necklace with intricate traditional design. Perfect for weddings and special occasions.',
          category: 'Necklaces',
          subcategory: 'Traditional',
          metal: 'Gold',
          purity: '22K',
          weight: { value: 25.5, unit: 'grams' },
          price: 125000,
          discountPrice: 118000,
          images: [{
            url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop',
            alt: 'Elegant Gold Necklace',
            isPrimary: true
          }],
          stock: { quantity: 5 },
          features: ['22K Gold', 'Traditional Design', 'Handcrafted', 'BIS Hallmarked'],
          tags: ['wedding', 'traditional', 'gold', 'necklace'],
          isFeatured: true,
          createdBy: admin._id
        },
        {
          name: 'Diamond Solitaire Ring',
          description: 'Stunning diamond solitaire ring with brilliant cut diamond. Perfect for engagements and proposals.',
          category: 'Rings',
          subcategory: 'Engagement',
          metal: 'Diamond',
          purity: '18K',
          weight: { value: 2.5, unit: 'carats' },
          price: 250000,
          images: [{
            url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop',
            alt: 'Diamond Solitaire Ring',
            isPrimary: true
          }],
          stock: { quantity: 3 },
          features: ['Natural Diamond', '18K Gold Setting', 'Certified', 'Brilliant Cut'],
          tags: ['diamond', 'engagement', 'ring', 'solitaire'],
          isFeatured: true,
          createdBy: admin._id
        },
        {
          name: 'Silver Jhumka Earrings',
          description: 'Traditional silver jhumka earrings with oxidized finish. Lightweight and comfortable for daily wear.',
          category: 'Earrings',
          subcategory: 'Traditional',
          metal: 'Silver',
          purity: '925 Silver',
          weight: { value: 15.2, unit: 'grams' },
          price: 3500,
          discountPrice: 2800,
          images: [{
            url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop',
            alt: 'Silver Jhumka Earrings',
            isPrimary: true
          }],
          stock: { quantity: 15 },
          features: ['925 Silver', 'Oxidized Finish', 'Lightweight', 'Traditional Design'],
          tags: ['silver', 'jhumka', 'traditional', 'earrings'],
          createdBy: admin._id
        },
        {
          name: 'Gold Bracelet Chain',
          description: 'Delicate gold chain bracelet perfect for layering or wearing alone. Adjustable length.',
          category: 'Bracelets',
          subcategory: 'Modern',
          metal: 'Gold',
          purity: '18K',
          weight: { value: 8.5, unit: 'grams' },
          price: 45000,
          images: [{
            url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop',
            alt: 'Gold Bracelet Chain',
            isPrimary: true
          }],
          stock: { quantity: 8 },
          features: ['18K Gold', 'Adjustable Length', 'Delicate Design', 'BIS Hallmarked'],
          tags: ['gold', 'bracelet', 'chain', 'modern'],
          createdBy: admin._id
        },
        {
          name: 'Bridal Wedding Set',
          description: 'Complete bridal jewelry set including necklace, earrings, and maang tikka. Perfect for Indian weddings.',
          category: 'Wedding Sets',
          subcategory: 'Bridal',
          metal: 'Gold',
          purity: '22K',
          weight: { value: 85.5, unit: 'grams' },
          price: 425000,
          discountPrice: 399000,
          images: [{
            url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=500&fit=crop',
            alt: 'Bridal Wedding Set',
            isPrimary: true
          }],
          stock: { quantity: 2 },
          features: ['22K Gold', 'Complete Set', 'Bridal Design', 'Handcrafted', 'BIS Hallmarked'],
          tags: ['bridal', 'wedding', 'set', 'gold', 'traditional'],
          isFeatured: true,
          createdBy: admin._id
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log(`✅ ${sampleProducts.length} sample products created successfully`);
    } else {
      console.log(`ℹ️ ${productCount} products already exist in database`);
    }

  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    const connected = await database.connect();
    if (!connected) {
      console.error('❌ Could not connect to database');
      process.exit(1);
    }

    // Seed data
    await seedUsers();
    await seedProducts();

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('👨‍💼 Admin: admin@srivasavijewels.com / Admin@123!');
    console.log('👤 Customer: customer@example.com / Customer@123!');
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error.message);
  } finally {
    await database.disconnect();
    process.exit(0);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedUsers, seedProducts };
