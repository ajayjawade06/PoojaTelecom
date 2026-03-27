import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../../src/redux/slices/ordersApiSlice';
import { useGetUsersQuery } from '../../../src/redux/slices/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaUsers, FaBoxOpen, FaChartLine, FaArrowUp, FaArrowDown, FaCrown } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetOrdersQuery();
  const { data: users, isLoading: loadingUsers, error: errorUsers } = useGetUsersQuery();

  // Metric Calculations
  const metrics = useMemo(() => {
    if (!orders || !users) return null;

    const totalRevenue = orders.reduce((acc, order) => (order.isPaid ? acc + order.totalPrice : acc), 0);
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    // Time-series Data for Revenue Area Chart (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), dateObj: d, revenue: 0 };
    });

    orders.forEach(order => {
      if (order.isPaid) {
        const orderDate = new Date(order.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayMatch = last7Days.find(d => d.date === orderDate);
        if (dayMatch) dayMatch.revenue += order.totalPrice;
      }
    });

    // Categorical Data for Order Status Pie Chart
    let paid = 0, shipped = 0, delivered = 0, pending = 0;
    orders.forEach(order => {
      if (order.isDelivered) delivered++;
      else if (order.isShipped) shipped++;
      else if (order.isPaid) paid++;
      else pending++;
    });

    const orderStatusData = [
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Paid', value: paid, color: '#3b82f6' },
      { name: 'Shipped', value: shipped, color: '#8b5cf6' },
      { name: 'Delivered', value: delivered, color: '#10b981' },
    ].filter(d => d.value > 0);

    return { totalRevenue, totalOrders, totalUsers, avgOrderValue, revenueData: last7Days, orderStatusData };
  }, [orders, users]);

  if (loadingOrders || loadingUsers) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
  if (errorOrders || errorUsers) return <Message variant="red">Error loading backend analytics.</Message>;

  return (
    <div className="container mx-auto px-4 mt-8 lg:mt-12 pb-24 relative z-10 w-full animate-fade-in">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-slate-900/80 rounded-3xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-xl">
              <FaChartLine size={28} className="text-emerald-400" />
           </div>
           <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-1">
                Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Dashboard</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Real-time Sales & Analytics</p>
           </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/30 transition-all"></div>
          <button className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl font-black text-xs text-white shadow-xl shadow-slate-900/50 group-hover:-translate-y-1 transition-transform flex items-center gap-3 uppercase tracking-widest">
            <span className="text-emerald-400">📄</span> Generate Report
          </button>
        </div>
      </div>
      
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
        {[
          { label: 'Total Revenue', value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`, icon: FaChartLine, color: 'emerald', trend: '+12.5%' },
          { label: 'Active Users', value: metrics.totalUsers, icon: FaUsers, color: 'blue', trend: '+5.2%' },
          { label: 'Orders Placed', value: metrics.totalOrders, icon: FaBoxOpen, color: 'indigo', trend: '+18.1%' },
          { label: 'Avg. Order', value: `₹${metrics.avgOrderValue}`, icon: FaCrown, color: 'amber', trend: '-2.4%' },
        ].map((stat, i) => (
          <div key={i} className={`bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl shadow-slate-950 hover:-translate-y-2 transition-transform duration-500 group relative overflow-hidden`}>
            {/* Background Glow */}
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-${stat.color}-500/10 rounded-full blur-[40px] group-hover:scale-150 group-hover:bg-${stat.color}-500/20 transition-all duration-700 pointer-events-none`}></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 border border-${stat.color}-500/20 shadow-[0_0_15px_rgba(var(--tw-color-${stat.color}-500),0.1)]`}>
                <stat.icon size={24} />
              </div>
              <span className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border ${stat.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-inner' : 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-inner'}`}>
                {stat.trend.startsWith('+') ? <FaArrowUp size={8}/> : <FaArrowDown size={8}/>} {stat.trend.replace(/[-+]/g, '')}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-white tracking-tight mb-2 drop-shadow-lg">{stat.value}</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts & Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 relative z-10">
        
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl rounded-[3rem] p-10 border border-white/5 shadow-2xl shadow-slate-950 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10 group-hover:bg-emerald-500/10 transition-colors"></div>
          
          <div className="flex justify-between items-center mb-10 relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <h2 className="text-xl font-black text-white uppercase tracking-widest">Revenue Over Time</h2>
            </div>
            <select className="bg-slate-950 border border-white/10 outline-none text-[10px] uppercase tracking-widest font-black text-slate-400 hover:text-white transition-colors px-4 py-3 rounded-xl cursor-pointer shadow-inner">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800, textTransform: 'uppercase' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontWeight: 800, padding: '16px 24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#34d399', fontWeight: 900, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}
                />
                <Area type="monotone" dataKey="revenue" name="Rev (₹)" stroke="#34d399" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Donut */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-[3rem] p-10 border border-white/5 shadow-2xl shadow-slate-950 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none -z-10 group-hover:bg-blue-500/10 transition-colors"></div>
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <h2 className="text-xl font-black text-white uppercase tracking-widest">Order Status</h2>
          </div>
          <div className="flex-grow flex items-center justify-center relative z-10">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={metrics.orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {metrics.orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontWeight: 800, padding: '12px 20px' }}
                  itemStyle={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Donut Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
              <span className="text-4xl font-black text-white">{metrics.totalOrders}</span>
              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase mt-1">Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch / Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          { title: 'Products', desc: 'Manage Store Products', path: '/admin/productlist', icon: FaBoxOpen, color: 'emerald' },
          { title: 'Orders', desc: 'Manage Customer Orders', path: '/admin/orderlist', icon: FaChartLine, color: 'blue' },
          { title: 'Users', desc: 'Manage Registered Users', path: '/admin/userlist', icon: FaUsers, color: 'amber' },
        ].map((link, i) => (
          <Link key={i} to={link.path} className={`group block p-8 bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-white/5 hover:border-${link.color}-500/30 hover:bg-slate-900 transition-all duration-300 relative overflow-hidden shadow-2xl shadow-slate-950`}>
             <div className={`absolute -right-6 -bottom-6 w-32 h-32 bg-${link.color}-500/5 rounded-full blur-[30px] group-hover:bg-${link.color}-500/20 transition-all duration-500 pointer-events-none`}></div>
             
             <div className="relative z-10 flex items-center justify-between">
                <div>
                   <h3 className="text-lg font-black text-white tracking-tight mb-1">{link.title}</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{link.desc}</p>
                </div>
                <div className={`w-14 h-14 rounded-[1.5rem] bg-${link.color}-500/10 text-${link.color}-400 flex items-center justify-center border border-${link.color}-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_0_20px_rgba(var(--tw-color-${link.color}-500),0.1)]`}>
                   <link.icon size={22} className="relative z-10" />
                </div>
             </div>
             {/* Hover Beam */}
             <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-${link.color}-400 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-[1.5s] ease-in-out`}></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
