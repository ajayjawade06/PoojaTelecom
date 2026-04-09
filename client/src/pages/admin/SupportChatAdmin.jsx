import { useState, useEffect, useRef } from 'react';
import { useGetAllChatsQuery, useMarkChatReadAdminMutation } from '../../redux/slices/chatApiSlice';
import io from 'socket.io-client';
import { FaPaperPlane, FaUserCircle, FaCircle, FaInfoCircle } from 'react-icons/fa';

const SupportChatAdmin = () => {
    const { data: allChats, isLoading, refetch } = useGetAllChatsQuery();
    const [markRead] = useMarkChatReadAdminMutation();
    const [activeChat, setActiveChat] = useState(null);
    const [input, setInput] = useState('');
    const [localChats, setLocalChats] = useState([]);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    // Initialize local state
    useEffect(() => {
        if (allChats) setLocalChats(allChats);
    }, [allChats]);

    // Socket Connection
    useEffect(() => {
        // FIX: Use import.meta.env.PROD for Vite/Live site detection
        const socketUrl = import.meta.env.PROD ? window.location.origin : 'http://localhost:5000';
        socketRef.current = io(socketUrl);
        socketRef.current.emit('admin_join');

        socketRef.current.on('chat_updated', (updatedChat) => {
            setLocalChats(prev => {
                const exists = prev.find(c => c.userId === updatedChat.userId);
                let newList;
                if (exists) {
                    newList = prev.map(c => c.userId === updatedChat.userId ? updatedChat : c);
                } else {
                    newList = [updatedChat, ...prev];
                }
                return newList.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            });

            // Update active chat live viewing
            setActiveChat(current => {
               if (current && current.userId === updatedChat.userId) {
                   // Only update if messages length is different to avoid cursor jumping
                   if (current.messages.length !== updatedChat.messages.length) {
                       return updatedChat;
                   }
               }
               return current;
            });
        });

        socketRef.current.on('receive_message', (newMessage) => {
            setActiveChat(current => {
                if (current && current.userId === newMessage.userId) {
                    // Prevent duplicates
                    if (current.messages.find(m => (m._id && m._id === newMessage._id) || (m.tempId && m.tempId === newMessage.tempId))) {
                        return current;
                    }
                    return {
                        ...current,
                        messages: [...current.messages, newMessage]
                    };
                }
                return current;
            });
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    // Auto-scroll Down
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChat]);

    const handleSelectChat = async (chat) => {
        setActiveChat(chat);
        if (socketRef.current) {
            socketRef.current.emit('join_chat', chat.userId);
        }
        
        if (chat.unreadAdmin > 0) {
            await markRead(chat.userId);
            // manually clear local unread to feel instant
            setLocalChats(prev => prev.map(c => c.userId === chat.userId ? { ...c, unreadAdmin: 0 } : c));
        }
    };

    const handleSend = () => {
        if (!input.trim() || !activeChat) return;

        const tempId = Date.now().toString();

        const newMsg = {
           userId: activeChat.userId,
           userName: 'Admin',
           text: input,
           sender: 'admin',
           tempId: tempId,
           createdAt: new Date().toISOString()
        };

        // Optimistic Update
        setActiveChat(prev => ({
            ...prev,
            messages: [...prev.messages, { ...newMsg, _id: tempId }]
        }));

        // Emit
        if (socketRef.current) {
            socketRef.current.emit('send_message', newMsg);
        }
        setInput('');
    };

    if (isLoading) return <div className="p-10 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div></div>;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] main-container pt-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Live Support Intercom</h2>
            
            <div className="flex-grow flex bg-white dark:bg-[#1c1c1e] rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm min-h-0">
                {/* Left Sidebar - Chat List */}
                <div className="w-1/3 min-w-[250px] border-r border-slate-200 dark:border-white/5 flex flex-col">
                    <div className="p-5 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Active Sessions</h3>
                    </div>
                    <div className="flex-grow overflow-y-auto custom-scrollbar">
                        {localChats.length === 0 ? (
                            <p className="p-8 text-xs font-medium text-slate-400 text-center">No active chats.</p>
                        ) : (
                            localChats.map(chat => (
                                <div 
                                    key={chat.userId} 
                                    onClick={() => handleSelectChat(chat)}
                                    className={`p-4 border-b border-slate-100 dark:border-white/5 cursor-pointer transition-colors flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-white/5 ${activeChat?.userId === chat.userId ? 'bg-blue-50/50 dark:bg-blue-500/10' : ''}`}
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                            <FaUserCircle size={20} />
                                        </div>
                                        {chat.status === 'Open' && <FaCircle className="absolute bottom-0 right-0 text-emerald-500 text-[10px] ring-2 ring-white dark:ring-[#1c1c1e] rounded-full" />}
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{chat.userName}</h4>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(chat.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                            {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'New Session'}
                                        </p>
                                    </div>
                                    {chat.unreadAdmin > 0 && (
                                        <div className="bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm shadow-rose-500/30 shrink-0">
                                            {chat.unreadAdmin}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Area - Chat Window */}
                <div className="w-2/3 flex flex-col bg-[#f8fafc] dark:bg-transparent relative">
                    {activeChat ? (
                        <>
                            {/* Header */}
                            <div className="p-6 bg-white dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                        <FaUserCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">{activeChat.userName}</h3>
                                        <p className="text-[11px] font-bold text-slate-400 tracking-wider">ID: <span className="uppercase text-slate-500 dark:text-slate-300">{activeChat.userId.substring(0,8)}</span></p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${activeChat.status === 'Open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 dark:bg-white/5 text-slate-500'}`}>
                                    {activeChat.status}
                                </span>
                            </div>

                            {/* Messages */}
                            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                                {activeChat.messages.map((m) => (
                                    <div key={m._id || m.tempId} className={`max-w-[70%] flex flex-col ${m.sender === 'admin' ? 'ml-auto items-end' : 'items-start'}`}>
                                        <div className={`p-4 rounded-3xl text-[13px] font-medium shadow-sm leading-relaxed ${m.sender === 'admin' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-white/5'}`}>
                                            {m.text}
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest px-2">
                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white dark:bg-black/20 border-t border-slate-200 dark:border-white/5">
                                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Type a reply to the customer..." 
                                        className="flex-grow bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 outline-none py-3 px-5 rounded-full text-[13px] font-medium text-slate-700 dark:text-white placeholder-slate-400 focus:border-blue-500 transition-all"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!input.trim()} 
                                        className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 disabled:opacity-50 hover:scale-105"
                                    >
                                        <FaPaperPlane size={14} className="-ml-1" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                            <FaInfoCircle size={48} className="mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Support Intercom</h3>
                            <p className="text-xs font-medium">Select a customer session from the left to start replying.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportChatAdmin;
