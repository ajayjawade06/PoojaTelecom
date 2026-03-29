import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaShoppingBag, FaArrowRight, FaMinus, FaPlus, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const removeFromCartHandler = (id) => dispatch(removeFromCart(id));

  const checkoutHandler = () => {
    if (userInfo) navigate('/shipping');
    else navigate('/login?redirect=/shipping');
  };

  const totalItems = cartItems.reduce((a, c) => a + c.qty, 0);
  const totalPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);

  if (cartItems.length === 0) {
    return (
      <div className="pt-40 pb-20 main-container animate-fade-in flex flex-col items-center text-center">
         <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 mb-6 border border-slate-200 dark:border-white/10">
            <FaShoppingBag size={24} />
         </div>
         <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Your Cart is Empty</h1>
         <p className="text-sm font-medium text-slate-500 mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
         <Link to="/" className="bg-emerald-500 text-white font-black py-3 px-8 rounded-lg text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/10">
            Explore Shop
         </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
      <div className="main-container">
        <div className="flex items-baseline gap-4 mb-10 border-b border-slate-100 dark:border-white/5 pb-4">
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Shopping Bag</h1>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{totalItems} Units Total</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
             {cartItems.map((item) => (
               <div key={item._id} className="group flex items-center gap-6 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 transition-all duration-300">
                  {/* Small Item Image */}
                  <Link to={`/product/${item._id}`} className="shrink-0">
                     <div className="w-20 h-20 bg-white dark:bg-slate-950 rounded-xl p-2 flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-sm transition-transform group-hover:-translate-y-1">
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                     </div>
                  </Link>
                  
                  {/* Detailed Info Column */}
                  <div className="flex-grow">
                     <Link to={`/product/${item._id}`} className="text-[13px] font-black text-slate-800 dark:text-white hover:text-emerald-500 transition-colors line-clamp-1 mb-1 leading-tight">
                        {item.name}
                     </Link>
                     <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">{item.brand}</p>
                     <div className="text-[14px] font-black text-slate-900 dark:text-emerald-400">
                        ₹{item.price.toLocaleString('en-IN')}
                     </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-white/10">
                        <button 
                          onClick={() => item.qty > 1 && dispatch(addToCart({ ...item, qty: item.qty - 1 }))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-colors text-slate-500"
                        >
                           <FaMinus size={10} />
                        </button>
                        <span className="w-4 text-center text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{item.qty}</span>
                        <button 
                          onClick={() => item.qty < item.countInStock && dispatch(addToCart({ ...item, qty: item.qty + 1 }))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-colors text-slate-500"
                        >
                           <FaPlus size={10} />
                        </button>
                     </div>
                     <button 
                       onClick={() => removeFromCartHandler(item._id)}
                       className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                     >
                        <FaTrash size={12} />
                     </button>
                  </div>
               </div>
             ))}
          </div>

          {/* Checkout Sticky Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
             <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-xl dark:shadow-none">
                <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/10 pb-4 flex items-center gap-2">
                   <FaShieldAlt className="text-emerald-500" /> Checkout Gateway
                </h2>
                
                <div className="space-y-4 mb-8">
                   <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      <span>Units total ({totalItems})</span>
                      <span className="text-slate-900 dark:text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      <span>Shipping Fee</span>
                      {totalPrice > 500 ? (
                        <span className="text-emerald-500 font-black">COMPLIMENTARY</span>
                      ) : (
                        <span className="text-slate-900 dark:text-white">₹49</span>
                      )}
                   </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/10 pt-6 mb-8 flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Estimated</span>
                   <span className="text-2xl font-black text-slate-900 dark:text-emerald-400 tracking-tighter">
                      ₹{(totalPrice > 500 ? totalPrice : totalPrice + 49).toLocaleString('en-IN')}
                   </span>
                </div>

                <button 
                  onClick={checkoutHandler}
                  className="w-full h-14 bg-emerald-500 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                   Final Checkout <FaArrowRight size={10} />
                </button>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                   <FaCheckCircle size={12} /> Encrypted Secure Platform
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
