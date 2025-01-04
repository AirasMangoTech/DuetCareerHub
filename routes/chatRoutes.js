const express = require('express');
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middlewares/verifyToken'); 
const router = express.Router();

router.post('/messages', verifyToken, chatController.sendMessage);
router.get('/messages/:conversationId', verifyToken, chatController.getMessages);

module.exports = router;
