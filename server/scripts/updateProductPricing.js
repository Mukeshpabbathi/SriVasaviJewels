const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

async function updateProductPricing() {
  try {
    console.log('🚀 Connecting to database...\n');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const products = await Product.find({});
    console.log(`📊 Found ${products.length} products to update:\n`);

    console.log('⚠️  IMPORTANT: Current products have estimated wastage and making charges.');
    console.log('   You should manually review and update these values based on:');
    console.log('   - Design complexity');
    console.log('   - Manufacturing process');
    console.log('   - Business profit margins\n');

    for (const product of products) {
      console.log(`📝 Product: ${product.name}`);
      console.log(`   Metal: ${product.metal} ${product.purity}`);
      console.log(`   Weight: ${product.weight.value}${product.weight.unit}`);
      
      // Current estimated values (you should update these manually)
      const currentWastage = product.pricing?.wastage || 0;
      const currentMakingCharges = product.pricing?.makingCharges || 0;
      
      console.log(`   Current Wastage: ${currentWastage}% (${currentWastage > 100 ? 'NEEDS FIXING - should be percentage!' : 'OK'})`);
      console.log(`   Current Making Charges: ₹${currentMakingCharges}`);
      
      // If wastage is > 100, it was probably stored as grams instead of percentage
      if (currentWastage > 100) {
        const weight = product.weight.value || 1;
        const estimatedWastagePercent = Math.min((currentWastage / weight) * 100, 20); // Cap at 20%
        
        console.log(`   🔧 Converting wastage from ${currentWastage}g to ${estimatedWastagePercent.toFixed(1)}%`);
        
        await Product.findByIdAndUpdate(product._id, {
          'pricing.wastage': Math.round(estimatedWastagePercent * 10) / 10 // Round to 1 decimal
        });
      }
      
      console.log('   ⚠️  Please review and update these values in admin panel!\n');
    }

    console.log('✅ Review completed!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Login to admin panel: http://localhost:3000/admin');
    console.log('2. Go to Product Management');
    console.log('3. Edit each product to set proper:');
    console.log('   - Wastage % (typically 5-15% based on complexity)');
    console.log('   - Making charges ₹ (based on craftsmanship required)');
    console.log('4. Prices will auto-calculate based on current metal rates');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📴 Disconnected from MongoDB');
  }
}

updateProductPricing();
