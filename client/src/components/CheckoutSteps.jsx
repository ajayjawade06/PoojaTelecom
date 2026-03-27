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
    <nav className="flex justify-center mb-10">
      <ol className="flex items-center w-full max-w-lg">
        {steps.map(({ label, path, icon: Icon, key }, idx) => {
          const active = activeMap[key];
          return (
            <li key={key} className={`flex items-center ${idx < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className="flex flex-col items-center">
                {active ? (
                  <Link to={path} className="flex flex-col items-center group">
                    <span className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200 group-hover:bg-emerald-600 transition-colors">
                      <Icon size={16} />
                    </span>
                    <span className="text-xs font-bold text-emerald-600 mt-1.5 whitespace-nowrap">{label}</span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center opacity-40 cursor-not-allowed">
                    <span className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                      <Icon size={16} />
                    </span>
                    <span className="text-xs font-medium text-slate-400 mt-1.5 whitespace-nowrap">{label}</span>
                  </div>
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-3 rounded-full mb-4 ${active && activeMap[steps[idx + 1].key] ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
export default CheckoutSteps;
