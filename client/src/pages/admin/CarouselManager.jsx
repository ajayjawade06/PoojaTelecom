import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetAdminCarouselSlidesQuery,
  useCreateCarouselSlideMutation,
  useUpdateCarouselSlideMutation,
  useDeleteCarouselSlideMutation,
  useReorderCarouselSlidesMutation,
} from '../../redux/slices/carouselApiSlice';
import { useUploadProductImageMutation } from '../../redux/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaCloudUploadAlt,
} from 'react-icons/fa';

const emptySlide = {
  title: '',
  subtitle: '',
  description: '',
  image: '',
  link: '/search/all',
  linkText: 'Shop Store',
  price: '',
  isActive: true,
};

const CarouselManager = () => {
  const navigate = useNavigate();
  const { data: slides, isLoading, error, refetch } = useGetAdminCarouselSlidesQuery();
  const [createSlide, { isLoading: creating }] = useCreateCarouselSlideMutation();
  const [updateSlide, { isLoading: updating }] = useUpdateCarouselSlideMutation();
  const [deleteSlide, { isLoading: deleting }] = useDeleteCarouselSlideMutation();
  const [reorderSlides] = useReorderCarouselSlidesMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadProductImageMutation();

  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState(emptySlide);
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      const res = await uploadImage(data).unwrap();
      handleInputChange('image', res.image);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err?.data?.message || 'Upload failed');
    }
  };

  const openCreateForm = () => {
    setEditingSlide(null);
    setFormData(emptySlide);
    setIsCreating(true);
  };

  const openEditForm = (slide) => {
    setIsCreating(false);
    setEditingSlide(slide._id);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image: slide.image,
      link: slide.link,
      linkText: slide.linkText,
      price: slide.price,
      isActive: slide.isActive,
    });
  };

  const cancelForm = () => {
    setEditingSlide(null);
    setIsCreating(false);
    setFormData(emptySlide);
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.image.trim()) {
      toast.error('Title and Image are required');
      return;
    }
    try {
      await createSlide(formData).unwrap();
      toast.success('Slide created');
      cancelForm();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create');
    }
  };

  const handleUpdate = async () => {
    if (!formData.title.trim() || !formData.image.trim()) {
      toast.error('Title and Image are required');
      return;
    }
    try {
      await updateSlide({ _id: editingSlide, ...formData }).unwrap();
      toast.success('Slide updated');
      cancelForm();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this carousel slide?')) {
      try {
        await deleteSlide(id).unwrap();
        toast.success('Slide deleted');
        if (editingSlide === id) cancelForm();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete');
      }
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      await updateSlide({ _id: slide._id, isActive: !slide.isActive }).unwrap();
      toast.success(slide.isActive ? 'Slide hidden' : 'Slide visible');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to toggle');
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const ids = slides.map((s) => s._id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    try {
      await reorderSlides({ slideIds: ids }).unwrap();
      refetch();
    } catch (err) {
      toast.error('Reorder failed');
    }
  };

  const handleMoveDown = async (index) => {
    if (index === slides.length - 1) return;
    const ids = slides.map((s) => s._id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    try {
      await reorderSlides({ slideIds: ids }).unwrap();
      refetch();
    } catch (err) {
      toast.error('Reorder failed');
    }
  };

  const isFormOpen = isCreating || editingSlide;
  const atMaxSlides = slides && slides.length >= 8;

  return (
    <div className="pt-24 pb-20 animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
      <div className="main-container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-slate-100 dark:border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-sm"
            >
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Hero Carousel
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                {slides ? slides.length : 0} / 8 Slides
              </p>
            </div>
          </div>

          <button
            onClick={openCreateForm}
            disabled={creating || atMaxSlides}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${
              atMaxSlides
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95'
            }`}
            title={atMaxSlides ? 'Maximum 8 slides reached' : 'Add new slide'}
          >
            <FaPlus size={10} />
            {atMaxSlides ? 'Max 8 Reached' : 'Add Slide'}
          </button>
        </div>

        {/* Create / Edit Form */}
        {isFormOpen && (
          <div className="mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-slate-50 dark:bg-white/5 px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                {isCreating ? 'New Slide' : 'Edit Slide'}
              </h3>
              <button
                onClick={cancelForm}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
              >
                <FaTimes size={12} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g. iPhone 16 Pro"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-[12px] font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Badge / Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      placeholder="e.g. New Arrival"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-[12px] font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="A short description for this slide..."
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-[12px] font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Price Text
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g. From ₹1,19,900"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-[12px] font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Image *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        placeholder="Image URL or upload below"
                        className="flex-grow bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-[12px] font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-colors"
                      />
                      <label className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 shrink-0">
                        <FaCloudUploadAlt size={12} />
                        {uploading ? '...' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formData.image && (
                      <div className="mt-3 w-full h-36 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        CTA Link
                      </label>
                      <input
                        type="text"
                        value={formData.link}
                        onChange={(e) => handleInputChange('link', e.target.value)}
                        placeholder="/search/all"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-[12px] font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        CTA Text
                      </label>
                      <input
                        type="text"
                        value={formData.linkText}
                        onChange={(e) => handleInputChange('linkText', e.target.value)}
                        placeholder="Shop Store"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-[12px] font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Active
                    </label>
                    <button
                      onClick={() => handleInputChange('isActive', !formData.isActive)}
                      className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
                        formData.isActive
                          ? 'bg-emerald-500'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                          formData.isActive ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={cancelForm}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={isCreating ? handleCreate : handleUpdate}
                  disabled={creating || updating}
                  className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <FaSave size={10} />
                  {creating || updating ? 'Saving...' : isCreating ? 'Create Slide' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slides List */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="red">{error?.data?.message || 'Failed to load slides'}</Message>
        ) : slides.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
            <FaImage size={32} className="text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">
              No Carousel Slides
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
              Add your first slide to get started
            </p>
            <button
              onClick={openCreateForm}
              className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <FaPlus size={10} /> Create First Slide
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div
                key={slide._id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all ${
                  editingSlide === slide._id
                    ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                    : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                } ${!slide.isActive ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Order Number */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className={`p-1.5 rounded-lg transition-all ${
                        index === 0
                          ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed'
                          : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                      }`}
                    >
                      <FaArrowUp size={10} />
                    </button>
                    <span className="text-[10px] font-black text-slate-400 w-6 text-center">
                      {index + 1}
                    </span>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === slides.length - 1}
                      className={`p-1.5 rounded-lg transition-all ${
                        index === slides.length - 1
                          ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed'
                          : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                      }`}
                    >
                      <FaArrowDown size={10} />
                    </button>
                  </div>

                  {/* Image Thumbnail */}
                  <div className="w-20 h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[13px] font-black text-slate-900 dark:text-white truncate leading-tight">
                        {slide.title}
                      </h4>
                      {slide.subtitle && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                          {slide.subtitle}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 truncate">
                      {slide.description || 'No description'}
                    </p>
                    {slide.price && (
                      <span className="text-[10px] font-black text-emerald-500 mt-0.5 inline-block">
                        {slide.price}
                      </span>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`p-2.5 rounded-lg transition-all ${
                        slide.isActive
                          ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                      title={slide.isActive ? 'Click to hide' : 'Click to show'}
                    >
                      {slide.isActive ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                    </button>
                    <button
                      onClick={() => openEditForm(slide)}
                      className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Edit"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(slide._id)}
                      disabled={deleting}
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarouselManager;
