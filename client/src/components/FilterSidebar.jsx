import { useState, useEffect } from 'react';
import { FaTimes, FaFilter, FaStar, FaBox } from 'react-icons/fa';

const FilterSidebar = ({ filters, setFilters, categories, brands, isLoadingFilters, isFetching, isOpen, onClose }) => {
  const [localMin, setLocalMin] = useState(filters.minPrice || 0);
  const [localMax, setLocalMax] = useState(filters.maxPrice || 500000);

  useEffect(() => {
    setLocalMin(filters.minPrice || 0);
    setLocalMax(filters.maxPrice || 500000);
  }, [filters.minPrice, filters.maxPrice]);

  const applyPriceFilter = () => {
    const min = Math.max(0, Math.min(Number(localMin), Number(localMax)));
    const max = Math.max(Number(localMin), Math.min(Number(localMax), 500000));
    setFilters({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleMinInput = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setLocalMin(val === '' ? 0 : Number(val));
  };

  const handleMaxInput = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setLocalMax(val === '' ? 0 : Number(val));
  };

  // Dual thumb progress calculation
  const minPercent = (Number(localMin) / 500000) * 100;
  const maxPercent = (Number(localMax) / 500000) * 100;

  const handleBrandChange = (brand) => {
    const currentBrands = filters.brand ? filters.brand.split(',') : [];
    if (currentBrands.includes(brand)) {
      const newBrands = currentBrands.filter(b => b !== brand);
      setFilters({ ...filters, brand: newBrands.length > 0 ? newBrands.join(',') : '' });
    } else {
      currentBrands.push(brand);
      setFilters({ ...filters, brand: currentBrands.join(',') });
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-1.5">
          <FaFilter className={`transition-all duration-200 ${isFetching ? 'text-blue-500 animate-pulse scale-110' : 'text-blue-500'}`} size={10} /> Filters
        </h3>
        {isFetching && (
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
        )}
        <button 
          onClick={() => setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', rating: '', stock: '', sort: filters.sort })}
          className="text-[8px] font-bold text-slate-400 hover:text-blue-500 uppercase tracking-widest transition-colors"
        >
          Clear
        </button>
      </div>

      {isLoadingFilters ? (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        </div>
      ) : (
        <div className={`flex flex-col gap-5 transition-all duration-200 ${isFetching ? 'opacity-60 pointer-events-none grayscale-[0.3]' : 'opacity-100'}`}>
          {/* Category */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-900 dark:text-white">Category</h4>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category" 
                  checked={!filters.category || filters.category === 'All'}
                  onChange={() => setFilters({ ...filters, category: '' })}
                  className="w-3 h-3 rounded border-slate-300 dark:border-white/10 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors uppercase tracking-tight">All Categories</span>
              </label>
              {categories?.map((cat, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={filters.category === cat}
                    onChange={() => setFilters({ ...filters, category: cat })}
                    className="w-3 h-3 rounded border-slate-300 dark:border-white/10 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-900 dark:text-white">Brand</h4>
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {brands?.map((brand, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filters.brand ? filters.brand.split(',').includes(brand) : false}
                    onChange={() => handleBrandChange(brand)}
                    className="w-3 h-3 rounded border-slate-300 dark:border-white/10 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range — Dual Slider + Manual Inputs */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-900 dark:text-white">Price Range</h4>
            
            {/* Manual Input Fields */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Min</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={localMin}
                    onChange={handleMinInput}
                    onBlur={applyPriceFilter}
                    onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-6 pr-2 text-[11px] font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500/50 transition-colors text-right"
                  />
                </div>
              </div>
              <span className="text-slate-300 dark:text-slate-600 font-bold mt-4">—</span>
              <div className="flex-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Max</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={localMax}
                    onChange={handleMaxInput}
                    onBlur={applyPriceFilter}
                    onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-6 pr-2 text-[11px] font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500/50 transition-colors text-right"
                  />
                </div>
              </div>
            </div>

            {/* Visual Slider Track */}
            <div className="relative h-6 flex items-center">
              {/* Track Background */}
              <div className="absolute left-0 right-0 h-[5px] bg-slate-200 dark:bg-white/10 rounded-full"></div>
              {/* Active Range Fill */}
              <div 
                className="absolute h-[5px] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-100"
                style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
              ></div>
              {/* Min Thumb */}
              <input
                type="range"
                min="0"
                max="500000"
                step="500"
                value={localMin}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), Number(localMax) - 500);
                  setLocalMin(val);
                }}
                onMouseUp={applyPriceFilter}
                onTouchEnd={applyPriceFilter}
                className="dual-range-thumb absolute w-full appearance-none bg-transparent pointer-events-none z-10"
              />
              {/* Max Thumb */}
              <input
                type="range"
                min="0"
                max="500000"
                step="500"
                value={localMax}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), Number(localMin) + 500);
                  setLocalMax(val);
                }}
                onMouseUp={applyPriceFilter}
                onTouchEnd={applyPriceFilter}
                className="dual-range-thumb absolute w-full appearance-none bg-transparent pointer-events-none z-20"
              />
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-900 dark:text-white">Minimum Rating</h4>
            <div className="flex flex-col gap-1.5">
              {[4, 3, 2, 1].map((star) => (
                <label key={star} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    name="rating"
                    checked={Number(filters.rating) === star}
                    onChange={() => setFilters({ ...filters, rating: star })}
                    className="w-3 h-3 border-slate-300 dark:border-white/10 text-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={8} className={i < star ? 'text-amber-400' : 'text-slate-200 dark:text-slate-800'} />
                    ))}
                    <span className="text-[10px] font-bold text-slate-500 ml-1">& Up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-900 dark:text-white">Availability</h4>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.stock === 'inStock'}
                  onChange={(e) => setFilters({ ...filters, stock: e.target.checked ? 'inStock' : '' })}
                  className="w-3 h-3 rounded border-slate-300 dark:border-white/10 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors uppercase tracking-tight">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-slate-900 z-50 p-6 transform transition-transform duration-200 ease-in-out lg:hidden overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl border-r border-slate-200 dark:border-white/10`}>
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 transition-colors">
          <FaTimes size={20} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[240px] flex-shrink-0 bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-lg shadow-slate-200/50 dark:shadow-none h-fit sticky top-28">
        <SidebarContent />
      </div>
    </>
  );
};

export default FilterSidebar;
