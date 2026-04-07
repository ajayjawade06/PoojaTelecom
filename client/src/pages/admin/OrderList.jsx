import { Link, useNavigate } from 'react-router-dom';
import { useGetOrdersQuery, useDeleteOrderMutation, useExcludeOrderMutation } from '../../../src/redux/slices/ordersApiSlice';
import { FaTimes, FaCheck, FaTruck, FaDatabase, FaArrowLeft, FaTrash, FaChartBar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const OrderList = () => {
 const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
 const [deleteOrder, { isLoading: loadingDelete }] = useDeleteOrderMutation();
 const [excludeOrder, { isLoading: loadingExclude }] = useExcludeOrderMutation();
 const navigate = useNavigate();

 const deleteHandler = async (id) => {
 if (window.confirm('Are you sure you want to delete this order?')) {
 try {
 await deleteOrder(id).unwrap();
 refetch();
 toast.success('Order deleted successfully');
 } catch (err) {
 toast.error(err?.data?.message || err.error);
 }
 }
 };

 const excludeHandler = async (id) => {
 try {
 await excludeOrder(id).unwrap();
 refetch();
 toast.success('Order stats status updated');
 } catch (err) {
 toast.error(err?.data?.message || err.error);
 }
 };

 return (
 <div className="pt-24 pb-20 bg-white dark:bg-slate-900 min-h-screen">
 <div className="main-container">
 
 <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-white/5 pb-4">
 <button 
 onClick={() => navigate('/admin')}
 className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm"
 >
 <FaArrowLeft size={14} />
 </button>
 <div>
 <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Orders</h1>
 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">View and Manage Orders</p>
 </div>
 </div>

 {isLoading ? <Loader /> : error ? <Message variant="red">Sync Error</Message> : (
 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
 <table className="w-full text-left">
 <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
 <tr>
 <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
 <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
 <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
 <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Payment</th>
 <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Shipping</th>
 <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stats</th>
 <th className="p-4"></th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 dark:divide-white/5">
 {orders.map(order => (
 <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
 <td className="p-4 text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">#{order._id.slice(-8)}</td>
 <td className="p-4">
 <p className="text-[12px] font-black text-slate-800 dark:text-white leading-tight">{order.user?.name || 'Deleted User'}</p>
 <p className="text-[10px] font-bold text-slate-400">{order.createdAt.substring(0, 10)}</p>
 </td>
 <td className="p-4 text-[12px] font-black text-slate-900 dark:text-blue-400">₹{order.totalPrice.toLocaleString('en-IN')}</td>
 <td className="p-4 text-center">
 {order.isPaid ? (
 <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase border border-blue-500/20">Paid</span>
 ) : (
 <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded uppercase border border-rose-500/20">Unpaid</span>
 )}
 </td>
 <td className="p-4 text-center">
 {order.isCancelled ? (
 <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded uppercase border border-rose-500/20 block">Cancelled</span>
 ) : order.isRefunded ? (
 <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase border border-blue-500/20 block">Refunded</span>
 ) : order.isDelivered ? (
 <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase border border-blue-500/20 block">Delivered</span>
 ) : order.isShipped ? (
 <span className="text-[9px] font-black text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded uppercase border border-purple-500/20 block">Shipped</span>
 ) : (
 <span className="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded uppercase border border-slate-200 dark:border-white/10 block">Pending</span>
 )}
 {order.isReturnRequested && !order.isRefunded && (
 <div className="mt-1.5 flex items-center justify-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
 <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
 <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest leading-none">Rtn {order.returnStatus}</span>
 </div>
 )}
 </td>
 <td className="p-4 text-center">
 <button 
 onClick={() => excludeHandler(order._id)}
 className={`p-2 rounded-lg transition-all ${order.excludeFromStats ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-blue-500'}`}
 title={order.excludeFromStats ? 'Excluded from charts' : 'Included in charts'}
 >
 <FaChartBar size={12} />
 </button>
 </td>
 <td className="p-4 text-right">
 <div className="flex items-center justify-end gap-3">
 <Link to={`/order/${order._id}`} className="text-blue-500 font-black text-[10px] uppercase tracking-widest hover:underline">Details</Link>
 <button 
 onClick={() => deleteHandler(order._id)}
 className="text-rose-500 hover:text-rose-600 transition-colors"
 disabled={loadingDelete}
 >
 <FaTrash size={12} />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 );
};

export default OrderList;
