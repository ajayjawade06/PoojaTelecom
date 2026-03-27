import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../redux/slices/productsApiSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaUserCircle, FaStar, FaShoppingCart, FaArrowLeft, FaComments } from 'react-icons/fa';

const ProductPage = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

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
      alert('Please select a star rating before submitting.');
      return;
    }
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      alert('Review submitted successfully!');
      setRating(0);
      setHoverRating(0);
      setComment('');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const starLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="container mx-auto px-4 my-10 animate-fade-in relative z-10 w-full flex flex-col items-center">
      <div className="w-full max-w-7xl relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-3 px-6 rounded-full transition-colors uppercase tracking-widest text-xs"
        >
          <FaArrowLeft /> Return to Database
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="red">{error?.data?.message || error.error}</Message>
        ) : (
          <>
            {/* Product Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 relative">
              {/* Decorative Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

              {/* Image */}
              <div className="lg:col-span-5 bg-slate-900/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full h-auto object-contain max-h-[500px] hover:scale-110 transition-transform duration-700 filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] cursor-zoom-in relative z-10"
                />
              </div>

              {/* Info */}
              <div className="lg:col-span-4 flex flex-col py-6">
                <div className="mb-4">
                  <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] px-4 py-1.5 rounded-xl">
                    {product.brand}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter">{product.name}</h1>
                <div className="flex items-center gap-4 bg-white/5 w-fit px-4 py-2 rounded-xl border border-white/5">
                  <Rating value={product.rating} text={`${product.numReviews} Database Entries`} color="#34d399" />
                  <span className="text-white/20">|</span>
                  <a href="#reviews" className="text-xs font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
                    Access Logs
                  </a>
                </div>
                <div className="mt-8 text-slate-300 leading-relaxed pt-8 border-t border-white/10 relative">
                  <h3 className="font-black text-white mb-4 text-xl tracking-tighter flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FaComments size={14} />
                     </div>
                     Hardware Specifications
                  </h3>
                  <p className="whitespace-pre-line text-sm font-medium">{product.description}</p>
                </div>
              </div>

              {/* Purchase Box */}
              <div className="lg:col-span-3">
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 text-center rounded-[2.5rem] p-8 shadow-2xl sticky top-28 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none -z-0"></div>

                  <div className="mb-8 relative z-10">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Acquisition Value</span>
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div
                    className={`mb-8 py-3 px-6 rounded-2xl font-black inline-block text-[10px] uppercase tracking-widest w-full relative z-10 ${
                      product.countInStock > 0
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {product.countInStock > 0 ? 'Units Available · Ready For Deployment' : 'Insufficient Resources'}
                  </div>

                  {product.countInStock > 0 && (
                    <div className="flex flex-col mb-8 relative z-10">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Allocate Quantity</span>
                      <div className="relative group">
                        <select
                          className="w-full border border-white/10 rounded-2xl p-4 bg-slate-950 focus:outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-colors font-black text-white appearance-none cursor-pointer tracking-widest text-center"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1} className="bg-slate-900">
                              {x + 1} UNITS
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-emerald-500 group-hover:text-emerald-400 transition-colors">
                           ▼
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    className="w-full relative overflow-hidden group bg-emerald-500 hover:bg-emerald-400 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm z-10"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <FaShoppingCart size={16} /> Load Cargo
                  </button>
                </div>
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="mt-24 pt-16 border-t border-white/10 relative" id="reviews">
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1/2 h-[200px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-12 flex items-center justify-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaStar />
                 </div>
                 Telemetry & Feedback
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Write Review Form */}
                <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl h-fit relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-300 to-transparent"></div>
                  <h3 className="text-xl font-black text-white mb-8 tracking-tighter">Submit Telemetry</h3>
                  
                  {loadingProductReview && <Loader />}
                  
                  {userInfo ? (
                    <form onSubmit={submitReviewHandler} className="space-y-8 relative z-10">
                      {/* ⭐ Interactive Star Rating */}
                      <div>
                        <label className="block text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Satisfaction Quotient</label>
                        <div className="flex flex-col items-center justify-center bg-white/5 p-6 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none transition-transform hover:scale-125 active:scale-110 p-2"
                              >
                                <FaStar
                                  size={42}
                                  className={`transition-colors duration-200 filter drop-shadow-lg ${
                                    star <= (hoverRating || rating)
                                      ? 'text-amber-400'
                                      : 'text-slate-800'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          <div className="h-6 flex items-center justify-center text-sm font-black text-white tracking-widest uppercase bg-slate-950 px-4 py-1 rounded-full border border-white/10 w-fit">
                            {starLabels[hoverRating || rating] || <span className="text-slate-600">UNRATED</span>}
                          </div>
                          {rating === 0 && (
                            <p className="text-[10px] text-rose-400 mt-4 font-black uppercase tracking-widest">
                              Selection Required
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Optional Comment */}
                      <div className="group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-emerald-400 transition-colors">
                          Additional Data <span className="text-slate-600">(Optional)</span>
                        </label>
                        <textarea
                          rows="4"
                          className="w-full border border-white/10 rounded-2xl p-5 bg-white/5 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium text-white min-h-[140px] resize-none ring-4 ring-transparent focus:ring-emerald-500/10 placeholder-slate-600"
                          value={comment}
                          placeholder="Transmit your detailed observations..."
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>

                      <button
                        disabled={loadingProductReview}
                        type="submit"
                        className="w-full relative overflow-hidden group bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs"
                      >
                         <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                         Transmit Data
                      </button>
                    </form>
                  ) : (
                    <Message variant="blue">
                      Authentication required. Please{' '}
                      <Link to="/login" className="font-black underline text-blue-400 hover:text-blue-300">
                        sign in
                      </Link>{' '}
                      to record telemetry.
                    </Message>
                  )}
                </div>

                {/* Existing Reviews List */}
                <div>
                  {product.reviews.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-slate-700 mb-6 border border-white/5">
                        <FaComments size={32} />
                      </div>
                      <p className="text-xl text-white font-black tracking-tighter mb-2">No Records Found</p>
                      <p className="text-slate-500 text-sm font-medium">Be the first to transmit an evaluation.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review._id} className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                {review.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-black text-white tracking-tight">{review.name}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{review.createdAt.substring(0, 10)}</p>
                              </div>
                            </div>
                            {/* Star display for existing reviews */}
                            <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <FaStar
                                  key={s}
                                  size={12}
                                  className={s <= review.rating ? 'text-amber-400' : 'text-slate-800'}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-slate-300 leading-relaxed text-sm font-medium italic border-l-2 border-emerald-500 pl-5 ml-2 mt-4">
                              "{review.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
