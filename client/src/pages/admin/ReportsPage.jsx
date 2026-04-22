import { useState, useMemo } from 'react';
import {
 useGetSalesReportQuery,
 useGetInventoryReportQuery,
 useGetUserReportQuery
} from '../../../src/redux/slices/reportsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
 AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
 PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
 FaChartLine, FaBox, FaUsers, FaDownload, FaFileCsv, FaFilePdf,
 FaArrowUp, FaArrowDown, FaCalendarAlt, FaMoneyBillWave, FaArrowLeft
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsPage = () => {
 const [startDate, setStartDate] = useState('');
 const [endDate, setEndDate] = useState('');
 const queryObj = useMemo(() => {
   if (startDate && endDate) return { start: startDate, end: endDate };
   return {};
 }, [startDate, endDate]);

 const { data: salesData, isLoading: loadingSales, error: salesError, refetch: refetchSales } = useGetSalesReportQuery(queryObj);
 const { data: inventoryData, isLoading: loadingInventory, error: inventoryError } = useGetInventoryReportQuery();
 const { data: userData, isLoading: loadingUsers, error: userError } = useGetUserReportQuery();

 const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

 const dateLabel = startDate && endDate ? `${startDate}_to_${endDate}` : 'all_time';
 const dateLabelDisplay = startDate && endDate
   ? `${new Date(startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} — ${new Date(endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
   : 'All Time';

 const exportCSV = (data, filename) => {
 if (!data || !data.length) return;
 const headers = Object.keys(data[0]).join(',');
 const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
 const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
 const encodedUri = encodeURI(csvContent);
 const link = document.createElement("a");
 link.setAttribute("href", encodedUri);
 link.setAttribute("download", `${filename}_${dateLabel}.csv`);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

 const exportPDF = () => {
 const doc = new jsPDF();
 doc.setFontSize(22);
 doc.setTextColor(15, 23, 42); // slate-900
 doc.text("POOJA TELECOM - ANALYTICS", 14, 22);

 doc.setFontSize(10);
 doc.setTextColor(100);
 doc.text(`Report Generated On: ${new Date().toLocaleString()}`, 14, 30);
 doc.setFontSize(11);
 doc.setTextColor(59, 130, 246);
 doc.text(`Date Range: ${dateLabelDisplay}`, 14, 37);

 // Summary Table
 const summary = [
 ["Date Range", dateLabelDisplay],
 ["Gross Revenue", `Rs. ${salesData?.totalRevenue?.toLocaleString('en-IN')}`],
 ["Total Inventory Items", inventoryData?.totalProducts],
 ["Total Registered Users", userData?.totalUsers],
 ["Active Customer Base", userData?.activeUsersCount],
 ["Low Stock Alerts", inventoryData?.lowStock],
 ["Out of Stock Items", inventoryData?.outOfStock],
 ];

 autoTable(doc, {
 startY: 45,
 head: [["Metric","Value"]],
 body: summary,
 theme: 'grid',
 headStyles: { fillColor: [16, 185, 129], fontStyle: 'bold' },
 styles: { fontSize: 10, cellPadding: 5 }
 });

 // Top Products Table
 if (salesData?.topProducts) {
 const productBody = salesData.topProducts.map(p => [p.name, p.soldCount, `Rs. ${p.price.toLocaleString('en-IN')}`, `Rs. ${(p.price * p.soldCount).toLocaleString('en-IN')}`]);
 autoTable(doc, {
 startY: doc.lastAutoTable.finalY + 15,
 head: [["Performance: Top Products","Sold","Price","Revenue"]],
 body: productBody,
 theme: 'striped',
 headStyles: { fillColor: [59, 130, 246] },
 styles: { fontSize: 9 }
 });
 }

 // Category Sales Table
 if (salesData?.categorySales) {
 const categoryBody = salesData.categorySales.map(c => [c._id, c.unitsSold, `Rs. ${c.totalSales.toLocaleString('en-IN')}`]);
 autoTable(doc, {
 startY: doc.lastAutoTable.finalY + 15,
 head: [["Category Performance","Units","Total Sales"]],
 body: categoryBody,
 theme: 'grid',
 headStyles: { fillColor: [139, 92, 246] }
 });
 }

 doc.save(`pooja_telecom_report_${dateLabel}.pdf`);
 };

 if (loadingSales || loadingInventory || loadingUsers) return <Loader />;
 if (salesError || inventoryError || userError) return <Message variant="red">Failed to load reporting data</Message>;

 return (
 <div className="pt-24 pb-20 bg-white dark:bg-slate-900 min-h-screen">
 <div className="main-container max-w-7xl mx-auto px-4">

 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
 <div className="flex items-center gap-4">
 <button
 onClick={() => window.history.back()}
 className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm"
 >
 <FaArrowLeft size={14} />
 </button>
 <div>
 <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Analytics & Reports</h1>
 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Production Insights for Pooja Telecom</p>
 </div>
 </div>
 </div>

 {/* Date Filter + Download Bar */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
   <div className="flex flex-wrap items-end gap-4">
     <div className="flex flex-col gap-1">
       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Start Date</label>
       <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
     </div>
     <div className="flex flex-col gap-1">
       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">End Date</label>
       <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
     </div>
     <button onClick={() => refetchSales()} className="bg-blue-500 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
       <FaCalendarAlt size={10} /> Apply Filter
     </button>
     {(startDate || endDate) && (
       <button onClick={() => { setStartDate(''); setEndDate(''); }} className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">Clear</button>
     )}
   </div>
   <div className="flex items-center gap-2">
     {(startDate && endDate) && (
       <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20 hidden md:inline-block">
         {dateLabelDisplay}
       </span>
     )}
     <button
     onClick={() => exportCSV(salesData?.sales, 'sales_report')}
     className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-2 border border-slate-200 dark:border-white/10"
     >
     <FaFileCsv size={12} /> CSV
     </button>
     <button
     onClick={exportPDF}
     className="bg-blue-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:bg-blue-600"
     >
     <FaFilePdf size={12} /> PDF Report
     </button>
   </div>
 </div>

 {/* Top Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
 <ReportCard
 title="Gross Revenue"
 value={`₹${salesData?.totalRevenue?.toLocaleString('en-IN')}`}
 icon={FaMoneyBillWave}
 color="blue"
 trend="Up 12%"
 />
 <ReportCard
 title="Active Users"
 value={userData?.activeUsersCount}
 icon={FaUsers}
 color="blue"
 trend="New: 5 today"
 />
 <ReportCard
 title="Stock Alerts"
 value={inventoryData?.lowStock}
 icon={FaBox}
 color="amber"
 trend={`${inventoryData?.outOfStock} Empty`}
 />
 <ReportCard
 title="Total Stock"
 value={inventoryData?.totalProducts}
 icon={FaChartLine}
 color="purple"
 trend="Managed"
 />
 </div>

 {/* Charts Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

 {/* Revenue Chart */}
 <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Revenue Trend</h3>
 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-2 py-1 rounded">Daily Sales</span>
 </div>
 <div className="h-72 w-full">
 <ResponsiveContainer width="100%" height="100%" minWidth={0}>
 <AreaChart data={salesData?.sales}>
 <defs>
 <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
 </linearGradient>
 </defs>
 <XAxis dataKey="_id" tick={{ fontSize: 10, fontWeight: 700 }} />
 <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
 <Tooltip
 contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
 itemStyle={{ color: '#10b981', fontWeight: 900, fontSize: '10px' }}
 />
 <Area type="monotone" dataKey="totalSales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Inventory Distribution */}
 <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm">
 <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-8 text-center">In-Stock Distribution</h3>
 <div className="h-64 flex justify-center items-center">
 <ResponsiveContainer width="100%" height="100%" minWidth={0}>
 <PieChart>
 <Pie
 data={inventoryData?.categoryDistribution}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={5}
 dataKey="stock"
 nameKey="_id"
 >
 {inventoryData?.categoryDistribution?.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
 ))}
 </Pie>
 <Tooltip />
 <Legend iconType="circle" />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Category Performance */}
 <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm">
 <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-8">Category Revenue</h3>
 <div className="h-64">
 <ResponsiveContainer width="100%" height="100%" minWidth={0}>
 <BarChart data={salesData?.categorySales}>
 <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
 <XAxis dataKey="_id" tick={{ fontSize: 9, fontWeight: 700 }} />
 <YAxis tick={{ fontSize: 9, fontWeight: 700 }} />
 <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} itemStyle={{ color: '#8b5cf6', fontWeight: 900 }} />
 <Bar dataKey="totalSales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* User Growth */}
 <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm">
 <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-8">User Growth Trend</h3>
 <div className="h-64">
 <ResponsiveContainer width="100%" height="100%" minWidth={0}>
 <AreaChart data={userData?.userStats}>
 <XAxis dataKey="_id" tick={{ fontSize: 9, fontWeight: 700 }} />
 <YAxis tick={{ fontSize: 9, fontWeight: 700 }} />
 <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
 <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={3} />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Order Status & Recent Users Split */}
 <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">

 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8">
 <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Order Fulfilment</h3>
 <div className="h-64">
 <ResponsiveContainer width="100%" height="100%" minWidth={0}>
 <PieChart>
 <Pie
 data={salesData?.orderStatus}
 dataKey="count"
 nameKey="_id"
 innerRadius={50}
 outerRadius={80}
 paddingAngle={5}
 >
 {salesData?.orderStatus?.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
 ))}
 </Pie>
 <Tooltip />
 <Legend />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </div>

 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8">
 <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Recent New Users</h3>
 <div className="space-y-4">
 {userData?.recentUsers?.map((user, idx) => (
 <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 transition-all hover:translate-x-1">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-[10px] font-black">
 {user.name.charAt(0)}
 </div>
 <div>
 <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight">{user.name}</p>
 <p className="text-[9px] font-bold text-slate-400">{user.email}</p>
 </div>
 </div>
 <span className="text-[8px] font-black text-slate-400 uppercase bg-white dark:bg-slate-800 px-2 py-1 rounded">{new Date(user.createdAt).toLocaleDateString()}</span>
 </div>
 ))}
 </div>
 </div>

 </div>

 {/* Top Selling Products */}
 <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm">
 <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Product Velocity Rankings</h3>
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50 dark:bg-white/5">
 <tr>
 <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product</th>
 <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Orders</th>
 <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Price</th>
 <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Revenue (Est.)</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 dark:divide-white/5">
 {salesData?.topProducts?.map((product, i) => (
 <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
 <td className="p-4 flex items-center gap-3">
 <div className="w-8 h-8 rounded p-1 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5">
 <img src={product.image} className="w-full h-full object-contain" alt="" />
 </div>
 <span className="text-[11px] font-black text-slate-900 dark:text-white">{product.name}</span>
 </td>
 <td className="p-4 text-center">
 <span className="text-[11px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">{product.soldCount}</span>
 </td>
 <td className="p-4 text-[11px] font-black text-slate-500 text-center">₹{product.price.toLocaleString('en-IN')}</td>
 <td className="p-4 text-[11px] font-black text-slate-900 dark:text-white text-right">₹{(product.price * product.soldCount).toLocaleString('en-IN')}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 </div>
 </div>
 </div>
 );
};

const ReportCard = ({ title, value, icon: Icon, color, trend }) => {
 const colorMap = {
 blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
 amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
 purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
 };

 return (
 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-slate-300 transition-all shadow-sm">
 <div className="flex-grow min-w-0">
 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{title}</p>
 <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2 truncate">{value}</h3>
 <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${colorMap[color]}`}>{trend}</span>
 </div>
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]} bg-opacity-10 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4`}>
 <Icon size={18} />
 </div>
 </div>
 );
};

export default ReportsPage;
