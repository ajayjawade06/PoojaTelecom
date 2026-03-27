import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation } from '../redux/slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../redux/slices/ordersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { 
  FaUser, 
  FaShoppingBag, 
  FaMapMarkerAlt, 
  FaSignOutAlt, 
  FaShieldAlt, 
  FaChevronRight,
  FaClock,
  FaCheckCircle,
  FaTruck
} from 'react-icons/fa';

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
      setMessage('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        setMessage('');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        // Handled by errorUpdate
      }
    }
  };

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: '', city: '', postalCode: '', country: '' });

  const addAddressHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        address: newAddress,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      setIsAddingAddress(false);
      setNewAddress({ address: '', city: '', postalCode: '', country: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <FaUser /> },
    { id: 'orders', name: 'Orders', icon: <FaShoppingBag /> },
    { id: 'addresses', name: 'Addresses', icon: <FaMapMarkerAlt /> },
    { id: 'payments', name: 'Payments', icon: <FaShieldAlt /> },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl animate-fade-in relative z-10 w-full flex flex-col items-center">
      <div className="w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 relative">
          
          {/* Decorative Glow */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 border border-white/5 overflow-hidden sticky top-32 group">
              <div className="p-8 text-center bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-50"></div>
                
                <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl font-black text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] relative z-10 group-hover:scale-105 transition-transform duration-500">
                  {name.charAt(0).toUpperCase()}
                </div>
                
                <h2 className="text-xl font-black tracking-tight text-white relative z-10">{name}</h2>
                <div className="mt-2 inline-block px-3 py-1 bg-white/5 rounded-lg border border-white/5 relative z-10">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{email}</p>
                </div>
              </div>
              
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all ${
                      activeTab === tab.id 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-lg ${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`}>{tab.icon}</span>
                      {tab.name}
                    </div>
                    <FaChevronRight className={`text-[10px] opacity-50 transition-transform ${activeTab === tab.id ? 'rotate-90 text-white' : ''}`} />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-3/4">
            {activeTab === 'profile' && (
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 p-8 md:p-12 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-10 relative z-10">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30"><FaShieldAlt /></div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">Update Profile</h2>
                </div>

                {message && <Message variant="red">{message}</Message>}
                {errorUpdate && <Message variant="red">{errorUpdate?.data?.message || errorUpdate.error}</Message>}
                {isSuccess && <Message variant="green">Profile updated successfully.</Message>}

                <form onSubmit={submitHandler} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-emerald-400 transition-colors">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-6 py-5 bg-slate-950 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none font-bold text-white placeholder-slate-600 shadow-inner"
                        placeholder="Enter identification name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-emerald-400 transition-colors">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-6 py-5 bg-slate-950 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none font-bold text-white placeholder-slate-600 shadow-inner"
                        placeholder="Enter email channel"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6 bg-emerald-500/10 px-4 py-2 rounded-xl inline-block border border-emerald-500/20">Change Password</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3 group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-white transition-colors">New Password</label>
                        <input
                          type="password"
                          className="w-full px-6 py-5 bg-slate-950 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none font-bold text-white tracking-widest"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-3 group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-white transition-colors">Confirm Password</label>
                        <input
                          type="password"
                          className="w-full px-6 py-5 bg-slate-950 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none font-bold text-white tracking-widest"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-4 italic">Leave blank to keep your current password.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingUpdate}
                    className="relative overflow-hidden group bg-emerald-500 text-white font-black py-5 px-10 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-[10px]"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    {loadingUpdate ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 p-8 md:p-12 animate-fade-in">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30"><FaShoppingBag /></div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">Order History</h2>
                </div>

                {loadingOrders ? (
                  <Loader />
                ) : errorOrders ? (
                  <Message variant="red">{errorOrders?.data?.message || errorOrders.error}</Message>
                ) : orders.length === 0 ? (
                  <div className="text-center py-24 bg-slate-950 rounded-[2rem] border border-white/5 shadow-inner">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-slate-700 mx-auto mb-6">
                       <FaShoppingBag size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 tracking-tighter">No Orders Found</h3>
                    <p className="text-slate-500 mb-8 font-medium">You haven't placed any orders yet.</p>
                    <Link to="/" className="inline-flex relative overflow-hidden group bg-emerald-500 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-widest text-[10px]">
                       <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                       Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-slate-950 rounded-[2rem] border border-white/5">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Paid Status</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Delivered</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                          <th className="px-6 py-5"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-6 font-mono text-[10px] text-emerald-400/80 tracking-widest bg-emerald-500/5">#{order._id.slice(-8).toUpperCase()}</td>
                            <td className="px-6 py-6 text-sm font-bold text-slate-300">{order.createdAt.substring(0, 10)}</td>
                            <td className="px-6 py-6 text-center">
                              {order.isPaid ? (
                                <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                  <FaCheckCircle className="text-emerald-500" />
                                  <span className="text-[10px] font-black text-emerald-400 uppercase">{order.paidAt.substring(0, 10)}</span>
                                </div>
                              ) : <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">Pending</span>}
                            </td>
                            <td className="px-6 py-6 text-center">
                              {order.isDelivered ? (
                                 <div className="inline-flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
                                    <FaTruck className="text-blue-400" />
                                    <span className="text-[10px] font-black text-blue-400 uppercase">{order.deliveredAt.substring(0, 10)}</span>
                                 </div>
                              ) : <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">In Transit</span>}
                            </td>
                            <td className="px-6 py-6 font-black text-white text-right">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-6 text-right">
                              <Link to={`/order/${order._id}`}>
                                <button className="bg-white/5 border border-white/10 text-white hover:bg-emerald-500 hover:border-emerald-400 px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">Details</button>
                              </Link>
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
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 p-8 md:p-12 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30"><FaMapMarkerAlt /></div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Saved Addresses</h2>
                  </div>
                  {!isAddingAddress && (
                    <button 
                      onClick={() => setIsAddingAddress(true)}
                      className="px-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    >
                      Add New Address
                    </button>
                  )}
                </div>

                {isAddingAddress && (
                  <div className="mb-10 p-8 bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-inner relative z-10 animate-fade-in">
                     <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        New Address
                     </h3>
                     <form onSubmit={addAddressHandler} className="space-y-6">
                        <input
                          type="text"
                          placeholder="Street Address"
                          className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl focus:border-emerald-500/50 outline-none font-medium text-white placeholder-slate-600 transition-all focus:bg-white/10"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          required
                        />
                        <div className="grid grid-cols-2 gap-6">
                          <input
                            type="text"
                            placeholder="City"
                            className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl focus:border-emerald-500/50 outline-none font-medium text-white placeholder-slate-600 transition-all focus:bg-white/10"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Postal Code"
                            className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl focus:border-emerald-500/50 outline-none font-medium text-white placeholder-slate-600 transition-all focus:bg-white/10"
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                            required
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Country"
                          className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl focus:border-emerald-500/50 outline-none font-medium text-white placeholder-slate-600 transition-all focus:bg-white/10"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          required
                        />
                        <div className="flex gap-4 pt-4">
                          <button type="submit" className="flex-grow bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] uppercase tracking-widest text-[10px] transition-all">Save Address</button>
                          <button type="button" onClick={() => setIsAddingAddress(false)} className="px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white uppercase tracking-widest text-[10px] font-black py-4 rounded-2xl transition-all">Cancel</button>
                        </div>
                     </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {userInfo.addresses && userInfo.addresses.length > 0 ? (
                     userInfo.addresses.map((addr, idx) => (
                       <div key={idx} className="p-8 bg-slate-950 rounded-[2rem] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden shadow-inner cursor-default">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute top-6 right-6 text-emerald-500/20 group-hover:text-emerald-400 transition-colors text-2xl">
                             <FaCheckCircle />
                          </div>
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 inline-block bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">Address {idx + 1}</p>
                          <p className="text-white font-bold leading-relaxed">{addr.address}</p>
                          <p className="text-slate-400 text-sm font-medium mt-1">{addr.city}, {addr.postalCode}</p>
                          <p className="text-slate-500 text-sm font-medium">{addr.country}</p>
                       </div>
                     ))
                  ) : (
                    <div className="col-span-2 text-center py-20 bg-slate-950 rounded-[2rem] border border-white/5 border-dashed shadow-inner">
                      <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 mx-auto mb-4"><FaMapMarkerAlt size={24} /></div>
                      <p className="text-white font-black tracking-tight text-lg mb-2">No Saved Addresses</p>
                      <p className="text-slate-500 text-sm font-medium">Add an address for faster checkout.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 p-8 md:p-16 animate-fade-in text-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,transparent_50%)] pointer-events-none -z-10"></div>
                
                <div className="w-24 h-24 bg-blue-500/10 text-blue-400 rounded-3xl mx-auto mb-8 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(59,130,246,0.1)] border border-blue-500/20">
                  <FaShieldAlt />
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">PCI-DSS Secured Gateway</h2>
                <p className="text-slate-400 max-w-lg mx-auto mb-10 font-medium text-sm leading-relaxed">
                  Financial telemetrics are encrypted end-to-end via <span className="text-blue-400 font-bold">Razorpay Infrastructure</span>. Zero persistent storage of sensitive data occurs on local nodes.
                </p>
                
                <div className="bg-slate-950 p-8 rounded-[2rem] border border-white/5 inline-block text-left relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500 border border-white/5 tracking-widest shadow-inner">VISA</div>
                    <div>
                      <p className="text-sm font-black text-white">Encrypted Tokens</p>
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">Managed Externally</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
                    Tokenized payment credentials can be managed dynamically during active secure checkout sequences. Central database holds no raw matrices.
                  </p>
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
