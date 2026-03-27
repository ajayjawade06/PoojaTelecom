import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaLaptop, FaMobileAlt, FaHeadphones, FaWatchmanMonitoring, FaKeyboard, FaThLarge, FaBolt } from 'react-icons/fa';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const { data: products, isLoading, error } = useGetProductsQuery({});

  const categories = [
    { name: 'All Products', icon: <FaThLarge />, color: 'bg-slate-100' },
    { name: 'Mobiles', icon: <FaMobileAlt />, color: 'bg-blue-50' },
    { name: 'Laptops', icon: <FaLaptop />, color: 'bg-emerald-50' },
    { name: 'Wearables', icon: <FaWatchmanMonitoring />, color: 'bg-amber-50' },
    { name: 'Audio', icon: <FaHeadphones />, color: 'bg-rose-50' },
    { name: 'Accessories', icon: <FaKeyboard />, color: 'bg-violet-50' },
    { name: 'Tablets', icon: <FaThLarge />, color: 'bg-blue-50' },
  ];

  const filteredProducts = products && products.products
    ? selectedCategory === 'All Products' 
      ? products.products 
      : products.products.filter(p => p.category === selectedCategory)
    : [];

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-24 md:pt-32">
      
      {/* Hero Banner Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-slate-900/40 group border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-16 relative z-10">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-emerald-500/10 text-emerald-400 font-black text-xs tracking-[0.2em] uppercase mb-8 border border-emerald-500/20 backdrop-blur-md">
                <FaBolt className="animate-pulse" /> Limited Edition Launch
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                The New <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">iPhone 17 Pro</span>
              </h1>
              <p className="text-lg text-slate-400 mb-10 font-medium leading-relaxed max-w-md">
                Experience the first phone forged in ultra-light titanium with the A19 Bionic chip. Now available with exclusive pre-order benefits.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/product/69c6b3db9d6eb3e81bdcc18f" className="bg-emerald-500 text-white font-black py-5 px-10 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:-translate-y-1 hover:shadow-emerald-500/40 active:scale-95">
                  Buy Now
                </Link>
                <Link to="/product/69c6b3db9d6eb3e81bdcc18f" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black py-5 px-10 rounded-2xl transition-all backdrop-blur-md">
                  Explore Benefits
                </Link>
              </div>
            </div>
            <div className="mt-12 md:mt-0 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-700 w-full md:w-1/2 h-80 md:h-auto">
              <div className="absolute inset-x-0 -bottom-10 bg-emerald-500/30 blur-[120px] h-64 rounded-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=contain" 
                className="w-96 h-96 object-contain relative z-10 drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]" 
                alt="iPhone 17 Pro" 
                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1521298353193-6da10d881fd5?q=80&w=800&auto=format&fit=contain"}}
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4">
        
        {/* Categories Section */}
        <div className="mb-12">
           <div className="flex items-center py-8 border-t border-slate-200 border-dashed mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase tracking-widest text-sm">
                 Browse {selectedCategory}
              </h2>
              <div className="h-px bg-slate-200 flex-grow ml-8"></div>
           </div>

           <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                    selectedCategory === cat.name
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                      : 'bg-white text-slate-700 border-slate-100 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
           </div>
        </div>

        {/* Products Section */}
        <div className="mb-16">
           {isLoading ? (
             <Loader />
           ) : error ? (
             <Message variant="red">{error?.data?.message}</Message>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {filteredProducts.length > 0 ? (
                 filteredProducts.map((product) => (
                     <ProductCard key={product._id} product={product} />
                   ))
               ) : (
                 <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm border-dashed">
                    <p className="text-slate-400 font-bold mb-4">No products in this category yet.</p>
                    <button onClick={() => setSelectedCategory('All Products')} className="text-emerald-500 font-black hover:underline uppercase text-xs tracking-widest">View All Products</button>
                 </div>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
