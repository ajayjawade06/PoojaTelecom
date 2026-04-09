import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaComments, FaTimes, FaRegSmile, FaHeadset, FaPaperPlane, FaQuestionCircle, FaTruck, FaMobileAlt, FaPercent } from 'react-icons/fa';
import io from 'socket.io-client';
import { useGetChatHistoryQuery } from '../redux/slices/chatApiSlice';

let socket;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [chatId, setChatId] = useState('');
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize Identity
  useEffect(() => {
    if (userInfo) {
      setChatId(userInfo._id);
      setUserName(userInfo.name);
    } else {
      let guestId = localStorage.getItem('guestChatId');
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('guestChatId', guestId);
      }
      setChatId(guestId);
      setUserName('Guest Customer');
    }
  }, [userInfo]);

  const { data: chatHistory, refetch } = useGetChatHistoryQuery(chatId, {
    skip: !chatId,
  });

  // Load History
  useEffect(() => {
    if (chatHistory && chatHistory.messages && chatHistory.messages.length > 0) {
      setMessages(chatHistory.messages);
    } else {
      setMessages([
        { 
          _id: 'welcome', 
          text: userInfo ? `Hi ${userInfo.name}! 👋 How can I assist you today?` : "Hi! 👋 Welcome to Pooja Telecom. How can I help you today?", 
          sender: 'admin', 
          createdAt: new Date().toISOString() 
        }
      ]);
    }
  }, [chatHistory, userInfo]);

  // Socket Connection
  useEffect(() => {
    if (chatId) {
      const socketUrl = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000';
      socket = io(socketUrl);
      
      socket.emit('join_chat', chatId);

      socket.on('receive_message', (newMessage) => {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.find(m => m._id === newMessage._id || (m.tempId && m.tempId === newMessage.tempId))) return prev;
          return [...prev, newMessage];
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [chatId]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // When opened, refetch to clear unread
  useEffect(() => {
    if (isOpen && chatId) {
      refetch();
    }
  }, [isOpen, chatId, refetch]);

  const quickReplies = [
    { text: "Latest iPhone Price", icon: <FaMobileAlt /> },
    { text: "Track My Order", icon: <FaTruck /> },
    { text: "Store Offers", icon: <FaPercent /> },
    { text: "Warranty Info", icon: <FaQuestionCircle /> }
  ];

  const handleSend = (text) => {
    const messageText = typeof text === 'string' ? text : input;
    if (!messageText.trim() || !chatId) return;

    const newMsg = {
      userId: chatId,
      userName: userName,
      text: messageText,
      sender: 'user'
    };

    setInput('');
    socket.emit('send_message', newMsg);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] font-sans">
      {/* Chat Window */}
      <div className={`fixed bottom-20 right-6 w-[calc(100vw-3rem)] sm:w-72 glass-panel rounded-[2rem] shadow-2xl transition-all duration-200 transform origin-bottom-right overflow-hidden border border-white/20 dark:border-white/5 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 p-4 text-white flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-2 ring-white/10">
              <FaHeadset size={10} />
            </div>
            <div>
              <h4 className="font-black text-[10px] tracking-tight uppercase">Support Assistant</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <span className="text-[8px] text-blue-500/80 font-black uppercase tracking-[0.1em]">Online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-all">
            <FaTimes size={10} className="text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Messages Content */}
        <div className="h-[280px] overflow-y-auto p-4 bg-slate-50/30 dark:bg-slate-900/40 flex flex-col gap-4 custom-scrollbar">
          {messages.map((m) => (
            <div key={m._id} className={`max-w-[85%] flex flex-col ${m.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-2xl text-[11px] font-medium shadow-sm leading-relaxed ${m.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-white/5'}`}>
                {m.text}
              </div>
              <span className="text-[8px] text-slate-400 mt-0.5 font-black uppercase tracking-widest">
                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-white/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-white/5">
          {quickReplies.map((qr, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(qr.text)}
              className="flex items-center gap-1.5 whitespace-nowrap bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/10 px-3 py-1.5 rounded-full text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:border-blue-500 hover:text-blue-500 transition-all transform shadow-sm"
            >
              <span className="text-blue-500 opacity-60">{qr.icon}</span> {qr.text}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white dark:bg-slate-900 flex items-center gap-2">
          <button type="button" className="text-slate-400 hover:text-blue-500 transition-colors"><FaRegSmile size={16} /></button>
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-grow bg-slate-100 dark:bg-slate-800 border-none outline-none py-2 px-4 rounded-xl text-[11px] font-bold text-slate-700 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input.trim()} className="bg-blue-500 text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
            <FaPaperPlane size={10} />
          </button>
        </form>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-200 transform ${isOpen ? 'bg-slate-900 rotate-90 text-white' : 'bg-blue-500 text-white shadow-blue-500/30 ring-4 ring-blue-500/10'}`}
      >
        {isOpen ? <FaTimes size={14} /> : <FaComments size={18} />}
        {!isOpen && chatHistory?.unreadUser > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-bounce flex items-center justify-center text-[8px] font-bold text-white">
            {chatHistory.unreadUser}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
