import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaStar, FaBolt, FaCheckCircle, FaShoppingCart, FaEye, FaShareAlt, FaFire } from 'react-icons/fa';
import { addToCart, setCartOpen } from '../redux/slices/cartSlice';
import { getFullImageUrl } from '../utils/imageUtils';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, qty: 1 }));
    dispatch(setCartOpen(true));
  };

  // Smart badge logic
  const isNew = product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
  const isPopular = product.numReviews > 10;

  return (
    <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] overflow-hidden flex flex-col h-full group transition-all duration-200 relative">
    

      {/* Image Section */}
      <div className="relative aspect-[4/5] bg-transparent overflow-hidden flex items-center justify-center p-8 transition-colors duration-200">
        
        {/* Badge Overlay - Inside Image Container */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          {product.countInStock === 0 ? (
            <span className="bg-slate-100 dark:bg-black text-slate-500 dark:text-slate-400 text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Out of Stock
            </span>
          ) : product.countInStock < 5 ? (
            <span className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Low Stock
            </span>
          ) : (
            <span className="bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Available
            </span>
          )}
          
          {/* Smart Badges */}
          {isNew && (
            <span className="bg-blue-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-md shadow-blue-500/20 uppercase tracking-widest">
              New
            </span>
          )}
          {isPopular && !isNew && (
            <span className="bg-amber-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-md shadow-amber-500/20 uppercase tracking-widest flex items-center gap-1">
              <FaFire size={8} /> Popular
            </span>
          )}

          {product.countInStock > 0 && product.price > 50000 && (
            <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-sm mt-1">
              Premium
            </span>
          )}
        </div>
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img 
            src={getFullImageUrl(product.image)} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group- transition-transform duration-200 ease-out" 
          />
        </Link>

        {/* Share Button Floating */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            const text = `Check out this ${product.name} on Pooja Telecom!`;
            const url = `${window.location.origin}/product/${product._id}`;
            if (navigator.share) {
              navigator.share({ title: product.name, text, url });
            } else {
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            }
          }}
          className="absolute top-4 right-4 w-8 h-8 bg-white/80 dark:bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
        >
          <FaShareAlt size={12} />
        </button>

        {/* Quick Add Floating Button */}
        <button 
          onClick={addToCartHandler}
          disabled={product.countInStock === 0}
          className="absolute bottom-4 right-4 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-blue-600 disabled:hidden"
        >
          <FaShoppingCart size={14} />
        </button>
      </div>
      
      {/* Product Info */}
      <div className="px-6 pb-6 pt-2 flex flex-col flex-grow bg-transparent">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">{product.brand}</span>
          <div className="flex items-center gap-1 text-slate-500">
            <FaStar className="text-slate-800 dark:text-slate-300" size={10} />
            <span className="text-[12px] font-semibold">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.numReviews})</span>
          </div>
        </div>
        
        <Link to={`/product/${product._id}`} className="mb-4 block">
          <p className="text-[13px] font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug hover:text-blue-500 transition-colors tracking-tight">
            {product.name}
          </p>
        </Link>
        
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.price > 10000 && (
            <span className="text-[12px] text-slate-400 line-through font-medium">
              ₹{(product.price * 1.25).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
