import { Link } from 'react-router-dom';

const steps = [
  { label: 'Login', path: '/login', key: 'step1' },
  { label: 'Shipping', path: '/shipping', key: 'step2' },
  { label: 'Confirm', path: '/placeorder', key: 'step3' },
];

const CheckoutSteps = ({ step1, step2, step3 }) => {
  const activeMap = { step1, step2, step3 };

  return (
    <nav className="flex justify-center mb-10">
      <div className="flex items-center gap-4">
        {steps.map(({ label, path, key }, idx) => {
          const active = activeMap[key];
          return (
            <div key={key} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${active ? 'bg-emerald-500 scale-125 shadow-lg shadow-emerald-500/50' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                {active ? (
                  <Link to={path} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white transition-colors">
                    {label}
                  </Link>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                    {label}
                  </span>
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className="w-8 h-[1px] bg-slate-100 dark:bg-white/5"></div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default CheckoutSteps;
