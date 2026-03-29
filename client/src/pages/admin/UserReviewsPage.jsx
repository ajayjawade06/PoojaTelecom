import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserReviewsQuery, useDeleteReviewAdminMutation } from '../../redux/slices/productsApiSlice';
import { useGetUsersQuery } from '../../redux/slices/usersApiSlice';
import { FaTrash, FaStar, FaArrowLeft, FaRegCalendarAlt, FaBoxOpen, FaUserCircle } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const UserReviewsPage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const { data: reviews, isLoading, error, refetch } = useGetUserReviewsQuery(userId);
  const { data: users } = useGetUsersQuery();
  const [deleteReview, { isLoading: loadingDelete }] = useDeleteReviewAdminMutation();

  const user = users?.find((u) => u._id === userId);

  const deleteHandler = async (productId, reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview({ productId, reviewId }).unwrap();
        toast.success('Review deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="pt-24 pb-20 animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
      <div className="main-container max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 border-b border-slate-100 dark:border-white/5 pb-6">
          <button
            onClick={() => navigate('/admin/userlist')}
            className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-sm"
          >
            <FaArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Review Management</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 flex items-center gap-2">
              <FaUserCircle className="text-indigo-500" /> 
              Managing reviews for: <span className="text-slate-900 dark:text-white">{user?.name || 'User'}</span>
            </p>
          </div>
        </div>

        {loadingDelete && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="red">Failed to load reviews</Message>
        ) : reviews?.length === 0 ? (
          <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-12 text-center border border-dashed border-slate-200 dark:border-white/10">
            <FaBoxOpen size={40} className="mx-auto text-slate-200 dark:text-white/10 mb-4" />
            <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest">No reviews found for this user</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                      {review.productName}
                    </h4>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-white/5'} size={10} />
                      ))}
                      <span className="text-[10px] font-black ml-2 text-slate-400">({review.rating}.0)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHandler(review.productId, review._id)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-all"
                    title="Delete Review"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 italic">
                  "{review.comment}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <FaRegCalendarAlt size={10} />
                    Posted on {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => navigate(`/product/${review.productId}`)}
                    className="text-[9px] font-black text-indigo-500 uppercase tracking-widest hover:underline"
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviewsPage;
