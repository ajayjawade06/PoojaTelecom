import { Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../../src/redux/slices/productsApiSlice';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
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
    <div className="container mx-auto px-4 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Products</h1>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 flex items-center gap-2 rounded-lg font-bold transition-colors shadow-sm" onClick={createProductHandler}>
          <FaPlus /> Create Product
        </button>
      </div>

      {loadingDelete && <Loader />}
      {loadingCreate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="red">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">NAME</th>
                <th className="px-6 py-4 font-bold">PRICE</th>
                <th className="px-6 py-4 font-bold">CATEGORY</th>
                <th className="px-6 py-4 font-bold">BRAND</th>
                <th className="px-6 py-4 font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-700">{product._id}</td>
                  <td className="px-6 py-4 text-slate-700 font-medium truncate max-w-xs">{product.name}</td>
                  <td className="px-6 py-4 text-slate-700 font-bold">₹{product.price}</td>
                  <td className="px-6 py-4 text-slate-700">{product.category}</td>
                  <td className="px-6 py-4 text-slate-700">{product.brand}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link to={`/admin/product/${product._id}/edit`}>
                      <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors">
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded transition-colors"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default ProductList;
