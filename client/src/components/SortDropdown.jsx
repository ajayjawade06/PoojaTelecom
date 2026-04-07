import { useState } from 'react';
import { FaSortDown } from 'react-icons/fa';

const SortDropdown = ({ sort, setSort }) => {
 const [isOpen, setIsOpen] = useState(false);

 const options = [
 { value: 'newest', label: 'Newest Arrivals' },
 { value: 'best_selling', label: 'Best Selling' },
 { value: 'price_asc', label: 'Price: Low to High' },
 { value: 'price_desc', label: 'Price: High to Low' },
 { value: 'rating', label: 'Highest Rated' },
 { value: 'name', label: 'Name A-Z' }
 ];

 const currentOption = options.find(o => o.value === sort) || options[0];

 const handleSelect = (val) => {
 setSort(val);
 setIsOpen(false);
 };

 return (
 <div className="relative z-20">
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors shadow-sm"
 >
 <span className="text-slate-500 font-normal">Sort by:</span> {currentOption.label}
 <FaSortDown className="mb-1 text-slate-400" />
 </button>

 {isOpen && (
 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden text-sm">
 {options.map((option) => (
 <button
 key={option.value}
 onClick={() => handleSelect(option.value)}
 className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
 sort === option.value ? 'font-bold text-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'text-slate-700 dark:text-slate-300 font-medium'
 }`}
 >
 {option.label}
 </button>
 ))}
 </div>
 )}
 </div>
 );
};

export default SortDropdown;
