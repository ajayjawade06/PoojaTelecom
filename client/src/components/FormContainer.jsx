const FormContainer = ({ children }) => {
 return (
 <div className="container mx-auto px-4 mt-12 mb-24 relative z-10 w-full flex justify-center">
 <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-200">
 {/* Decorative background glow */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>
 {children}
 </div>
 </div>
 );
};
export default FormContainer;
