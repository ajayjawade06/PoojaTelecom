import SupportChat from '../models/supportChatModel.js';

// @desc    Get user's chat history
// @route   GET /api/chat/:userId
// @access  Public
export const getChatHistory = async (req, res) => {
  try {
    let chat = await SupportChat.findOne({ userId: req.params.userId });
    
    // Auto-clear unread count for user when they fetch their history
    if (chat && chat.unreadUser > 0) {
      chat.unreadUser = 0;
      await chat.save();
    }
    
    res.json(chat || { messages: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active chats
// @route   GET /api/chat
// @access  Private/Admin
export const getAllChats = async (req, res) => {
  try {
    const chats = await SupportChat.find({}).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear admin unread notifications for a chat
// @route   PUT /api/chat/:userId/read
// @access  Private/Admin
export const markChatReadAdmin = async (req, res) => {
  try {
    const chat = await SupportChat.findOne({ userId: req.params.userId });
    if (chat) {
      chat.unreadAdmin = 0;
      await chat.save();
      res.json({ message: 'Marked as read' });
    } else {
      res.status(404).json({ message: 'Chat not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Clear user's chat history
// @route   DELETE /api/chat/:userId
// @access  Public
export const deleteChatHistory = async (req, res) => {
  try {
    const chat = await SupportChat.findOne({ userId: req.params.userId });
    if (chat) {
      chat.messages = [];
      chat.status = 'Open';
      chat.unreadAdmin = 0;
      chat.unreadUser = 0;
      await chat.save();
      res.json({ message: 'Chat history cleared' });
    } else {
      res.status(401).json({ message: 'Chat not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
