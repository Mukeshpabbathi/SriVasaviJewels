const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Migration script to update existing products with pricing fields
async function updateExistingProducts() {
  try {
    console.log('🚀 Starting product pricing migration...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get all products that don't have pricing fields
    const productsToUpdate = await Product.find({
      $or: [
        { 'pricing.makingCharges': { $exists: false } },
        { 'pricing.wastage': { $exists: false } }
      ]
    });
    
    console.log(`📊 Found ${productsToUpdate.length} products to update\n`);
    
    if (productsToUpdate.length === 0) {
      console.log('✅ All products already have pricing fields!');
      return;
    }
    
    let updated = 0;
    let errors = 0;
    
    for (const product of productsToUpdate) {
      try {
        // Set default pricing values based on product characteristics
        const defaultWastage = calculateDefaultWastage(product);
        const defaultMakingCharges = calculateDefaultMakingCharges(product);
        
        // Update product with pricing fields
        await Product.findByIdAndUpdate(product._id, {
          $set: {
            'pricing.wastage': defaultWastage,
            'pricing.makingCharges': defaultMakingCharges,
            'pricing.metalRate': 0,
            'pricing.metalCost': 0,
            'pricing.calculatedPrice': 0,
            'pricing.lastPriceUpdate': new Date()
          }
        });
        
        updated++;
        console.log(`✅ Updated: ${product.name} (Wastage: ${defaultWastage}g, Making: ₹${defaultMakingCharges})`);
        
      } catch (error) {
        errors++;
        console.error(`❌ Error updating ${product.name}:`, error.message);
      }
    }
    
    console.log(`\n📈 Migration Summary:`);
    console.log(`✅ Updated: ${updated} products`);
    console.log(`❌ Errors: ${errors} products`);
    
    if (updated > 0) {
      console.log(`\n💡 Next Steps:`);
      console.log(`1. Admin should set metal rates in the admin panel`);
      console.log(`2. System will automatically calculate prices for all products`);
      console.log(`3. Review and adjust wastage/making charges as needed`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📴 Disconnected from MongoDB');
  }
}

// Calculate default wastage based on product characteristics
function calculateDefaultWastage(product) {
  const weight = product.weight?.value || 0;
  const category = product.category?.toLowerCase() || '';
  const metal = product.metal?.toLowerCase() || '';
  
  // Default wastage percentages
  let wastagePercent = 0.05; // 5% default
  
  // Adjust based on category
  if (category.includes('ring')) {
    wastagePercent = 0.03; // 3% for rings (less wastage)
  } else if (category.includes('necklace') || category.includes('chain')) {
    wastagePercent = 0.07; // 7% for necklaces (more complex)
  } else if (category.includes('earring')) {
    wastagePercent = 0.04; // 4% for earrings
  } else if (category.includes('bangle') || category.includes('bracelet')) {
    wastagePercent = 0.06; // 6% for bangles
  }
  
  // Adjust based on metal (gold typically has more wastage)
  if (metal.includes('gold')) {
    wastagePercent += 0.01; // +1% for gold
  }
  
  // Calculate wastage in grams
  const wastage = Math.round(weight * wastagePercent * 100) / 100;
  
  return Math.max(wastage, 0.1); // Minimum 0.1g wastage
}

// Calculate default making charges based on product characteristics
function calculateDefaultMakingCharges(product) {
  const weight = product.weight?.value || 0;
  const category = product.category?.toLowerCase() || '';
  const metal = product.metal?.toLowerCase() || '';
  const currentPrice = product.price || 0;
  
  // Base making charges per gram
  let makingChargesPerGram = 500; // ₹500 per gram default
  
  // Adjust based on metal
  if (metal.includes('gold')) {
    makingChargesPerGram = 800; // ₹800 per gram for gold
  } else if (metal.includes('silver')) {
    makingChargesPerGram = 200; // ₹200 per gram for silver
  } else if (metal.includes('platinum')) {
    makingChargesPerGram = 1000; // ₹1000 per gram for platinum
  }
  
  // Adjust based on category complexity
  if (category.includes('ring')) {
    makingChargesPerGram *= 1.2; // +20% for rings (precision work)
  } else if (category.includes('necklace')) {
    makingChargesPerGram *= 1.5; // +50% for necklaces (complex design)
  } else if (category.includes('earring')) {
    makingChargesPerGram *= 1.1; // +10% for earrings
  } else if (category.includes('bangle')) {
    makingChargesPerGram *= 0.8; // -20% for bangles (simpler)
  }
  
  // Calculate total making charges
  let makingCharges = Math.round(weight * makingChargesPerGram);
  
  // Ensure making charges don't exceed 30% of current price
  const maxMakingCharges = currentPrice * 0.3;
  if (makingCharges > maxMakingCharges && maxMakingCharges > 0) {
    makingCharges = Math.round(maxMakingCharges);
  }
  
  return Math.max(makingCharges, 100); // Minimum ₹100 making charges
}

// Run migration if called directly
if (require.main === module) {
  updateExistingProducts();
}

module.exports = { updateExistingProducts };
