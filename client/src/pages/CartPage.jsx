import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaShoppingBag, FaArrowRight, FaMinus, FaPlus, FaCheckCircle, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { getFullImageUrl } from '../utils/imageUtils';
import { motion } from 'framer-motion';

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
 <div className="pt-40 pb-20 main-container flex flex-col items-center text-center">
 <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 mb-6 border border-slate-200 dark:border-white/10">
 <FaShoppingBag size={24} />
 </div>
 <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Your Cart is Empty</h1>
 <p className="text-sm font-medium text-slate-500 mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
 <Link to="/" className="bg-blue-500 text-white font-black py-3 px-8 rounded-lg text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/10">
 Explore Shop
 </Link>
 </div>
 );
 }

 return (
 <div className="pt-28 pb-20 bg-white dark:bg-slate-950 min-h-screen relative overflow-hidden">
 {/* Ambient backgrounds */}
 <div className="hidden lg:block absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

 <div className="main-container relative z-10">
 <div className="flex items-center gap-6 mb-10 border-b border-slate-100 dark:border-white/5 pb-6">
 <button 
 onClick={() => navigate('/')} 
 className="p-3 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm"
 >
 <FaArrowLeft size={14} />
 </button>
 <div className="flex items-baseline gap-4">
 <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Shopping Bag</h1>
 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{totalItems} Units</span>
 </div>
 </div>

 <motion.div 
 initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
 className="grid grid-cols-1 lg:grid-cols-12 gap-12"
 >
 
 {/* Cart Items List */}
 <div className="lg:col-span-8 space-y-4">
 {cartItems.map((item) => (
 <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } }} key={item._id} className="group flex flex-col sm:flex-row sm:items-center gap-6 p-6 bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[20px] border border-slate-200/60 dark:border-white/5 hover:border-blue-500/30 transition-all duration-200">
 {/* Small Item Image */}
 <Link to={`/product/${item._id}`} className="shrink-0 flex justify-center">
 <div className="w-24 h-24 bg-slate-50 dark:bg-black/20 rounded-2xl p-3 flex items-center justify-center border border-slate-200 dark:border-white/10 transition-transform group-">
 <img src={getFullImageUrl(item.image)} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
 </div>
 </Link>
 
 {/* Detailed Info Column */}
 <div className="flex-grow text-center sm:text-left">
 <Link to={`/product/${item._id}`} className="text-[14px] font-black text-slate-800 dark:text-white hover:text-blue-500 transition-colors line-clamp-2 mb-1.5 leading-tight">
 {item.name}
 </Link>
 <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">{item.brand}</p>
 <div className="text-[14px] font-black text-slate-900 dark:text-blue-400">
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
 </motion.div>
 ))}
 </div>

 {/* Checkout Sticky Summary */}
 <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', delay: 0.2 } } }} className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
 <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-[24px] p-8 border border-slate-200 dark:border-white/5 relative overflow-hidden">
 
 <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/10 pb-4 flex items-center gap-2">
 <FaShieldAlt className="text-blue-500" /> Secure Checkout Gateway
 </h2>
 
 <div className="space-y-4 mb-8">
 <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
 <span>Units total ({totalItems})</span>
 <span className="text-slate-900 dark:text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
 </div>
 <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
 <span>Shipping Fee</span>
 {totalPrice > 500 ? (
 <span className="text-blue-500 font-black">COMPLIMENTARY</span>
 ) : (
 <span className="text-slate-900 dark:text-white">₹49</span>
 )}
 </div>
 </div>

 <div className="border-t border-slate-200 dark:border-white/10 pt-6 mb-8 flex justify-between items-center">
 <span className="text-[12px] font-semibold text-slate-500">Estimated Total</span>
 <span className="text-2xl font-bold text-slate-900 dark:text-blue-400 tracking-tight">
 ₹{(totalPrice > 500 ? totalPrice : totalPrice + 49).toLocaleString('en-IN')}
 </span>
 </div>

 <button 
 onClick={checkoutHandler}
 className="w-full h-12 bg-blue-500 text-white font-semibold text-[14px] rounded-full shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
 >
 <span>Checkout</span> <FaArrowRight size={12} />
 </button>
 
 <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
 <FaCheckCircle size={12} /> Encrypted Secure Platform
 </div>
 </div>
 </motion.div>
 </motion.div>
 </div>
 </div>
 );
};

export default CartPage;
