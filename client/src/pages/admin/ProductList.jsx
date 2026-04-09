import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
    useUpdateProductMutation
} from '../../../src/redux/slices/productsApiSlice';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaArrowLeft, FaPencilAlt } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { getFullImageUrl } from '../../utils/imageUtils';

const ProductList = () => {
    const [page, setPage] = useState(1);
    const { data: productsData, isLoading, error, refetch } = useGetProductsQuery({ pageNumber: page, isAdmin: 'true' });
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const navigate = useNavigate();

    // Inline editing tracking
    const [editingCell, setEditingCell] = useState(null);

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

    const handleEditClick = (product, field) => {
        setEditingCell({ id: product._id, field, value: field === 'price' ? product.price : product.countInStock });
    };

    const handleEditSave = async (product) => {
        if (!editingCell) return;
        try {
            const updatedData = {
                productId: product._id,
                name: product.name,
                price: editingCell.field === 'price' ? Number(editingCell.value) : product.price,
                image: product.image,
                brand: product.brand,
                category: product.category,
                countInStock: editingCell.field === 'stock' ? Number(editingCell.value) : product.countInStock,
                description: product.description,
            };
            await updateProduct(updatedData).unwrap();
            toast.success(`${editingCell.field} instantly updated`);
            setEditingCell(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="pt-24 pb-20 bg-white dark:bg-slate-900 min-h-screen">
            <div className="main-container max-w-7xl mx-auto px-4">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-slate-100 dark:border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/admin')}
                            className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-full transition-all shadow-sm"
                        >
                            <FaArrowLeft size={14} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Inventory Stock-Board</h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Live Editing Enabled</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={createProductHandler}
                            disabled={loadingCreate}
                            className="bg-blue-500 text-white px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 hover:scale-105 flex items-center gap-2"
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
                                        <th className="p-5 text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1.5"><FaPencilAlt size={10}/> Stock (Click to Edit)</th>
                                        <th className="p-5 text-[10px] font-black text-blue-500 uppercase tracking-widest"><FaPencilAlt size={10} className="inline mr-1"/> Valuation</th>
                                        <th className="p-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {productsData.products.map(product => (
                                        <tr key={product._id} className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group ${product.countInStock < 5 ? 'bg-amber-500/5' : ''}`}>
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/10 rounded-lg p-1.5 shadow-sm">
                                                        <img src={getFullImageUrl(product.image)} alt="" className="w-full h-full object-contain" />
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
                                            
                                            {/* LIVE EDIT STOCK */}
                                            <td className="p-5">
                                                {editingCell?.id === product._id && editingCell?.field === 'stock' ? (
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="number" 
                                                            className="w-20 bg-white dark:bg-slate-800 border border-blue-500 rounded px-2 py-1 text-[12px] font-black text-blue-500 outline-none"
                                                            value={editingCell.value}
                                                            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleEditSave(product)}
                                                            autoFocus
                                                        />
                                                        <button onClick={() => handleEditSave(product)} className="text-emerald-500 hover:text-emerald-600"><FaCheck size={14}/></button>
                                                    </div>
                                                ) : (
                                                    <div 
                                                        className="flex flex-col gap-1.5 cursor-pointer group/edit items-start"
                                                        onClick={() => handleEditClick(product, 'stock')}
                                                    >
                                                        <div className="flex items-center gap-2 px-2 py-0.5 -ml-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                                            <span className={`text-[12px] font-black ${product.countInStock === 0 ? 'text-rose-500' : product.countInStock < 5 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                                                {product.countInStock} Units
                                                            </span>
                                                            <FaPencilAlt size={8} className="opacity-0 group-hover/edit:opacity-100 text-blue-500 transition-opacity" />
                                                        </div>
                                                        {product.countInStock < 5 && (
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded animate-pulse">Low</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            {/* LIVE EDIT PRICE */}
                                            <td className="p-5">
                                                {editingCell?.id === product._id && editingCell?.field === 'price' ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-400 font-bold">₹</span>
                                                        <input 
                                                            type="number" 
                                                            className="w-24 bg-white dark:bg-slate-800 border border-blue-500 rounded px-2 py-1 text-[12px] font-black text-blue-500 outline-none"
                                                            value={editingCell.value}
                                                            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleEditSave(product)}
                                                            autoFocus
                                                        />
                                                        <button onClick={() => handleEditSave(product)} className="text-emerald-500 hover:text-emerald-600"><FaCheck size={14}/></button>
                                                    </div>
                                                ) : (
                                                    <div 
                                                        className="flex items-center gap-2 cursor-pointer group/edit px-2 py-0.5 -ml-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-fit"
                                                        onClick={() => handleEditClick(product, 'price')}
                                                    >
                                                        <span className="text-[13px] font-black text-slate-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
                                                        <FaPencilAlt size={8} className="opacity-0 group-hover/edit:opacity-100 text-blue-500 transition-opacity" />
                                                    </div>
                                                )}
                                            </td>

                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Link to={`/admin/product/${product._id}/edit`} className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all" title="Full Edit">
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
                                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${page === x + 1 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-100'}`}
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
