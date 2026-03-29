import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { useProfileMutation } from '../redux/slices/usersApiSlice';
import { FaMapMarkerAlt, FaHistory, FaCheckCircle, FaArrowRight, FaCrosshairs } from 'react-icons/fa';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [geoLoading, setGeoLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updateProfile] = useProfileMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    
    if (userInfo) {
       try {
         const updatedUser = await updateProfile({
           _id: userInfo._id,
           name: userInfo.name,
           email: userInfo.email,
           address: { address, city, postalCode, country }
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
    <div className="pt-28 pb-20 animate-fade-in bg-white dark:bg-slate-950 min-h-screen relative overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-xl mx-auto px-6 relative z-10">
        <CheckoutSteps step1 step2 />
        
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] border border-slate-200/50 dark:border-white/10 p-10 shadow-2xl transition-all duration-500 hover:shadow-emerald-500/5">
          <div className="flex items-center justify-between mb-8">
             <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
               <FaMapMarkerAlt className="text-emerald-500" size={16} /> Shipping Address
             </h1>
             <button 
               onClick={getLocationHandler}
               disabled={geoLoading}
               className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
             >
               <FaCrosshairs size={10} /> {geoLoading ? 'Detecting...' : 'Autofill'}
             </button>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
               <input 
                 type="text" 
                 placeholder="Locality, Building" 
                 className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
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
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
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
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
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
                 className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                 value={country}
                 onChange={e => setCountry(e.target.value)}
                 required
               />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 h-14 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 mt-8 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center gap-3">Continue to Review <FaArrowRight size={10} /></span>
            </button>
          </form>

          {userInfo?.addresses?.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Select Saved Address</p>
               <div className="space-y-2">
                  {userInfo.addresses.map((addr, i) => (
                    <button 
                      key={i}
                      onClick={() => autofillSavedAddress(addr)}
                      className="w-full bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 flex items-center justify-between text-left group transition-all"
                    >
                       <div>
                          <p className="text-[12px] font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{addr.address}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{addr.city}, {addr.postalCode}</p>
                       </div>
                       <FaHistory className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={10}/>
                    </button>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
