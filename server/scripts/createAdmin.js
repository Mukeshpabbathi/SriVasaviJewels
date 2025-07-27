const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createAdminUser() {
  try {
    console.log('🚀 Connecting to database...\n');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check existing users
    const existingUsers = await User.find({});
    console.log(`📊 Found ${existingUsers.length} existing users:\n`);
    
    existingUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}\n`);
    });

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log('\n💡 If you forgot the password, I can reset it for you.');
      
      // Ask if user wants to reset password (for now, just show instructions)
      console.log('\n🔧 To reset admin password, run this script with --reset flag');
      return;
    }

    // Create new admin user
    console.log('🔧 Creating new admin user...\n');
    
    const adminData = {
      name: 'Admin User',
      email: 'admin@srivasavijewels.com',
      password: 'admin123', // Default password - should be changed after first login
      role: 'admin'
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const adminUser = new User(adminData);
    await adminUser.save();

    console.log('✅ Admin user created successfully!\n');
    console.log('📧 Login Credentials:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: admin123`);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📴 Disconnected from MongoDB');
  }
}

async function resetAdminPassword() {
  try {
    console.log('🚀 Connecting to database...\n');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('❌ No admin user found. Run without --reset to create one.');
      return;
    }

    // Reset password
    const newPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(admin._id, { password: hashedPassword });

    console.log('✅ Admin password reset successfully!\n');
    console.log('📧 Updated Login Credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${newPassword}`);
    console.log('\n⚠️  IMPORTANT: Change this password after login!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📴 Disconnected from MongoDB');
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--reset')) {
  resetAdminPassword();
} else {
  createAdminUser();
}

module.exports = { createAdminUser, resetAdminPassword };
