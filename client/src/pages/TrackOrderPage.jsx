import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMyOrdersQuery } from '../redux/slices/ordersApiSlice';
import { FaTruck, FaBoxOpen, FaCheckCircle, FaShippingFast, FaClock, FaRupeeSign, FaUser, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } } };

const TrackOrderPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery(undefined, { skip: !userInfo });

  const getStatusBadge = (order) => {
    if (order.isCancelled) return { label: 'Cancelled', color: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400', icon: FaTimesCircle };
    if (order.isDelivered) return { label: 'Delivered', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400', icon: FaCheckCircle };
    if (order.isShipped) return { label: 'Shipped', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400', icon: FaShippingFast };
    if (order.isPaid) return { label: 'Processing', color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400', icon: FaClock };
    return { label: 'Pending Payment', color: 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400', icon: FaClock };
  };

  return (
    <div className="min-h-screen bg-transparent pb-16 pt-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300">Track Order</span>
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
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Track Your Orders</h1>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
            {userInfo ? `${orders?.length || 0} orders found` : 'Sign in to view your orders'}
          </p>
        </motion.div>

        {/* Logged In: Show orders list */}
        {userInfo ? (
          <>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-blue-500 mb-4" size={24} />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading your orders...</p>
              </div>
            ) : error ? (
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
                        to={`/order/${order._id}`}
                        className="block bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 p-5 shadow-sm hover:border-blue-200 dark:hover:border-blue-500/20 transition-all duration-200 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                #{order._id.slice(-8)}
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
                            View Details →
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
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
            >
              <FaUser size={10} />
              Sign In
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default TrackOrderPage;
