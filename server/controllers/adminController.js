const User = require('../models/User');
const memoryDB = require('../config/memoryDB');

// Global variable to track if we're using MongoDB or in-memory DB
let usingMongoDB = true;

// Check if MongoDB is available
const checkMongoDBAvailability = async () => {
  try {
    await User.findOne();
    usingMongoDB = true;
    return true;
  } catch (err) {
    usingMongoDB = false;
    console.log('⚠️ MongoDB not available, using in-memory database in admin controller');
    return false;
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    await checkMongoDBAvailability();
    
    let users;
    
    if (usingMongoDB) {
      users = await User.find({}).select('-password').sort({ createdAt: -1 });
    } else {
      users = memoryDB.getAllUsers().map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    }
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error getting users' });
  }
};

// @desc    Get dashboard stats (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    await checkMongoDBAvailability();
    
    let totalUsers, totalCustomers, totalAdmins;
    
    if (usingMongoDB) {
      totalUsers = await User.countDocuments();
      totalCustomers = await User.countDocuments({ role: 'customer' });
      totalAdmins = await User.countDocuments({ role: 'admin' });
    } else {
      const users = memoryDB.getAllUsers();
      totalUsers = users.length;
      totalCustomers = users.filter(user => user.role === 'customer').length;
      totalAdmins = users.filter(user => user.role === 'admin').length;
    }

    // Mock data for now - will be replaced with real data later
    const stats = {
      totalUsers,
      totalCustomers,
      totalAdmins,
      totalProducts: 12, // Mock
      totalOrders: 45,   // Mock
      revenue: 125000    // Mock
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error getting stats' });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    await checkMongoDBAvailability();
    
    const { role } = req.body;
    const userId = req.params.id;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    let user;
    
    if (usingMongoDB) {
      user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      ).select('-password');
    } else {
      // For in-memory DB, we need to implement this functionality
      const userIndex = memoryDB.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        memoryDB.users[userIndex].role = role;
        memoryDB.saveData();
        
        // Create a copy without password
        user = { ...memoryDB.users[userIndex] };
        delete user.password;
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    await checkMongoDBAvailability();
    
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    let user;
    
    if (usingMongoDB) {
      user = await User.findByIdAndDelete(userId);
    } else {
      // For in-memory DB, we need to implement this functionality
      const userIndex = memoryDB.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        user = memoryDB.users[userIndex];
        memoryDB.users.splice(userIndex, 1);
        memoryDB.saveData();
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

module.exports = {
  getAllUsers,
  getDashboardStats,
  updateUserRole,
  deleteUser,
};
