import { Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../../src/redux/slices/productsApiSlice';
import { FaEdit, FaTrash, FaPlus, FaBoxOpen } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ProductList = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery({ keyword: '' });
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const navigate = useNavigate();

  const deleteHandler = async (id) => {
    if (window.confirm('Confirm Deletion')) {
      try { await deleteProduct(id); refetch(); } catch (err) {}
    }
  };

  const createProductHandler = async () => {
    try {
      const res = await createProduct().unwrap();
      navigate(`/admin/product/${res._id}/edit`);
    } catch (err) {}
  };

  return (
    <div className="pt-24 pb-20 animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
      <div className="main-container">
        
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-white/5 pb-4">
           <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Products</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manage Inventory</p>
           </div>
           <button 
             onClick={createProductHandler}
             disabled={loadingCreate}
             className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-2"
           >
              <FaPlus size={10} /> Add Product
           </button>
        </div>

        {loadingDelete && <Loader />}
        
        {isLoading ? <Loader /> : error ? <Message variant="red">Sync Error</Message> : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                   <tr>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand</th>
                      <th className="p-4"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                   {products.products.map(product => (
                      <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                         <td className="p-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded p-0.5">
                                  <img src={product.image} alt="" className="w-full h-full object-contain" />
                               </div>
                               <span className="text-[12px] font-black text-slate-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
                            </div>
                         </td>
                         <td className="p-4 text-[12px] font-black text-slate-900 dark:text-emerald-400">₹{product.price.toLocaleString('en-IN')}</td>
                         <td className="p-4">
                            <span className="text-[9px] font-black text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-200 dark:border-white/10">{product.category}</span>
                         </td>
                         <td className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.brand}</td>
                         <td className="p-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Link to={`/admin/product/${product._id}/edit`} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                                  <FaEdit size={12} />
                               </Link>
                               <button onClick={() => deleteHandler(product._id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                  <FaTrash size={12} />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
