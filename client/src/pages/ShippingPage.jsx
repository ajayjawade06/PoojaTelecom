import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { useProfileMutation } from '../redux/slices/usersApiSlice';
import Loader from '../components/Loader';
import { FaMapMarkerAlt, FaHistory, FaCheckCircle } from 'react-icons/fa';

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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Shipping Details</h1>

      {/* Saved Addresses feature */}
      {userInfo && userInfo.addresses && userInfo.addresses.length > 0 && (
        <div className="mb-8">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><FaHistory /> Saved Addresses</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {userInfo.addresses.map((addr, idx) => (
               <div 
                 key={idx} 
                 onClick={() => autofillSavedAddress(addr)}
                 className="p-4 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors relative group"
               >
                 <div className="font-bold text-slate-800 text-sm mb-1">{addr.address}</div>
                 <div className="text-xs text-slate-500">{addr.city}, {addr.postalCode}</div>
                 <div className="text-xs text-slate-500">{addr.country}</div>
                 
                 <div className="absolute top-2 right-2 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCheckCircle />
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
         className="w-full mb-8 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
         <FaMapMarkerAlt /> {geoLoading ? 'Detecting Location...' : 'Use My Current Location'}
      </button>

      <div className="relative flex py-5 items-center">
         <div className="flex-grow border-t border-gray-200"></div>
         <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">Or enter manually</span>
         <div className="flex-grow border-t border-gray-200"></div>
      </div>
      
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Street Address</label>
          <input
            type="text"
            placeholder="e.g. 123 Main St, Apartment 4B"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-slate-700"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
          <input
            type="text"
            placeholder="Enter city"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-slate-700"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Postal Code</label>
          <input
            type="text"
            placeholder="Enter ZIP/Postal code"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-slate-700"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
          <input
            type="text"
            placeholder="Enter country"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-slate-700"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
        >
          Save & Continue to Payment
        </button>
      </form>
    </FormContainer>
  );
};
export default ShippingPage;
