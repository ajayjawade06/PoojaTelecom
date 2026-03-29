import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../src/redux/slices/ordersApiSlice';
import { FaTimes, FaCheck, FaTruck, FaDatabase } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="pt-24 pb-20 animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
      <div className="main-container">
        
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-white/5 pb-4">
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
                         <td className="p-4 text-[12px] font-black text-slate-900 dark:text-emerald-400">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                         <td className="p-4 text-center">
                            {order.isPaid ? (
                               <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase border border-emerald-500/20">Paid</span>
                            ) : (
                               <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded uppercase border border-rose-500/20">Unpaid</span>
                            )}
                         </td>
                         <td className="p-4 text-center">
                            {order.isDelivered ? (
                               <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase border border-blue-500/20">Delivered</span>
                            ) : order.isShipped ? (
                               <span className="text-[9px] font-black text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded uppercase border border-purple-500/20">Shipped</span>
                            ) : (
                               <span className="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded uppercase border border-slate-200 dark:border-white/10">Pending</span>
                            )}
                         </td>
                         <td className="p-4 text-right">
                            <Link to={`/order/${order._id}`} className="text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:underline">Details</Link>
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
