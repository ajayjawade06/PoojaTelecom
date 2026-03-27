import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaShoppingBag, FaArrowRight, FaMinus, FaPlus } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const removeFromCartHandler = (id) => dispatch(removeFromCart(id));

  // BUG FIX: if already logged in go directly to shipping, else send to login first
  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  };

  const totalItems = cartItems.reduce((a, c) => a + c.qty, 0);
  const totalPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 animate-fade-in relative z-10">
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-12 flex items-center gap-4">
        <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-3xl shadow-lg shadow-emerald-500/20">
          <FaShoppingBag size={32} />
        </div>
        Your Cart.
        {cartItems.length > 0 && (
          <span className="text-xl font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-2xl ml-auto border border-slate-200 dark:border-white/10">
            {totalItems} <span className="text-sm uppercase tracking-widest">items</span>
          </span>
        )}
      </h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-32 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none"></div>
          <div className="text-9xl mb-8 relative">
             🛒
             <div className="absolute inset-0 bg-emerald-500/20 blur-[50px] -z-10 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Your cart is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-sm text-lg">Looks like you haven't added any of our premium products yet.</p>
          <Link
            to="/"
            className="group relative inline-flex items-center gap-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest text-sm py-4 px-10 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-95"
          >
            Explore Catalog <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item._id} className="group relative flex flex-col sm:flex-row items-center p-6 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-900/5 border border-slate-100 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-300">
                {/* Image */}
                <Link to={`/product/${item._id}`} className="flex-shrink-0 mb-6 sm:mb-0 sm:mr-8 relative">
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-32 h-32 bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex items-center justify-center relative z-10 border border-slate-100 dark:border-white/5 group-hover:-translate-y-2 transition-transform duration-300">
                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain filter drop-shadow-xl" />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-grow text-center sm:text-left min-w-0 w-full">
                  <Link to={`/product/${item._id}`} className="block text-xl font-black text-slate-800 dark:text-white hover:text-emerald-500 transition-colors line-clamp-2 leading-tight mb-2">
                    {item.name}
                  </Link>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{item.brand}</p>
                  
                  {/* Quantity Mobile */}
                  <div className="flex sm:hidden items-center justify-center gap-4 mb-4">
                    <button
                      onClick={() => item.qty > 1 && dispatch(addToCart({ ...item, qty: item.qty - 1 }))}
                      disabled={item.qty <= 1}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-emerald-500 hover:text-white text-slate-600 dark:text-white flex items-center justify-center disabled:opacity-30 transition-colors"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="w-8 text-center font-black text-lg text-slate-900 dark:text-white">{item.qty}</span>
                    <button
                      onClick={() => item.qty < item.countInStock && dispatch(addToCart({ ...item, qty: item.qty + 1 }))}
                      disabled={item.qty >= item.countInStock}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-emerald-500 hover:text-white text-slate-600 dark:text-white flex items-center justify-center disabled:opacity-30 transition-colors"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  
                  <div className="text-2xl font-black text-emerald-500">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Actions Desktop */}
                <div className="hidden sm:flex flex-col items-end justify-between self-stretch lg:min-w-[140px]">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <button
                      onClick={() => item.qty > 1 && dispatch(addToCart({ ...item, qty: item.qty - 1 }))}
                      disabled={item.qty <= 1}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-sm disabled:opacity-30 transition-colors"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="w-8 text-center font-black text-slate-900 dark:text-white">{item.qty}</span>
                    <button
                      onClick={() => item.qty < item.countInStock && dispatch(addToCart({ ...item, qty: item.qty + 1 }))}
                      disabled={item.qty >= item.countInStock}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-sm disabled:opacity-30 transition-colors"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="group/btn flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-white/5 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <FaTrash size={12} className="group-hover/btn:scale-110 transition-transform" /> Remove
                  </button>
                </div>

                {/* Remove Mobile */}
                <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="sm:hidden absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-white/5 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] shadow-2xl p-8 sticky top-28 border border-slate-800 dark:border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <h2 className="text-xl font-black text-white mb-8 pb-4 border-b border-white/10 relative z-10">Checkout Summary</h2>

              <div className="space-y-6 mb-8 text-sm relative z-10">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-bold">Subtotal ({totalItems})</span>
                  <span className="font-black text-white text-lg">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-bold">Shipping</span>
                  {totalPrice > 500 ? (
                     <span className="font-black text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-lg">FREE</span>
                  ) : (
                     <span className="font-black text-white text-lg">₹49</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center py-6 border-t border-white/10 mb-8 relative z-10">
                <span className="font-bold text-slate-300 uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
                  ₹{(totalPrice > 500 ? totalPrice : totalPrice + 49).toLocaleString('en-IN')}
                </span>
              </div>

              {totalPrice > 500 && (
                <div className="bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl mb-6 flex items-center justify-center gap-2 border border-emerald-500/20 relative z-10">
                  🎉 Free Delivery Unlocked
                </div>
              )}

              <button
                className="w-full relative group flex items-center justify-between bg-emerald-500 hover:bg-emerald-400 text-white p-1 rounded-2xl transition-all active:scale-[0.98] z-10 overflow-hidden"
                onClick={checkoutHandler}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="font-black uppercase tracking-widest text-xs pl-6 py-4 relative z-10">Secure Checkout</span>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center relative z-10 mr-1 group-hover:bg-white/30 transition-colors">
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
            
            <Link to="/" className="flex items-center justify-center gap-2 mt-8 text-slate-500 dark:text-slate-400 hover:text-emerald-500 font-bold text-sm transition-colors uppercase tracking-widest">
              <FaArrowRight className="rotate-180" /> Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default CartPage;
