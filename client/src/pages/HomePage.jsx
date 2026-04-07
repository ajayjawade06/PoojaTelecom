import { useState, useEffect } from 'react';
import { useGetProductsQuery, useGetCategoriesAndBrandsQuery } from '../redux/slices/productsApiSlice';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import HeroCarousel from '../components/HeroCarousel';
import ChatWidget from '../components/ChatWidget';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import { FaTruck, FaShieldAlt, FaHeadset, FaUndo, FaArrowRight, FaFilter, FaTimes, FaStar } from 'react-icons/fa';

const HomePage = () => {
  const { keyword } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL
  const filtersFromUrl = {
    keyword: keyword || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    stock: searchParams.get('stock') || '',
    sort: searchParams.get('sort') || 'newest',
  };

  const [filters, setFilters] = useState(filtersFromUrl);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  // Fetch filters options
  const { data: filterOptions, isLoading: isLoadingFilters } = useGetCategoriesAndBrandsQuery();

  // Fetch products based on filters
  const { data: productsData, isLoading: isLoadingProducts, error: productsError, isFetching } = useGetProductsQuery({
    ...filters,
    pageNumber: page,
  });

  // Sync state to URL and reset properties on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.rating) params.set('rating', filters.rating);
    if (filters.stock) params.set('stock', filters.stock);
    if (filters.sort) params.set('sort', filters.sort);
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // When filters change drastically, reset page to 1
  useEffect(() => {
    setPage(1);
  }, [filters.category, filters.brand, filters.minPrice, filters.maxPrice, filters.rating, filters.stock, filters.sort, keyword]);

  // Append data on page change
  useEffect(() => {
    if (productsData?.products) {
      if (page === 1) {
        setAllProducts(productsData.products);
      } else {
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const newProducts = productsData.products.filter(p => !existingIds.has(p._id));
          return [...prev, ...newProducts];
        });
      }
    }
  }, [productsData, page]);

  const handleViewMore = () => {
    if (productsData && page < productsData.pages) {
      setPage(prev => prev + 1);
    }
  };

  const activeFiltersCount = [filters.category, filters.brand, filters.minPrice, filters.rating, filters.stock].filter(Boolean).length;

  return (
    <div className="bg-transparent min-h-screen pb-12 pt-28 relative z-10 w-full flex flex-col items-center text-slate-900 dark:text-slate-100">
      
      {/* Hero Carousel */}
      {!keyword && activeFiltersCount === 0 && (
        <div className="main-container mb-20 relative z-10 w-full max-w-7xl mx-auto px-4">
          <HeroCarousel />
        </div>
      )}

      <div className="main-container w-full max-w-7xl mx-auto px-4">
        
        {/* Compact Features Grid */}
        {!keyword && activeFiltersCount === 0 && (
          <>
            <motion.section 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {[
                { icon: FaTruck, title: 'Express Delivery', desc: 'Secure & Fast' },
                { icon: FaShieldAlt, title: 'Warranty Plus', desc: '100% Genuine' },
                { icon: FaHeadset, title: 'Elite Support', desc: '24/7 Expert Help' },
                { icon: FaUndo, title: 'Easy Returns', desc: 'Simple 7-Day Policy' }
              ].map((f, i) => (
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }}
                  key={i} className="flex flex-col items-center text-center p-8 rounded-[32px] bg-white dark:bg-[#1c1c1e] transition-colors duration-200 border border-slate-100 dark:border-white/5 shadow-sm group"
                >
                  <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-6 transition-transform group-hover:scale-110">
                    <f.icon size={22} />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-[15px] mb-2 tracking-tight">{f.title}</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.section>

            {/* Enterprise Social Proof Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full py-10 mb-20 bg-[var(--surface)] border border-[var(--border)] rounded-[40px] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 px-8 shadow-sm"
            >
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-amber-400 text-lg" />
                  ))}
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Trusted by over 50k customers</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-slate-200 dark:bg-white/10"></div>
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-0.5 tracking-tight">4.9/5</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average Rating</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-0.5 tracking-tight">100k+</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Orders Delivered</p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Featured Products Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {keyword ? `Results for "${keyword}"` : activeFiltersCount > 0 ? 'Filtered Results' : 'Explore Premium Tech'}
              </h2>
              {productsData && <p className="text-sm text-slate-500 mt-1">Showing {productsData.count || allProducts.length} items</p>}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-5 py-2.5 rounded-full text-[13px] font-medium text-slate-800 dark:text-slate-200 shadow-sm relative transition-all"
              >
                <FaFilter className="text-slate-500" /> Filters
                {activeFiltersCount > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-[#1c1c1e]"></span>}
              </button>
              <SortDropdown sort={filters.sort} setSort={(sort) => setFilters({ ...filters, sort })} />
            </div>
          </div>

          <div className="flex gap-8 relative items-start">
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              categories={filterOptions?.categories} 
              brands={filterOptions?.brands} 
              isLoadingFilters={isLoadingFilters}
              isFetching={isFetching}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />

            <div className="flex-grow w-full">
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {filters.category && (
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                      {filters.category} <FaTimes className="cursor-pointer hover:text-rose-500 transition-colors" onClick={() => setFilters({ ...filters, category: '' })}/>
                    </span>
                  )}
                  {filters.brand && filters.brand.split(',').map((b, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                      {b} <FaTimes className="cursor-pointer hover:text-rose-500 transition-colors" onClick={() => {
                        const newBrands = filters.brand.split(',').filter(brand => brand !== b).join(',');
                        setFilters({ ...filters, brand: newBrands });
                      }}/>
                    </span>
                  ))}
                  <button 
                    onClick={() => setFilters({ ...filters, category: '', brand: '', minPrice: '', maxPrice: '', rating: '', stock: '' })}
                    className="text-[10px] font-bold text-blue-500 hover:text-blue-600 uppercase tracking-widest px-2"
                  >
                    Clear All
                  </button>
                </div>
              )}

              <div className={`h-1 mx-2 mb-4 rounded-full overflow-hidden transition-all duration-200 ${isFetching ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}>
                <div className="w-full h-full bg-blue-500/20 loading-bar-shimmer">
                  <div className="h-full bg-blue-500 w-[40%] rounded-full"></div>
                </div>
              </div>

              {isLoadingProducts && page === 1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                </div>
              ) : productsError ? (
                <div className="py-20 text-center text-rose-500 font-bold bg-rose-500/10 rounded-2xl border border-rose-500/20">
                  {productsError?.data?.message || 'Connection failed'}
                </div>
              ) : allProducts.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <FaFilter size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">No Products Found</h3>
                  <p className="text-xs font-medium text-slate-500 px-4">Try adjusting your filters or search terms.</p>
                  <button 
                    onClick={() => setFilters({ ...filters, category: '', brand: '', minPrice: '', maxPrice: '', rating: '', stock: '', sort: 'newest' })}
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className={`transition-all duration-200 ${isFetching && page === 1 ? 'opacity-40 grayscale-[0.5] pointer-events-none' : 'opacity-100 grayscale-0'}`}>
                    <motion.div 
                      initial="hidden" animate="visible"
                      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[400px]"
                    >
                      {allProducts.map((product) => (
                        <motion.div key={product._id} variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.4 } } }}>
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                      {isFetching && page > 1 && (
                        [...Array(4)].map((_, i) => <ProductSkeleton key={`load-${i}`} />)
                      )}
                    </motion.div>
                  </div>
                  
                  {productsData && page < productsData.pages && (
                    <div className="mt-12 flex justify-center">
                      <button
                        onClick={handleViewMore}
                        disabled={isFetching}
                        className="group px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-black uppercase tracking-widest text-[11px] shadow-lg hover:shadow-slate-300 dark:hover:shadow-none transition-all flex items-center gap-3"
                      >
                        {isFetching ? (
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
                </>
              )}
            </div>
          </div>
        </section>

        {/* Tiny Newsletter */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-[32px] p-12 relative overflow-hidden mb-12 flex flex-col items-center"
        >
          <div className="relative z-10 text-center max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              Exclusive <span className="text-blue-500">Tech Drops.</span>
            </h2>
            <p className="text-slate-500 text-[14px] font-medium mb-8">
              Zero spam. Early access. Private offers.
            </p>
            <form className="flex gap-2 p-1.5 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-full shadow-sm">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow bg-transparent px-5 py-2.5 text-slate-900 dark:text-white outline-none font-medium text-[13px]"
              />
              <button type="button" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-8 py-2.5 rounded-full hover:opacity-90 transition-all text-[13px]">
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      <ChatWidget />
    </div>
  );
};

export default HomePage;
