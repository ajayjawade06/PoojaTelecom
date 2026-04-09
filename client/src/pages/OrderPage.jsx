import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
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
  useRequestReturnOrderMutation,
  useProcessReturnOrderMutation,
} from '../redux/slices/ordersApiSlice';
import { FaCheckCircle, FaTruck, FaBoxOpen, FaCreditCard, FaMapMarkerAlt, FaLock, FaShieldAlt, FaClock, FaUser, FaArrowRight, FaArrowLeft, FaTimes, FaUndo, FaRupeeSign, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { getFullImageUrl } from '../utils/imageUtils';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } } };

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
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState('Product defective');

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
  const [requestReturnOrder, { isLoading: loadingRequestReturn }] = useRequestReturnOrderMutation();
  const [processReturnOrder, { isLoading: loadingProcessReturn }] = useProcessReturnOrderMutation();
  
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

  const requestReturnHandler = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to request a return for this order?')) {
      try {
        await requestReturnOrder({ orderId, returnReason }).unwrap();
        toast.success('Return requested successfully');
        setShowReturnForm(false);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const processReturnHandler = async (action) => {
    try {
      await processReturnOrder({ orderId, action }).unwrap();
      toast.success(`Return ${action}ed successfully`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const isEligibleForReturn = order ? (order.isDelivered && !order.isReturnRequested && !order.isRefunded && (Date.now() - new Date(order.deliveredAt).getTime()) <= 7 * 24 * 60 * 60 * 1000) : false;

  const steps = [
    { name: 'Ordered', done: true, time: order?.createdAt, icon: <FaBoxOpen size={12}/> },
    { name: 'Paid', done: order?.isPaid, time: order?.paidAt, icon: <FaCreditCard size={12}/> },
    { name: 'Shipped', done: order?.isShipped, time: order?.shippedAt, icon: <FaTruck size={12}/> },
    { name: 'Delivered', done: order?.isDelivered, time: order?.deliveredAt, icon: <FaCheckCircle size={12}/> },
  ];

  if (order?.isReturnRequested) {
    steps.push({ name: 'Ret. Req', done: true, time: order?.updatedAt, icon: <FaUndo size={12}/> });
    
    if (order.returnStatus === 'Rejected') {
      steps.push({ name: 'Rejected', done: true, time: order?.updatedAt, icon: <FaExclamationTriangle size={12}/> });
    } else {
      steps.push({ name: 'Refunded', done: order?.isRefunded, time: order?.refundedAt, icon: <FaRupeeSign size={12}/> });
    }
  }

  const activeStepIndex = [...steps].reverse().findIndex(s => s.done);
  const doneIndex = activeStepIndex === -1 ? 0 : steps.length - 1 - activeStepIndex;
  const progressRatio = steps.length > 1 ? (doneIndex / (steps.length - 1)) * 100 : 0;


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
    <div className="pt-28 pb-20 bg-white dark:bg-slate-950 min-h-screen relative overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="main-container relative z-10">
        
        {/* Header Badge */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 group">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm"
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
          <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${order.isCancelled ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : order.isDelivered ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
            {order.isCancelled ? `Cancelled on ${new Date(order.cancelledAt).toLocaleDateString()}` : order.isDelivered ? 'Order Delivered' : order.isShipped ? 'In Transit' : order.isPaid ? 'Payment Received' : 'Pending Payment'}
          </div>
        </motion.div>

        {/* Modern Order Stepper */}
        <motion.div variants={itemVariants} className="mb-12 relative p-6">
          <div className="flex justify-between items-start min-w-[630px] relative px-[2%]">
            {/* Background Track */}
            <div className="absolute top-[20px] left-[10%] right-[10%] h-[2px] bg-slate-100 dark:bg-white/5 rounded-full"></div>
            {/* Active Progress */}
            <div 
              className="absolute top-[20px] left-[10%] h-[2px] bg-blue-500 transition-all duration-1000 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
              style={{ width: `${progressRatio * 0.8}%` }} 
            ></div>
            
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 z-10 flex-1 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${step.done ? (step.name === 'Rejected' ? 'bg-rose-500 text-white border-white dark:border-slate-800 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-blue-500 text-white border-white dark:border-slate-800 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-110') : 'bg-slate-50 dark:bg-slate-800 text-slate-300 border-white dark:border-slate-800 shadow-sm'}`}>
                  {step.icon}
                </div>
                <div className="text-center group">
                  <p className={`text-[9px] uppercase font-black tracking-[0.2em] mb-1.5 transition-colors ${step.done ? (step.name === 'Rejected' ? 'text-rose-500' : 'text-slate-900 dark:text-white') : 'text-slate-400'}`}>
                    {step.name}
                  </p>
                  {step.done && step.time && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 0.6, y: 0 }}
                      className={`text-[8px] font-bold uppercase tracking-widest ${step.name === 'Rejected' ? 'text-rose-500' : 'text-blue-500'}`}
                    >
                      {new Date(step.time).toLocaleDateString()}
                    </motion.p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Detailed Information Column */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Shipping & User Split */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[24px] p-8 shadow-lg transition-all">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2"><FaUser size={10} /> Customer Details</h3>
                <p className="text-[13px] font-black text-slate-800 dark:text-white leading-tight mb-1">{order.user?.name || 'Deleted User'}</p>
                <p className="text-[11px] font-bold text-slate-500 truncate">{order.user?.email || 'N/A'}</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[24px] p-8 shadow-lg transition-all">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2"><FaMapMarkerAlt size={10} /> Shipping Address</h3>
                <p className="text-[12px] font-bold text-slate-800 dark:text-white leading-tight">
                  {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>
            </motion.div>

            {/* Items Manifest */}
            <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[24px] p-8 shadow-lg transition-all">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-100 dark:border-white/10 pb-4 flex items-center gap-2"><FaBoxOpen size={12} className="text-blue-500"/> Order Items</h3>
              <div className="space-y-3">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-lg p-1">
                        <img src={getFullImageUrl(item.image)} alt={item.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <Link to={`/product/${item.product}`} className="text-[12px] font-black text-slate-800 dark:text-blue-400 hover:underline line-clamp-1">{item.name}</Link>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <p className="text-[14px] font-black text-slate-900 dark:text-white">₹{(item.qty * item.price).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Order Timeline / Audit Trail */}
            {order.timeline && order.timeline.length > 0 && (
              <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[24px] p-8 shadow-lg transition-all">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-100 dark:border-white/10 pb-4 flex items-center gap-2"><FaClock size={10} className="text-blue-500"/> Order Timeline</h3>
                <div className="relative pl-6">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-100 dark:bg-white/5"></div>
                  <div className="space-y-6">
                    {order.timeline.map((event, idx) => {
                      const isLast = idx === order.timeline.length - 1;
                      const eventColors = {
                        'Order Placed': 'bg-blue-500',
                        'Payment Confirmed': 'bg-emerald-500',
                        'Shipped': 'bg-purple-500',
                        'Delivered': 'bg-emerald-500',
                        'Cancelled': 'bg-rose-500',
                        'Return Requested': 'bg-amber-500',
                        'Return Approved': 'bg-blue-500',
                        'Refunded': 'bg-indigo-500',
                      };
                      const dotColor = eventColors[event.event] || 'bg-slate-400';
                      return (
                        <div key={idx} className="relative flex items-start gap-4">
                          <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${dotColor} shadow-sm ${isLast ? 'ring-4 ring-blue-500/10' : ''}`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <p className="text-[12px] font-black text-slate-900 dark:text-white">{event.event}</p>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                                {new Date(event.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{event.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Totals & Actions Sticky Column */}
          <motion.div variants={itemVariants} className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
            <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] p-10 text-slate-900 dark:text-white border border-slate-100 dark:border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
              
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 border-b border-slate-100 dark:border-white/10 pb-4 relative z-10">Order Summary</h2>
              
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

              <div className="border-t border-slate-100 dark:border-white/10 pt-8 mb-10 flex justify-between items-center relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Total</span>
                <span className="text-4xl font-black tracking-tighter">₹{order.totalPrice.toLocaleString('en-IN')}</span>
              </div>

              {/* Payment Action Buffer */}
              {!order.isPaid && userInfo._id === order.user?._id && !showCardForm && !order.isCancelled && (
                <button 
                  onClick={paymentHandler} 
                  disabled={razorpayLoading}
                  className="w-full h-16 bg-blue-500 text-white font-black rounded-2xl text-[12px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn disabled:opacity-50 z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-200"></div>
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

              {/* Return Order Status / Action */}
              {order.isReturnRequested && (
                <div className="mt-4 p-4 rounded-xl border relative z-10 bg-amber-500/10 border-amber-500/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Return Status</p>
                  <p className="text-[14px] font-black tracking-tight text-white dark:text-slate-900">{order.returnStatus}</p>
                  {order.isRefunded && <p className="text-[10px] font-bold text-slate-400 mt-1">Refund processed on {new Date(order.refundedAt).toLocaleDateString()}</p>}
                </div>
              )}

              {/* Request Return Flow Trigger */}
              {isEligibleForReturn && userInfo._id === order.user?._id && (
                <button 
                  onClick={() => setShowReturnForm(true)}
                  className="w-full h-12 bg-white/5 border border-amber-500/20 hover:bg-amber-500/5 text-amber-500 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-4 relative z-10"
                >
                  <FaUndo size={12}/> Request Return / Replace
                </button>
              )}

              {/* Dummy Card Form */}
              {showCardForm && !order.isPaid && (
                <div className="mt-4 pt-6 border-t border-white/10 dark:border-slate-100 relative z-10 text-left">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Test Credit Card</h3>
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

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-2">
                      <p className="text-[9px] font-bold text-blue-500 leading-tight italic">Sandbox Mode: Unlimited transaction limit enabled for testing.</p>
                    </div>

                    <button 
                      type="submit" 
                      disabled={paymentLoading}
                      className="w-full h-14 bg-white dark:bg-slate-950 text-slate-950 dark:text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
                    <button onClick={deliverOrderHandler} disabled={loadingDeliver} className="w-full h-12 bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20">
                      <FaCheckCircle size={12}/> {loadingDeliver ? 'Wait...' : 'Mark as Delivered'}
                    </button>
                  )}
                  {/* Standard Admin Checkmarks */}
                  {order.isDelivered && !order.isReturnRequested && (
                    <div className="text-center py-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-xl">Order Completed</div>
                  )}
                  
                </div>
              )}
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
              <FaLock size={12} /> Secure Checkout
            </div>
          </motion.div>
        </motion.div>

        {/* Dedicated Admin Return Review Panel */}
        {userInfo?.isAdmin && order.isReturnRequested && (
          <motion.div variants={itemVariants} className="mt-8 bg-white dark:bg-[#1c1c1e] rounded-[32px] p-10 border border-slate-100 dark:border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-2"><FaUndo/> Admin Return Review</h2>
                <p className="text-sm text-slate-800 dark:text-white">Customer stated: <span className="font-bold">"{order.returnReason}"</span></p>
                <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Current Status: {order.returnStatus}</p>
              </div>
              
              <div className="flex items-center gap-4 min-w-[200px]">
                {order.returnStatus === 'Pending' && (
                  <>
                    <button onClick={() => processReturnHandler('approve')} disabled={loadingProcessReturn} className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all">Approve</button>
                    <button onClick={() => processReturnHandler('reject')} disabled={loadingProcessReturn} className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Reject</button>
                  </>
                )}
                {order.returnStatus === 'Approved' && !order.isRefunded && (
                  <button onClick={() => processReturnHandler('refund')} disabled={loadingProcessReturn} className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                    <FaRupeeSign size={14}/> Execute Refund
                  </button>
                )}
                {order.isRefunded && (
                  <div className="w-full text-center py-4 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[11px] font-black uppercase tracking-widest rounded-xl">Refund Completed</div>
                )}
                {order.returnStatus === 'Rejected' && (
                  <div className="w-full text-center py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-black uppercase tracking-widest rounded-xl">Request Rejected</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium Return Request Modal */}
        {showReturnForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[32px] p-8 shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden relative">
              <button 
                onClick={() => setShowReturnForm(false)}
                className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-500 transition-colors"
              >
                <FaTimes size={14}/>
              </button>
              
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Request Return</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">Select a reason for your return below</p>
              
              <form onSubmit={requestReturnHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Product defective or damaged', 'Not as described', 'Missing accessories or parts', 'Changed my mind'].map((reason) => (
                    <div 
                      key={reason}
                      onClick={() => setReturnReason(reason)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${returnReason === reason ? 'border-amber-500 bg-amber-500/5 text-amber-600 dark:text-amber-400' : 'border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-white/10'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${returnReason === reason ? 'border-amber-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        {returnReason === reason && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                      </div>
                      <span className="text-xs font-bold leading-tight">{reason}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-start gap-3 border border-slate-100 dark:border-white/5">
                  <FaInfoCircle className="text-slate-400 shrink-0 mt-0.5" size={14}/>
                  <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                    By initiating this return, you agree to our Return Policy. Refunds are processed to the original payment method within 5-7 business days after the item is received and inspected by our facility.
                  </p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loadingRequestReturn}
                  className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingRequestReturn ? 'Processing...' : 'Confirm Return Request'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderPage;
