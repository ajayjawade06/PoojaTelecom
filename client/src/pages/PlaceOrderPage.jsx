import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../redux/slices/ordersApiSlice';
import { clearCartItems, savePaymentMethod } from '../redux/slices/cartSlice';
import { FaMapMarkerAlt, FaShieldAlt, FaLock, FaCreditCard, FaWallet } from 'react-icons/fa';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // Logic fix: guard both address AND navigate to shipping if missing
  useEffect(() => {
    if (!cart.shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [cart.shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod || 'Razorpay',
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      // shown by error state
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: details */}
        <div className="lg:col-span-8 space-y-5">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-500" /> Delivery Address
              </h2>
              <Link to="/shipping" className="text-sm text-emerald-600 font-bold hover:underline">
                Change
              </Link>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-slate-700 leading-relaxed font-medium">
              {cart.shippingAddress.address},<br />
              {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},<br />
              {cart.shippingAddress.country}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <FaCreditCard className="text-emerald-500" /> Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${cart.paymentMethod === 'Credit Card' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="Credit Card" 
                  checked={cart.paymentMethod === 'Credit Card'} 
                  onChange={(e) => dispatch(savePaymentMethod(e.target.value))}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                   <div className="font-bold text-slate-800">Credit Card</div>
                   <div className="text-xs text-slate-500 mt-0.5">Demo predefined card</div>
                </div>
              </label>

              <label className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${cart.paymentMethod === 'Razorpay' || !cart.paymentMethod ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="Razorpay" 
                  checked={cart.paymentMethod === 'Razorpay' || !cart.paymentMethod} 
                  onChange={(e) => dispatch(savePaymentMethod(e.target.value))}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                   <div className="font-bold text-slate-800">Razorpay</div>
                   <div className="text-xs text-slate-500 mt-0.5">UPI, Cards, NetBanking</div>
                </div>
              </label>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-extrabold text-slate-900 mb-5">
              Order Items ({cart.cartItems.reduce((a, c) => a + c.qty, 0)})
            </h2>
            {cart.cartItems.length === 0 ? (
              <Message variant="blue">Your cart is empty</Message>
            ) : (
              <div className="divide-y divide-gray-100">
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl border border-gray-100 p-1.5 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <Link to={`/product/${item._id}`} className="flex-grow text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-slate-400 font-medium">{item.qty} × ₹{item.price.toLocaleString('en-IN')}</div>
                      <div className="font-extrabold text-slate-900 text-base">
                        ₹{(item.qty * item.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-28">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6 pb-4 border-b border-gray-100">Price Details</h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-slate-600">
                <span>MRP Total</span>
                <span className="font-semibold text-slate-900">₹{cart.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className={`font-semibold ${cart.shippingPrice == 0 ? 'text-emerald-500' : 'text-slate-900'}`}>
                  {cart.shippingPrice == 0 ? 'FREE' : `₹${cart.shippingPrice}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-200 mb-6">
              <span className="font-extrabold text-slate-900 text-lg">Total Amount</span>
              <span className="text-2xl font-extrabold text-slate-900">₹{cart.totalPrice}</span>
            </div>

            {error && (
              <Message variant="red">{error?.data?.message || 'Failed to create order'}</Message>
            )}

            <button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 disabled:opacity-50 active:scale-[0.98] mb-4"
              disabled={cart.cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
            >
              {isLoading ? 'Placing Order...' : '🔒 Place Order'}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <FaLock size={10} />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaceOrderPage;
