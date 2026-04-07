import { FaArrowLeft, FaShareAlt } from 'react-icons/fa';

const ProductPageSkeleton = () => {
 return (
 <div className="pt-28 pb-20 bg-white dark:bg-slate-950 min-h-screen relative overflow-hidden animate-pulse">
 <div className="main-container relative z-10 max-w-6xl mx-auto">
 
 {/* Nav Breadcrumbs Skeleton */}
 <div className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-slate-200 dark:bg-white/5 rounded-full"></div>
 <div className="w-48 h-4 bg-slate-200 dark:bg-white/5 rounded"></div>
 </div>
 <div className="w-24 h-8 bg-slate-200 dark:bg-white/5 rounded-lg"></div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
 {/* Left Gallery Skeleton */}
 <div className="lg:col-span-5 space-y-4">
 <div className="w-full h-[350px] lg:h-[450px] bg-slate-200 dark:bg-white/5 rounded-[32px]"></div>
 <div className="flex gap-3 px-1">
 {[1, 2, 3, 4].map(i => (
 <div key={i} className="w-16 h-16 bg-slate-200 dark:bg-white/5 rounded-xl"></div>
 ))}
 </div>
 </div>

 {/* Right Details Skeleton */}
 <div className="lg:col-span-7 space-y-8 mt-2 lg:mt-0">
 <div>
 <div className="w-24 h-3 bg-slate-200 dark:bg-white/5 rounded mb-4"></div>
 <div className="w-3/4 h-10 bg-slate-200 dark:bg-white/5 rounded mb-4"></div>
 <div className="w-1/2 h-10 bg-slate-200 dark:bg-white/5 rounded mb-6"></div>
 <div className="flex items-center gap-4 py-3 border-y border-slate-100 dark:border-white/5">
 <div className="w-24 h-4 bg-slate-200 dark:bg-white/5 rounded"></div>
 </div>
 </div>

 <div className="space-y-4">
 <div className="flex items-baseline gap-3">
 <div className="w-32 h-8 bg-slate-200 dark:bg-white/5 rounded"></div>
 <div className="w-16 h-5 bg-slate-200 dark:bg-white/5 rounded"></div>
 </div>
 <div className="w-28 h-6 bg-slate-200 dark:bg-white/5 rounded-md"></div>
 </div>

 <div className="space-y-5 pt-4">
 <div className="w-40 h-11 bg-slate-200 dark:bg-white/5 rounded-full"></div>
 <div className="flex flex-col sm:flex-row gap-3">
 <div className="flex-1 h-12 bg-slate-200 dark:bg-white/5 rounded-full"></div>
 <div className="flex-1 h-12 bg-slate-200 dark:bg-white/5 rounded-full"></div>
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-white/5 pt-8">
 {[1, 2, 3].map(i => (
 <div key={i} className="flex flex-col items-center gap-2">
 <div className="w-6 h-6 bg-slate-200 dark:bg-white/5 rounded-full"></div>
 <div className="w-16 h-2 bg-slate-200 dark:bg-white/5 rounded"></div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default ProductPageSkeleton;
