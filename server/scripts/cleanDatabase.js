const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function cleanDatabase() {
  try {
    console.log('🧹 Cleaning up database files...');
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
      console.log('✅ Created data directory');
    }
    
    // Create a clean admin user
    const adminPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Create users.json with just one admin user
    const users = [
      {
        id: "1000000000000",
        name: "Admin User",
        email: "admin@srivasavijewels.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date().toISOString()
      }
    ];
    
    fs.writeFileSync(
      path.join(dataDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log('✅ Created clean users.json with admin user');
    console.log('   Admin email: admin@srivasavijewels.com');
    console.log('   Admin password: admin123');
    
    // Create clean products.json with sample products
    const products = [
      {
        id: "2000000000001",
        name: "Gold Necklace",
        description: "Beautiful 22K gold necklace with intricate design",
        price: 45000,
        category: "necklace",
        imageUrl: "https://example.com/images/gold-necklace.jpg",
        inStock: true,
        weight: "25g",
        createdAt: new Date().toISOString()
      },
      {
        id: "2000000000002",
        name: "Diamond Earrings",
        description: "Elegant diamond earrings with gold setting",
        price: 35000,
        category: "earrings",
        imageUrl: "https://example.com/images/diamond-earrings.jpg",
        inStock: true,
        weight: "8g",
        createdAt: new Date().toISOString()
      }
    ];
    
    fs.writeFileSync(
      path.join(dataDir, 'products.json'),
      JSON.stringify(products, null, 2)
    );
    console.log('✅ Created clean products.json with sample products');
    
    // Create empty orders.json
    fs.writeFileSync(
      path.join(dataDir, 'orders.json'),
      JSON.stringify([], null, 2)
    );
    console.log('✅ Created empty orders.json');
    
    // Test password verification
    const isMatch = await bcrypt.compare(adminPassword, hashedPassword);
    console.log('Password verification test:', isMatch ? 'PASSED ✅' : 'FAILED ❌');
    
    console.log('\n🎉 Database cleanup complete!');
    console.log('You can now login with:');
    console.log('Email: admin@srivasavijewels.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  }
}

cleanDatabase();
