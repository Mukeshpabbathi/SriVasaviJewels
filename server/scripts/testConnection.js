const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

// Test with native MongoDB driver (like your sample)
async function testNativeConnection() {
  const uri = process.env.MONGO_URI;
  
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    console.log('🔄 Testing native MongoDB connection...');
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Native MongoDB connection successful!");
    
    // List databases
    const databases = await client.db().admin().listDatabases();
    console.log("📋 Available databases:", databases.databases.map(db => db.name));
    
  } catch (error) {
    console.error("❌ Native MongoDB connection failed:", error.message);
  } finally {
    await client.close();
  }
}

// Test with Mongoose (what we're using in the app)
async function testMongooseConnection() {
  try {
    console.log('\n🔄 Testing Mongoose connection...');
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('✅ Mongoose connection successful!');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📋 Collections:", collections.map(col => col.name));
    
  } catch (error) {
    console.error("❌ Mongoose connection failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Run both tests
async function runTests() {
  console.log('🧪 MongoDB Connection Tests\n');
  console.log('Connection URI:', process.env.MONGO_URI.replace(/:[^:@]*@/, ':****@'));
  console.log('=' .repeat(50));
  
  await testNativeConnection();
  await testMongooseConnection();
  
  console.log('\n✅ Connection tests completed!');
  process.exit(0);
}

runTests().catch(console.error);
