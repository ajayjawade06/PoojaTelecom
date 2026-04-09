import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    useGetOrdersQuery, 
    useDeleteOrderMutation, 
    useExcludeOrderMutation,
    useBulkUpdateOrdersMutation 
} from '../../redux/slices/ordersApiSlice';
import { FaArrowLeft, FaTrash, FaChartBar, FaSortAmountDown, FaExclamationCircle, FaCheckCircle, FaTruck, FaBoxOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const OrderList = () => {
    const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
    const [deleteOrder, { isLoading: loadingDelete }] = useDeleteOrderMutation();
    const [excludeOrder] = useExcludeOrderMutation();
    const [bulkUpdateOrders, { isLoading: loadingBulk }] = useBulkUpdateOrdersMutation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('All');
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc'); // newest first

    useEffect(() => {
        setSelectedOrders([]);
    }, [activeTab]);

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

    const handleBulkAction = async (actionStr) => {
        if (selectedOrders.length === 0) return;
        try {
            await bulkUpdateOrders({ orderIds: selectedOrders, action: actionStr }).unwrap();
            toast.success(`${selectedOrders.length} orders marked as ${actionStr}`);
            setSelectedOrders([]);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    // Derived Categorized Orders
    const processedOrders = useMemo(() => {
        if (!orders) return { All: [], PendingPayment: [], ToShip: [], InTransit: [], Returns: [], Completed: [] };
        
        return {
            All: [...orders],
            PendingPayment: orders.filter(o => !o.isPaid && !o.isCancelled && !o.isDelivered),
            ToShip: orders.filter(o => o.isPaid && !o.isShipped && !o.isCancelled && !o.isRefunded && !o.isReturnRequested),
            InTransit: orders.filter(o => o.isShipped && !o.isDelivered && !o.isReturnRequested && !o.isCancelled && !o.isRefunded),
            Returns: orders.filter(o => o.isReturnRequested && !o.isRefunded),
            Completed: orders.filter(o => o.isDelivered || o.isRefunded || o.isCancelled)
        };
    }, [orders]);

    const sortedFilteredOrders = useMemo(() => {
        const filtered = processedOrders[activeTab.replace(' ', '')] || processedOrders.All;
        return [...filtered].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }, [processedOrders, activeTab, sortOrder]);

    const tabs = [
        { id: 'All', label: 'All Orders', count: processedOrders.All.length },
        { id: 'PendingPayment', label: 'Pending Payment', count: processedOrders.PendingPayment.length, warn: true },
        { id: 'ToShip', label: 'To Ship', count: processedOrders.ToShip.length, urgent: true },
        { id: 'InTransit', label: 'In Transit', count: processedOrders.InTransit.length },
        { id: 'Returns', label: 'Returns', count: processedOrders.Returns.length, urgent: true },
        { id: 'Completed', label: 'Completed', count: processedOrders.Completed.length }
    ];

    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedOrders(sortedFilteredOrders.map(o => o._id));
        else setSelectedOrders([]);
    };

    const handleSelectOne = (e, id) => {
        if (e.target.checked) setSelectedOrders(prev => [...prev, id]);
        else setSelectedOrders(prev => prev.filter(oId => oId !== id));
    };

    return (
        <div className="pt-24 pb-20 bg-white dark:bg-slate-900 min-h-screen relative">
            <div className="main-container max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/admin')}
                            className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm hover:scale-105"
                        >
                            <FaArrowLeft size={14} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Order Management</h1>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Streamline your fulfillments</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    >
                        <FaSortAmountDown size={12} className={`transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                    </button>
                </div>

                {isLoading ? <Loader /> : error ? <Message variant="red">Sync Error</Message> : (
                    <>
                        {/* Tabbed Navigation */}
                        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5 w-max max-w-full">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2
                                        ${activeTab === tab.id 
                                            ? 'bg-white dark:bg-[#1c1c1e] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10' 
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                                        activeTab === tab.id 
                                            ? (tab.urgent && tab.count > 0 ? 'bg-rose-500 text-white' : 'bg-blue-500/10 text-blue-500') 
                                            : ((tab.urgent || tab.warn) && tab.count > 0 ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500')
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Order Table */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                            {sortedFilteredOrders.length === 0 ? (
                                <div className="py-20 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                        <FaCheckCircle size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Queue is Clear!</h3>
                                    <p className="text-xs font-medium text-slate-500">No orders currently sitting in this pipeline stage.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                                            <tr>
                                                <th className="p-4 w-12 text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                        checked={selectedOrders.length === sortedFilteredOrders.length && sortedFilteredOrders.length > 0}
                                                        onChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Order ID</th>
                                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Payment</th>
                                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stage</th>
                                                <th className="p-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {sortedFilteredOrders.map(order => (
                                                <tr key={order._id} className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group ${selectedOrders.includes(order._id) ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}>
                                                    <td className="p-4 w-12 text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                            checked={selectedOrders.includes(order._id)}
                                                            onChange={(e) => handleSelectOne(e, order._id)}
                                                        />
                                                    </td>
                                                    <td className="p-4 pl-0">
                                                        <span className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-wider block">#{order._id.slice(-8)}</span>
                                                        <span className="text-[9px] font-bold text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-[12px] font-black text-slate-800 dark:text-white leading-tight">{order.user?.name || 'Deleted User'}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                                                    </td>
                                                    <td className="p-4 text-[13px] font-black text-slate-900 dark:text-blue-400">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                                    <td className="p-4 text-center">
                                                        {order.isPaid ? (
                                                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-emerald-500/20">Paid</span>
                                                        ) : (
                                                            <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-amber-500/20">Unpaid</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {order.isCancelled ? (
                                                            <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-rose-500/20 inline-block">Cancelled</span>
                                                        ) : order.isRefunded ? (
                                                            <span className="text-[9px] font-black text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-indigo-500/20 inline-block">Refunded</span>
                                                        ) : order.isReturnRequested ? (
                                                            <div className="inline-flex items-center gap-1.5 bg-rose-500 text-white border border-rose-600 px-2.5 py-1 rounded-md shadow-sm shadow-rose-500/20">
                                                                <FaExclamationCircle size={10} />
                                                                <span className="text-[9px] font-black uppercase tracking-wider">Return: {order.returnStatus}</span>
                                                            </div>
                                                        ) : order.isDelivered ? (
                                                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-emerald-500/20 inline-block">Delivered</span>
                                                        ) : order.isShipped ? (
                                                            <span className="text-[9px] font-black text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-purple-500/20 inline-block">Shipped</span>
                                                        ) : order.isPaid ? (
                                                            <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-500/20 shadow-sm inline-block shadow-blue-500/10">Needs Ship</span>
                                                        ) : (
                                                            <span className="text-[9px] font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md uppercase tracking-wider block">Pending</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link to={`/order/${order._id}`} className="px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-blue-500 hover:text-white transition-all">Manage</Link>
                                                            <button 
                                                                onClick={() => deleteHandler(order._id)}
                                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                                                disabled={loadingDelete}
                                                                title="Delete Order completely"
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

                        {/* Bulk Action Sticky Bar */}
                        {selectedOrders.length > 0 && (
                            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 p-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5">
                                <div className="text-white text-[12px] font-black flex items-center gap-2 pl-2">
                                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white leading-none">{selectedOrders.length}</span>
                                    <span>Selected</span>
                                </div>
                                <div className="flex items-center gap-2 pr-1">
                                    {activeTab === 'ToShip' && (
                                        <button 
                                            onClick={() => handleBulkAction('shipped')}
                                            disabled={loadingBulk}
                                            className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
                                        >
                                            <FaTruck size={12} /> Mark as Shipped
                                        </button>
                                    )}
                                    {activeTab === 'InTransit' && (
                                        <button 
                                            onClick={() => handleBulkAction('delivered')}
                                            disabled={loadingBulk}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                                        >
                                            <FaBoxOpen size={12} /> Mark as Delivered
                                        </button>
                                    )}
                                    {activeTab !== 'ToShip' && activeTab !== 'InTransit' && (
                                        <div className="text-[10px] text-slate-400 uppercase tracking-widest pr-4 font-black">
                                            Bulk tools unavailable in this tab
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderList;
