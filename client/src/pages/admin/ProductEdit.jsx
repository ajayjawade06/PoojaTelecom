import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../../src/redux/slices/productsApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { FaArrowLeft, FaCloudUploadAlt, FaSave } from 'react-icons/fa';

const ProductEdit = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

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
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ productId, name, price, image, brand, category, description, countInStock }).unwrap();
      navigate('/admin/productlist');
    } catch (err) {}
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
           <FaArrowLeft size={10} /> Back to Catalog
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
           <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 border-b border-slate-50 dark:border-white/5 pb-4">Edit Product Profile</h1>

           {loadingUpdate && <Loader />}
           {isLoading ? <Loader /> : error ? <Message variant="red">Sync Error</Message> : (
             <form onSubmit={submitHandler} className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
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
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Units</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                        value={countInStock}
                        onChange={e => setCountInStock(e.target.value)}
                      />
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Identity</label>
                   <input 
                     type="text" 
                     className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                     value={brand}
                     onChange={e => setBrand(e.target.value)}
                   />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Catalog Category</label>
                   <input 
                     type="text" 
                     className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white"
                     value={category}
                     onChange={e => setCategory(e.target.value)}
                   />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Resource</label>
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
                   {loadingUpload && <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse mt-1">Uploading...</p>}
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Specs / Description</label>
                   <textarea 
                     rows="3"
                     className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 dark:text-white resize-none"
                     value={description}
                     onChange={e => setDescription(e.target.value)}
                   />
                </div>

                <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-12 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4">
                   <FaSave size={14} /> Commit Changes
                </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
