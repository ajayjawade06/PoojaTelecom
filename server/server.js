import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './utils/db.js';
import SupportChat from './models/supportChatModel.js';

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://pooja-telecom.vercel.app',
      'https://pooja-telecom-git-main-ajayjawade06s-projects.vercel.app',
      'https://poojatelecom.onrender.com',
      'https://pooja-telecom.onrender.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import carouselRoutes from './routes/carouselRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Pooja Telecom API is running...');
});

const getBotResponse = (text, userName) => {
  const t = text.toLowerCase();
  const nameStr = userName && userName !== 'Guest Customer' ? ` ${userName.split(' ')[0]}` : '';

  // Greetings
  if (t.match(/\b(hi|hello|hey|greetings|namaste)\b/)) return `Hello${nameStr}! 👋 Welcome to Pooja Telecom. How can I assist you with our premium tech store today?`;
  
  // Order Tracking
  if (t.match(/\b(track|status|where is my order|tracking)\b/)) return `📦 To track your order, please click "Track My Order" or provide your Order ID (e.g., #PTXXXX) and an admin will assist you shortly.`;
  
  // Products & Inventory
  if (t.match(/\b(iphone|apple)\b/)) return "🍎 We carry the complete Apple ecosystem! The latest iPhones start at ₹79,900 with No-Cost EMI options. Are you looking for a specific model or storage size?";
  if (t.match(/\b(samsung|galaxy)\b/)) return "🌌 Samsung's latest Galaxy S and Z series are in stock! We currently have exclusive trade-in bonuses available for these devices.";
  if (t.match(/\b(laptop|macbook)\b/)) return "💻 Looking for high-performance computing? We stock Apple MacBooks, Asus ROG, and HP Envy. Let me know your use-case and I can recommend the perfect model.";
  
  // Sales & Policies
  if (t.match(/\b(offer|discount|coupon|sale|deal)\b/)) return "🎁 Great news! We offer a flat 10% instant discount on HDFC & ICICI credit cards. You can also use code 'POOJA10' at checkout for additional savings.";
  if (t.match(/\b(warranty|repair|broken|fix)\b/)) return "🛡️ All our premium products include a standard 1-year authorized brand warranty. If you require physical repairs, our certified service center in Mumbai is open daily 10 AM - 9 PM.";
  if (t.match(/\b(refund|return|cancel|exchange)\b/)) return "🔄 We offer a seamless 7-day return policy for sealed items. If you received a defective product, an admin will be with you shortly to initiate a replacement.";
  if (t.match(/\b(emi|loan|finance|credit)\b/)) return "💳 We partner with Bajaj Finserv and major banks to offer 0% No-Cost EMI for up to 12 months on all devices over ₹15,000.";
  if (t.match(/\b(shipping|delivery|time|deliver)\b/)) return "🚚 Express Delivery is FREE for all orders above ₹5,000! Deliveries to metro areas usually take 1-2 business days, and 3-5 days for other regions.";
  
  // If no match is found, fallback to human support
  return null;
};

import searchRoutes from './routes/searchRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin/search', searchRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/carousel', carouselRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/chat', chatRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/api/config/razorpay', (req, res) =>
  res.send({ keyId: process.env.RAZORPAY_KEY_ID })
);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Socket.io Setup
const io = new Server(httpServer, {
  cors: corsOptions
});

io.on('connection', (socket) => {
  socket.on('join_chat', (userId) => {
    socket.join(userId);
  });

  socket.on('send_message', async (data) => {
    const { userId, text, sender, userName, tempId } = data;
    try {
      if (!userId || !text) return;

      let botReplyText = null;
      let botMessageAdded = false;

      // Calculate bot response before touching the DB
      if (sender === 'user') {
        botReplyText = getBotResponse(text, userName);
        if (botReplyText) botMessageAdded = true;
      }

      const messagesToPush = [{ text, sender }];
      if (botMessageAdded) {
        messagesToPush.push({ text: botReplyText, sender: 'admin' });
      }

      const updateQuery = {
        $push: { messages: { $each: messagesToPush } },
        $setOnInsert: { userName }
      };

      if (sender === 'user' && !botMessageAdded) {
         updateQuery.$inc = { unreadAdmin: 1 };
      } else if (sender === 'admin') {
         updateQuery.$inc = { unreadUser: 1 };
      }

      // Atomic update prevents concurrency lost-update bugs
      const updatedChat = await SupportChat.findOneAndUpdate(
        { userId },
        updateQuery,
        { new: true, upsert: true }
      );

      // Emit the messages
      if (botMessageAdded && updatedChat.messages.length >= 2) {
         const userMsg = updatedChat.messages[updatedChat.messages.length - 2].toObject();
         const botMsg = updatedChat.messages[updatedChat.messages.length - 1].toObject();
         
         // Attach tempId and userId to user message so client can de-duplicate and identify the chat
         io.to(userId).emit('receive_message', { ...userMsg, tempId, userId });
         
         // Notify admin immediately of the human message
         io.to('admin_room').emit('chat_updated', updatedChat);
         
         // Delay bot emit
         setTimeout(() => {
            io.to(userId).emit('receive_message', { ...botMsg, userId });
            
            // Re-emit chat_updated for admin to show bot response in history
            io.to('admin_room').emit('chat_updated', updatedChat);
         }, 1000);
      } else if (updatedChat.messages.length >= 1) {
         const lastMsg = updatedChat.messages[updatedChat.messages.length - 1].toObject();
         io.to(userId).emit('receive_message', { ...lastMsg, tempId: sender === 'user' ? tempId : undefined, userId });
         io.to('admin_room').emit('chat_updated', updatedChat);
      }
    } catch (err) {
      console.error('Socket message error:', err);
    }
  });

  socket.on('admin_join', () => {
    socket.join('admin_room');
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
