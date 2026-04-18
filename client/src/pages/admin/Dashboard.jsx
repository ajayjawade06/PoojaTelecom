import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../src/redux/slices/ordersApiSlice';
import { useGetUsersQuery } from '../../../src/redux/slices/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaUsers, FaBoxOpen, FaChartLine, FaArrowUp, FaArrowDown, FaCrown, FaCheckCircle, FaClock, FaPercent, FaSave } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useGetConfigQuery, useUpdateConfigMutation } from '../../../src/redux/slices/configApiSlice';

const Dashboard = () => {
 const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetOrdersQuery();
 const { data: users, isLoading: loadingUsers, error: errorUsers } = useGetUsersQuery();

 const { data: config, refetch: refetchConfig } = useGetConfigQuery();
 const [updateConfig, { isLoading: updatingConfig }] = useUpdateConfigMutation();
 
 const [festivalName, setFestivalName] = useState('');
 const [discountPercentage, setDiscountPercentage] = useState(0);

 useMemo(() => {
 if (config) {
   setFestivalName(config.festivalName || '');
   setDiscountPercentage(config.discountPercentage || 0);
 }
 }, [config]);

 const handleSaveConfig = async () => {
   try {
     await updateConfig({ festivalName, discountPercentage }).unwrap();
     alert('Global settings updated successfully');
     refetchConfig();
   } catch (err) {
     alert('Failed to update config');
   }
 };

 const metrics = useMemo(() => {
 if (!orders || !users) return null;
 const totalRevenue = orders.reduce((acc, order) => (order.isPaid ? acc + order.totalPrice : acc), 0);
 const totalOrders = orders.length;
 const totalUsers = users.length;
 const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;

 const last7Days = [...Array(7)].map((_, i) => {
 const d = new Date();
 d.setDate(d.getDate() - (6 - i));
 return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), revenue: 0 };
 });

 orders.forEach(order => {
 if (order.isPaid) {
 const orderDate = new Date(order.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 const dayMatch = last7Days.find(d => d.date === orderDate);
 if (dayMatch) dayMatch.revenue += order.totalPrice;
 }
 });

 let paid = 0, shipped = 0, delivered = 0, pending = 0;
 orders.forEach(order => {
 if (order.isDelivered) delivered++;
 else if (order.isShipped) shipped++;
 else if (order.isPaid) paid++;
 else pending++;
 });

 const orderStatusData = [
 { name: 'Pending', value: pending, color: '#94a3b8' },
 { name: 'Paid', value: paid, color: '#3b82f6' },
 { name: 'Shipped', value: shipped, color: '#8b5cf6' },
 { name: 'Delivered', value: delivered, color: '#10b981' },
 ].filter(d => d.value > 0);

 return { totalRevenue, totalOrders, totalUsers, avgOrderValue, revenueData: last7Days, orderStatusData };
 }, [orders, users]);

 if (loadingOrders || loadingUsers) return <Loader />;
 if (errorOrders || errorUsers) return <Message variant="red">Sync Error</Message>;

 return (
 <div className="pt-24 pb-20 bg-white dark:bg-slate-900 min-h-screen">
 <div className="main-container">
 
 {/* Compact Admin Header */}
 <div className="flex items-center justify-between mb-10 border-b border-slate-100 dark:border-white/5 pb-4">
 <div>
 <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pooja Telecom Stats</p>
 </div>
 <div className="flex gap-2 flex-wrap">
 <Link to="/admin/reports" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/10 hover:-translate-y-0.5">Reports</Link>
 <Link to="/admin/support-chat" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 hover:-translate-y-0.5">Support Chat</Link>
 <Link to="/admin/userlist" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/10 hover:-translate-y-0.5">Users</Link>
 <Link to="/admin/productlist" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:-translate-y-0.5">Products</Link>
 <Link to="/admin/orderlist" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/10 hover:-translate-y-0.5">Orders</Link>
 <Link to="/admin/carousel" className="bg-violet-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-500/10 hover:-translate-y-0.5">Carousel</Link>
 </div>
 </div>

 {/* Global Stats Grid */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
 {[
 { label: 'Total Revenue', value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`, icon: FaChartLine, color: 'text-blue-500', link: '/admin/reports' },
 { label: 'Total Users', value: metrics.totalUsers, icon: FaUsers, color: 'text-blue-500', link: '/admin/userlist' },
 { label: 'Total Orders', value: metrics.totalOrders, icon: FaBoxOpen, color: 'text-purple-500', link: '/admin/orderlist' },
 { label: 'Avg order value', value: `₹${metrics.avgOrderValue}`, icon: FaCrown, color: 'text-amber-500', link: '/admin/reports' },
 ].map((stat, i) => (
 <Link to={stat.link} key={i} className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-blue-500/20 transition-all cursor-pointer">
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
 <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{stat.value}</h3>
 </div>
 <stat.icon size={16} className={`${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
 </Link>
 ))}
 </div>

 {/* Analytics Section */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 
 {/* Revenue Area Chart */}
 <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm">
 <div className="flex items-center justify-between mb-10">
 <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
 Revenue Growth
 </h2>
 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-2 py-1 rounded">Last 7 Days</span>
 </div>
 <div className="h-64 w-full">
 <ResponsiveContainer width="100%" height="100%" minWidth={0}>
 <AreaChart data={metrics.revenueData}>
 <defs>
 <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
 </linearGradient>
 </defs>
 <XAxis dataKey="date" hide />
 <Tooltip 
 contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', padding: '12px' }}
 itemStyle={{ color: '#10b981', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}
 labelStyle={{ color: '#94a3b8', fontSize: '8px', fontWeight: 900, marginBottom: '4px' }}
 />
 <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Order status Pie Chart */}
 <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm text-center">
 <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-8 border-b border-slate-50 dark:border-white/5 pb-4">Order Status</h2>
 <div className="h-48 flex items-center justify-center relative">
 <ResponsiveContainer width="100%" height="100%" minWidth={0}>
 <PieChart>
 <Pie 
 data={metrics.orderStatusData} 
 innerRadius={50} 
 outerRadius={65} 
 paddingAngle={5} 
 dataKey="value" 
 stroke="none"
 >
 {metrics.orderStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
 </Pie>
 <Tooltip />
 </PieChart>
 </ResponsiveContainer>
 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-4px]">
 <span className="text-2xl font-black text-slate-900 dark:text-white">{metrics.totalOrders}</span>
 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-40">Orders</span>
 </div>
 </div>
 <div className="flex flex-wrap justify-center gap-4 mt-6">
 {metrics.orderStatusData.map((e, i) => (
 <div key={i} className="flex items-center gap-1.5">
 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }}></div>
 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{e.name}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Global Settings Container */}
 <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm">
 <div className="flex items-center justify-between mb-8">
 <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
 Global Festive Discount
 </h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
   <div className="space-y-1.5">
     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Festival Name</label>
     <input 
       type="text" 
       placeholder="e.g. Diwali"
       className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white"
       value={festivalName}
       onChange={e => setFestivalName(e.target.value)}
     />
   </div>
   <div className="space-y-1.5">
     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Percentage (%)</label>
     <div className="flex gap-4">
       <input 
         type="number" 
         min="0"
         max="100"
         className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white"
         value={discountPercentage}
         onChange={e => setDiscountPercentage(Number(e.target.value))}
       />
       <button 
         onClick={handleSaveConfig}
         disabled={updatingConfig}
         className="bg-emerald-500 text-white px-6 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
       >
         <FaSave size={14} /> {updatingConfig ? 'Saving...' : 'Save'}
       </button>
     </div>
   </div>
 </div>
 </div>

 </div>
 </div>
 );
};

export default Dashboard;
