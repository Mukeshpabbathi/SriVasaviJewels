const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = readUsers();
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const users = readUsers();
    const totalUsers = users.length;
    const totalCustomers = users.filter(user => user.role === 'customer').length;
    const totalAdmins = users.filter(user => user.role === 'admin').length;

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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u._id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex].role = role;
    writeUsers(users);

    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u._id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users.splice(userIndex, 1);
    writeUsers(users);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getDashboardStats,
  updateUserRole,
  deleteUser,
};
