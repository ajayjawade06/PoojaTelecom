import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../../src/redux/slices/productsApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

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
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap();
      navigate('/admin/productlist');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <Link to="/admin/productlist" className="inline-block mb-6 bg-slate-100 hover:bg-slate-200 py-2 px-4 rounded text-slate-800 font-medium transition-colors">
        &larr; Go Back
      </Link>
      
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-slate-800">Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? <Loader /> : error ? <Message variant="red">{error.data.message}</Message> : (
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-emerald-500" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
              <input type="number" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-emerald-500" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
              <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-emerald-500 mb-2" value={image} onChange={(e) => setImage(e.target.value)} />
              <input type="file" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-emerald-500" onChange={uploadFileHandler} />
              {loadingUpload && <Loader />}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Brand</label>
              <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-emerald-500" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Count In Stock</label>
              <input type="number" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-emerald-500" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-emerald-500" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea className="w-full px-3 py-2 border rounded focus:outline-none focus:border-emerald-500" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded transition-colors shadow-sm">
              Update Product
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEdit;
