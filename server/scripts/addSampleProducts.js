const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const database = require('../config/database');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Royal Gold Necklace Set',
    description: 'Exquisite handcrafted 22K gold necklace set with traditional motifs. Perfect for weddings and special occasions. Features intricate design work and premium finish.',
    category: 'Necklaces',
    subcategory: 'Traditional',
    metal: 'Gold',
    purity: '22K',
    weight: { value: 45.5, unit: 'grams' },
    price: 285000,
    discountPrice: 265000,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
        alt: 'Royal Gold Necklace Set - Primary',
        isPrimary: true
      }
    ],
    stock: { quantity: 3 },
    features: ['22K Gold', 'Handcrafted', 'Traditional Design', 'BIS Hallmarked'],
    tags: ['wedding', 'traditional', 'gold', 'necklace', 'bridal'],
    isActive: true,
    isFeatured: true,
    seoTitle: 'Royal Gold Necklace Set - Traditional 22K Gold Jewelry',
    seoDescription: 'Beautiful handcrafted 22K gold necklace set perfect for weddings and special occasions. Premium quality with BIS hallmark.'
  },
  {
    name: 'Diamond Solitaire Ring',
    description: 'Stunning diamond solitaire ring featuring a brilliant cut diamond set in 18K white gold. Perfect for engagements and proposals. Certified diamond with excellent clarity.',
    category: 'Rings',
    subcategory: 'Engagement',
    metal: 'Diamond',
    purity: '18K',
    weight: { value: 2.5, unit: 'carats' },
    price: 185000,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop',
        alt: 'Diamond Solitaire Ring - Primary',
        isPrimary: true
      }
    ],
    stock: { quantity: 5 },
    features: ['Natural Diamond', '18K White Gold', 'Certified', 'Brilliant Cut'],
    tags: ['diamond', 'engagement', 'ring', 'solitaire', 'wedding'],
    isActive: true,
    isFeatured: true,
    seoTitle: 'Diamond Solitaire Ring - Certified Diamond Engagement Ring',
    seoDescription: 'Brilliant cut diamond solitaire ring in 18K white gold. Perfect for engagements with certified natural diamond.'
  },
  {
    name: 'Pearl Drop Earrings',
    description: 'Elegant pearl drop earrings crafted in 18K gold. Features lustrous freshwater pearls with secure gold settings. Perfect for formal occasions and daily wear.',
    category: 'Earrings',
    subcategory: 'Modern',
    metal: 'Gold',
    purity: '18K',
    weight: { value: 8.2, unit: 'grams' },
    price: 45000,
    discountPrice: 38000,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop',
        alt: 'Pearl Drop Earrings - Primary',
        isPrimary: true
      }
    ],
    stock: { quantity: 8 },
    features: ['18K Gold', 'Freshwater Pearls', 'Secure Settings', 'Lightweight'],
    tags: ['pearl', 'earrings', 'gold', 'elegant', 'formal'],
    isActive: true,
    isFeatured: true,
    seoTitle: 'Pearl Drop Earrings - 18K Gold Pearl Jewelry',
    seoDescription: 'Elegant freshwater pearl drop earrings in 18K gold. Perfect for formal occasions with secure gold settings.'
  },
  {
    name: 'Silver Charm Bracelet',
    description: 'Beautiful 925 silver charm bracelet with multiple decorative charms. Adjustable length with secure clasp. Perfect gift for loved ones.',
    category: 'Bracelets',
    subcategory: 'Modern',
    metal: 'Silver',
    purity: '925 Silver',
    weight: { value: 25.0, unit: 'grams' },
    price: 15000,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop',
        alt: 'Silver Charm Bracelet - Primary',
        isPrimary: true
      }
    ],
    stock: { quantity: 12 },
    features: ['925 Silver', 'Multiple Charms', 'Adjustable Length', 'Secure Clasp'],
    tags: ['silver', 'bracelet', 'charm', 'gift', 'adjustable'],
    isActive: true,
    isFeatured: false,
    seoTitle: 'Silver Charm Bracelet - 925 Silver Jewelry',
    seoDescription: '925 silver charm bracelet with multiple decorative charms. Adjustable length, perfect gift for any occasion.'
  },
  {
    name: 'Traditional Gold Bangles Set',
    description: 'Set of 4 traditional gold bangles with intricate carved patterns. Made from 22K gold with beautiful finish. Perfect for festivals and celebrations.',
    category: 'Bangles',
    subcategory: 'Traditional',
    metal: 'Gold',
    purity: '22K',
    weight: { value: 65.8, unit: 'grams' },
    price: 425000,
    discountPrice: 395000,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=500&fit=crop',
        alt: 'Traditional Gold Bangles Set - Primary',
        isPrimary: true
      }
    ],
    stock: { quantity: 2 },
    features: ['22K Gold', 'Set of 4', 'Carved Patterns', 'Traditional Design'],
    tags: ['gold', 'bangles', 'traditional', 'festival', 'set'],
    isActive: true,
    isFeatured: true,
    seoTitle: 'Traditional Gold Bangles Set - 22K Gold Jewelry',
    seoDescription: 'Set of 4 traditional 22K gold bangles with intricate carved patterns. Perfect for festivals and celebrations.'
  },
  {
    name: 'Modern Chain Necklace',
    description: 'Sleek and modern chain necklace in 18K gold. Minimalist design perfect for daily wear and layering. Durable construction with secure clasp.',
    category: 'Chains',
    subcategory: 'Modern',
    metal: 'Gold',
    purity: '18K',
    weight: { value: 12.5, unit: 'grams' },
    price: 85000,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop',
        alt: 'Modern Chain Necklace - Primary',
        isPrimary: true
      }
    ],
    stock: { quantity: 15 },
    features: ['18K Gold', 'Minimalist Design', 'Daily Wear', 'Secure Clasp'],
    tags: ['gold', 'chain', 'modern', 'minimalist', 'daily'],
    isActive: true,
    isFeatured: false,
    seoTitle: 'Modern Chain Necklace - 18K Gold Chain',
    seoDescription: 'Sleek 18K gold chain necklace with minimalist design. Perfect for daily wear and layering with other jewelry.'
  }
];

const addSampleProducts = async () => {
  try {
    console.log('🌱 Adding sample products to database...');
    
    // Connect to database
    const connected = await database.connect();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('❌ Admin user not found. Please run user seeding first.');
      process.exit(1);
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Add createdBy field to all products
    const productsWithAdmin = sampleProducts.map(product => ({
      ...product,
      createdBy: admin._id
    }));

    // Insert sample products
    const insertedProducts = await Product.insertMany(productsWithAdmin);
    
    console.log(`✅ Successfully added ${insertedProducts.length} sample products:`);
    insertedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.category} - ₹${product.price.toLocaleString()}`);
    });

    console.log('\n📊 Summary:');
    console.log(`✅ Total Products: ${insertedProducts.length}`);
    console.log(`✅ Featured Products: ${insertedProducts.filter(p => p.isFeatured).length}`);
    console.log(`✅ Categories: ${[...new Set(insertedProducts.map(p => p.category))].join(', ')}`);
    console.log(`✅ Metals: ${[...new Set(insertedProducts.map(p => p.metal))].join(', ')}`);
    
    console.log('\n🎉 Sample products added successfully!');
    console.log('🌐 You can now view them on:');
    console.log('   - Home page: http://localhost:3000');
    console.log('   - Collections: http://localhost:3000/collections');
    console.log('   - Admin panel: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error adding sample products:', error.message);
  } finally {
    await database.disconnect();
    process.exit(0);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  addSampleProducts();
}

module.exports = { addSampleProducts };
