import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../redux/slices/productsApiSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaUserCircle, FaStar, FaShoppingCart, FaArrowLeft, FaComments, FaShieldAlt, FaTruck, FaClock, FaShareAlt } from 'react-icons/fa';
import { getFullImageUrl } from '../utils/imageUtils';

const ProductPage = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  const { userInfo } = useSelector((state) => state.auth);
  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Selection Required');
      return;
    }
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      setRating(0);
      setComment('');
      alert('Thank you for your review!');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const shareHandler = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this ${product.name} on Pooja Telecom!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard or show options
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (isLoading) return <div className="pt-40"><Loader /></div>;
  if (error) return <div className="pt-40 main-container"><Message variant="red">{error?.data?.message || 'Error loading product'}</Message></div>;

  return (
    <div className="pt-28 pb-20 animate-fade-in bg-white dark:bg-slate-950 min-h-screen relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="hidden lg:block absolute top-[10%] content-none right-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="main-container relative z-10">
        
        {/* Navigation / Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => navigate(-1)}
               className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-sm"
             >
                <FaArrowLeft size={14} />
             </button>
             <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
             </div>
          </div>
          
          <button 
            onClick={shareHandler}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 px-3 py-2 rounded-lg transition-all"
          >
             <FaShareAlt size={12} /> Share Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Gallery - Left */}
          <div className="lg:col-span-7 space-y-4">
             <div className="aspect-square bg-white dark:bg-black/20 rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden flex items-center justify-center p-16 group hover:shadow-2xl transition-all duration-500 relative">
                {/* Subtle inner glow for product gallery */}
                <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <img 
                  src={getFullImageUrl(product.image)} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-[1.05] transition-transform duration-700 z-10 relative" 
                />
             </div>
             {/* Tiny thumbnails could go here */}
          </div>

          {/* Details - Right */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
             <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2 block">{product.brand}</span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 py-3 border-y border-slate-100 dark:border-white/5">
                   <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => <FaStar key={s} className={s <= product.rating ? 'text-amber-400' : 'text-slate-200'} size={12}/>)}
                   </div>
                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{product.numReviews} Reviews</span>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                   <span className="text-4xl font-black text-slate-900 dark:text-emerald-400 tracking-tighter">
                     ₹{product.price.toLocaleString('en-IN')}
                   </span>
                   <span className="text-sm font-bold text-slate-400 line-through">₹{(product.price * 1.3).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md inline-block ${product.countInStock > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'}`}>
                   {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Unavailable'}
                </div>
             </div>

             {product.countInStock > 0 && (
               <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                     <div className="flex-grow flex items-center border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden h-12">
                        <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-12 h-full hover:bg-slate-100 dark:hover:bg-white/5 font-bold transition-colors">-</button>
                        <span className="flex-grow text-center font-black text-xs text-slate-900 dark:text-white uppercase tracking-widest">{qty} Units</span>
                        <button onClick={() => setQty(q => Math.min(product.countInStock, q+1))} className="w-12 h-full hover:bg-slate-100 dark:hover:bg-white/5 font-bold transition-colors">+</button>
                     </div>
                  </div>

                  <button 
                    onClick={addToCartHandler}
                    className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 h-16 rounded-[16px] font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden relative group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                    <FaShoppingCart size={16} className="relative z-10" /> 
                    <span className="relative z-10">Add to Cart</span>
                  </button>
               </div>
             )}

             {/* Minimal Features List */}
             <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-white/5 pt-8">
                <div className="flex flex-col items-center text-center gap-2">
                   <FaTruck className="text-emerald-500" size={14}/>
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Fast Ship</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                   <FaShieldAlt className="text-emerald-500" size={14}/>
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Genuine</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                   <FaClock className="text-emerald-500" size={14}/>
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">24/7 Support</span>
                </div>
             </div>
          </div>
        </div>

        {/* Dynamic Tabs Section */}
        <section className="mt-20 border-t border-slate-100 dark:border-white/5 pt-12">
           <div className="flex items-center gap-8 mb-10 border-b border-slate-100 dark:border-white/5">
              {['description', 'reviews'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                 >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 animate-fade-in"></div>}
                 </button>
              ))}
           </div>

           <div className="max-w-4xl">
              {activeTab === 'description' && (
                 <div className="animate-fade-in">
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line font-medium">
                       {product.description}
                    </p>
                 </div>
              )}

              {activeTab === 'reviews' && (
                 <div className="animate-fade-in space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       {/* Review List */}
                       <div className="space-y-6">
                          {product.reviews.length === 0 ? (
                             <p className="text-slate-400 text-xs italic">No reviews yet. Be the first to share your experience.</p>
                          ) : (
                             product.reviews.map(r => (
                                <div key={r._id} className="bg-slate-50 dark:bg-white/5 p-5 rounded-xl border border-slate-100 dark:border-white/5">
                                   <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-2">
                                         <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[10px] font-black">
                                            {r.name.charAt(0)}
                                         </div>
                                         <span className="text-[11px] font-bold text-slate-900 dark:text-white">{r.name}</span>
                                      </div>
                                      <div className="flex gap-0.5">
                                         {[1,2,3,4,5].map(s => <FaStar key={s} size={8} className={s <= r.rating ? 'text-amber-400' : 'text-slate-200'}/>)}
                                      </div>
                                   </div>
                                   <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">"{r.comment}"</p>
                                </div>
                             ))
                          )}
                       </div>

                       {/* Write Review */}
                       <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5 h-fit">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Write a review</h4>
                          {userInfo ? (
                             <form onSubmit={submitReviewHandler} className="space-y-4">
                                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-white/10">
                                   {[1,2,3,4,5].map(s => (
                                      <button key={s} type="button" onClick={() => setRating(s)} className="hover:scale-110 transition-transform">
                                         <FaStar size={16} className={s <= rating ? 'text-amber-400' : 'text-slate-200'}/>
                                      </button>
                                   ))}
                                </div>
                                <textarea 
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 p-4 rounded-xl text-xs font-medium outline-none focus:border-emerald-500/30 transition-all min-h-[100px] resize-none"
                                  placeholder="How was your experience?"
                                  value={comment}
                                  onChange={e => setComment(e.target.value)}
                                />
                                <button type="submit" disabled={loadingProductReview} className="w-full bg-emerald-500 text-white font-black py-3 rounded-lg text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95 transition-all">
                                   Submit Review
                                </button>
                             </form>
                          ) : (
                             <p className="text-[11px] font-medium text-slate-400">Please <Link to="/login" className="text-emerald-500 font-black underline">login</Link> to write a review.</p>
                          )}
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </section>

      </div>
    </div>
  );
};

export default ProductPage;
