const express = require('express');
const {
  getAllConfigurations,
  getConfigurationByKey,
  updateConfiguration,
  getPublicConfigurations,
  initializeConfigurations
} = require('../controllers/configController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route for frontend to get configurations
router.get('/public', getPublicConfigurations);

// Admin routes (protected)
router.use(protect);
router.use(admin);

router.route('/')
  .get(getAllConfigurations);

router.post('/initialize', initializeConfigurations);

router.route('/:key')
  .get(getConfigurationByKey)
  .put(updateConfiguration);

module.exports = router;
