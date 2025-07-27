const express = require('express');
const ChatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Chat routes
router.post('/message', ChatController.processMessage);

// Chat history routes (require authentication) - commented out for now to avoid auth issues
// router.get('/history', authMiddleware, ChatController.getChatHistory);
// router.post('/history', authMiddleware, ChatController.saveChatHistory);
// router.delete('/history', authMiddleware, ChatController.clearChatHistory);

module.exports = router;
