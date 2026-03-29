import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaComments, FaTimes, FaRegSmile, FaHeadset, FaPaperPlane, FaRobot, FaQuestionCircle, FaTruck, FaMobileAlt, FaPercent } from 'react-icons/fa';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([
    { id: 1, text: userInfo ? `Hi ${userInfo.name}! 👋 Welcome back to Pooja Telecom. How can I assist you today?` : "Hi! 👋 Welcome to Pooja Telecom. How can I help you today?", sender: 'bot', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    { text: "Latest iPhone Price", icon: <FaMobileAlt /> },
    { text: "Track My Order", icon: <FaTruck /> },
    { text: "Store Offers", icon: <FaPercent /> },
    { text: "Warranty Info", icon: <FaQuestionCircle /> }
  ];

  const handleSend = (text) => {
    const messageText = typeof text === 'string' ? text : input;
    if (!messageText.trim()) return;

    const userMessage = { id: Date.now(), text: messageText, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulated Bot Response
    setTimeout(() => {
      const botMessage = { 
        id: Date.now() + 1, 
        text: getBotResponse(messageText), 
        sender: 'bot', 
        time: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const getBotResponse = (text) => {
    const t = text.toLowerCase();
    if (t.includes('iphone')) return "Excellent choice! The newest iPhone series starts at ₹79,900. We also have interest-free EMI options. Would you like a direct link to the iPhone collection?";
    if (t.includes('track') || t.includes('status')) return userInfo ? `Sure ${userInfo.name}! Please provide your Order ID (starting with #PT), or you can check our 'My Orders' section in your profile.` : "To track your order, please log in to your account or provide your Order ID (#PTXXXX).";
    if (t.includes('offer') || t.includes('discount')) return "Currently, we have 10% instant discount on HDFC & ICICI cards, plus a special festive coupon 'POOJA10' for extra savings!";
    if (t.includes('warranty') || t.includes('repair')) return "We offer 1-year official brand warranty on all products. If you need repair services, our main store in Mumbai is open 10 AM - 9 PM daily.";
    if (t.includes('hi') || t.includes('hello')) return userInfo ? `Hello again, ${userInfo.name}! How's your shopping experience today?` : "Hello! How can I help you navigate our premium tech store?";
    return "I've logged your request. One of our human experts will take over this chat in a few moments if you need more specialized help. Anything else I can assist with?";
  };

  return (
    <div className="fixed bottom-4 right-4 z-[1000] font-sans">
      {/* Chat Window */}
      <div className={`fixed bottom-20 right-4 w-[calc(100vw-2rem)] sm:w-80 glass-panel rounded-[1.5rem] shadow-2xl transition-all duration-500 transform origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <FaHeadset size={12} />
             </div>
             <div>
                <h4 className="font-bold text-[11px] tracking-tight">Support</h4>
                <div className="flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                   <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Online</span>
                </div>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-1.5 bg-white/10 rounded-lg">
             <FaTimes size={10} />
          </button>
        </div>

        {/* Messages Content */}
        <div className="h-[320px] overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-3 custom-scrollbar">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[85%] flex flex-col animate-fade-in ${m.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}>
               <div className={`p-3 rounded-2xl text-[11px] font-medium shadow-sm leading-relaxed ${m.sender === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-white/5'}`}>
                  {m.text}
               </div>
               <span className="text-[8px] text-slate-400 mt-0.5 font-black uppercase tracking-widest">{m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
          {isTyping && (
             <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 p-2 rounded-xl flex gap-1 w-12 shadow-sm animate-pulse">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1 h-1 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
             </div>
          )}
        </div>

        {/* Quick Replies */}
        {!isTyping && (
          <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
             {quickReplies.map((qr, i) => (
               <button 
                 key={i} 
                 onClick={() => handleSend(qr.text)}
                 className="flex items-center gap-1.5 whitespace-nowrap bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1.5 rounded-full text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all transform active:scale-95"
               >
                 <span className="scale-75">{qr.icon}</span> {qr.text}
               </button>
             ))}
          </div>
        )}

        {/* Improved Input Area */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white dark:bg-slate-900 flex items-center gap-2">
           <button type="button" className="text-slate-400 hover:text-emerald-500 transition-colors"><FaRegSmile size={16} /></button>
           <input 
             type="text" 
             placeholder="How can we help?" 
             className="flex-grow bg-slate-100 dark:bg-slate-800 border-none outline-none py-2 px-4 rounded-xl text-[11px] font-bold text-slate-700 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 transition-all"
             value={input}
             onChange={(e) => setInput(e.target.value)}
           />
           <button type="submit" className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/30 active:scale-90 transition-all hover:bg-emerald-600">
             <FaPaperPlane size={10} />
           </button>
        </form>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-rose-500 rotate-90 text-white' : 'bg-emerald-500 text-white shadow-emerald-500/40'}`}
      >
        {isOpen ? <FaTimes size={18} /> : <FaComments size={20} />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-bounce"></span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
