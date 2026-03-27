import { Link } from 'react-router-dom';
import { FaStar, FaBolt, FaCheckCircle } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden flex flex-col h-full group relative hover:-translate-y-2 ring-1 ring-slate-900/5">
      
      {/* Dynamic Status Badges - Flipkart Style */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
         {product.countInStock === 0 ? (
           <span className="bg-slate-900/90 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest backdrop-blur-md">
             Sold Out
           </span>
         ) : (
           <>
             {product.price > 50000 && (
               <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                 Best Seller
               </span>
             )}
             <span className="bg-amber-400 text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-amber-400/20">
               <FaBolt className="animate-pulse" /> Sale
             </span>
           </>
         )}
      </div>

      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="block relative h-64 overflow-hidden bg-slate-50 flex items-center justify-center p-10 group-hover:bg-white transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl z-10"
        />
      </Link>
      
      {/* Content Area */}
      <div className="p-6 flex-grow flex flex-col bg-white border-t border-slate-50 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {product.brand}
          </span>
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
             <span className="text-emerald-600 font-black text-xs">{product.rating}</span>
             <FaStar className="text-emerald-500 text-[10px]" />
          </div>
        </div>
        
        <Link to={`/product/${product._id}`}>
          <h3 className="text-md font-bold text-slate-800 mb-4 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 line-through font-bold">₹{(product.price * 1.2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span className="text-xs text-emerald-500 font-black uppercase">20% off</span>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-50 mt-4">
             <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <FaCheckCircle className="text-emerald-500" />
                <span>Free Delivery</span>
             </div>
             <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <Link to={`/product/${product._id}`} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 hover:underline">
                   View Details
                </Link>
             </div>
          </div>
        </div>
      </div>

      {/* Trust Badge Overlay for Premium Items */}
      {product.price > 80000 && (
         <div className="absolute bottom-6 right-6 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
            <FaCheckCircle className="text-6xl text-emerald-500" />
         </div>
      )}
    </div>
  );
};

export default ProductCard;
