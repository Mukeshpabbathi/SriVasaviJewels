// Simple in-memory database for development
const fs = require('fs');
const path = require('path');

class MemoryDB {
  constructor() {
    this.users = [];
    this.products = [];
    this.orders = [];
    
    // Try to load data from JSON files if they exist
    try {
      const usersPath = path.join(__dirname, '../data/users.json');
      console.log('Loading users from:', usersPath);
      if (fs.existsSync(usersPath)) {
        this.users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        console.log(`Loaded ${this.users.length} users from JSON file`);
        console.log('User emails loaded:', this.users.map(u => u.email));
      } else {
        console.log('Users file does not exist');
      }
      
      const productsPath = path.join(__dirname, '../data/products.json');
      if (fs.existsSync(productsPath)) {
        this.products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        console.log(`Loaded ${this.products.length} products from JSON file`);
      }
      
      const ordersPath = path.join(__dirname, '../data/orders.json');
      if (fs.existsSync(ordersPath)) {
        this.orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        console.log(`Loaded ${this.orders.length} orders from JSON file`);
      }
    } catch (err) {
      console.error('Error loading data from JSON files:', err);
    }
  }
  
  // Save data to JSON files
  saveData() {
    try {
      // Create data directory if it doesn't exist
      const dataDir = path.join(__dirname, '../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }
      
      fs.writeFileSync(
        path.join(dataDir, 'users.json'), 
        JSON.stringify(this.users, null, 2)
      );
      
      fs.writeFileSync(
        path.join(dataDir, 'products.json'), 
        JSON.stringify(this.products, null, 2)
      );
      
      fs.writeFileSync(
        path.join(dataDir, 'orders.json'), 
        JSON.stringify(this.orders, null, 2)
      );
    } catch (err) {
      console.error('Error saving data to JSON files:', err);
    }
  }
  
  // User methods
  findUserByEmail(email) {
    console.log(`Searching for user with email: ${email}`);
    console.log(`Available users: ${this.users.length}`);
    const user = this.users.find(user => user.email === email);
    console.log(`User found: ${user ? 'Yes' : 'No'}`);
    return user;
  }
  
  findUserById(id) {
    return this.users.find(user => user.id === id);
  }
  
  createUser(userData) {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.saveData();
    return newUser;
  }
  
  getAllUsers() {
    return this.users;
  }
  
  // Product methods
  getAllProducts() {
    return this.products;
  }
  
  getProductById(id) {
    return this.products.find(product => product.id === id);
  }
  
  createProduct(productData) {
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString()
    };
    this.products.push(newProduct);
    this.saveData();
    return newProduct;
  }
  
  updateProduct(id, productData) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...productData,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.products[index];
    }
    return null;
  }
  
  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      const deletedProduct = this.products[index];
      this.products.splice(index, 1);
      this.saveData();
      return deletedProduct;
    }
    return null;
  }
}

module.exports = new MemoryDB();

module.exports = new MemoryDB();
