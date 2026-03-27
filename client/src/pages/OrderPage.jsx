import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { loadRazorpayScript } from '../utils/loadRazorpay';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useCreateRazorpayOrderMutation,
  useGetRazorpayClientIdQuery,
  useDeliverOrderMutation,
  useShipOrderMutation,
} from '../redux/slices/ordersApiSlice';
import { FaCheckCircle, FaTruck, FaBoxOpen, FaCreditCard, FaMapMarkerAlt, FaLock, FaShieldAlt } from 'react-icons/fa';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '4242424242424242',
    expiry: '12/28',
    cvv: '123',
  });
  const [paymentLoading, setPaymentLoading] = useState(false);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder] = usePayOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [shipOrder, { isLoading: loadingShip }] = useShipOrderMutation();
  
  const { data: razorpayConfig } = useGetRazorpayClientIdQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const shipOrderHandler = async () => {
    try {
      await shipOrder(orderId).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // Progress Bar Steps
  const steps = [
    { name: 'Ordered', done: true, time: order?.createdAt, icon: <FaBoxOpen /> },
    { name: 'Paid', done: order?.isPaid, time: order?.paidAt, icon: <FaCreditCard /> },
    { name: 'Shipped', done: order?.isShipped, time: order?.shippedAt, icon: <FaTruck /> },
    { name: 'Delivered', done: order?.isDelivered, time: order?.deliveredAt, icon: <FaCheckCircle /> },
  ];

  const paymentHandler = async () => {
    if (order.paymentMethod === 'Credit Card') {
      setShowCardForm(true);
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) { alert('Razorpay SDK failed to load.'); return; }
    setRazorpayLoading(true);
    try {
      const rpOrder = await createRazorpayOrder(orderId).unwrap();
      const options = {
        key: razorpayConfig.keyId,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: 'Pooja Telecom',
        description: `Order ${orderId}`,
        order_id: rpOrder.id,
        handler: async function (response) {
          try {
            await payOrder({ orderId, details: response }).unwrap();
            refetch();
          } catch (err) { console.error(err); }
        },
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: '#10b981' },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      alert(err?.data?.message || 'Error initializing Razorpay');
    } finally {
      setRazorpayLoading(false);
    }
  };

  const dummyPaymentHandler = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    
    // Simulate network delay
    setTimeout(async () => {
      try {
        await payOrder({ 
          orderId, 
          details: { 
            id: 'dummy_card_' + Math.random().toString(36).substr(2, 9),
            status: 'COMPLETED'
          } 
        }).unwrap();
        setShowCardForm(false);
        refetch();
      } catch (err) {
        console.error(err);
        alert('Payment processing failed');
      } finally {
        setPaymentLoading(false);
      }
    }, 1500);
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <div className="container mx-auto px-4 mt-8"><Message variant="red">{error?.data?.message || error.error}</Message></div>
  ) : (
    <div className="container mx-auto px-4 py-12 lg:py-20 animate-fade-in relative z-10 w-full flex flex-col items-center">
      <div className="w-full max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-slate-900 rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter flex items-center gap-3">
               Order <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl uppercase">#{order._id.slice(-8)}</span>
            </h1>
            <p className="text-slate-400 font-medium text-xs uppercase tracking-widest mt-4">
              Placed {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2 relative z-10">
             <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl border ${order.isDelivered ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-amber-500/10'}`}>
                {order.isDelivered ? 'Status: Completed' : order.isShipped ? 'Status: In Transit' : order.isPaid ? 'Status: Secured' : 'Status: Awaiting Funds'}
             </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-white/5 mb-10 overflow-x-auto relative">
          <div className="flex justify-between items-start min-w-[600px] relative mt-4">
            {/* Connector Line */}
            <div className="absolute top-6 left-[12%] right-[12%] h-1 bg-white/5 border-y border-white/5 rounded-full" />
            <div 
              className="absolute top-6 left-[12%] h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] rounded-full transition-all duration-1000" 
              style={{ width: `${order.isDelivered ? '76%' : order.isShipped ? '50%' : order.isPaid ? '25%' : '0%'}` }} 
            />

            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 z-10 w-1/4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 border ${step.done ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-slate-950 text-slate-600 border-white/5'}`}>
                  {step.icon}
                </div>
                <div className="text-center">
                  <p className={`text-xs uppercase tracking-widest font-black ${step.done ? 'text-white' : 'text-slate-500'}`}>{step.name}</p>
                  {step.done && step.time && (
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">{new Date(step.time).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {/* Shipping */}
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>

              <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 tracking-tighter relative z-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FaMapMarkerAlt />
                </div>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                 <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-2">Customer</p>
                    <p className="text-white font-black tracking-tight">{order.user.name}</p>
                    <p className="text-slate-400 text-xs font-medium mt-1">{order.user.email}</p>
                 </div>
                 <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-2">Address</p>
                    <p className="text-slate-300 font-medium leading-relaxed text-sm">
                      {order.shippingAddress.address}<br/>
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br/>
                      <span className="uppercase tracking-widest text-[10px] text-emerald-500 font-black mt-2 block">{order.shippingAddress.country}</span>
                    </p>
                 </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-white/5 relative overflow-hidden group">
              <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 tracking-tighter relative z-10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <FaBoxOpen />
                </div>
                Order Items
              </h2>
              <div className="space-y-4 relative z-10">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-5 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="w-16 h-16 bg-slate-950 rounded-xl border border-white/10 p-2 flex-shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain filter drop-shadow-lg" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <Link to={`/product/${item.product}`} className="text-sm font-black text-white hover:text-emerald-400 transition-colors line-clamp-1 tracking-tight">
                        {item.name}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{item.qty} Units × ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="font-black text-emerald-400 text-lg tracking-tighter">₹{(item.qty * item.price).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-white/10 sticky top-28 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none -z-0"></div>

              <h2 className="text-xl font-black text-white mb-8 pb-4 border-b border-white/10 tracking-tighter relative z-10">Order Summary</h2>
              <div className="space-y-6 text-sm mb-8 relative z-10">
                 <div className="flex justify-between text-slate-300 font-medium items-center">
                    <span className="font-black uppercase tracking-widest text-[10px]">Items</span>
                    <span className="font-black text-white text-lg">₹{order.itemsPrice}</span>
                 </div>
                 <div className="flex justify-between text-slate-300 font-medium items-center">
                    <span className="font-black uppercase tracking-widest text-[10px]">Shipping</span>
                    <span className="font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">₹{order.shippingPrice}</span>
                 </div>
              </div>
              <div className="flex justify-between items-center py-6 border-t border-white/10 mb-8 relative z-10">
                 <span className="font-black text-slate-300 uppercase tracking-widest text-xs">Total</span>
                 <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">₹{order.totalPrice}</span>
              </div>

              {/* User Payment Action */}
              {!order.isPaid && userInfo._id === order.user._id && !showCardForm && (
                <button
                  type="button"
                  onClick={paymentHandler}
                  disabled={razorpayLoading || (order.paymentMethod === 'Razorpay' && !razorpayConfig)}
                  className="w-full relative overflow-hidden group bg-emerald-500 hover:bg-emerald-400 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-50 mb-6 flex items-center justify-center gap-3 uppercase tracking-widest text-sm z-10"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  {razorpayLoading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                     <><FaShieldAlt size={16} /> Pay with {order.paymentMethod}</>
                  )}
                </button>
              )}

              {/* Dummy Credit Card Form */}
              {!order.isPaid && userInfo._id === order.user._id && showCardForm && (
                <div className="animate-fade-in border-t border-white/10 pt-6 mt-2 relative z-10">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Payment Details</h3>
                     <button onClick={() => setShowCardForm(false)} className="text-[10px] text-slate-500 hover:text-rose-500 font-black uppercase tracking-widest transition-colors py-1 px-2 rounded-lg hover:bg-rose-500/10">Cancel</button>
                  </div>
                  <form onSubmit={dummyPaymentHandler} className="space-y-5">
                    <div className="group">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-emerald-500/50 text-white font-medium transition-all outline-none placeholder-slate-600 ring-4 ring-transparent focus:ring-emerald-500/10 tracking-widest text-center"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '').slice(0, 16)})}
                        maxLength="16"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-emerald-500/50 text-white font-medium transition-all outline-none placeholder-slate-600 ring-4 ring-transparent focus:ring-emerald-500/10 text-center tracking-widest"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        required
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-emerald-500/50 text-white font-medium transition-all outline-none placeholder-slate-600 ring-4 ring-transparent focus:ring-emerald-500/10 text-center tracking-widest"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                        maxLength="3"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={paymentLoading}
                      className="w-full relative overflow-hidden group bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-50 mt-6 flex items-center justify-center uppercase tracking-widest text-xs"
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                      {paymentLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        `Pay ₹${order.totalPrice}`
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Admin Controls */}
              {userInfo && userInfo.isAdmin && order.isPaid && (
                <div className="space-y-4 pt-6 border-t border-white/10 mt-6 relative z-10">
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">Admin Actions</p>
                  
                  {/* Ship Button */}
                  {!order.isShipped && (
                    <button
                      type="button"
                      className="w-full bg-slate-950 hover:bg-black text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg border border-white/10 hover:border-white/20 active:scale-[0.98] uppercase tracking-widest text-xs"
                      onClick={shipOrderHandler}
                      disabled={loadingShip}
                    >
                      {loadingShip ? (
                         <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                      ) : (
                         <><FaTruck size={14} className="text-slate-400" /> Mark as Shipped</>
                      )}
                    </button>
                  )}

                  {/* Deliver Button */}
                  {order.isShipped && !order.isDelivered && (
                    <button
                      type="button"
                      className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg border border-emerald-500/30 hover:border-emerald-500/50 active:scale-[0.98] uppercase tracking-widest text-xs"
                      onClick={deliverOrderHandler}
                      disabled={loadingDeliver}
                    >
                      {loadingDeliver ? (
                         <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin"></div>
                      ) : (
                         <><FaCheckCircle size={14} /> Mark as Delivered</>
                      )}
                    </button>
                  )}

                  {order.isDelivered && (
                    <div className="bg-emerald-500/10 text-emerald-400 text-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      Order Completed ✅
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
