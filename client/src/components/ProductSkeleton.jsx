const ProductSkeleton = () => {
 return (
 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden flex flex-col h-full animate-pulse">
 <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-950/50"></div>
 <div className="p-4 space-y-3">
 <div className="flex justify-between items-center">
 <div className="h-2 w-12 bg-slate-100 dark:bg-white/5 rounded"></div>
 <div className="h-2 w-8 bg-slate-100 dark:bg-white/5 rounded"></div>
 </div>
 <div className="h-3 w-3/4 bg-slate-100 dark:bg-white/5 rounded"></div>
 <div className="h-3 w-1/2 bg-slate-100 dark:bg-white/5 rounded"></div>
 <div className="pt-4 flex gap-2">
 <div className="h-5 w-20 bg-slate-100 dark:bg-white/5 rounded"></div>
 </div>
 </div>
 </div>
 );
};

export default ProductSkeleton;
