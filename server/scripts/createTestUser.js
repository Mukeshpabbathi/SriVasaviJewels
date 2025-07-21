const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    // User data
    const email = 'admin@srivasavijewels.com';
    const password = 'password123';
    const name = 'Admin User';
    const role = 'admin';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };

    // Create users array
    const users = [user];

    // Save to file
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    fs.writeFileSync(
      path.join(dataDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );

    console.log('Test user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Password Hash:', hashedPassword);

    // Test password verification
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification test:', isMatch ? 'PASSED' : 'FAILED');
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();
