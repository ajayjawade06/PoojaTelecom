import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../src/redux/slices/ordersApiSlice';
import { useGetUsersQuery } from '../../../src/redux/slices/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaUsers, FaBoxOpen, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetOrdersQuery();
  const { data: users, isLoading: loadingUsers, error: errorUsers } = useGetUsersQuery();

  if (loadingOrders || loadingUsers) return <Loader />;
  if (errorOrders || errorUsers) return <Message variant="red">Error loading dashboard stats</Message>;

  const totalRevenue = orders.reduce((acc, order) => (order.isPaid ? acc + order.totalPrice : acc), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;

  return (
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium mb-1">Total users</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{totalUsers}</h3>
          </div>
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
             <FaUsers size={28} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium mb-1">Total orders</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{totalOrders}</h3>
          </div>
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
             <FaBoxOpen size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium mb-1">Total revenue</p>
            <h3 className="text-3xl font-extrabold text-slate-800">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          </div>
          <div className="bg-amber-100 p-4 rounded-full text-amber-600">
             <FaChartLine size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Management Cards */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6 pb-4 border-b border-gray-100">Quick Management</h2>
            <div className="grid grid-cols-2 gap-4">
               <Link to="/admin/productlist" className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FaBoxOpen className="text-emerald-500" />
                  </div>
                  <p className="font-bold text-slate-800">Products</p>
                  <p className="text-xs text-slate-500">Manage stock & prices</p>
               </Link>
               <Link to="/admin/orderlist" className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FaChartLine className="text-blue-500" />
                  </div>
                  <p className="font-bold text-slate-800">Orders</p>
                  <p className="text-xs text-slate-500">Fulfillment & Status</p>
               </Link>
               <Link to="/admin/userlist" className="p-4 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FaUsers className="text-amber-500" />
                  </div>
                  <p className="font-bold text-slate-800">Users</p>
                  <p className="text-xs text-slate-500">Manage permissions</p>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
