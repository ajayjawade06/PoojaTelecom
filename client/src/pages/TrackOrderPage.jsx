import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMyOrdersQuery, useGetOrderStatusQuery } from '../redux/slices/ordersApiSlice';
import { FaTruck, FaBoxOpen, FaCheckCircle, FaShippingFast, FaClock, FaRupeeSign, FaUser, FaSpinner, FaTimesCircle, FaCalendarAlt, FaHistory } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getFullImageUrl } from '../utils/imageUtils';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } } };

const TrackOrderPage = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  
  // Queries
  const { data: orders, isLoading: isLoadingMyOrders, error: myOrdersError } = useGetMyOrdersQuery(undefined, { skip: !userInfo || !!orderId });
  const { data: trackOrder, isLoading: isTracking, error: trackError } = useGetOrderStatusQuery(orderId, { skip: !orderId });

  const getStatusBadge = (order) => {
    if (order.isCancelled) return { label: 'Cancelled', color: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400', icon: FaTimesCircle, progress: 100 };
    if (order.isDelivered) return { label: 'Delivered', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400', icon: FaCheckCircle, progress: 100 };
    if (order.isShipped) return { label: 'Shipped', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400', icon: FaShippingFast, progress: 66 };
    if (order.isPaid) return { label: 'Processing', color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400', icon: FaClock, progress: 33 };
    return { label: 'Pending Payment', color: 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400', icon: FaClock, progress: 10 };
  };

  const SingleOrderTrack = ({ order }) => {
    const status = getStatusBadge(order);
    const StatusIcon = status.icon;

    const steps = [
      { name: 'Placed', done: true, time: order.createdAt, icon: <FaBoxOpen size={14}/> },
      { name: 'Paid', done: order.isPaid, time: order.paidAt, icon: <FaRupeeSign size={14}/> },
      { name: 'Shipped', done: order.isShipped, time: order.shippedAt, icon: <FaShippingFast size={14}/> },
      { name: 'Delivered', done: order.isDelivered, time: order.deliveredAt, icon: <FaCheckCircle size={14}/> }
    ];

    if (order.isCancelled) {
      steps.splice(2, 2, { name: 'Cancelled', done: true, time: order.cancelledAt, icon: <FaTimesCircle size={14}/> });
    }

    return (
      <div className="space-y-6">
        {/* Status Highlight Card */}
        <motion.div variants={itemVariants} className="rounded-3xl p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${status.color}`}>
                  <StatusIcon size={9} />
                  {status.label}
                </span>
                <p className="text-[11px] font-bold text-slate-400">#{(order._id || '').slice(-8).toUpperCase()}</p>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {order.isDelivered ? 'Your order has been delivered!' : order.isCancelled ? 'Order was cancelled' : 'On its way to you'}
              </h2>
            </div>
            
            <div className="flex flex-col items-end">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Arrival</p>
              <p className="text-lg font-black text-blue-500">
                {order.isDelivered ? 'Delivered' : order.isCancelled ? 'N/A' : '3-5 Business Days'}
              </p>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="mt-10 relative h-[2px] bg-slate-100 dark:bg-white/5 rounded-full">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${status.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`absolute top-0 left-0 h-full rounded-full ${order.isCancelled ? 'bg-rose-500' : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}
            />
            
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 transition-all duration-300 ${step.done ? (order.isCancelled && idx >= 2 ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white shadow-lg') : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                    {idx === 0 ? <FaBoxOpen size={10}/> : idx === 1 ? <FaRupeeSign size={10}/> : idx === 2 ? <FaShippingFast size={10}/> : <FaCheckCircle size={10}/>}
                  </div>
                  <div className="mt-3 text-center">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${step.done ? (order.isCancelled && idx >= 2 ? 'text-rose-500' : 'text-slate-900 dark:text-white') : 'text-slate-400'}`}>{step.name}</p>
                    {step.done && step.time && (
                      <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase">{new Date(step.time).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Details */}
          <motion.div variants={itemVariants} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-2xl p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
              <FaHistory /> Order Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[12px]">
                <span className="font-bold text-slate-500 uppercase tracking-widest">Order Date</span>
                <span className="font-black text-slate-900 dark:text-white tracking-tight">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="font-bold text-slate-500 uppercase tracking-widest">Total Items</span>
                <span className="font-black text-slate-900 dark:text-white tracking-tight">{order.orderItems?.length || 0} Products</span>
              </div>
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Items Purchased</p>
              <div className="space-y-2">
                {order.orderItems?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={getFullImageUrl(item.image)} className="w-10 h-10 object-contain bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-50 dark:border-white/5" alt="" />
                    <div className="flex-grow min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Action Card */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-8 flex flex-col justify-center text-center text-slate-900 dark:text-white border border-slate-100 dark:border-white/5 relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:from-blue-600/20 dark:to-purple-600/20"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight mb-2">Need Help?</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 font-medium leading-relaxed mb-6">If you have any questions regarding your delivery or order status, our premium support team is here for you.</p>
              <div className="flex flex-col gap-2">
                <Link to="/profile" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                   view full order history
                </Link>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-4 flex items-center justify-center gap-2">
                  <FaTruck /> Pooja Telecom Elite Support
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent pb-16 pt-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <span>/</span>
          {orderId ? (
            <>
               <Link to="/track-order" className="hover:text-blue-500 transition-colors">Track Order</Link>
               <span>/</span>
               <span className="text-slate-600 dark:text-slate-300">#{orderId.slice(-8).toUpperCase()}</span>
            </>
          ) : (
            <span className="text-slate-600 dark:text-slate-300">Track Order</span>
          )}
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ type: 'spring', damping: 20 }}
          className="text-center mb-10"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-4 border border-blue-100 dark:border-blue-500/10">
            <FaTruck size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
            {orderId ? 'Track Shipment' : 'Your Orders'}
          </h1>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
            {orderId ? 'Real-time delivery updates' : (userInfo ? `${orders?.length || 0} orders found` : 'Sign in to view your orders')}
          </p>
        </motion.div>

        {/* Loading/Error States for Single Track */}
        {orderId ? (
          <>
            {isTracking ? (
              <div className="flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-blue-500 mb-4" size={24} />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Locating your shipment...</p>
              </div>
            ) : trackError ? (
              <div className="py-12 text-center bg-rose-50 dark:bg-rose-500/5 rounded-2xl border border-rose-200 dark:border-rose-500/10">
                <FaTimesCircle className="text-rose-500 mb-4 mx-auto" size={32} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">Order Not Found</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Please check your order ID and try again</p>
                <Link to="/track-order" className="inline-block mt-6 text-[10px] font-black text-blue-500 uppercase tracking-widest">Go Back</Link>
              </div>
            ) : trackOrder && (
              <SingleOrderTrack order={trackOrder} />
            )}
          </>
        ) : (
          /* Logged In: Show orders list */
          <>
            {userInfo ? (
              <>
                {isLoadingMyOrders ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <FaSpinner className="animate-spin text-blue-500 mb-4" size={24} />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading your orders...</p>
                  </div>
                ) : myOrdersError ? (
                  <div className="py-12 text-center bg-red-50 dark:bg-red-500/5 rounded-2xl border border-red-200 dark:border-red-500/10">
                    <p className="text-sm font-bold text-red-500">Failed to load orders. Please try again later.</p>
                  </div>
                ) : orders?.length === 0 ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-16 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <FaBoxOpen className="text-slate-300 dark:text-slate-600 mb-4" size={32} />
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">No orders yet</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Start shopping to see your orders here</p>
                    <Link
                      to="/"
                      className="mt-6 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
                    >
                      Browse Products
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-3">
                    {orders.map((order) => {
                      const status = getStatusBadge(order);
                      const StatusIcon = status.icon;
                      return (
                        <motion.div key={order._id} variants={itemVariants}>
                          <Link
                            to={`/track-order/${order._id}`}
                            className="block bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 p-5 shadow-sm hover:border-blue-200 dark:hover:border-blue-500/20 transition-all duration-200 group"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                  <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                    #{(order._id || '').slice(-8).toUpperCase()}
                                  </p>
                                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${status.color} flex items-center gap-1.5`}>
                                    <StatusIcon size={8} />
                                    {status.label}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-slate-400">
                                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                  <span className="flex items-center gap-1">
                                    <FaRupeeSign size={9} />
                                    {order.totalPrice?.toLocaleString('en-IN')}
                                  </span>
                                  <span>{order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}</span>
                                </div>
                              </div>
                              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Track Now →
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </>
            ) : (
              /* Not Logged In: Prompt to sign in */
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 shadow-lg shadow-slate-200/50 dark:shadow-none">
                <FaUser className="text-slate-300 dark:text-slate-600 mb-4" size={32} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">Sign in to track your orders</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 max-w-sm">
                  View order status, delivery updates, and complete order history
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
                  >
                    <FaUser size={10} />
                    Sign In
                  </Link>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Looking for a specific order? Use the link in your confirmation email.</p>
                </div>
              </motion.div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default TrackOrderPage;
