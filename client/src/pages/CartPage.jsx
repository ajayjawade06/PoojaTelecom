import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const removeFromCartHandler = (id) => dispatch(removeFromCart(id));

  // BUG FIX: if already logged in go directly to shipping, else send to login first
  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  };

  const totalItems = cartItems.reduce((a, c) => a + c.qty, 0);
  const totalPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
        <FaShoppingBag className="text-emerald-500" />
        Shopping Cart
        {cartItems.length > 0 && (
          <span className="text-base font-semibold text-slate-500">({totalItems} item{totalItems > 1 ? 's' : ''})</span>
        )}
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link
            to="/"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-emerald-500/30"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center p-5 gap-5 hover:bg-slate-50 transition-colors group">
                  <Link to={`/product/${item._id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden border border-gray-100 p-2 group-hover:shadow-md transition-shadow">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                  </Link>

                  <div className="flex-grow min-w-0">
                    <Link to={`/product/${item._id}`} className="text-base font-bold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                      {item.name}
                    </Link>
                    <div className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">{item.brand}</div>
                    <div className="text-emerald-600 font-extrabold text-lg mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity - simple +/- buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => item.qty > 1 && dispatch(addToCart({ ...item, qty: item.qty - 1 }))}
                      disabled={item.qty <= 1}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-30 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-slate-800 text-base">{item.qty}</span>
                    <button
                      onClick={() => item.qty < item.countInStock && dispatch(addToCart({ ...item, qty: item.qty + 1 }))}
                      disabled={item.qty >= item.countInStock}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-30 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <div className="font-extrabold text-slate-900 text-lg">
                      ₹{(item.qty * item.price).toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => removeFromCartHandler(item._id)}
                      className="mt-2 text-rose-400 hover:text-rose-600 transition-colors text-xs font-medium flex items-center gap-1 ml-auto"
                    >
                      <FaTrash size={10} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/" className="inline-block mt-4 text-slate-500 hover:text-emerald-600 font-medium text-sm transition-colors">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-28">
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                  <span className="font-semibold text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-emerald-500">
                    {totalPrice > 500 ? 'FREE' : '₹49'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-6">
                <span className="font-extrabold text-slate-900 text-lg">Total</span>
                <span className="text-2xl font-extrabold text-slate-900">
                  ₹{(totalPrice > 500 ? totalPrice : totalPrice + 49).toLocaleString('en-IN')}
                </span>
              </div>

              {totalPrice > 500 && (
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2.5 rounded-xl mb-4 flex items-center gap-2 border border-emerald-100">
                  🎉 You qualify for FREE delivery!
                </div>
              )}

              <button
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-[0.98]"
                onClick={checkoutHandler}
              >
                Proceed to Checkout <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CartPage;
