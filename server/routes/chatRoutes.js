import express from 'express';
import { getChatHistory, getAllChats, markChatReadAdmin, deleteChatHistory } from '../controllers/chatController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getAllChats);
router.route('/:userId').get(getChatHistory).delete(deleteChatHistory); // Public to accommodate guests
router.route('/:userId/read').put(protect, admin, markChatReadAdmin);

export default router;
