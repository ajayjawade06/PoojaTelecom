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
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        const res = await createProduct().unwrap();
        navigate(`/admin/product/${res._id}/edit`);
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in relative z-10 w-full flex flex-col items-center">
      <div className="w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
               <FaBoxOpen size={24} />
            </div>
            <div>
               <h1 className="text-4xl font-black text-white tracking-tighter">Products</h1>
               <p className="text-slate-400 font-medium mt-1">Manage all products in your store.</p>
            </div>
          </div>
          <button 
            className="group relative overflow-hidden bg-emerald-500 text-white px-6 py-4 flex items-center gap-3 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 uppercase tracking-widest text-[10px]" 
            onClick={createProductHandler}
            disabled={loadingCreate}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <FaPlus className="text-lg relative z-10" /> 
            <span className="relative z-10">Create Product</span>
          </button>
        </div>

        {loadingDelete && <Loader />}
        {loadingCreate && <Loader />}
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="red">{error?.data?.message || error.error}</Message>
        ) : (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 p-2 overflow-hidden relative group">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            
            <div className="overflow-x-auto rounded-[2rem] bg-slate-950 border border-white/5 relative z-10">
              <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] font-black text-slate-400">
                  <tr>
                    <th className="px-6 py-6 border-r border-white/5">Product ID</th>
                    <th className="px-6 py-6">Name</th>
                    <th className="px-6 py-6">Price</th>
                    <th className="px-6 py-6">Category</th>
                    <th className="px-6 py-6">Brand</th>
                    <th className="px-6 py-6 border-l border-white/5 text-right flex justify-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.products.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5 transition-colors group/row">
                      <td className="px-6 py-5 text-emerald-400/80 font-mono text-[10px] tracking-widest bg-emerald-500/5 border-r border-white/5">#{product._id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-5 text-white font-black truncate max-w-[250px]">{product.name}</td>
                      <td className="px-6 py-5 text-white font-bold text-base shadow-inner">₹{product.price.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-5">
                         <span className="bg-white/5 text-slate-300 font-bold px-3 py-1.5 rounded-xl border border-white/10 text-[10px] uppercase tracking-widest">
                            {product.category}
                         </span>
                      </td>
                      <td className="px-6 py-5 text-slate-400 font-black uppercase tracking-widest text-[10px]">{product.brand}</td>
                      <td className="px-6 py-5 text-right flex justify-end gap-3 border-l border-white/5">
                        <Link to={`/admin/product/${product._id}/edit`}>
                          <button 
                            className="p-3 bg-white/5 border border-white/10 hover:border-blue-500 hover:text-white hover:bg-blue-500/20 text-slate-400 rounded-xl transition-all shadow-inner active:scale-95 group/btn"
                            title="Edit Product"
                          >
                            <FaEdit className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </Link>
                        <button
                          className="p-3 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-rose-400 text-rose-500 rounded-xl transition-all shadow-inner active:scale-95 group/btn"
                          onClick={() => deleteHandler(product._id)}
                          title="Delete Product"
                        >
                          <FaTrash className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductList;
