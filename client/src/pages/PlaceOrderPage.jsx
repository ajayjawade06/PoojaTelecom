import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
    <div className="pt-28 pb-20 animate-fade-in bg-white dark:bg-slate-950 min-h-screen relative overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="main-container relative z-10">
        <CheckoutSteps step1 step2 step3 />

        <div className="flex items-center gap-4 mb-8">
           <button 
             onClick={() => navigate('/shipping')}
             className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-sm"
           >
              <FaArrowLeft size={14} />
           </button>
           <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest text-[13px]">Review Order Info</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Details Column */}
          <div className="lg:col-span-8 space-y-6">
             
             {/* Shipping Preview */}
             <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[24px] border border-slate-200/50 dark:border-white/10 p-8 flex items-start justify-between shadow-lg hover:shadow-emerald-500/5 transition-all">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
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
                <Link to="/shipping" className="text-slate-300 hover:text-emerald-500 transition-colors">
                   <FaPencilAlt size={12} />
                </Link>
             </div>

             {/* Payment Selection Preview */}
             <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[24px] border border-slate-200/50 dark:border-white/10 p-8 shadow-lg hover:shadow-emerald-500/5 transition-all">
                <div className="flex gap-4 mb-6">
                   <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
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
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${cart.paymentMethod === method || (!cart.paymentMethod && method === 'Razorpay') ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-emerald-500/20'}`}
                      >
                         <span className={`text-[12px] font-black uppercase tracking-widest ${cart.paymentMethod === method || (!cart.paymentMethod && method === 'Razorpay') ? 'text-emerald-500' : 'text-slate-400'}`}>{method}</span>
                         {(cart.paymentMethod === method || (!cart.paymentMethod && method === 'Razorpay')) && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>}
                      </button>
                   ))}
                </div>
             </div>

             {/* Items Review */}
             <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[24px] border border-slate-200/50 dark:border-white/10 p-8 shadow-lg hover:shadow-emerald-500/5 transition-all">
                <div className="flex gap-4 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                   <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
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
                         <p className="text-[14px] font-black text-slate-900 dark:text-emerald-400">₹{(item.qty * item.price).toLocaleString('en-IN')}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Totals Summary Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
             <div className="bg-slate-950 dark:bg-white rounded-[32px] p-10 text-white dark:text-slate-950 shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none"></div>

                <h2 className="text-[12px] font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 dark:border-slate-100 pb-4 relative z-10">Order Summary</h2>
                
                <div className="space-y-4 mb-8 relative z-10">
                   <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">Products</span>
                      <span className="text-[15px] font-black">₹{cart.itemsPrice.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">Shipping</span>
                      <span className="text-[15px] font-black">{cart.shippingPrice == 0 ? 'FREE' : `₹${cart.shippingPrice}`}</span>
                   </div>
                   <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">Taxes</span>
                      <span className="text-[15px] font-black">₹{cart.taxPrice || 0}</span>
                   </div>
                </div>

                <div className="border-t border-white/10 dark:border-slate-100 pt-8 mb-10 flex justify-between items-center relative z-10">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Total</span>
                   <span className="text-4xl font-black tracking-tighter">₹{cart.totalPrice.toLocaleString('en-IN')}</span>
                </div>

                {error && <div className="mb-6"><Message variant="red">{error?.data?.message || 'Placement error'}</Message></div>}

                <button 
                  onClick={placeOrderHandler}
                  disabled={isLoading}
                  className="w-full bg-emerald-500 text-white font-black h-16 rounded-2xl text-[12px] uppercase tracking-[0.2em] shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn disabled:opacity-50 z-10"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                   {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10"></div> : <span className="relative z-10 flex items-center gap-3"><FaShieldAlt size={16} /> Place Order</span>}
                </button>
             </div>
             
             <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                <FaLock size={12} /> Secure Checkout
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
