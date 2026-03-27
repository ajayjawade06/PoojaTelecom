import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../redux/slices/ordersApiSlice';
import { clearCartItems, savePaymentMethod } from '../redux/slices/cartSlice';
import { FaMapMarkerAlt, FaShieldAlt, FaLock, FaCreditCard, FaWallet, FaArrowRight, FaBox } from 'react-icons/fa';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // Logic fix: guard both address AND navigate to shipping if missing
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
    } catch (err) {
      // shown by error state
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 animate-fade-in relative z-10 w-full flex flex-col items-center">
      <div className="w-full max-w-6xl relative z-10">
        <CheckoutSteps step1 step2 step3 />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Shipping Address */}
            <div className="bg-slate-900 rounded-[2rem] shadow-2xl border border-white/5 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaMapMarkerAlt />
                  </div>
                  Logistics Target
                </h2>
                <Link to="/shipping" className="text-xs text-emerald-400 font-black uppercase tracking-widest hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 underline-offset-4">
                  Modify
                </Link>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 text-slate-300 leading-relaxed font-medium border border-white/5 relative z-10">
                <span className="text-white font-bold block mb-1">Destination Address:</span>
                {cart.shippingAddress.address},<br />
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},<br />
                <span className="uppercase tracking-widest text-[10px] text-emerald-500 font-black mt-2 block">{cart.shippingAddress.country}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-slate-900 rounded-[2rem] shadow-2xl border border-white/5 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>

              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3 tracking-tighter relative z-10">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <FaCreditCard />
                </div>
                Transaction Gateway
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <label className={`cursor-pointer rounded-2xl border-2 p-5 flex items-center gap-4 transition-all ${cart.paymentMethod === 'Credit Card' ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/5 bg-white/5 hover:border-emerald-500/30 hover:bg-white/10'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Credit Card" 
                    checked={cart.paymentMethod === 'Credit Card'} 
                    onChange={(e) => dispatch(savePaymentMethod(e.target.value))}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer bg-slate-900 border-white/20"
                  />
                  <div>
                     <div className="font-black text-white tracking-tight">Credit/Debit Card</div>
                     <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">Pre-authorized Network</div>
                  </div>
                </label>

                <label className={`cursor-pointer rounded-2xl border-2 p-5 flex items-center gap-4 transition-all ${cart.paymentMethod === 'Razorpay' || !cart.paymentMethod ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/5 bg-white/5 hover:border-emerald-500/30 hover:bg-white/10'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Razorpay" 
                    checked={cart.paymentMethod === 'Razorpay' || !cart.paymentMethod} 
                    onChange={(e) => dispatch(savePaymentMethod(e.target.value))}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer bg-slate-900 border-white/20"
                  />
                  <div>
                     <div className="font-black text-white tracking-tight">Razorpay Node</div>
                     <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">UPI, Wallets, NetBanking</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-slate-900 rounded-[2rem] shadow-2xl border border-white/5 p-8 relative overflow-hidden group">
              <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 tracking-tighter relative z-10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <FaBox />
                </div>
                Cargo Manifest ({cart.cartItems.reduce((a, c) => a + c.qty, 0)})
              </h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="blue">No cargo detected.</Message>
              ) : (
                <div className="space-y-4 relative z-10">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-5 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                      <div className="w-20 h-20 bg-slate-950 rounded-xl border border-white/10 p-2 flex-shrink-0 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain filter drop-shadow-lg" />
                      </div>
                      <Link to={`/product/${item._id}`} className="flex-grow text-lg font-black text-white hover:text-emerald-400 transition-colors line-clamp-2 tracking-tight">
                        {item.name}
                      </Link>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg inline-block mb-1">{item.qty} Units × ₹{item.price.toLocaleString('en-IN')}</div>
                        <div className="font-black text-emerald-400 text-xl tracking-tighter">
                          ₹{(item.qty * item.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] shadow-2xl p-8 sticky top-28 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none -z-0"></div>
              
              <h2 className="text-xl font-black text-white mb-8 pb-4 border-b border-white/10 relative z-10 tracking-tighter">Financial Summary</h2>

              <div className="space-y-6 text-sm mb-8 relative z-10">
                <div className="flex justify-between items-center text-slate-300 font-medium">
                  <span className="font-black uppercase tracking-widest text-[10px]">Hardware Total</span>
                  <span className="font-black text-white text-lg">₹{cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 font-medium">
                  <span className="font-black uppercase tracking-widest text-[10px]">Secure Transport</span>
                  <span className={`font-black tracking-wider ${cart.shippingPrice == 0 ? 'text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg' : 'text-white text-lg'}`}>
                    {cart.shippingPrice == 0 ? 'COMPLIMENTARY' : `₹${cart.shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300 font-medium">
                  <span className="font-black uppercase tracking-widest text-[10px]">Network Tax</span>
                  <span className="font-black text-white text-lg">₹{cart.taxPrice || 0}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-6 border-t border-white/10 mb-8 relative z-10">
                <span className="font-black text-slate-300 uppercase tracking-widest text-xs">Total Authorization</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">₹{cart.totalPrice}</span>
              </div>

              {error && (
                <div className="mb-6 relative z-10">
                   <Message variant="red">{error?.data?.message || 'Transaction could not be authorized.'}</Message>
                </div>
              )}

              <button
                className="w-full relative overflow-hidden group bg-emerald-500 hover:bg-emerald-400 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mb-6 flex items-center justify-center gap-3 uppercase tracking-widest text-sm z-10"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                {isLoading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                   <><FaShieldAlt size={16} /> Authorize Transaction</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest relative z-10">
                <FaLock />
                <span>Encrypted 256-bit Connection Route</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaceOrderPage;
