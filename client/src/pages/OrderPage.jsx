import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  useCancelOrderMutation,
} from '../redux/slices/ordersApiSlice';
import { FaCheckCircle, FaTruck, FaBoxOpen, FaCreditCard, FaMapMarkerAlt, FaLock, FaShieldAlt, FaClock, FaUser, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
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
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();
  
  const { data: razorpayConfig } = useGetRazorpayClientIdQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const shipOrderHandler = async () => {
    try { await shipOrder(orderId).unwrap(); refetch(); } catch (err) {}
  };

  const deliverOrderHandler = async () => {
    try { await deliverOrder(orderId).unwrap(); refetch(); } catch (err) {}
  };
  
  const cancelOrderHandler = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder(orderId).unwrap();
        refetch();
        toast.success('Order cancelled successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const steps = [
    { name: 'Ordered', done: true, time: order?.createdAt, icon: <FaBoxOpen size={12}/> },
    { name: 'Paid', done: order?.isPaid, time: order?.paidAt, icon: <FaCreditCard size={12}/> },
    { name: 'Shipped', done: order?.isShipped, time: order?.shippedAt, icon: <FaTruck size={12}/> },
    { name: 'Delivered', done: order?.isDelivered, time: order?.deliveredAt, icon: <FaCheckCircle size={12}/> },
  ];

  const paymentHandler = async () => {
    if (order.paymentMethod === 'Credit Card') { setShowCardForm(true); return; }
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
          try { await payOrder({ orderId, details: response }).unwrap(); refetch(); } catch (err) {}
        },
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: '#10b981' },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      alert(err?.data?.message || 'Error initializing Razorpay');
    } finally { setRazorpayLoading(false); }
  };

  const dummyPaymentHandler = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setTimeout(async () => {
      try {
        await payOrder({ orderId, details: { id: 'dummy_card_' + Math.random().toString(36).substr(2, 9), status: 'COMPLETED' } }).unwrap();
        setShowCardForm(false);
        refetch();
      } catch (err) { alert('Payment processing failed'); } finally { setPaymentLoading(false); }
    }, 1500);
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <div className="pt-24 min-h-screen main-container"><Message variant="red">{error?.data?.message || error.error}</Message></div>
  ) : (
    <div className="pt-28 pb-20 animate-fade-in bg-white dark:bg-slate-950 min-h-screen relative overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="main-container relative z-10">
        
        {/* Header Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           <div className="flex items-center gap-4 group">
              <button 
                onClick={() => navigate(-1)}
                className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-sm"
              >
                 <FaArrowLeft size={14} />
              </button>
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Order Details</h1>
                    <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest leading-none shadow-lg shadow-black/10">#{order._id.slice(-8)}</span>
                 </div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 items-center">
                    <FaClock size={10} /> Placed {new Date(order.createdAt).toLocaleDateString('en-IN')}
                 </p>
              </div>
           </div>
           <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${order.isCancelled ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : order.isDelivered ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
              {order.isCancelled ? `Cancelled on ${new Date(order.cancelledAt).toLocaleDateString()}` : order.isDelivered ? 'Order Delivered' : order.isShipped ? 'In Transit' : order.isPaid ? 'Payment Received' : 'Pending Payment'}
           </div>
        </div>

        {/* Minimal Progress Map */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-10 rounded-[32px] border border-slate-200/50 dark:border-white/10 mb-10 shadow-xl overflow-x-auto relative">
           <div className="flex justify-between items-start min-w-[600px] relative">
              <div className="absolute top-3 left-[12%] right-[12%] h-[1px] bg-slate-100 dark:bg-white/5"></div>
              <div 
                className="absolute top-3 left-[12%] h-[1px] bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                style={{ width: `${order.isDelivered ? '76%' : order.isShipped ? '50%' : order.isPaid ? '25%' : '0%'}` }}
              ></div>
              
              {steps.map((step, idx) => (
                 <div key={idx} className="flex flex-col items-center gap-4 z-10 w-1/4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 border ${step.done ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 border-slate-100 dark:border-white/5'}`}>
                       {step.icon}
                    </div>
                    <div className="text-center">
                       <p className={`text-[10px] uppercase tracking-widest font-black ${step.done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.name}</p>
                       {step.done && step.time && <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest mt-1 opacity-60">{new Date(step.time).toLocaleDateString()}</p>}
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Detailed Information Column */}
           <div className="lg:col-span-8 space-y-4">
              
              {/* Shipping & User Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[24px] p-8 shadow-lg hover:shadow-emerald-500/5 transition-all">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2"><FaUser size={10} /> Customer Details</h3>
                    <p className="text-[13px] font-black text-slate-800 dark:text-white leading-tight mb-1">{order.user?.name || 'Deleted User'}</p>
                    <p className="text-[11px] font-bold text-slate-500 truncate">{order.user?.email || 'N/A'}</p>
                 </div>
                 <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[24px] p-8 shadow-lg hover:shadow-emerald-500/5 transition-all">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2"><FaMapMarkerAlt size={10} /> Shipping Address</h3>
                    <p className="text-[12px] font-bold text-slate-800 dark:text-white leading-tight">
                       {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                       {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                 </div>
              </div>

              {/* Items Manifest */}
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[24px] p-8 shadow-lg hover:shadow-emerald-500/5 transition-all">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-100 dark:border-white/10 pb-4 flex items-center gap-2"><FaBoxOpen size={12} className="text-emerald-500"/> Order Items</h3>
                 <div className="space-y-3">
                    {order.orderItems.map((item, index) => (
                       <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-lg p-1">
                                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                             </div>
                             <div>
                                <Link to={`/product/${item.product}`} className="text-[12px] font-black text-slate-800 dark:text-emerald-400 hover:underline line-clamp-1">{item.name}</Link>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                             </div>
                          </div>
                          <p className="text-[14px] font-black text-slate-900 dark:text-white">₹{(item.qty * item.price).toLocaleString('en-IN')}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Totals & Actions Sticky Column */}
           <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
              <div className="bg-slate-950 dark:bg-white rounded-[32px] p-10 text-white dark:text-slate-950 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none"></div>
                 
                 <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 dark:border-slate-100 pb-4 relative z-10">Order Summary</h2>
                 
                 <div className="space-y-4 mb-8 relative z-10">
                    <div className="flex justify-between items-baseline opacity-60">
                       <span className="text-[10px] font-bold uppercase tracking-widest">Items</span>
                       <span className="text-[14px] font-black">₹{order.itemsPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-baseline opacity-60">
                       <span className="text-[10px] font-bold uppercase tracking-widest">Shipping</span>
                       <span className="text-[14px] font-black">₹{order.shippingPrice}</span>
                    </div>
                 </div>

                 <div className="border-t border-white/10 dark:border-slate-100 pt-8 mb-10 flex justify-between items-center relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Total</span>
                    <span className="text-4xl font-black tracking-tighter">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                 </div>

                 {/* Payment Action Buffer */}
                 {!order.isPaid && userInfo._id === order.user?._id && !showCardForm && !order.isCancelled && (
                    <button 
                      onClick={paymentHandler} 
                      disabled={razorpayLoading}
                      className="w-full h-16 bg-emerald-500 text-white font-black rounded-2xl text-[12px] uppercase tracking-[0.2em] shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn disabled:opacity-50 z-10"
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                       {razorpayLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10"></div> : <span className="relative z-10 flex items-center gap-3"><FaShieldAlt size={16}/> Pay Now</span>}
                    </button>
                 )}

                 {/* Cancel Order Action */}
                 {!order.isCancelled && !order.isDelivered && userInfo._id === order.user?._id && (
                    <button 
                      onClick={cancelOrderHandler} 
                      disabled={loadingCancel}
                      className="w-full h-12 bg-white/5 border border-rose-500/20 hover:bg-rose-500/5 text-rose-500 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-4 relative z-10"
                    >
                       <FaTimes size={12}/> {loadingCancel ? 'Processing...' : 'Cancel Order'}
                    </button>
                 )}

                 {/* Dummy Card Form */}
                 {showCardForm && !order.isPaid && (
                   <div className="mt-4 pt-6 border-t border-white/10 dark:border-slate-100 animate-fade-in relative z-10 text-left">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Test Credit Card</h3>
                         <button onClick={() => setShowCardForm(false)} className="text-[9px] font-bold text-slate-400 hover:text-white dark:hover:text-slate-900 border border-white/10 dark:border-slate-200 px-2 py-0.5 rounded transition-colors">Cancel</button>
                      </div>
                      
                      <form onSubmit={dummyPaymentHandler} className="space-y-4 text-left">
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                            <div className="relative">
                               <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12}/>
                               <input 
                                 type="text" 
                                 readOnly
                                 className="w-full bg-white/5 dark:bg-slate-50 border border-white/10 dark:border-slate-200 py-3 pl-11 pr-4 rounded-xl text-xs font-bold font-mono text-white dark:text-slate-900 outline-none"
                                 value={cardDetails.number.replace(/(\d{4})/g, '$1 ').trim()}
                               />
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 space-y-1.5">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                               <input 
                                 type="text" 
                                 readOnly
                                 className="w-full bg-white/5 dark:bg-slate-50 border border-white/10 dark:border-slate-200 py-3 px-4 rounded-xl text-xs font-black text-white dark:text-slate-900 text-center"
                                 value={cardDetails.expiry}
                               />
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                               <input 
                                 type="text" 
                                 readOnly
                                 className="w-full bg-white/5 dark:bg-slate-50 border border-white/10 dark:border-slate-200 py-3 px-4 rounded-xl text-xs font-black text-white dark:text-slate-900 text-center"
                                 value={cardDetails.cvv}
                               />
                            </div>
                         </div>

                         <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-2">
                            <p className="text-[9px] font-bold text-emerald-500 leading-tight italic">Sandbox Mode: Unlimited transaction limit enabled for testing.</p>
                         </div>

                         <button 
                           type="submit" 
                           disabled={paymentLoading}
                           className="w-full h-14 bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                         >
                            {paymentLoading ? (
                              <div className="w-5 h-5 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>Process Payment <FaArrowRight size={10} /></>
                            )}
                         </button>
                      </form>
                   </div>
                 )}

                 {/* Admin Actions */}
                 {userInfo?.isAdmin && order.isPaid && (
                   <div className="space-y-3 pt-6 border-t border-white/10 dark:border-slate-100 mt-6">
                      <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-3">Admin Actions</p>
                      {!order.isShipped && (
                         <button onClick={shipOrderHandler} disabled={loadingShip} className="w-full h-12 bg-white/10 hover:bg-white/20 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 border border-white/10 dark:border-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                            <FaTruck size={12}/> {loadingShip ? 'Wait...' : 'Mark as Shipped'}
                         </button>
                      )}
                      {order.isShipped && !order.isDelivered && (
                         <button onClick={deliverOrderHandler} disabled={loadingDeliver} className="w-full h-12 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                            <FaCheckCircle size={12}/> {loadingDeliver ? 'Wait...' : 'Mark as Delivered'}
                         </button>
                      )}
                      {order.isDelivered && (
                         <div className="text-center py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl">Order Completed</div>
                      )}
                   </div>
                 )}
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

export default OrderPage;
