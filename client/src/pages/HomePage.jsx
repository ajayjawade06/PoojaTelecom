import { useState } from 'react';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import HeroCarousel from '../components/HeroCarousel';
import ChatWidget from '../components/ChatWidget';
import Message from '../components/Message';
import { FaThLarge, FaShippingFast, FaShieldAlt, FaHeadset, FaWallet, FaPaperPlane } from 'react-icons/fa';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const { data: products, isLoading, error } = useGetProductsQuery({});

  const categories = [
    { name: 'All Products', icon: <FaThLarge /> },
    { name: 'Mobiles', icon: null },
    { name: 'Laptops', icon: null },
    { name: 'Wearables', icon: null },
    { name: 'Audio', icon: null },
    { name: 'Accessories', icon: null },
    { name: 'Tablets', icon: null },
  ];

  const features = [
    { icon: <FaShippingFast />, title: 'Free Express Delivery', desc: 'On orders over ₹5,000' },
    { icon: <FaShieldAlt />, title: 'Brand Warranty', desc: '100% Genuine Products' },
    { icon: <FaHeadset />, title: '24/7 Expert Support', desc: 'Dedicated helpline' },
    { icon: <FaWallet />, title: 'Secure Payments', desc: 'Razorpay & EMI Options' },
  ];

  const filteredProducts = products && products.products
    ? selectedCategory === 'All Products' 
      ? products.products 
      : products.products.filter(p => p.category === selectedCategory)
    : [];

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-24 lg:pt-32 font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-20 animate-fade-in">
        <HeroCarousel />
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4">
        
        {/* Categories Section */}
        <div className="mb-12">
           <div className="flex items-center py-8 border-t border-slate-200 border-dashed mb-8">
              <h2 className="text-sm font-black text-slate-400 tracking-[0.2em] uppercase">
                 Explore Collections
              </h2>
              <div className="h-px bg-slate-200 flex-grow ml-8 opacity-50"></div>
           </div>

           <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                    selectedCategory === cat.name
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 active:scale-95'
                      : 'bg-white text-slate-700 border-slate-100 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {cat.icon && <span className="text-emerald-500">{cat.icon}</span>}
                    {cat.name}
                  </span>
                </button>
              ))}
           </div>
        </div>

        {/* Products Section */}
        <div className="mb-24">
           {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
             </div>
           ) : error ? (
             <Message variant="red">{error?.data?.message}</Message>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-slide-up">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-slate-100 border-dashed">
                     <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaThLarge className="text-slate-300 text-2xl" />
                     </div>
                     <p className="text-slate-500 font-bold mb-4">No products found in this category.</p>
                     <button onClick={() => setSelectedCategory('All Products')} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all animate-pulse">View All Products</button>
                  </div>
                )}
             </div>
           )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
           {features.map((f, i) => (
             <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                   <span className="text-2xl">{f.icon}</span>
                </div>
                <h3 className="font-extrabold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{f.desc}</p>
             </div>
           ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden mb-12 shadow-2xl shadow-slate-900/40 border border-white/5 group">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                 <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                   Stay Ahead of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Curve.</span>
                 </h2>
                 <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
                   Subscribe to our newsletter and get exclusive access to new launches, special deals and tech news before anyone else.
                 </p>
                 <form className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:bg-white focus:text-slate-900 transition-all font-medium"
                    />
                    <button className="bg-emerald-500 text-white font-black px-10 py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 group">
                      Join Club <FaPaperPlane className="group-hover:rotate-12 transition-transform" />
                    </button>
                 </form>
              </div>
              <div className="hidden lg:block">
                 <div className="w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] absolute -right-10 -bottom-10 pointer-events-none"></div>
                 <div className="text-[12rem] text-white/5 font-black leading-none select-none tracking-tighter">
                    POOJA
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Floating Widget */}
      <ChatWidget />
    </div>
  );
};

export default HomePage;
