import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../src/redux/slices/ordersApiSlice';
import { FaTimes, FaCheck, FaTruck, FaDatabase } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in relative z-10 w-full flex flex-col items-center">
      <div className="w-full relative z-10">
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
             <FaDatabase size={24} />
          </div>
          <div>
             <h1 className="text-4xl font-black text-white tracking-tighter">Orders</h1>
             <p className="text-slate-400 font-medium mt-1">List of all customer orders in the system.</p>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="red">{error?.data?.message || error.error}</Message>
        ) : (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 p-2 overflow-hidden relative group">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            
            <div className="overflow-x-auto rounded-[2rem] bg-slate-950 border border-white/5 relative z-10">
              <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] font-black text-slate-400">
                  <tr>
                    <th className="px-6 py-6 border-r border-white/5">Order ID</th>
                    <th className="px-6 py-6">User</th>
                    <th className="px-6 py-6">Date</th>
                    <th className="px-6 py-6">Total Amount</th>
                    <th className="px-6 py-6 text-center">Paid Status</th>
                    <th className="px-6 py-6 text-center">Shipped</th>
                    <th className="px-6 py-6 text-center">Delivered</th>
                    <th className="px-6 py-6 border-l border-white/5 text-right flex justify-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-white/5 transition-colors group/row">
                      <td className="px-6 py-5 text-emerald-400/80 font-mono text-[10px] bg-emerald-500/5 tracking-widest border-r border-white/5">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-5 text-white font-black">{order.user && order.user.name}</td>
                      <td className="px-6 py-5 text-slate-400 font-medium text-xs tracking-wider">{order.createdAt.substring(0, 10)}</td>
                      <td className="px-6 py-5 font-black text-white text-base">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                      
                      <td className="px-6 py-5 text-center">
                        {order.isPaid ? (
                          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                             <FaCheck className="text-emerald-500" />
                             <span className="text-[10px] font-black uppercase text-emerald-400">{order.paidAt.substring(0, 10)}</span>
                          </div>
                        ) : (
                          <span className="bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 shadow-inner">Unpaid</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-5 text-center">
                        {order.isShipped ? (
                          <div className="inline-flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
                             <FaTruck className="text-blue-400" />
                             <span className="text-[10px] font-black uppercase text-blue-400">{order.shippedAt.substring(0, 10)}</span>
                          </div>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20">No</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-5 text-center">
                        {order.isDelivered ? (
                          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                             <FaCheck className="text-emerald-500" />
                             <span className="text-[10px] font-black uppercase text-emerald-400">{order.deliveredAt.substring(0, 10)}</span>
                          </div>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20">No</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-5 text-center border-l border-white/5 flex justify-end">
                        <Link to={`/order/${order._id}`}>
                          <button className="bg-white/5 border border-white/10 hover:border-emerald-500 hover:text-white hover:bg-emerald-500/20 text-slate-400 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-inner hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default OrderList;
