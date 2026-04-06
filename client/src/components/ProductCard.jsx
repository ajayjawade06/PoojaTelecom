import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaStar, FaBolt, FaCheckCircle, FaShoppingCart, FaEye, FaShareAlt } from 'react-icons/fa';
import { addToCart } from '../redux/slices/cartSlice';
import { getFullImageUrl } from '../utils/imageUtils';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, qty: 1 }));
  };

  return (
    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-white/5 rounded-[20px] overflow-hidden flex flex-col h-full group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:border-emerald-500/20 relative">
      

      {/* Image Section */}
      <div className="relative aspect-[4/5] bg-slate-50/50 dark:bg-black/20 overflow-hidden flex items-center justify-center p-8 transition-colors duration-500">
        
        {/* Badge Overlay - Inside Image Container */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.countInStock === 0 ? (
            <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          ) : product.countInStock < 5 ? (
            <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
              Low Stock
            </span>
          ) : (
            <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
              In Stock
            </span>
          )}
          
          {product.countInStock > 0 && product.price > 50000 && (
            <span className="bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-900 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm mt-1">
              Premium
            </span>
          )}
        </div>
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img 
            src={getFullImageUrl(product.image)} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition-transform duration-500 ease-out" 
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
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
        >
          <FaShareAlt size={10} />
        </button>

        {/* Quick Add Floating Button */}
        <button 
          onClick={addToCartHandler}
          disabled={product.countInStock === 0}
          className="absolute bottom-3 right-3 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-emerald-600 active:scale-90 disabled:hidden"
        >
          <FaShoppingCart size={11} />
        </button>
      </div>
      
      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow bg-transparent">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{product.brand}</span>
          <div className="flex items-center gap-1 text-slate-400">
            <FaStar className="text-amber-400" size={8} />
            <span className="text-[10px] font-bold leading-none">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product._id}`} className="mb-2 block">
          <h3 className="text-[11px] font-bold text-slate-800 dark:text-white line-clamp-2 leading-tight hover:text-emerald-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-baseline gap-1.5">
          <span className="text-base font-black text-slate-900 dark:text-emerald-400">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.price > 10000 && (
            <span className="text-[9px] text-slate-400 line-through font-medium">
              ₹{(product.price * 1.25).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
