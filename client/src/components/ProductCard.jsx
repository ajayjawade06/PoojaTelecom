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
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden flex flex-col h-full group relative hover:-translate-y-3 ring-1 ring-slate-900/5">
      
      {/* Dynamic Status Badges */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
         {product.countInStock === 0 ? (
           <span className="bg-slate-900/90 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest backdrop-blur-md border border-white/10 shadow-lg">
             Out of Stock
           </span>
         ) : (
           <>
             {product.price > 50000 && (
               <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl shadow-emerald-500/30 border border-emerald-400">
                 Best Seller
               </span>
             )}
             <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-1.5 shadow-xl shadow-amber-400/20 border border-amber-300">
               <FaBolt className="animate-pulse" /> Trending
             </span>
           </>
         )}
      </div>

      {/* Image Container with Hover Actions */}
      <div className="relative h-72 overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-12 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors duration-700">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <Link to={`/product/${product._id}`} className="block w-full h-full z-10">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl"
          />
        </Link>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-20">
           <button 
             onClick={addToCartHandler}
             disabled={product.countInStock === 0}
             className="w-12 h-12 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-emerald-500 hover:text-white transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
             title="Add to Cart"
           >
              <FaShoppingCart size={18} className="group-hover/btn:animate-bounce" />
           </button>
           <button 
             onClick={() => navigate(`/product/${product._id}`)}
             className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-emerald-600 transition-all active:scale-90"
             title="Quick View"
           >
              <FaEye size={18} />
           </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-8 flex-grow flex flex-col bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-white/5 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-white/5">
            {product.brand}
          </span>
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-100/50 dark:border-emerald-500/20">
             <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs">{product.rating}</span>
             <FaStar className="text-emerald-500 text-[10px]" />
          </div>
        </div>
        
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-black text-slate-800 dark:text-gray-100 mb-4 line-clamp-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 line-through font-bold">₹{(product.price * 1.2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg font-black uppercase">20% Off</span>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-slate-50 dark:border-white/5 mt-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <FaCheckCircle className="text-emerald-500" />
                <span>Free Express Delivery</span>
             </div>
          </div>
        </div>
      </div>

      {/* Trust Badge Overlay */}
      {product.price > 80000 && (
         <div className="absolute bottom-8 right-8 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
            <FaCheckCircle className="text-8xl text-emerald-500" />
         </div>
      )}
    </div>
  );
};

export default ProductCard;
