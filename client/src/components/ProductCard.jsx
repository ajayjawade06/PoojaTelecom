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
    <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-white/5 shadow-lg dark:shadow-2xl hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden flex flex-col h-full group relative hover:-translate-y-2 hover:border-emerald-500/20 dark:hover:border-white/10">
      
      {/* Dynamic Status Badges */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
         {product.countInStock === 0 ? (
           <span className="bg-rose-500/20 text-rose-400 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest backdrop-blur-md border border-rose-500/30 shadow-lg shadow-rose-500/10">
             Out of Stock
           </span>
         ) : (
           <>
             {product.price > 50000 && (
               <span className="bg-emerald-500 text-slate-900 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl shadow-emerald-500/30 border border-emerald-400">
                 Premium
               </span>
             )}
             <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-1.5 shadow-xl shadow-indigo-500/20 border border-indigo-500/30">
               <FaBolt className="animate-pulse" /> Trending
             </span>
           </>
         )}
      </div>

      {/* Image Container with Hover Actions */}
      <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-8 group-hover:bg-slate-50 dark:group-hover:bg-slate-900 transition-colors duration-700">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <Link to={`/product/${product._id}`} className="block w-full h-full z-10">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]"
          />
        </Link>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-20">
           <button 
             onClick={addToCartHandler}
             disabled={product.countInStock === 0}
             className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-emerald-500 hover:border-emerald-400 hover:text-white transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
             title="Add to Cart"
           >
              <FaShoppingCart size={18} className="group-hover/btn:animate-bounce" />
           </button>
           <button 
             onClick={() => navigate(`/product/${product._id}`)}
             className="w-12 h-12 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-slate-800 dark:text-white rounded-2xl flex items-center justify-center shadow-2xl border border-slate-200 dark:border-white/10 hover:bg-blue-500 hover:border-blue-400 hover:text-white transition-all active:scale-90"
             title="Quick View"
           >
              <FaEye size={18} />
           </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-6 flex-grow flex flex-col bg-white dark:bg-slate-900 relative z-10 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">
            {product.brand}
          </span>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
             <span className="text-emerald-400 font-extrabold text-xs">{product.rating}</span>
             <FaStar className="text-emerald-400 text-[10px]" />
          </div>
        </div>
        
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500 line-through font-bold">₹{(product.price * 1.2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-lg border border-emerald-500/30 font-black uppercase tracking-widest">20% Off</span>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-white/5 mt-3">
             <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                <FaCheckCircle className="text-emerald-500" />
                <span>Fast Shipping Available</span>
             </div>
          </div>
        </div>
      </div>

      {/* Trust Badge Overlay */}
      {product.price > 80000 && (
         <div className="absolute bottom-8 right-8 pointer-events-none opacity-5 group-hover:opacity-[0.08] transition-opacity">
            <FaCheckCircle className="text-8xl text-emerald-500" />
         </div>
      )}
    </div>
  );
};

export default ProductCard;
