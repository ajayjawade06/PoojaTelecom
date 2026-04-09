import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetGlobalSearchQuery } from '../../redux/slices/searchApiSlice';
import { FaSearch, FaTimes, FaBox, FaUser, FaShoppingBag } from 'react-icons/fa';
import Loader from '../Loader';

const AdminOmnibar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [query]);

  const { data, isLoading } = useGetGlobalSearchQuery(debouncedQuery, {
    skip: !debouncedQuery || debouncedQuery.trim() === '',
  });

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 backdrop-blur-sm bg-slate-900/40" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Area */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-white/5">
          <FaSearch className="text-slate-400" size={16} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search orders, products, or users..." 
            className="flex-1 bg-transparent outline-none text-slate-800 dark:text-white text-[15px] font-medium placeholder-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded"
            onClick={() => setIsOpen(false)}
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto min-h-[100px] p-2 no-scrollbar">
          {!query ? (
             <div className="py-10 text-center text-slate-400">
               <p className="text-[12px] font-bold">Start typing to search your entire platform.</p>
               <p className="text-[10px] uppercase tracking-widest mt-2 opacity-50">Products • Orders • Customers</p>
             </div>
          ) : isLoading ? (
             <div className="py-10 flex justify-center"><Loader /></div>
          ) : data && (data.users.length > 0 || data.products.length > 0 || data.orders.length > 0) ? (
             <div className="space-y-4 p-2">
                {/* Orders Block */}
                {data.orders.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 pl-2">Orders Found</h3>
                    {data.orders.map(order => (
                      <div 
                        key={order._id}
                        onClick={() => handleNavigate(`/order/${order._id}`)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                         <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                           <FaBox size={14} />
                         </div>
                         <div className="flex flex-col min-w-0">
                           <span className="text-[13px] font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">#{order._id.slice(-8)}</span>
                           <span className="text-[11px] text-slate-500 font-medium truncate">Placed by {order.user?.name} on {new Date(order.createdAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Products Block */}
                {data.products.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 pl-2 mt-4">Products Found</h3>
                    {data.products.map(product => (
                      <div 
                        key={product._id}
                        onClick={() => handleNavigate(`/admin/product/${product._id}/edit`)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                         <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                           <FaShoppingBag size={14} />
                         </div>
                         <div className="flex flex-col min-w-0">
                           <span className="text-[13px] font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate">{product.name}</span>
                           <span className="text-[11px] text-slate-500 font-medium">₹{product.price.toLocaleString('en-IN')} — {product.countInStock} In Stock</span>
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Users Block */}
                {data.users.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 pl-2 mt-4">Customers Found</h3>
                    {data.users.map(user => (
                      <div 
                        key={user._id}
                        onClick={() => handleNavigate(`/admin/user/${user._id}/edit`)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                         <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                           <FaUser size={14} />
                         </div>
                         <div className="flex flex-col min-w-0">
                           <span className="text-[13px] font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">{user.name}</span>
                           <span className="text-[11px] text-slate-500 font-medium">{user.email} {user.isAdmin && '• Admin'}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          ) : (
             <div className="py-10 text-center text-slate-400">
               <p className="text-[13px] font-bold">No matching records found for "{query}"</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOmnibar;
