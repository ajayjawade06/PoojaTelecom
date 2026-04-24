import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useGetProductDetailsQuery, useCreateReviewMutation, useUploadProductImageMutation } from '../redux/slices/productsApiSlice';
import { addToCart, setCartOpen } from '../redux/slices/cartSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductPageSkeleton from '../components/ProductPageSkeleton';
import { FaUserCircle, FaStar, FaShoppingCart, FaArrowLeft, FaComments, FaShieldAlt, FaTruck, FaClock, FaShareAlt, FaSearchPlus, FaChevronLeft, FaChevronRight, FaTimes, FaCamera, FaFire } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getFullImageUrl } from '../utils/imageUtils';

const ProductPage = () => {
 const { id: productId } = useParams();
 const dispatch = useDispatch();
 const navigate = useNavigate();

 const [qty, setQty] = useState(1);
 const [rating, setRating] = useState(0);
 const [comment, setComment] = useState('');
 const [activeTab, setActiveTab] = useState('description');
 const [currentImageIndex, setCurrentImageIndex] = useState(0);
 const [isZoomed, setIsZoomed] = useState(false);
 const [reviewImage, setReviewImage] = useState('');
 const [showStickyCart, setShowStickyCart] = useState(false);
 const [recentlyViewed, setRecentlyViewed] = useState([]);

 const { userInfo } = useSelector((state) => state.auth);
 const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
 const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
 const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

 useEffect(() => {
 const handleScroll = () => setShowStickyCart(window.scrollY > 500);
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 useEffect(() => {
 if (product) {
 const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
 const updated = stored.filter(p => p._id !== product._id);
 updated.unshift({ _id: product._id, name: product.name, image: product.image, price: product.price });
 const limited = updated.slice(0, 8);
 localStorage.setItem('recentlyViewed', JSON.stringify(limited));
 setRecentlyViewed(limited.filter(p => p._id !== product._id).slice(0, 5));
 }
 }, [product]);

 const addToCartHandler = () => {
 dispatch(addToCart({ ...product, qty }));
 dispatch(setCartOpen(true));
 };

 const submitReviewHandler = async (e) => {
 e.preventDefault();
 if (rating === 0) {
 alert('Selection Required');
 return;
 }
 try {
 await createReview({ productId, rating, comment, reviewImage }).unwrap();
 refetch();
 setRating(0);
 setComment('');
 setReviewImage('');
 alert('Thank you for your review!');
 } catch (err) {
 alert(err?.data?.message || err.error);
 }
 };

 const uploadFileHandler = async (e) => {
 const file = e.target.files[0];
 if (!file) return;
 const formData = new FormData();
 formData.append('image', file);
 try {
 const res = await uploadProductImage(formData).unwrap();
 setReviewImage(res.image);
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

 if (isLoading) return <ProductPageSkeleton />;
 if (error) return <div className="pt-40 main-container"><Message variant="red">{error?.data?.message || 'Error loading product'}</Message></div>;

 const allImages = product ? [product.image, ...(product.images || [])] : [];
 const currentImageUrl = product ? (allImages[currentImageIndex] || allImages[0]) : '';
 
 const nextImage = (e) => {
 e.stopPropagation();
 setCurrentImageIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
 };
 
 const prevImage = (e) => {
 e.stopPropagation();
 setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
 };

 return (
 <div className="pt-28 pb-20 bg-white dark:bg-slate-950 min-h-screen relative overflow-hidden">
 <Helmet>
 <title>{product.name} | Pooja Telecom</title>
 <meta name="description" content={product.description} />
 <meta property="og:title" content={product.name} />
 <meta property="og:image" content={getFullImageUrl(product.image)} />
 </Helmet>
 
 {/* Ambient background glow */}
 <div className="hidden lg:block absolute top-[10%] content-none right-[-5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

 <div className="main-container relative z-10">
 
 {/* Navigation / Breadcrumb */}
 <div className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-4">
 <button 
 onClick={() => navigate(-1)}
 className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm"
 >
 <FaArrowLeft size={14} />
 </button>
 <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
 <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
 <span>/</span>
 <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
 </div>
 </div>
 
 <button 
 onClick={shareHandler}
 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-all"
 >
 <FaShareAlt size={12} /> Share Product
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
 
 {/* Gallery - Left */}
 <div className="lg:col-span-5 space-y-4">
 {/* Main Display */}
 <div 
 onClick={() => setIsZoomed(true)}
 className="w-full h-[350px] lg:h-[450px] bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-[32px] flex items-center justify-center p-4 lg:p-8 cursor-zoom-in group transition-all duration-200 relative overflow-hidden shadow-inner"
 >
 {/* Background decoration */}
 <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
 
 {/* Image */}
 <img 
 src={getFullImageUrl(currentImageUrl)} 
 alt={product.name} 
 className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-[1.03] transition-transform duration-500 z-10 relative" 
 />

 {/* Hover zoom icon */}
 <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 backdrop-blur-md p-2.5 rounded-full text-slate-700 dark:text-white/80 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 z-20 shadow-sm">
 <FaSearchPlus size={14} />
 </div>

 {/* Left / Right Navigation */}
 {allImages.length > 1 && (
 <>
 <button 
 onClick={prevImage}
 className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/60 backdrop-blur-md border border-slate-200/50 dark:border-white/10 w-10 h-10 rounded-full flex items-center justify-center text-slate-800 dark:text-white shadow-lg opacity-0 lg:opacity-0 lg:-translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-20 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
 >
 <FaChevronLeft size={12} className="-ml-0.5" />
 </button>
 <button 
 onClick={nextImage}
 className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/60 backdrop-blur-md border border-slate-200/50 dark:border-white/10 w-10 h-10 rounded-full flex items-center justify-center text-slate-800 dark:text-white shadow-lg opacity-0 lg:opacity-0 lg:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-20 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
 >
 <FaChevronRight size={12} className="-mr-0.5" />
 </button>
 </>
 )}
 </div>

 {/* Thumbnails Map */}
 {allImages.length > 1 && (
 <div className="flex gap-3 overflow-x-auto py-2 scrollbar-none snap-x snap-mandatory px-1">
 {allImages.map((img, idx) => (
 <button 
 key={idx} 
 onClick={() => setCurrentImageIndex(idx)}
 className={`snap-center shrink-0 w-16 h-16 bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-xl flex items-center justify-center p-2 border-[1.5px] transition-all duration-200 ${
 currentImageIndex === idx 
 ? 'border-blue-500 opacity-100 shadow-md shadow-blue-500/20 scale-105' 
 : 'border-transparent opacity-60 hover:opacity-100 hover:bg-slate-200 dark:hover:bg-white/5'
 }`}
 >
 <img 
 src={getFullImageUrl(img)} 
 alt={`${product.name} thumbnail ${idx + 1}`} 
 className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
 />
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Details - Right */}
 <div className="lg:col-span-7 space-y-8 lg:sticky lg:top-24">
 <div>
 <span className="text-[12px] font-semibold tracking-wide text-blue-500 mb-2 block">{product.brand}</span>
 <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
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
 {product.festivalName && (
 <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-md shadow-pink-500/30 uppercase tracking-widest flex items-center gap-2 w-fit mb-2">
 <FaFire size={10} /> {product.festivalName}
 </span>
 )}
 <div className="flex items-baseline gap-3">
 <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
 ₹{product.price.toLocaleString('en-IN')}
 </span>
 {product.mrp > product.price && (
 <>
 <span className="text-base font-medium text-slate-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
 <span className="text-[12px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded">
 {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
 </span>
 </>
 )}
 </div>
 
 <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md inline-block ${product.countInStock > 0 ? 'bg-blue-500/10 text-blue-600' : 'bg-rose-500/10 text-rose-500'}`}>
 {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Unavailable'}
 </div>
 </div>

 {product.countInStock > 0 && (
 <div className="space-y-5 pt-4">
 <div className="flex items-center gap-4">
 <span className="text-[13px] font-semibold text-slate-500">Quantity</span>
 <div className="flex items-center bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-full overflow-hidden h-11 w-32 border border-slate-200 dark:border-white/5">
 <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-10 h-full hover:bg-slate-200 dark:hover:bg-white/10 font-medium transition-colors text-slate-500">-</button>
 <span className="flex-grow text-center font-bold text-[13px] text-slate-900 dark:text-white">{qty}</span>
 <button onClick={() => setQty(q => Math.min(product.countInStock, q+1))} className="w-10 h-full hover:bg-slate-200 dark:hover:bg-white/10 font-medium transition-colors text-slate-500">+</button>
 </div>
 </div>

 <div className="flex flex-col sm:flex-row gap-3">
 <button 
 onClick={addToCartHandler}
 className="flex-1 bg-white dark:bg-transparent border border-blue-500 text-blue-500 h-12 rounded-full font-semibold text-[14px] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all flex items-center justify-center gap-2 group/btn"
 >
 <FaShoppingCart size={14} className="group-hover/btn:scale-[1.05] transition-transform" /> 
 <span>Add to Cart</span>
 </button>

 <button 
 onClick={() => {
 dispatch(addToCart({ ...product, qty }));
 navigate('/shipping');
 }}
 className="flex-1 bg-blue-500 text-white h-12 rounded-full font-semibold text-[14px] hover:bg-blue-600 transition-all flex items-center justify-center shadow-lg shadow-blue-500/20"
 >
 <span>Buy Now</span>
 </button>
 </div>
 </div>
 )}

 {/* Minimal Features List */}
 <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-white/5 pt-8">
 <div className="flex flex-col items-center text-center gap-2">
 <FaTruck className="text-blue-500" size={14}/>
 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Fast Ship</span>
 </div>
 <div className="flex flex-col items-center text-center gap-2">
 <FaShieldAlt className="text-blue-500" size={14}/>
 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Genuine</span>
 </div>
 <div className="flex flex-col items-center text-center gap-2">
 <FaClock className="text-blue-500" size={14}/>
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
 className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-blue-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
 >
 {tab}
 {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
 </button>
 ))}
 </div>

 <div className="max-w-4xl">
 {activeTab === 'description' && (
 <div className="">
 <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line font-medium">
 {product.description}
 </p>
 </div>
 )}

 {activeTab === 'reviews' && (
 <div className=" space-y-12">
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
 <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-[10px] font-black">
 {r.name.charAt(0)}
 </div>
 <span className="text-[11px] font-bold text-slate-900 dark:text-white">{r.name}</span>
 </div>
 <div className="flex gap-0.5">
 {[1,2,3,4,5].map(s => <FaStar key={s} size={8} className={s <= r.rating ? 'text-amber-400' : 'text-slate-200'}/>)}
 </div>
 </div>
 <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">"{r.comment}"</p>
 {r.reviewImage && (
 <img src={getFullImageUrl(r.reviewImage)} alt="Review payload" className="mt-4 h-20 w-auto rounded-md object-cover border border-slate-200 dark:border-white/10" />
 )}
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
 <button key={s} type="button" onClick={() => setRating(s)} className=" transition-transform">
 <FaStar size={16} className={s <= rating ? 'text-amber-400' : 'text-slate-200'}/>
 </button>
 ))}
 </div>
 <textarea 
 className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 p-4 rounded-xl text-xs font-medium outline-none focus:border-blue-500/30 transition-all min-h-[100px] resize-none"
 placeholder="How was your experience?"
 value={comment}
 onChange={e => setComment(e.target.value)}
 />
 <div className="flex items-center gap-4">
 <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
 <FaCamera /> {loadingUpload ? 'Uploading...' : 'Add Photo'}
 <input type="file" className="hidden" onChange={uploadFileHandler} disabled={loadingUpload} />
 </label>
 {reviewImage && <img src={getFullImageUrl(reviewImage)} className="h-8 rounded" alt="Preview"/>}
 </div>
 <button type="submit" disabled={loadingProductReview} className="w-full bg-blue-500 text-white font-black py-3 rounded-lg text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/10 transition-all mt-4">
 Submit Review
 </button>
 </form>
 ) : (
 <p className="text-[11px] font-medium text-slate-400">Please <Link to="/login" className="text-blue-500 font-black underline">login</Link> to write a review.</p>
 )}
 </div>
 </div>
 </div>
 )}
 </div>
 </section>

 {/* Recently Viewed */}
 {recentlyViewed.length > 0 && (
 <section className="main-container max-w-6xl mx-auto mt-20 pt-10 border-t border-slate-100 dark:border-white/5">
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recently Viewed</h3>
 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
 {recentlyViewed.map(item => (
 <Link key={item._id} to={`/product/${item._id}`} className="block bg-slate-50 dark:bg-white/5 p-4 rounded-2xl hover:scale-105 transition-transform duration-300 border border-slate-200/50 dark:border-white/10">
 <img src={getFullImageUrl(item.image)} alt={item.name} className="w-full h-32 object-contain mix-blend-multiply dark:mix-blend-normal mb-3" />
 <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
 <p className="text-[11px] font-bold text-blue-500 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
 </Link>
 ))}
 </div>
 </section>
 )}

 </div>

 {/* Sticky Add-to-Cart Bar */}
 {product.countInStock > 0 && (
 <div className={`fixed bottom-0 left-0 w-full bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 p-3 z-[60] transition-transform duration-500 transform ${showStickyCart ? 'translate-y-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]' : 'translate-y-full'}`}>
 <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
 <div className="hidden md:flex items-center gap-4">
 <img src={getFullImageUrl(product.image)} alt={product.name} className="h-10 w-10 object-contain rounded bg-slate-100 dark:bg-white/5 p-1" />
 <div>
 <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-sm">{product.name}</p>
 <p className="text-xs font-bold text-blue-500">₹{product.price.toLocaleString('en-IN')}</p>
 </div>
 </div>
 <div className="flex items-center gap-3 w-full md:w-auto">
 <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-full h-10 w-24 overflow-hidden border border-slate-200 dark:border-white/5 shrink-0">
 <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-8 h-full hover:bg-slate-200 dark:hover:bg-white/10 font-bold dark:text-white">-</button>
 <span className="flex-grow text-center font-bold text-xs dark:text-white">{qty}</span>
 <button onClick={() => setQty(q => Math.min(product.countInStock, q+1))} className="w-8 h-full hover:bg-slate-200 dark:hover:bg-white/10 font-bold dark:text-white">+</button>
 </div>
 <button onClick={addToCartHandler} className="flex-grow md:flex-grow-0 bg-blue-500 text-white px-8 py-2 h-10 rounded-full font-bold text-[12px] uppercase tracking-wide hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 whitespace-nowrap">
 Add to Cart
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Zoom Overlay */}
 {isZoomed && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm shadow-2xl transition-opacity animate-in fade-in duration-200" onClick={() => setIsZoomed(false)}>
 <button 
 onClick={() => setIsZoomed(false)}
 className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/20 p-4 rounded-full z-[110]"
 >
 <FaTimes size={20} />
 </button>

 {allImages.length > 1 && (
 <>
 <button 
 onClick={prevImage}
 className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/20 w-12 h-12 lg:w-20 lg:h-20 rounded-full flex items-center justify-center backdrop-blur-md z-[110] active:scale-95"
 >
 <FaChevronLeft size={24} className="-ml-1" />
 </button>
 <button 
 onClick={nextImage}
 className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/20 w-12 h-12 lg:w-20 lg:h-20 rounded-full flex items-center justify-center backdrop-blur-md z-[110] active:scale-95"
 >
 <FaChevronRight size={24} className="-mr-1" />
 </button>
 </>
 )}

 <img 
 src={getFullImageUrl(currentImageUrl)} 
 alt="Zoomed inside overlay" 
 className="max-w-[95vw] max-h-[90vh] object-contain select-none cursor-zoom-out animate-in zoom-in-95 duration-300" 
 onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
 />
 </div>
 )}

 </div>
 );
};

export default ProductPage;
