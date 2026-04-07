import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

const steps = [
  { label: 'Login', path: '/login', key: 'step1' },
  { label: 'Shipping', path: '/shipping', key: 'step2' },
  { label: 'Review', path: '/placeorder', key: 'step3' },
];

const CheckoutSteps = ({ step1, step2, step3 }) => {
  const activeMap = { step1, step2, step3 };

  // Find the current active step index (last truthy one)
  const currentIndex = [step1, step2, step3].lastIndexOf(true);

  return (
    <nav className="flex justify-center mb-10">
      <div className="flex items-center w-full max-w-lg">
        {steps.map(({ label, path, key }, idx) => {
          const active = activeMap[key];
          const completed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={key} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center gap-2 relative z-10">
                {active ? (
                  <Link to={path} className="group flex flex-col items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300 ${
                      completed 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                        : isCurrent 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20' 
                          : 'bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10'
                    }`}>
                      {completed ? <FaCheck size={12} /> : idx + 1}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${
                      completed || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                    }`}>
                      {label}
                    </span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-white/10">
                      {idx + 1}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300 dark:text-slate-600">
                      {label}
                    </span>
                  </div>
                )}
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-3 relative">
                  <div className="absolute inset-0 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                  <div 
                    className={`absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all duration-500 ${
                      completed ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default CheckoutSteps;
