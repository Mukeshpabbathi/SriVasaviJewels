const express = require('express');
const ChatController = require('../controllers/chatController');

const router = express.Router();

// Chat routes
router.post('/message', ChatController.processMessage);

module.exports = router;
