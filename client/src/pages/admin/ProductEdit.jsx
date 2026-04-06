import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../../src/redux/slices/productsApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { FaArrowLeft, FaCloudUploadAlt, FaSave } from 'react-icons/fa';
import { getFullImageUrl } from '../../utils/imageUtils';

const ProductEdit = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [costPrice, setCostPrice] = useState(0);
  const [isPublished, setIsPublished] = useState(false);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setCostPrice(product.costPrice || 0);
      setIsPublished(product.isPublished);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ productId, name, price, costPrice, image, brand, category, description, countInStock, isPublished }).unwrap();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
    } catch (err) {}
  };

  return (
    <div className="pt-24 pb-20 animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-xl mx-auto px-6">
        
        <Link to="/admin/productlist" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 mb-8 transition-colors">
           <FaArrowLeft size={10} /> Back to Products
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
           <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 border-b border-slate-50 dark:border-white/5 pb-4">Edit Product</h1>

           {loadingUpdate && <Loader />}
           {isLoading ? <Loader /> : error ? <Message variant="red">Sync Error</Message> : (
              <form onSubmit={submitHandler} className="space-y-4">
                 <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl mb-6">
                    <div>
                        <h3 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Visibility Status</h3>
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Controls if this product appears in the public store</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                        <span className="ml-3 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">
                            {isPublished ? 'Published' : 'Draft'}
                        </span>
                    </label>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                 </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Cost Price (₹)</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white text-emerald-500"
                        value={costPrice}
                        onChange={e => setCostPrice(e.target.value)}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Count In Stock</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                        value={countInStock}
                        onChange={e => setCountInStock(e.target.value)}
                      />
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand</label>
                   <input 
                     type="text" 
                     className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                     value={brand}
                     onChange={e => setBrand(e.target.value)}
                   />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                   <input 
                     type="text" 
                     className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                     value={category}
                     onChange={e => setCategory(e.target.value)}
                   />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        className="flex-grow bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                      />
                      <label className="cursor-pointer bg-slate-100 dark:bg-white/10 px-4 flex items-center justify-center rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-slate-500">
                         <FaCloudUploadAlt size={16} />
                         <input type="file" className="hidden" onChange={uploadFileHandler} />
                      </label>
                   </div>
                   {image && (
                      <div className="w-20 h-20 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-xl p-2 mb-2">
                         <img src={getFullImageUrl(image)} alt="preview" className="w-full h-full object-contain" />
                      </div>
                   )}
                   {loadingUpload && <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse mt-1">Uploading...</p>}
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                   <textarea 
                     rows="3"
                     className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white resize-none"
                     value={description}
                     onChange={e => setDescription(e.target.value)}
                   />
                </div>

                <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-12 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4">
                   <FaSave size={14} /> Update Product
                </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
