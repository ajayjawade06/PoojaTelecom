import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useBulkUpdateStockMutation
} from '../../../src/redux/slices/productsApiSlice';
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaSave, FaTimes, FaLayerGroup, FaArrowLeft } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [page, setPage] = useState(1);
  const { data: productsData, isLoading, error, refetch } = useGetProductsQuery({ pageNumber: page, isAdmin: 'true' });
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [bulkUpdateStock, { isLoading: loadingBulk }] = useBulkUpdateStockMutation();
  const navigate = useNavigate();

  const [isBulkMode, setIsBulkMode] = useState(false);
  const [stockUpdates, setStockUpdates] = useState({});

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const res = await createProduct().unwrap();
      toast.success('Product created successfully');
      navigate(`/admin/product/${res._id}/edit`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleStockChange = (productId, value) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: Number(value)
    }));
  };

  const saveBulkUpdates = async () => {
    const updates = Object.entries(stockUpdates).map(([_id, countInStock]) => ({
      _id,
      countInStock
    }));

    if (updates.length === 0) {
      setIsBulkMode(false);
      return;
    }

    try {
      await bulkUpdateStock({ stockUpdates: updates }).unwrap();
      toast.success('Inventory updated');
      setIsBulkMode(false);
      setStockUpdates({});
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="pt-24 pb-20 animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
      <div className="main-container max-w-7xl mx-auto px-4">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-slate-100 dark:border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-sm"
            >
                <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Inventory</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Total {productsData?.count || 0} Items</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {!isBulkMode ? (
              <button
                onClick={() => setIsBulkMode(true)}
                className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center gap-2 border border-slate-200 dark:border-white/10"
              >
                <FaLayerGroup size={10} /> Bulk Edit Stock
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={saveBulkUpdates}
                  disabled={loadingBulk}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                >
                  {loadingBulk ? 'Saving...' : <><FaSave size={10} /> Save Changes</>}
                </button>
                <button
                  onClick={() => { setIsBulkMode(false); setStockUpdates({}); }}
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                >
                  <FaTimes size={10} /> Cancel
                </button>
              </div>
            )}

            <button
              onClick={createProductHandler}
              disabled={loadingCreate}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
            >
              <FaPlus size={10} /> Add New Product
            </button>
          </div>
        </div>

        {isLoading ? <Loader /> : error ? <Message variant="red">{error?.data?.message || 'Sync Error'}</Message> : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <tr>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categorization</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                    <th className="p-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {productsData.products.map(product => (
                    <tr key={product._id} className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group ${product.countInStock < 5 ? 'bg-amber-500/5' : ''}`}>
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-lg p-1.5 shadow-sm">
                            <img src={product.image} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-black text-slate-900 dark:text-white truncate max-w-[240px] leading-tight">{product.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{product.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-[9px] font-black text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded uppercase tracking-widest border border-slate-200 dark:border-white/10">{product.category}</span>
                      </td>
                      <td className="p-5">
                        {isBulkMode ? (
                          <input
                            type="number"
                            min="0"
                            defaultValue={product.countInStock}
                            onChange={(e) => handleStockChange(product._id, e.target.value)}
                            className="w-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[12px] font-black text-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                          />
                        ) : (
                           <div className="flex flex-col gap-1.5">
                             <div className="flex items-center gap-2">
                               <span className={`text-[12px] font-black ${product.countInStock === 0 ? 'text-rose-500' : product.countInStock < 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                 {product.countInStock} Units
                               </span>
                               {product.countInStock < 5 && (
                                 <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded animate-pulse">Low</span>
                               )}
                             </div>
                             {!product.isPublished && (
                               <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded w-fit border border-rose-500/20">Draft</span>
                             )}
                           </div>
                        )}
                      </td>
                      <td className="p-5 text-[13px] font-black text-slate-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-1">
                          <Link to={`/admin/product/${product._id}/edit`} className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all" title="Edit">
                            <FaEdit size={14} />
                          </Link>
                          <button onClick={() => deleteHandler(product._id)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all" title="Delete">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {productsData.pages > 1 && (
              <div className="flex justify-center items-center gap-2 p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
                {[...Array(productsData.pages).keys()].map(x => (
                  <button
                    key={x + 1}
                    onClick={() => setPage(x + 1)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${page === x + 1 ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
