import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { removeFromCart, setCartOpen } from '../redux/slices/cartSlice';
import { getFullImageUrl } from '../utils/imageUtils';

const SideCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, itemsPrice, isCartOpen } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => dispatch(setCartOpen(false))}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm cursor-pointer"
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[210] h-full w-full sm:w-[400px] bg-white dark:bg-[#1c1c1e] shadow-2xl flex flex-col border-l border-slate-200 dark:border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                <FaShoppingCart /> Your Cart
              </h2>
              <button 
                onClick={() => dispatch(setCartOpen(false))}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <FaTimes size={12}/>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-white/5">
                    <FaShoppingCart size={32} className="text-slate-200 dark:text-slate-700" />
                  </div>
                  <p className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">Your cart is empty</p>
                  <p className="text-[11px] font-medium text-slate-500 mb-8 max-w-[200px] mx-auto leading-relaxed">Looks like you haven't added any premium tech to your collection yet.</p>
                  <button 
                    onClick={() => dispatch(setCartOpen(false))}
                    className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200/50 dark:shadow-none transition-all active:scale-95 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 group">
                    <img src={getFullImageUrl(item.image)} alt={item.name} className="w-16 h-16 object-contain rounded-xl bg-white dark:bg-slate-950 p-1 shrink-0" />
                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <p className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">{item.name}</p>
                        <p className="text-[9px] font-black tracking-widest uppercase text-slate-400 mt-1">Qty: {item.qty}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[13px] font-black text-blue-500">₹{item.price.toLocaleString('en-IN')}</p>
                        <button onClick={() => dispatch(removeFromCart(item._id))} className="text-slate-400 hover:text-rose-500 transition-colors p-1 opacity-0 group-hover:opacity-100">
                          <FaTrash size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">₹{itemsPrice?.toLocaleString('en-IN')}</span>
                </div>
                <button 
                  onClick={() => { dispatch(setCartOpen(false)); navigate('/cart'); }}
                  className="w-full bg-blue-500 text-white font-black h-12 rounded-full text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors active:scale-95"
                >
                  Review Order <FaArrowRight size={10}/>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideCart;
