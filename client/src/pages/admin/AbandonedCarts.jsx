import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAbandonedCartsQuery, useMarkCartRecoveredMutation } from '../../redux/slices/cartSyncApiSlice';
import { FaArrowLeft, FaShoppingCart, FaEnvelope, FaCheck, FaRupeeSign, FaClock, FaUser } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { getFullImageUrl } from '../../utils/imageUtils';

const AbandonedCarts = () => {
  const { data: carts, isLoading, error, refetch } = useGetAbandonedCartsQuery();
  const [markCartRecovered] = useMarkCartRecoveredMutation();
  const navigate = useNavigate();
  const [expandedCart, setExpandedCart] = useState(null);

  const recoverHandler = async (id) => {
    try {
      await markCartRecovered(id).unwrap();
      toast.success('Cart marked as recovered');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const timeSince = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const totalLostRevenue = carts ? carts.reduce((acc, cart) => acc + cart.cartTotal, 0) : 0;

  return (
    <div className="pt-24 pb-20 bg-white dark:bg-slate-900 min-h-screen">
      <div className="main-container max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm hover:scale-105"
            >
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Abandoned Carts</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Revenue Recovery Dashboard</p>
            </div>
          </div>
        </div>

        {isLoading ? <Loader /> : error ? <Message variant="red">Sync Error</Message> : (
          <>
            {/* Revenue Lost Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/10 rounded-2xl p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Potential Lost Revenue</p>
                <p className="text-3xl font-black text-rose-500 tracking-tight">₹{totalLostRevenue.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-2xl p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Active Abandoned Carts</p>
                <p className="text-3xl font-black text-amber-500 tracking-tight">{carts?.length || 0}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10 rounded-2xl p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Avg Cart Value</p>
                <p className="text-3xl font-black text-blue-500 tracking-tight">₹{carts && carts.length > 0 ? Math.round(totalLostRevenue / carts.length).toLocaleString('en-IN') : 0}</p>
              </div>
            </div>

            {/* Cart List */}
            {!carts || carts.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-4">
                  <FaCheck size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Abandoned Carts!</h3>
                <p className="text-xs font-medium text-slate-500">All customers are completing their purchases. Great job!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {carts.map(cart => (
                  <div key={cart._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Cart Header Row */}
                    <div 
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedCart(expandedCart === cart._id ? null : cart._id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                          <FaShoppingCart size={14} />
                        </div>
                        <div>
                          <p className="text-[13px] font-black text-slate-900 dark:text-white">{cart.user?.name || 'Unknown User'}</p>
                          <p className="text-[10px] font-bold text-slate-400">{cart.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[14px] font-black text-rose-500">₹{cart.cartTotal.toLocaleString('en-IN')}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 justify-end"><FaClock size={8}/> {timeSince(cart.lastActivity)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); recoverHandler(cart._id); }}
                            className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                          >
                            Recovered
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Items */}
                    {expandedCart === cart._id && (
                      <div className="border-t border-slate-100 dark:border-white/5 p-5 bg-slate-50 dark:bg-slate-800/30">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{cart.cartItems.length} Items in Cart</p>
                        <div className="space-y-3">
                          {cart.cartItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-lg p-1">
                                  <img src={getFullImageUrl(item.image)} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                  <p className="text-[12px] font-bold text-slate-800 dark:text-white truncate max-w-[260px]">{item.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400">Qty: {item.qty}</p>
                                </div>
                              </div>
                              <p className="text-[12px] font-black text-slate-900 dark:text-white shrink-0">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                            </div>
                          ))}
                        </div>
                        
                        {cart.user?.email && (
                          <a 
                            href={`mailto:${cart.user.email}?subject=Complete%20your%20Pooja%20Telecom%20order!&body=Hi%20${cart.user.name},%0A%0AWe%20noticed%20you%20left%20some%20items%20in%20your%20cart.%20Complete%20your%20order%20now%20and%20use%20code%20COMEBACK5%20for%205%25%20off!%0A%0AVisit%20us%20at%20poojatelecom.com`}
                            className="mt-4 flex items-center gap-2 w-full justify-center py-3 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                          >
                            <FaEnvelope size={12} /> Send Recovery Email
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AbandonedCarts;
