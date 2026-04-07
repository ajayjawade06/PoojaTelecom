import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { useProfileMutation } from '../redux/slices/usersApiSlice';
import { FaMapMarkerAlt, FaHistory, FaCheckCircle, FaArrowRight, FaCrosshairs, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');
  const [geoLoading, setGeoLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updateProfile] = useProfileMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country, phone }));
    
    if (userInfo) {
      try {
        const updatedUser = await updateProfile({
          _id: userInfo._id,
          name: userInfo.name,
          email: userInfo.email,
          phoneNumber: phone,
          address: { address, city, postalCode, country, phoneNumber: phone }
        }).unwrap();
        dispatch(setCredentials({ ...updatedUser }));
      } catch (err) {
        console.warn('Could not save address to profile:', err);
      }
    }
    navigate('/placeorder');
  };

  const autofillSavedAddress = (saved) => {
    setAddress(saved.address);
    setCity(saved.city);
    setPostalCode(saved.postalCode);
    setCountry(saved.country);
    if (saved.phoneNumber) setPhone(saved.phoneNumber);
  };

  const getLocationHandler = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data.address) {
            setAddress(data.address.road || data.address.suburb || data.display_name.split(',')[0]);
            setCity(data.address.city || data.address.town || data.address.village || data.address.state_district || '');
            setPostalCode(data.address.postcode || '');
            setCountry(data.address.country || '');
          }
        } catch (error) {
          alert('Location detection failed');
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setGeoLoading(false);
        alert('Permission denied');
      }
    );
  };

  return (
    <div className="pt-24 pb-16 bg-[#f5f5f7] dark:bg-black min-h-screen relative z-0">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
      <CheckoutSteps step1 step2 />
      
      <motion.div 
        initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12"
      >
        {/* Left Column: Form */}
        <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } }} className="lg:col-span-7 bg-white dark:bg-[#1c1c1e] rounded-[32px] border border-slate-100 dark:border-white/5 p-8 shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/cart')}
                className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm"
              >
                <FaArrowLeft size={12} />
              </button>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-500" size={18} /> Shipping Detail
              </h1>
            </div>
            <button 
              onClick={getLocationHandler}
              disabled={geoLoading}
              className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <FaCrosshairs size={10} /> {geoLoading ? 'Detecting...' : 'Autofill'}
            </button>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
              <input 
                type="text" 
                placeholder="Locality, Building" 
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3.5 px-5 rounded-2xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                <input 
                  type="text" 
                  placeholder="Mumbai" 
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3.5 px-5 rounded-2xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Postal Code</label>
                <input 
                  type="text" 
                  placeholder="400001" 
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3.5 px-5 rounded-2xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white"
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
              <input 
                type="text" 
                placeholder="India" 
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3.5 px-5 rounded-2xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white"
                value={country}
                onChange={e => setCountry(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                type="text" 
                placeholder="0987654321" 
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3.5 px-5 rounded-2xl text-xs font-bold outline-none focus:border-blue-500/30 dark:text-white"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-500 text-white font-black h-14 rounded-full text-[12px] uppercase tracking-widest shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-10 hover:bg-blue-600"
            >
              <span className="relative z-10 flex items-center gap-2">Continue to Payment <FaArrowRight size={12} /></span>
            </button>
          </form>
        </motion.div>

        {/* Right Column: Saved Addresses */}
        <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring' } } }} className="lg:col-span-5 h-full">
          <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-200/50 dark:border-white/5 p-8 shadow-inner h-full flex flex-col">
            {userInfo?.addresses?.length > 0 ? (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <FaHistory className="text-slate-400" size={16}/>
                  <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">Saved Addresses</h2>
                </div>
                <div className="space-y-4">
                  {userInfo.addresses.map((addr, i) => (
                    <button 
                      key={i}
                      onClick={() => autofillSavedAddress(addr)}
                      className="w-full bg-white dark:bg-[#1c1c1e] p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 hover:border-blue-500 focus:border-blue-500 flex items-center justify-between text-left group transition-all shadow-sm hover:shadow-md"
                    >
                      <div>
                        <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate max-w-[220px] leading-tight">{addr.address}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{addr.city}, {addr.postalCode}</p>
                        <p className="text-[10px] font-bold text-slate-500 mt-1">{addr.country}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-black/30 flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                        <FaArrowRight size={10}/>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow text-center opacity-60">
                <FaMapMarkerAlt className="text-slate-300 mb-4" size={32} />
                <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">No Saved Addresses</p>
                <p className="text-[13px] font-medium text-slate-500 mt-2 max-w-[200px]">Fill out the form to save your first shipping address automatically.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
    </div>
  );
};

export default ShippingPage;
