const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px] animate-pulse">
      {/* Image Placeholder */}
      <div className="h-64 bg-slate-100"></div>
      
      {/* Content Placeholder */}
      <div className="p-6 flex-grow flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <div className="h-3 w-16 bg-slate-100 rounded-full"></div>
          <div className="h-6 w-12 bg-slate-50 rounded-full"></div>
        </div>
        
        <div className="space-y-2">
          <div className="h-5 w-full bg-slate-100 rounded-lg outline-none"></div>
          <div className="h-5 w-2/3 bg-slate-100 rounded-lg outline-none"></div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
             <div className="h-8 w-1/3 bg-slate-100 rounded-xl outline-none"></div>
             <div className="h-4 w-1/5 bg-slate-50 rounded-lg outline-none"></div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="h-3 w-4 bg-emerald-100 rounded-full"></div>
             <div className="h-3 w-1/4 bg-slate-100 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
