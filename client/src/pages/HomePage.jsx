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
    <div className="bg-transparent min-h-screen pb-20 pt-24 lg:pt-32 font-sans overflow-x-hidden animate-fade-in relative z-10 w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-24 w-full max-w-7xl relative z-10">
        <HeroCarousel />
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 w-full max-w-7xl relative z-10">
        
        {/* Trusted Features Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-2xl relative overflow-hidden mb-32 group transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { icon: FaTruck, title: 'Secure Shipping', desc: 'Fast & Reliable Delivery' },
                { icon: FaShieldAlt, title: 'Hardware Warranty', desc: '100% Certified Components' },
                { icon: FaHeadset, title: '24/7 Support', desc: 'Always Here to Help' },
                { icon: FaUndo, title: 'Easy Returns', desc: '7-Day Return Policy' }
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center group/item hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-20 h-20 rounded-[2rem] bg-slate-200 dark:bg-white/5 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-xl border border-slate-300 dark:border-white/5 group-hover/item:scale-110 group-hover/item:bg-emerald-500/20 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-300 group-hover/item:border-emerald-500/30 transition-all duration-500 mb-6">
                    <f.icon size={30} />
                  </div>
                  <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-[10px] mb-2">{f.title}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-300">Products</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg text-sm">Browse our extensive catalog of high-performance mobile devices and accessories.</p>
            </div>
            <Link to="/search/all" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-6 py-3 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
              View All Products <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 relative z-10">
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
            <div className="mt-24 flex justify-center relative z-10">
              <button
                onClick={handleViewMore}
                disabled={isExpanding}
                className="group relative flex items-center gap-4 px-12 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl font-black uppercase tracking-[0.2em] text-xs text-slate-900 dark:text-white hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                {isExpanding ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="relative z-10">Load More Products</span>
                    <FaArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500 relative z-10" />
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden mb-12 shadow-xl dark:shadow-2xl border border-slate-200 dark:border-white/10 group transition-colors duration-300">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
           <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                 <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
                   Subscribe to our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Newsletter.</span>
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">
                   Sign up to receive updates on our latest products, exclusive offers, and special events directly in your inbox.
                 </p>
                 <form className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="email" 
                      placeholder="Enter your email address..." 
                      className="flex-grow bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-white/10 focus:border-emerald-500/50 transition-all font-medium text-sm tracking-widest ring-4 ring-transparent focus:ring-emerald-500/10 placeholder-slate-400 dark:placeholder-slate-600"
                    />
                    <button className="relative overflow-hidden group/btn bg-emerald-500 text-white font-black px-10 py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                      Subscribe <FaPaperPlane size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                 </form>
              </div>
              <div className="hidden lg:block relative">
                 <div className="w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] absolute -right-10 -bottom-10 pointer-events-none"></div>
                 <div className="text-[10rem] text-slate-900/5 dark:text-white/5 font-black leading-none select-none tracking-tighter uppercase">
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
