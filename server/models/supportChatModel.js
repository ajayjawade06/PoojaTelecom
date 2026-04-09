import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, enum: ['user', 'admin'], required: true },
}, { timestamps: true });

const supportChatSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  userName: {
    type: String,
    required: true
  },
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  unreadAdmin: {
    type: Number,
    default: 0
  },
  unreadUser: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const SupportChat = mongoose.model('SupportChat', supportChatSchema);

export default SupportChat;
