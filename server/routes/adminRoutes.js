const express = require('express');
const {
  getAllUsers,
  getDashboardStats,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
