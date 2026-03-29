import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation } from '../redux/slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../redux/slices/ordersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaShieldAlt, FaChevronRight, FaCheckCircle, FaTruck, FaClock } from 'react-icons/fa';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdate, error: errorUpdate, isSuccess }] = useProfileMutation();
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Security keys do not match');
    } else {
      try {
        const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        setMessage('');
        setPassword('');
        setConfirmPassword('');
        alert('Credentials updated');
      } catch (err) {}
    }
  };

  const tabs = [
    { id: 'profile', name: 'Identity', icon: <FaUser size={12}/> },
    { id: 'orders', name: 'Order Logs', icon: <FaShoppingBag size={12}/> },
    { id: 'addresses', name: 'Locations', icon: <FaMapMarkerAlt size={12}/> },
  ];

  return (
    <div className="pt-24 pb-20 animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
      <div className="main-container">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Dashboard Sidebar */}
          <div className="lg:w-64 shrink-0 space-y-8">
             <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-emerald-500/20">
                   {name.charAt(0)}
                </div>
                <div>
                   <h2 className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">{name}</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Member</p>
                </div>
             </div>

             <nav className="space-y-1">
                {tabs.map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
                   >
                      {tab.icon}
                      {tab.name}
                   </button>
                ))}
             </nav>
          </div>

          {/* Core Content Shell */}
          <div className="flex-grow">
             {activeTab === 'profile' && (
                <div className="animate-fade-in max-w-2xl">
                   <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Identity Management</h2>
                   
                   {message && <Message variant="red">{message}</Message>}
                   {errorUpdate && <Message variant="red">{errorUpdate?.data?.message}</Message>}
                   {isSuccess && <Message variant="green">Profile Synchronized</Message>}

                   <form onSubmit={submitHandler} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input 
                              type="text" 
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                              value={name}
                              onChange={e => setName(e.target.value)}
                            />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Source</label>
                            <input 
                              type="email" 
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                            />
                         </div>
                      </div>

                      <div className="pt-4 space-y-4">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 border-b border-emerald-500/10 pb-2">Security Override</h3>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Access Key</label>
                               <input 
                                 type="password" 
                                 placeholder="••••••••"
                                 className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white tracking-widest"
                                 value={password}
                                 onChange={e => setPassword(e.target.value)}
                               />
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verify Access Key</label>
                               <input 
                                 type="password" 
                                 placeholder="••••••••"
                                 className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white tracking-widest"
                                 value={confirmPassword}
                                 onChange={e => setConfirmPassword(e.target.value)}
                               />
                            </div>
                         </div>
                      </div>

                      <button type="submit" disabled={loadingUpdate} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-12 px-10 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4">
                         {loadingUpdate ? 'Syncing...' : 'Update Credentials'}
                      </button>
                   </form>
                </div>
             )}

             {activeTab === 'orders' && (
                <div className="animate-fade-in">
                   <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Order Logs</h2>
                   {loadingOrders ? <Loader /> : errorOrders ? <Message variant="red">{errorOrders?.data?.message}</Message> : (
                      <div className="rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden">
                         <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                               <tr>
                                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descriptor</th>
                                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Value</th>
                                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                  <th className="p-4"></th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                               {orders.map(order => (
                                  <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                     <td className="p-4 text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">#{order._id.slice(-8)}</td>
                                     <td className="p-4 text-[11px] font-bold text-slate-400">{order.createdAt.substring(0, 10)}</td>
                                     <td className="p-4 text-[11px] font-black text-slate-900 dark:text-white">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                     <td className="p-4">
                                        {order.isPaid ? (
                                           <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded uppercase tracking-widest">Authorized</span>
                                        ) : (
                                           <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded uppercase tracking-widest">Pending</span>
                                        )}
                                     </td>
                                     <td className="p-4 text-right">
                                        <Link to={`/order/${order._id}`} className="text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:underline">Inspect</Link>
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   )}
                </div>
             )}

             {activeTab === 'addresses' && (
                <div className="animate-fade-in max-w-2xl">
                   <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Saved Locations</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userInfo.addresses?.map((addr, i) => (
                         <div key={i} className="p-5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex flex-col gap-2">
                            <span className="text-[9px] font-black bg-emerald-500 text-white w-fit px-2 py-0.5 rounded shadow-sm">TAG #{i+1}</span>
                            <p className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight">{addr.address}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{addr.city}, {addr.postalCode}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{addr.country}</p>
                         </div>
                      ))}
                      {(!userInfo.addresses || userInfo.addresses.length === 0) && (
                         <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No primary locations established</p>
                         </div>
                      )}
                   </div>
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
