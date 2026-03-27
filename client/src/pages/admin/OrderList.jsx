import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../src/redux/slices/ordersApiSlice';
import { FaTimes, FaCheck } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="red">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">USER</th>
                <th className="px-6 py-4 font-bold">DATE</th>
                <th className="px-6 py-4 font-bold">TOTAL</th>
                <th className="px-6 py-4 font-bold">PAID</th>
                <th className="px-6 py-4 font-bold">SHIPPED</th>
                <th className="px-6 py-4 font-bold">DELIVERED</th>
                <th className="px-6 py-4 font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-700 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-slate-700 font-bold">{order.user && order.user.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{order.createdAt.substring(0, 10)}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 text-base">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    {order.isPaid ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{order.paidAt.substring(0, 10)}</span>
                    ) : (
                      <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.isShipped ? (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{order.shippedAt.substring(0, 10)}</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.isDelivered ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap">{order.deliveredAt.substring(0, 10)}</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default OrderList;
