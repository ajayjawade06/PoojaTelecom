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
    { id: 'profile', name: 'Account Settings', icon: <FaUser /> },
    { id: 'orders', name: 'My Orders', icon: <FaShoppingBag /> },
    { id: 'addresses', name: 'Saved Addresses', icon: <FaMapMarkerAlt /> },
    { id: 'payments', name: 'Payments', icon: <FaShieldAlt /> },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky top-32">
            <div className="p-8 text-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div className="w-20 h-20 bg-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-black shadow-lg shadow-emerald-500/30">
                {name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">{name}</h2>
              <p className="text-slate-400 text-xs font-medium mt-1">{email}</p>
            </div>
            
            <nav className="p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-emerald-50 text-emerald-600 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={activeTab === tab.id ? 'text-emerald-500' : 'text-slate-400'}>{tab.icon}</span>
                    {tab.name}
                  </div>
                  <FaChevronRight className={`text-[10px] opacity-30 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><FaShieldAlt /></div>
                <h2 className="text-2xl font-black text-slate-900">Security & Profile</h2>
              </div>

              {message && <Message variant="red">{message}</Message>}
              {errorUpdate && <Message variant="red">{errorUpdate?.data?.message || errorUpdate.error}</Message>}
              {isSuccess && <Message variant="green">Your profile has been updated!</Message>}

              <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-bold text-slate-700 placeholder-slate-300"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-bold text-slate-700 placeholder-slate-300"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                  <p className="text-xs font-bold text-slate-500 mb-4 italic opacity-75">Leave password fields blank if you don't want to change it.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                      <input
                        type="password"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-bold text-slate-700"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
                      <input
                        type="password"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-bold text-slate-700"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
                >
                  {loadingUpdate ? 'Updating Profile...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><FaShoppingBag /></div>
                <h2 className="text-2xl font-black text-slate-900">Purchase History</h2>
              </div>

              {loadingOrders ? (
                <Loader />
              ) : errorOrders ? (
                <Message variant="red">{errorOrders?.data?.message || errorOrders.error}</Message>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                  <div className="text-6xl text-slate-200 mb-4 flex justify-center"><FaShoppingBag /></div>
                  <h3 className="text-xl font-bold text-slate-600 mb-2">No orders yet</h3>
                  <p className="text-slate-400 mb-6">Looks like you haven't made any purchases.</p>
                  <Link to="/" className="inline-block bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors">Start Shopping</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="px-4 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                        <th className="px-4 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-4 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Paid</th>
                        <th className="px-4 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Delivered</th>
                        <th className="px-4 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="px-4 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-4 py-5 font-mono text-[10px] text-slate-500">#{order._id.slice(-8).toUpperCase()}</td>
                          <td className="px-4 py-5 text-sm font-bold text-slate-700">{order.createdAt.substring(0, 10)}</td>
                          <td className="px-4 py-5 text-center">
                            {order.isPaid ? (
                              <div className="flex flex-col items-center">
                                <FaCheckCircle className="text-emerald-500 mb-1" />
                                <span className="text-[10px] font-bold text-emerald-600 uppercase">{order.paidAt.substring(0, 10)}</span>
                              </div>
                            ) : <span className="text-xs font-bold text-slate-300">Pending</span>}
                          </td>
                          <td className="px-4 py-5 text-center">
                            {order.isDelivered ? (
                               <div className="flex flex-col items-center">
                                  <FaTruck className="text-emerald-500 mb-1" />
                                  <span className="text-[10px] font-bold text-emerald-600 uppercase">{order.deliveredAt.substring(0, 10)}</span>
                               </div>
                            ) : <span className="text-xs font-bold text-slate-300">In Transit</span>}
                          </td>
                          <td className="px-4 py-5 font-black text-slate-900">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-5 text-right">
                            <Link to={`/order/${order._id}`}>
                              <button className="bg-white border border-slate-200 text-slate-600 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 px-4 py-2 rounded-xl text-xs font-black transition-all">Details</button>
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
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><FaMapMarkerAlt /></div>
                  <h2 className="text-2xl font-black text-slate-900">Saved Addresses</h2>
                </div>
                {!isAddingAddress && (
                  <button 
                    onClick={() => setIsAddingAddress(true)}
                    className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-100 transition-colors"
                  >
                    Add New
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 animate-slide-down">
                   <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">New Shipping Address</h3>
                   <form onSubmit={addAddressHandler} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Street Address"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="City"
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Postal Code"
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          required
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Country"
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        required
                      />
                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-grow bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/20">Save Address</button>
                        <button type="button" onClick={() => setIsAddingAddress(false)} className="px-6 bg-slate-200 text-slate-600 font-black py-4 rounded-2xl">Cancel</button>
                      </div>
                   </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userInfo.addresses && userInfo.addresses.length > 0 ? (
                   userInfo.addresses.map((addr, idx) => (
                     <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors group relative">
                        <div className="absolute top-4 right-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                           <FaCheckCircle />
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Address #{idx + 1}</p>
                        <p className="text-slate-800 font-bold leading-relaxed">{addr.address}</p>
                        <p className="text-slate-500 text-sm font-medium">{addr.city}, {addr.postalCode}</p>
                        <p className="text-slate-500 text-sm font-medium">{addr.country}</p>
                     </div>
                   ))
                ) : (
                  <div className="col-span-2 text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-bold">No saved addresses found.</p>
                    <p className="text-slate-300 text-xs mt-1">Add one to speed up your checkout!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 animate-fade-in text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/10">
                <FaShieldAlt />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Secure Payments</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">Your payment methods are securely encrypted and managed by **Razorpay PCI-DSS compliant servers**.</p>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 border-dashed inline-block text-left">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center text-[10px] font-black text-slate-400">VISA</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Saved Cards</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Managed by Razorpay</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">For your security, Pooja Telecom does not store your full card details. You can manage saved cards during your next checkout.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
