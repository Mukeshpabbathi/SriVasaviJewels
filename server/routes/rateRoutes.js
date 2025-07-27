const express = require('express');
const RateController = require('../controllers/rateController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Public routes (for price calculation)
router.get('/current', RateController.getCurrentRates);
router.post('/calculate', RateController.calculatePrice);

// Admin only routes
router.use(protect); // All routes below require authentication
router.use(adminMiddleware); // All routes below require admin role

router.post('/update', RateController.updateRates);
router.get('/history', RateController.getRateHistory);
router.post('/update-all-prices', RateController.updateAllProductPrices);
router.get('/summary', RateController.getPricingSummary);

module.exports = router;
