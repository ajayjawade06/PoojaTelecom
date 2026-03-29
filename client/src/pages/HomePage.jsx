import { useState, useEffect } from 'react';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import HeroCarousel from '../components/HeroCarousel';
import ChatWidget from '../components/ChatWidget';
import Message from '../components/Message';
import { FaTruck, FaShieldAlt, FaHeadset, FaUndo, FaArrowRight, FaPaperPlane } from 'react-icons/fa';

const HomePage = () => {
  const { data: products, isLoading, error } = useGetProductsQuery({});
  const [visibleCount, setVisibleCount] = useState(10);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleViewMore = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 10);
      setIsExpanding(false);
    }, 400);
  };

  return (
    <div className="bg-transparent min-h-screen pb-12 pt-20 animate-fade-in relative z-10 w-full flex flex-col items-center">
      
      {/* Ambient Aesthetics */}
      <div className="hidden lg:block absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="hidden lg:block absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Carousel */}
      <div className="main-container mb-20 relative z-10">
        <HeroCarousel />
      </div>

      <div className="main-container">
        
        {/* Compact Features Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: FaTruck, title: 'Express Delivery', desc: 'Secure & Fast' },
            { icon: FaShieldAlt, title: 'Warranty Plus', desc: '100% Genuine' },
            { icon: FaHeadset, title: 'Elite Support', desc: '24/7 Expert Help' },
            { icon: FaUndo, title: 'Easy Returns', desc: 'Simple 7-Day Policy' }
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 rounded-[24px] bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-white/5 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-[16px] bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-100 dark:border-emerald-500/10 group-hover:scale-110 transition-transform">
                <f.icon size={24} />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-widest text-[12px] mb-2">{f.title}</h4>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Featured Products Section */}
        <section className="mb-20">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
               <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
               <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                 Explore <span className="text-emerald-500">Premium Tech</span>
               </h2>
            </div>
            <Link to="/search/all" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-2 px-4 py-2 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-lg border border-emerald-500/10 transition-all">
              Shop Store <FaArrowRight size={10} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoading ? (
              [...Array(10)].map((_, i) => <ProductSkeleton key={i} />)
            ) : error ? (
              <div className="col-span-full py-20 text-center text-rose-500 font-bold bg-rose-500/10 rounded-2xl border border-rose-500/20">
                {error?.data?.message || 'Connection failed'}
              </div>
            ) : (
              products.products.slice(0, visibleCount).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>

          {/* Load More Compact */}
          {!isLoading && !error && products.products.length > visibleCount && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleViewMore}
                disabled={isExpanding}
                className="group px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-black uppercase tracking-widest text-[11px] shadow-lg hover:shadow-slate-300 dark:hover:shadow-none active:scale-95 transition-all flex items-center gap-3"
              >
                {isExpanding ? (
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Load More Products</span>
                    <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* Tiny Newsletter */}
        <div className="bg-slate-950 dark:bg-slate-900 rounded-2xl p-10 relative overflow-hidden mb-12 flex flex-col items-center">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
           <div className="relative z-10 text-center max-w-lg">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tighter">
                Exclusive <span className="text-emerald-500">Tech Drops.</span>
              </h2>
              <p className="text-slate-400 text-[12px] font-bold mb-6 tracking-widest uppercase">
                Zero spam. Early access. Private offers.
              </p>
              <form className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
                 <input 
                   type="email" 
                   placeholder="Enter your email" 
                   className="flex-grow bg-transparent px-4 py-2 text-white outline-none font-bold text-xs"
                 />
                 <button className="bg-emerald-500 text-white font-black px-6 py-2 rounded-lg hover:bg-emerald-600 transition-all text-[11px] uppercase tracking-widest">
                   Join Hub
                 </button>
              </form>
           </div>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
};

export default HomePage;
