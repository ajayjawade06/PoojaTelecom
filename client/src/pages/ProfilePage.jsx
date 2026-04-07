import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation, useDeleteProfileMutation } from '../redux/slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../redux/slices/ordersApiSlice';
import { setCredentials, logout } from '../redux/slices/authSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaShieldAlt, FaChevronRight, FaCheckCircle, FaTruck, FaClock, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } } };

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
  const [deleteProfile, { isLoading: loadingDelete }] = useDeleteProfileMutation();
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

  const deleteHandler = async () => {
    if (window.confirm('Are you absolutely sure? This will permanently delete your account and all associated data. This action cannot be undone.')) {
      try {
        await deleteProfile().unwrap();
        dispatch(logout());
        alert('Your account has been successfully deleted.');
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

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
        alert('Profile updated');
      } catch (err) {}
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <FaUser size={12}/> },
    { id: 'orders', name: 'Orders', icon: <FaShoppingBag size={12}/> },
    { id: 'addresses', name: 'Addresses', icon: <FaMapMarkerAlt size={12}/> },
  ];

  return (
    <div className="pt-28 pb-20 bg-white dark:bg-slate-950 min-h-screen relative overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="main-container relative z-10">
        <motion.div 
          initial="hidden" animate="visible" variants={containerVariants}
          className="flex flex-col lg:flex-row gap-12"
        >
          
          {/* Dashboard Sidebar */}
          <motion.div variants={itemVariants} className="lg:w-64 shrink-0 space-y-8">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/20">
                {name.charAt(0)}
              </div>
              <div>
                <h2 className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">{name}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</p>
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
          </motion.div>

          {/* Core Content Shell */}
          <motion.div variants={itemVariants} className="flex-grow">
            {activeTab === 'profile' && (
              <motion.div initial="hidden" animate="visible" variants={containerVariants} className=" max-w-2xl">
                <motion.h2 variants={itemVariants} className="text-xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Profile Settings</motion.h2>
                
                {message && <Message variant="red">{message}</Message>}
                {errorUpdate && <Message variant="red">{errorUpdate?.data?.message}</Message>}
                {isSuccess && <Message variant="green">Profile Updated</Message>}

                <motion.form variants={itemVariants} onSubmit={submitHandler} className="space-y-6 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-[24px] p-8 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 border-b border-blue-500/10 pb-2">Update Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white tracking-widest"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white tracking-widest"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loadingUpdate} className="w-full md:w-auto bg-slate-950 dark:bg-white text-white dark:text-slate-950 h-12 px-10 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all mt-4 relative overflow-hidden group/btn z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-200"></div>
                    <span className="relative z-10">{loadingUpdate ? 'Updating...' : 'Save Changes'}</span>
                  </button>
                </motion.form>

                {/* Danger Zone */}
                {!userInfo.isAdmin && (
                  <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                    <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 rounded-[24px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/10 transition-colors"></div>
                      
                      <div className="relative z-10 flex items-start gap-4 text-center md:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                          <FaExclamationTriangle size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">Account Termination</h3>
                          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">Permanent deletion of your platform identity, order history, and saved credentials. This cannot be reversed.</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={deleteHandler} 
                        disabled={loadingDelete}
                        className="relative z-10 bg-rose-600 hover:bg-rose-700 text-white px-8 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50 flex items-center gap-3"
                      >
                        {loadingDelete ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <FaTrashAlt size={10} />
                        )}
                        Delete Account
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.h2 variants={itemVariants} className="text-xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Order History</motion.h2>
                {loadingOrders ? <Loader /> : errorOrders ? <Message variant="red">{errorOrders?.data?.message}</Message> : (
                  <motion.div variants={itemVariants} className="rounded-[24px] border border-slate-200/50 dark:border-white/10 overflow-hidden bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/10">
                        <tr>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="p-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {orders.map(order => (
                          <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="p-4 text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">#{order._id.slice(-8)}</td>
                            <td className="p-4 text-[11px] font-bold text-slate-400">{order.createdAt.substring(0, 10)}</td>
                            <td className="p-4 text-[11px] font-black text-slate-900 dark:text-white">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                            <td className="p-4">
                              {order.isCancelled ? (
                                <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded uppercase tracking-widest border border-rose-500/20">Cancelled</span>
                              ) : order.isDelivered ? (
                                <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-widest border border-blue-500/20">Delivered</span>
                              ) : order.isShipped ? (
                                <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded uppercase tracking-widest border border-amber-500/20">Shipped</span>
                              ) : order.isPaid ? (
                                <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-widest border border-blue-500/20">Paid</span>
                              ) : (
                                <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded uppercase tracking-widest border border-rose-500/20">Unpaid</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <Link to={`/order/${order._id}`} className="text-blue-500 font-black text-[10px] uppercase tracking-widest group-hover:underline flex items-center justify-end gap-1">Details <FaChevronRight size={8}/></Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div initial="hidden" animate="visible" variants={containerVariants} className=" max-w-2xl">
                <motion.h2 variants={itemVariants} className="text-xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">My Addresses</motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userInfo.addresses?.map((addr, i) => (
                    <motion.div variants={itemVariants} key={i} className="p-6 rounded-[24px] border border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg flex flex-col gap-2 transition-all">
                      <span className="text-[9px] font-black bg-blue-500 text-white w-fit px-2 py-0.5 rounded shadow-sm">Address #{i+1}</span>
                      <p className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight mt-2">{addr.address}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{addr.city}, {addr.postalCode}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{addr.country}</p>
                    </motion.div>
                  ))}
                  {(!userInfo.addresses || userInfo.addresses.length === 0) && (
                    <motion.div variants={itemVariants} className="col-span-full py-12 text-center bg-white/50 dark:bg-white/5 rounded-[24px] border border-dashed border-slate-200/50 dark:border-white/10 backdrop-blur-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No addresses saved</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
