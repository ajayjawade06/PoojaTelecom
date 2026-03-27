import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { useProfileMutation } from '../redux/slices/usersApiSlice';
import { FaMapMarkerAlt, FaHistory, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

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
    
    // Save address to user profile historically
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
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse Geocoding with OpenStreetMap Nominatim API 
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          if (data.address) {
            setAddress(data.address.road || data.address.suburb || data.display_name.split(',')[0]);
            setCity(data.address.city || data.address.town || data.address.village || data.address.state_district || '');
            setPostalCode(data.address.postcode || '');
            setCountry(data.address.country || '');
          }
        } catch (error) {
          alert('Failed to detect exact address from coordinates. ' + error.message);
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        alert('Permission denied or location unavailable.');
      }
    );
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1 className="text-4xl font-black mb-8 text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
        <FaMapMarkerAlt className="text-emerald-500" /> Shipping Details
      </h1>

      {/* Saved Addresses feature */}
      {userInfo && userInfo.addresses && userInfo.addresses.length > 0 && (
        <div className="mb-10">
           <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FaHistory className="text-slate-400 dark:text-slate-500" /> Saved Addresses</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {userInfo.addresses.map((addr, idx) => (
               <div 
                 key={idx} 
                 onClick={() => autofillSavedAddress(addr)}
                 className="p-5 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 rounded-2xl cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all relative group shadow-md dark:shadow-xl shadow-black/10 dark:shadow-black/20"
               >
                 <div className="font-black text-slate-900 dark:text-white text-sm mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{addr.address}</div>
                 <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{addr.city}, {addr.postalCode}</div>
                 <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">{addr.country}</div>
                 
                 <div className="absolute top-4 right-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100">
                    <FaCheckCircle size={20} />
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
      
      {/* Geolocation Autodetect */}
      <button 
         type="button" 
         onClick={getLocationHandler}
         disabled={geoLoading}
         className="w-full mb-10 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-black py-4 rounded-2xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest text-[10px]"
      >
         <FaMapMarkerAlt size={14} /> {geoLoading ? 'Locating...' : 'Auto-Detect Location'}
      </button>

      <div className="relative flex py-5 items-center mb-6">
         <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
         <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Or enter manually</span>
         <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
      </div>
      
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="group">
          <label className="block text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-2 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">Street Address</label>
          <input
            type="text"
            placeholder="Area 51, Block B"
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:bg-slate-50 dark:focus:bg-white/10 focus:border-emerald-500/50 text-slate-900 dark:text-white font-medium transition-all outline-none placeholder-slate-400 dark:placeholder-slate-600 ring-4 ring-transparent focus:ring-emerald-500/10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-2 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">City</label>
            <input
              type="text"
              placeholder="Mumbai"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:bg-slate-50 dark:focus:bg-white/10 focus:border-emerald-500/50 text-slate-900 dark:text-white font-medium transition-all outline-none placeholder-slate-400 dark:placeholder-slate-600 ring-4 ring-transparent focus:ring-emerald-500/10"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="group">
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-2 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">Postal Code</label>
            <input
              type="text"
              placeholder="400001"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:bg-slate-50 dark:focus:bg-white/10 focus:border-emerald-500/50 text-slate-900 dark:text-white font-medium transition-all outline-none placeholder-slate-400 dark:placeholder-slate-600 ring-4 ring-transparent focus:ring-emerald-500/10"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="group pb-4">
          <label className="block text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-2 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">Country</label>
          <input
            type="text"
            placeholder="India"
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:bg-slate-50 dark:focus:bg-white/10 focus:border-emerald-500/50 text-slate-900 dark:text-white font-medium transition-all outline-none placeholder-slate-400 dark:placeholder-slate-600 ring-4 ring-transparent focus:ring-emerald-500/10"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full relative overflow-hidden group bg-emerald-500 hover:bg-emerald-400 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-[0.98] mt-8 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          Continue to Payment <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </FormContainer>
  );
};
export default ShippingPage;
