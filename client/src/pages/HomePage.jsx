import { useState, useEffect } from 'react';
import { useGetProductsQuery, useGetCategoriesAndBrandsQuery } from '../redux/slices/productsApiSlice';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import HeroCarousel from '../components/HeroCarousel';
import ChatWidget from '../components/ChatWidget';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import { FaTruck, FaShieldAlt, FaHeadset, FaUndo, FaArrowRight, FaFilter, FaTimes } from 'react-icons/fa';

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
    // Note: We no longer clear allProducts here to keep the UI smooth.
    // The new products will replace the old ones once the fetch is complete.
  }, [filters.category, filters.brand, filters.minPrice, filters.maxPrice, filters.rating, filters.stock, filters.sort, keyword]);

  // Append data on page change
  useEffect(() => {
    if (productsData?.products) {
      if (page === 1) {
        setAllProducts(productsData.products);
      } else {
        setAllProducts(prev => {
          // simple deduplication based on ID just in case
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

  // Check if we have active filters to show active tags
  const activeFiltersCount = [filters.category, filters.brand, filters.minPrice, filters.rating, filters.stock].filter(Boolean).length;

  return (
    <div className="bg-transparent min-h-screen pb-12 pt-20 animate-fade-in relative z-10 w-full flex flex-col items-center">
      
      {/* Ambient Aesthetics */}
      <div className="hidden lg:block absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="hidden lg:block absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Carousel (Only show on bare root path without searches) */}
      {!keyword && activeFiltersCount === 0 && (
        <div className="main-container mb-20 relative z-10 w-full max-w-7xl mx-auto px-4">
          <HeroCarousel />
        </div>
      )}

      <div className="main-container w-full max-w-7xl mx-auto px-4">
        
        {/* Compact Features Grid (Only show on bare root path) */}
        {!keyword && activeFiltersCount === 0 && (
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
        )}

        {/* Featured Products Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
               <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
               <div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                   {keyword ? `Results for "${keyword}"` : activeFiltersCount > 0 ? 'Filtered Results' : 'Explore Premium Tech'}
                 </h2>
                 {productsData && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Showing {productsData.count || allProducts.length} items</p>}
               </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm relative"
              >
                <FaFilter className="text-emerald-500" /> Filters
                {activeFiltersCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>}
              </button>

              <SortDropdown sort={filters.sort} setSort={(sort) => setFilters({ ...filters, sort })} />
            </div>
          </div>

          <div className="flex gap-8 relative items-start">
            {/* Filter Sidebar Component */}
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

            {/* Product Grid */}
            <div className="flex-grow w-full">
              {/* Active Filters Bar */}
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
                    onClick={() => setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', rating: '', stock: '' })}
                    className="text-[10px] font-bold text-emerald-500 hover:text-emerald-600 uppercase tracking-widest px-2"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Smooth Loading Bar */}
              <div className={`h-1 mx-2 mb-4 rounded-full overflow-hidden transition-all duration-500 ${isFetching ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}>
                 <div className="w-full h-full bg-emerald-500/20 loading-bar-shimmer">
                    <div className="h-full bg-emerald-500 w-[40%] rounded-full"></div>
                 </div>
              </div>

              {/* Grid content */}
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
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">No Products Found</h3>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4">Try adjusting your filters or search terms.</p>
                   <button 
                     onClick={() => setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', rating: '', stock: '', sort: 'newest' })}
                     className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                   >
                     Reset Filters
                   </button>
                </div>
              ) : (
                <>
                  <div className={`transition-all duration-500 ${isFetching && page === 1 ? 'opacity-40 grayscale-[0.5] pointer-events-none' : 'opacity-100 grayscale-0'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[400px]">
                      {allProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                      {isFetching && page > 1 && (
                        [...Array(4)].map((_, i) => <ProductSkeleton key={`load-${i}`} />)
                      )}
                    </div>
                  </div>
                  
                  {productsData && page < productsData.pages && (
                    <div className="mt-12 flex justify-center">
                      <button
                        onClick={handleViewMore}
                        disabled={isFetching}
                        className="group px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-black uppercase tracking-widest text-[11px] shadow-lg hover:shadow-slate-300 dark:hover:shadow-none active:scale-95 transition-all flex items-center gap-3"
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
                 <button type="button" className="bg-emerald-500 text-white font-black px-6 py-2 rounded-lg hover:bg-emerald-600 transition-all text-[11px] uppercase tracking-widest">
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
