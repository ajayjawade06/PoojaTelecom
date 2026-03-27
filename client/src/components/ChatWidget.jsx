import { useState, useEffect } from 'react';
import { FaComments, FaTimes, FaRegSmile, FaHeadset, FaPaperPlane } from 'react-icons/fa';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! 👋 Welcome to Pooja Telecom. How can I help you today?", sender: 'bot', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user', time: new Date() };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulated Bot Response
    setTimeout(() => {
      const botMessage = { 
        id: Date.now() + 1, 
        text: getBotResponse(input), 
        sender: 'bot', 
        time: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (text) => {
    const t = text.toLowerCase();
    if (t.includes('iphone')) return "Great choice! We have the latest iPhone 16 series in stock with exclusive exchange offers. Would you like to see the pricing?";
    if (t.includes('delivery')) return "We offer free expressing shipping across India! Most orders are delivered within 2-4 business days.";
    if (t.includes('warranty')) return "All our products come with a 1-year brand warranty. We only sell 100% genuine products.";
    return "Thanks for reaching out! One of our experts will be with you shortly. In the meantime, feel free to browse our latest collection.";
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {/* Chat Window */}
      <div className={`absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl transition-all duration-500 transform origin-bottom-right border border-slate-100 overflow-hidden ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <FaHeadset />
             </div>
             <div>
                <h4 className="font-bold text-sm tracking-tight">Customer Support</h4>
                <div className="flex items-center gap-1.5">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Online Now</span>
                </div>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-2 bg-white/10 rounded-xl">
             <FaTimes size={14} />
          </button>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-4">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[85%] flex flex-col ${m.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}>
               <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${m.sender === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                  {m.text}
               </div>
               <span className="text-[9px] text-slate-400 mt-1 font-bold uppercase">{m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
          {isTyping && (
             <div className="bg-white border border-slate-100 p-3 rounded-2xl flex gap-1 w-16 shadow-sm">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></div>
             </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
           <button type="button" className="text-slate-400 hover:text-emerald-500 transition-colors"><FaRegSmile size={20} /></button>
           <input 
             type="text" 
             placeholder="Type a message..." 
             className="flex-grow bg-slate-100 border-none outline-none py-3 px-4 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all"
             value={input}
             onChange={(e) => setInput(e.target.value)}
           />
           <button type="submit" className="bg-emerald-500 text-white p-3 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-90 transition-all">
             <FaPaperPlane size={14} />
           </button>
        </form>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-rose-500 rotate-90 text-white' : 'bg-emerald-500 text-white shadow-emerald-500/40'}`}
      >
        {isOpen ? <FaTimes size={24} /> : <FaComments size={28} />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white animate-bounce"></span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
