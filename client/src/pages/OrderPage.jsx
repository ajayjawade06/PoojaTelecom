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
import { FaCheckCircle, FaTruck, FaBoxOpen, FaCreditCard, FaMapMarkerAlt, FaLock, FaShieldAlt, FaClock } from 'react-icons/fa';

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
    try { await shipOrder(orderId).unwrap(); refetch(); } catch (err) {}
  };

  const deliverOrderHandler = async () => {
    try { await deliverOrder(orderId).unwrap(); refetch(); } catch (err) {}
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
    <div className="pt-24 pb-20 animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="main-container">
        
        {/* Header Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Order Record</h1>
                 <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest leading-none shadow-lg shadow-black/10">#{order._id.slice(-8)}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 items-center">
                 <FaClock size={10} /> Placed {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </p>
           </div>
           <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${order.isDelivered ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
              {order.isDelivered ? 'Synchronized & Delivered' : order.isShipped ? 'Carrier In-Transit' : order.isPaid ? 'Payment Authorized' : 'Awaiting Authorization'}
           </div>
        </div>

        {/* Minimal Progress Map */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-white/5 mb-8 shadow-sm overflow-x-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2"><FaUser size={10} /> Origin Identity</h3>
                    <p className="text-[13px] font-black text-slate-800 dark:text-white leading-tight mb-1">{order.user.name}</p>
                    <p className="text-[11px] font-bold text-slate-500 truncate">{order.user.email}</p>
                 </div>
                 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2"><FaMapMarkerAlt size={10} /> Shipping Matrix</h3>
                    <p className="text-[12px] font-bold text-slate-800 dark:text-white leading-tight">
                       {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                       {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                 </div>
              </div>

              {/* Items Manifest */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-50 dark:border-white/5 pb-4"><FaBoxOpen size={10} className="inline mr-2" /> Items Manifest</h3>
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
           <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-slate-900 dark:bg-white rounded-2xl p-8 text-white dark:text-slate-900 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none"></div>
                 
                 <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 dark:border-slate-100 pb-4">Financial Overview</h2>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-baseline opacity-60">
                       <span className="text-[10px] font-bold uppercase tracking-widest">Base Value</span>
                       <span className="text-[13px] font-black">₹{order.itemsPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-baseline opacity-60">
                       <span className="text-[10px] font-bold uppercase tracking-widest">Logistics</span>
                       <span className="text-[13px] font-black">₹{order.shippingPrice}</span>
                    </div>
                 </div>

                 <div className="border-t border-white/10 dark:border-slate-100 pt-6 mb-10 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Net Net</span>
                    <span className="text-3xl font-black tracking-tighter">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                 </div>

                 {/* Payment Action Buffer */}
                 {!order.isPaid && userInfo._id === order.user._id && !showCardForm && (
                    <button 
                      onClick={paymentHandler} 
                      disabled={razorpayLoading}
                      className="w-full h-14 bg-emerald-500 text-white font-black rounded-xl text-[12px] uppercase tracking-[0.2em] hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
                    >
                       {razorpayLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FaShieldAlt size={16}/> Authorize Payment</>}
                    </button>
                 )}

                 {/* Admin Controls Area */}
                 {userInfo?.isAdmin && order.isPaid && (
                   <div className="space-y-3 pt-6 border-t border-white/10 dark:border-slate-100 mt-6">
                      <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-3">Priority Overrides</p>
                      {!order.isShipped && (
                         <button onClick={shipOrderHandler} disabled={loadingShip} className="w-full h-12 bg-white/10 hover:bg-white/20 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 border border-white/10 dark:border-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                            <FaTruck size={12}/> {loadingShip ? 'Wait...' : 'Trigger Shipping'}
                         </button>
                      )}
                      {order.isShipped && !order.isDelivered && (
                         <button onClick={deliverOrderHandler} disabled={loadingDeliver} className="w-full h-12 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                            <FaCheckCircle size={12}/> {loadingDeliver ? 'Wait...' : 'Conclude Delivery'}
                         </button>
                      )}
                      {order.isDelivered && (
                         <div className="text-center py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl">Sequence Closed</div>
                      )}
                   </div>
                 )}
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                 <FaLock size={12} /> Secure Protocol Active
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default OrderPage;
