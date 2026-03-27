import { Link } from 'react-router-dom';
import { FaUser, FaTruck, FaClipboardCheck } from 'react-icons/fa';

const steps = [
  { label: 'Sign In',  path: '/login',     icon: FaUser,           key: 'step1' },
  { label: 'Shipping', path: '/shipping',   icon: FaTruck,          key: 'step2' },
  { label: 'Confirm',  path: '/placeorder', icon: FaClipboardCheck, key: 'step3' },
];

const CheckoutSteps = ({ step1, step2, step3 }) => {
  const activeMap = { step1, step2, step3 };

  return (
    <nav className="flex justify-center mb-12">
      <ol className="flex items-center w-full max-w-lg relative z-10">
        {steps.map(({ label, path, icon: Icon, key }, idx) => {
          const active = activeMap[key];
          const isNextActive = idx < steps.length - 1 && activeMap[steps[idx + 1].key];
          
          return (
            <li key={key} className={`flex items-center ${idx < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className="flex flex-col items-center relative z-10">
                {active ? (
                  <Link to={path} className="flex flex-col items-center group relative cursor-pointer">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[20px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <span className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon size={18} />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mt-3 whitespace-nowrap drop-shadow-md">{label}</span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center opacity-50 cursor-not-allowed">
                    <span className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center border-2 border-slate-700">
                      <Icon size={18} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-3 whitespace-nowrap">{label}</span>
                  </div>
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 rounded-full mb-6 relative overflow-hidden bg-slate-800 border border-white/5">
                   <div className={`absolute top-0 left-0 h-full w-full transition-transform duration-1000 origin-left ${isNextActive ? 'scale-x-100 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'scale-x-0 bg-emerald-500'}`}></div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
export default CheckoutSteps;
