import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaStar, FaBolt, FaCheckCircle, FaShoppingCart, FaEye } from 'react-icons/fa';
import { addToCart } from '../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, qty: 1 }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden flex flex-col h-full group transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none relative">
      
      {/* Badge Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.countInStock === 0 ? (
          <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
            Sold Out
          </span>
        ) : (
          <>
            {product.price > 50000 && (
              <span className="bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-900 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                Premium
              </span>
            )}
            {product.rating >= 4.5 && (
              <span className="bg-amber-400 text-slate-900 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                <FaStar size={8} /> Best Rated
              </span>
            )}
          </>
        )}
      </div>

      {/* Image Section */}
      <div className="relative aspect-[4/5] bg-slate-50 dark:bg-slate-950/50 overflow-hidden flex items-center justify-center p-6 group-hover:bg-slate-100 dark:group-hover:bg-slate-950 transition-colors duration-300">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Quick Add Floating Button */}
        <button 
          onClick={addToCartHandler}
          disabled={product.countInStock === 0}
          className="absolute bottom-4 right-4 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-emerald-600 active:scale-90 disabled:hidden"
        >
          <FaShoppingCart size={14} />
        </button>
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.brand}</span>
          <div className="flex items-center gap-1 text-slate-400">
            <FaStar className="text-amber-400" size={10} />
            <span className="text-[11px] font-bold">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product._id}`} className="mb-3 block">
          <h3 className="text-[13px] font-bold text-slate-800 dark:text-white line-clamp-2 leading-tight hover:text-emerald-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-black text-slate-900 dark:text-emerald-400">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.price > 10000 && (
            <span className="text-[11px] text-slate-400 line-through font-medium">
              ₹{(product.price * 1.25).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
