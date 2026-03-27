import { useState } from 'react';
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
  const [visibleCount, setVisibleCount] = useState(15);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleViewMore = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 8);
      setIsExpanding(false);
    }, 600);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 pt-24 lg:pt-32 font-sans overflow-x-hidden transition-colors duration-500">
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-20 animate-fade-in">
        <HeroCarousel />
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4">
        
        {/* Trusted Features Section */}
        <section className="py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-900/5 mb-24 transition-colors duration-500">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { icon: FaTruck, title: 'Free Express', desc: 'On orders above ₹5000' },
                { icon: FaShieldAlt, title: 'Brand Warranty', desc: '100% Genuine Products' },
                { icon: FaHeadset, title: '24/7 Support', desc: 'Expert Tech Assistance' },
                { icon: FaUndo, title: 'Easy Returns', desc: '7-Day Replacement' }
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-emerald-500 shadow-lg group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 mb-6">
                    <f.icon size={24} />
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-2">{f.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                Latest <span className="text-emerald-500 underline decoration-8 decoration-emerald-500/20 underline-offset-8">Gadgets</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold max-w-lg">Discover our curated selection of high-performance smartphones and luxury electronics.</p>
            </div>
            <Link to="/search/all" className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Explore All <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading ? (
              [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
            ) : error ? (
              <Message variant="red">{error?.data?.message}</Message>
            ) : (
              products.products.slice(0, visibleCount).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>

          {/* View More Button */}
          {!isLoading && !error && products.products.length > visibleCount && (
            <div className="mt-20 flex justify-center">
              <button
                onClick={handleViewMore}
                disabled={isExpanding}
                className="group relative flex items-center gap-4 px-12 py-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs text-slate-900 dark:text-white hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-500 shadow-xl shadow-slate-900/5 hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
              >
                {isExpanding ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Discover More</span>
                    <FaArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </>
                )}
                {/* Visual pulse for premium feel */}
                <div className="absolute inset-x-0 -bottom-4 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <div className="bg-slate-900 dark:bg-black/40 rounded-[3rem] p-8 md:p-16 relative overflow-hidden mb-12 shadow-2xl shadow-slate-900/40 border border-white/5 group transition-colors duration-500">
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
              <div className="hidden lg:block relative">
                 <div className="w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] absolute -right-10 -bottom-10 pointer-events-none"></div>
                 <div className="text-[12rem] text-white/5 font-black leading-none select-none tracking-tighter opacity-10 dark:opacity-20">
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
