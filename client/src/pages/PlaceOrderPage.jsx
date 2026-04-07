import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../redux/slices/ordersApiSlice';
import { clearCartItems, savePaymentMethod } from '../redux/slices/cartSlice';
import { FaMapMarkerAlt, FaShieldAlt, FaLock, FaCreditCard, FaArrowRight, FaBox, FaPencilAlt, FaArrowLeft } from 'react-icons/fa';

const PlaceOrderPage = () => {
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const cart = useSelector((state) => state.cart);

 const [createOrder, { isLoading, error }] = useCreateOrderMutation();

 useEffect(() => {
 if (!cart.shippingAddress?.address) {
 navigate('/shipping');
 }
 }, [cart.shippingAddress, navigate]);

 const placeOrderHandler = async () => {
 try {
 const res = await createOrder({
 orderItems: cart.cartItems,
 shippingAddress: cart.shippingAddress,
 paymentMethod: cart.paymentMethod || 'Razorpay',
 itemsPrice: cart.itemsPrice,
 shippingPrice: cart.shippingPrice,
 taxPrice: cart.taxPrice,
 totalPrice: cart.totalPrice,
 }).unwrap();
 dispatch(clearCartItems());
 navigate(`/order/${res._id}`);
 } catch (err) {}
 };

 return (
 <div className="pt-24 pb-16 bg-[#f5f5f7] dark:bg-black min-h-screen relative z-0">
 <div className="main-container relative z-10">
 <CheckoutSteps step1 step2 step3 />

 <div className="flex items-center gap-4 mb-8">
 <button 
 onClick={() => navigate('/shipping')}
 className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm"
 >
 <FaArrowLeft size={14} />
 </button>
 <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest text-[13px]">Review Order Info</h2>
 </div>

 <motion.div 
 initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
 className="grid grid-cols-1 lg:grid-cols-12 gap-8"
 >
 
 {/* Details Column */}
 <div className="lg:col-span-8 space-y-4">
 
 {/* Shipping Preview */}
 <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } }} className="bg-white dark:bg-[#1c1c1e] rounded-[24px] border border-slate-100 dark:border-white/5 p-6 flex items-start justify-between shadow-sm transition-all">
 <div className="flex gap-4">
 <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
 <FaMapMarkerAlt size={16} />
 </div>
 <div>
 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Shipping Address</h3>
 <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
 {cart.shippingAddress.address}, {cart.shippingAddress.city}<br />
 {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
 </p>
 </div>
 </div>
 <Link to="/shipping" className="text-slate-300 hover:text-blue-500 transition-colors">
 <FaPencilAlt size={12} />
 </Link>
 </motion.div>

 {/* Payment Selection Preview */}
 <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } }} className="bg-white dark:bg-[#1c1c1e] rounded-[24px] border border-slate-100 dark:border-white/5 p-6 shadow-sm transition-all">
 <div className="flex gap-4 mb-6">
 <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
 <FaCreditCard size={16} />
 </div>
 <div>
 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Payment Method</h3>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 {['Razorpay', 'Credit Card'].map(method => (
 <button 
 key={method}
 onClick={() => dispatch(savePaymentMethod(method))}
 className={`flex items-center justify-between p-4 rounded-xl border transition-all ${cart.paymentMethod === method || (!cart.paymentMethod && method === 'Razorpay') ? 'border-blue-500 bg-blue-500/5' : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-blue-500/20'}`}
 >
 <span className={`text-[12px] font-black uppercase tracking-widest ${cart.paymentMethod === method || (!cart.paymentMethod && method === 'Razorpay') ? 'text-blue-500' : 'text-slate-400'}`}>{method}</span>
 {(cart.paymentMethod === method || (!cart.paymentMethod && method === 'Razorpay')) && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>}
 </button>
 ))}
 </div>
 </motion.div>

 {/* Items Review */}
 <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } }} className="bg-white dark:bg-[#1c1c1e] rounded-[24px] border border-slate-100 dark:border-white/5 p-6 shadow-sm transition-all">
 <div className="flex gap-4 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
 <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
 <FaBox size={16} />
 </div>
 <div>
 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Order Items</h3>
 </div>
 </div>
 <div className="space-y-3">
 {cart.cartItems.map((item, i) => (
 <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-lg p-1">
 <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
 </div>
 <div>
 <p className="text-[12px] font-black text-slate-900 dark:text-white truncate max-w-[250px]">{item.name}</p>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
 </div>
 </div>
 <p className="text-[14px] font-black text-slate-900 dark:text-blue-400">₹{(item.qty * item.price).toLocaleString('en-IN')}</p>
 </div>
 ))}
 </div>
 </motion.div>
 </div>

 {/* Totals Summary Column */}
 <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', delay: 0.2 } } }} className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
 <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden">
 <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4 relative z-10">Order Summary</h2>
 
 <div className="space-y-4 mb-6 relative z-10">
 <div className="flex justify-between items-baseline">
 <span className="text-[13px] font-medium text-slate-500">Products</span>
 <span className="text-[14px] font-semibold text-slate-900 dark:text-white">₹{cart.itemsPrice.toLocaleString('en-IN')}</span>
 </div>
 <div className="flex justify-between items-baseline">
 <span className="text-[13px] font-medium text-slate-500">Shipping</span>
 <span className="text-[14px] font-semibold text-slate-900 dark:text-white">{cart.shippingPrice == 0 ? 'FREE' : `₹${cart.shippingPrice}`}</span>
 </div>
 <div className="flex justify-between items-baseline">
 <span className="text-[13px] font-medium text-slate-500">Taxes</span>
 <span className="text-[14px] font-semibold text-slate-900 dark:text-white">₹{cart.taxPrice || 0}</span>
 </div>
 </div>

 <div className="border-t border-slate-100 dark:border-white/5 pt-6 mb-8 flex justify-between items-center relative z-10">
 <span className="text-[14px] font-semibold text-slate-900 dark:text-white">Total</span>
 <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">₹{cart.totalPrice.toLocaleString('en-IN')}</span>
 </div>

 {error && <div className="mb-6"><Message variant="red">{error?.data?.message || 'Placement error'}</Message></div>}

 <button 
 onClick={placeOrderHandler}
 disabled={isLoading}
 className="w-full bg-blue-500 text-white font-semibold text-[14px] h-12 rounded-full shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 z-10"
 >
 {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10"></div> : <span className="relative z-10 flex items-center gap-2">Place Order</span>}
 </button>
 </div>
 
 <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
 <FaLock size={12} /> Secure Checkout
 </div>
 </motion.div>

 </motion.div>
 </div>
 </div>
 );
};

export default PlaceOrderPage;
