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
import { FaCheckCircle, FaTruck, FaBoxOpen, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const [razorpayLoading, setRazorpayLoading] = useState(false);

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
    // ... same payment handler
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

  return isLoading ? (
    <Loader />
  ) : error ? (
    <div className="container mx-auto px-4 mt-8"><Message variant="red">{error?.data?.message || error.error}</Message></div>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
             Order <span className="text-emerald-600">#{order._id.slice(-8).toUpperCase()}</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-2">
           <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.isDelivered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {order.isDelivered ? 'Status: Completed' : order.isShipped ? 'Status: Out for Delivery' : order.isPaid ? 'Status: Processing' : 'Status: Pending Payment'}
           </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto">
        <div className="flex justify-between items-start min-w-[600px] relative">
          {/* Connector Line */}
          <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-slate-100 -z-0" />
          <div 
            className="absolute top-6 left-[10%] h-1 bg-emerald-500 transition-all duration-1000 -z-0" 
            style={{ width: `${order.isDelivered ? '80%' : order.isShipped ? '53%' : order.isPaid ? '26%' : '0%'}` }} 
          />

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 z-10 w-1/4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 shadow-md ${step.done ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border-2 border-slate-100'}`}>
                {step.icon}
              </div>
              <div className="text-center">
                <p className={`text-sm font-bold ${step.done ? 'text-slate-900' : 'text-slate-300'}`}>{step.name}</p>
                {step.done && step.time && (
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{new Date(step.time).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-extrabold text-slate-900 mb-5 flex items-center gap-2">
              <FaMapMarkerAlt className="text-emerald-500" /> Delivery Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Customer</p>
                  <p className="text-slate-700 font-bold">{order.user.name}</p>
                  <p className="text-slate-500 text-sm">{order.user.email}</p>
               </div>
               <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Address</p>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {order.shippingAddress.address}<br/>
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br/>
                    {order.shippingAddress.country}
                  </p>
               </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-extrabold text-slate-900 mb-5">Order Items</h2>
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl border border-gray-100 p-2 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <Link to={`/product/${item.product}`} className="text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="font-extrabold text-slate-900">₹{(item.qty * item.price).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-28">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6 pb-4 border-b border-gray-100">Payment Summary</h2>
            <div className="space-y-3 text-sm mb-5">
               <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-semibold text-slate-900">₹{order.itemsPrice}</span></div>
               <div className="flex justify-between text-slate-600"><span>Shipping</span><span className="font-semibold text-slate-900">₹{order.shippingPrice}</span></div>
            </div>
            <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-200 mb-6">
               <span className="font-extrabold text-slate-900 text-lg">Total Amount</span>
               <span className="text-2xl font-extrabold text-slate-900 text-emerald-600">₹{order.totalPrice}</span>
            </div>

            {/* User Payment Action */}
            {!order.isPaid && userInfo._id === order.user._id && (
              <button
                type="button"
                onClick={paymentHandler}
                disabled={razorpayLoading || !razorpayConfig}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 mb-4"
              >
                {razorpayLoading ? 'Initiating...' : 'Pay with Razorpay'}
              </button>
            )}

            {/* Admin Controls */}
            {userInfo && userInfo.isAdmin && order.isPaid && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Admin Settings</p>
                
                {/* Ship Button */}
                {!order.isShipped && (
                  <button
                    type="button"
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                    onClick={shipOrderHandler}
                    disabled={loadingShip}
                  >
                    {loadingShip ? <Loader /> : <><FaTruck /> Mark as Shipped</>}
                  </button>
                )}

                {/* Deliver Button */}
                {order.isShipped && !order.isDelivered && (
                  <button
                    type="button"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 active:scale-[0.98]"
                    onClick={deliverOrderHandler}
                    disabled={loadingDeliver}
                  >
                    {loadingDeliver ? <Loader /> : <><FaCheckCircle /> Mark as Delivered</>}
                  </button>
                )}

                {order.isDelivered && (
                  <div className="bg-emerald-50 text-emerald-700 text-center py-3 rounded-xl font-bold text-sm border border-emerald-100">
                    Order Fulfilled ✅
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
