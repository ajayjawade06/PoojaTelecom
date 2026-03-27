import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../redux/slices/productsApiSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaUserCircle, FaStar, FaShoppingCart } from 'react-icons/fa';

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
    <div className="container mx-auto px-4 my-8">
      <Link
        to="/"
        className="inline-block mb-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2 px-5 rounded-full transition-colors"
      >
        &larr; Back to Shop
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="red">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Image */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full h-auto object-contain max-h-[500px] hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              />
            </div>

            {/* Info */}
            <div className="lg:col-span-4 flex flex-col py-4">
              <div className="mb-2">
                <span className="text-xs font-bold tracking-widest text-emerald-500 uppercase bg-emerald-50 px-3 py-1 rounded-full">
                  {product.brand}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3">
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                <span className="text-slate-300">|</span>
                <a href="#reviews" className="text-sm font-medium text-emerald-600 hover:underline">
                  Read reviews
                </a>
              </div>
              <div className="mt-8 text-slate-600 leading-relaxed pt-6 border-t border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-3 text-lg">Product Overview</h3>
                <p className="whitespace-pre-line">{product.description}</p>
              </div>
            </div>

            {/* Purchase Box */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-100 text-center rounded-2xl p-6 shadow-xl shadow-slate-200/50 sticky top-28">
                <div className="mb-6">
                  <span className="text-slate-500 block mb-1">Price</span>
                  <span className="text-4xl font-extrabold text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div
                  className={`mb-6 py-2 px-4 rounded-full font-bold inline-block text-sm ${
                    product.countInStock > 0
                      ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                      : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                  }`}
                >
                  {product.countInStock > 0 ? 'In Stock · Ready to Ship' : 'Currently Out Of Stock'}
                </div>

                {product.countInStock > 0 && (
                  <div className="flex flex-col mb-6">
                    <span className="text-slate-600 font-medium mb-2 text-left">Quantity</span>
                    <select
                      className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors font-medium text-slate-700"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  <FaShoppingCart /> Add To Cart
                </button>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="mt-20 pt-10 border-t border-slate-200" id="reviews">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Write Review Form */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-fit">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Write a Review</h3>
                {loadingProductReview && <Loader />}
                {userInfo ? (
                  <form onSubmit={submitReviewHandler} className="space-y-6">

                    {/* ⭐ Interactive Star Rating */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-3">Your Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-125 active:scale-110 p-1"
                          >
                            <FaStar
                              size={38}
                              className={`transition-colors duration-100 ${
                                star <= (hoverRating || rating)
                                  ? 'text-amber-400 drop-shadow'
                                  : 'text-slate-200'
                              }`}
                            />
                          </button>
                        ))}
                        {(hoverRating || rating) > 0 && (
                          <span className="ml-3 text-sm font-bold text-slate-500 w-20">
                            {starLabels[hoverRating || rating]}
                          </span>
                        )}
                      </div>
                      {rating === 0 && (
                        <p className="text-xs text-rose-400 mt-2 font-medium">
                          Click a star to leave your rating
                        </p>
                      )}
                    </div>

                    {/* Optional Comment */}
                    <div>
                      <label className="block text-slate-700 font-bold mb-2">
                        Comment <span className="font-normal text-slate-400 text-xs">(optional)</span>
                      </label>
                      <textarea
                        rows="4"
                        className="w-full border-2 border-slate-200 rounded-xl p-4 bg-white focus:outline-none focus:border-emerald-500 transition-colors font-medium text-slate-700 min-h-[120px]"
                        value={comment}
                        placeholder="Share your thoughts about this product..."
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      disabled={loadingProductReview}
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <Message variant="blue">
                    Please{' '}
                    <Link to="/login" className="font-bold underline text-blue-700">
                      sign in
                    </Link>{' '}
                    to write a review
                  </Message>
                )}
              </div>

              {/* Existing Reviews List */}
              <div>
                {product.reviews.length === 0 ? (
                  <div className="text-center py-10 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-slate-200 mb-4 flex justify-center">
                      <FaStar size={48} />
                    </div>
                    <p className="text-lg text-slate-500 font-medium">No reviews yet.</p>
                    <p className="text-slate-400">Be the first to share your experience!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                              {review.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">{review.name}</h4>
                              <p className="text-xs text-slate-400">{review.createdAt.substring(0, 10)}</p>
                            </div>
                          </div>
                          {/* Star display for existing reviews */}
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <FaStar
                                key={s}
                                size={16}
                                className={s <= review.rating ? 'text-amber-400' : 'text-slate-200'}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-slate-600 leading-relaxed italic border-l-4 border-emerald-500 pl-4">
                            {review.comment}
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
  );
};

export default ProductPage;
