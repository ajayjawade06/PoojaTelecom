import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { FaEye, FaEyeSlash, FaArrowRight, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading, error }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Security keys do not match');
      return;
    }
    setMessage('');
    try {
      await register({ name, email, password }).unwrap();
      navigate('/login');
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-2xl p-8 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>

        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaUser size={18} />
           </div>
           <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">Join the Hub</h1>
           <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-loose">Create your account</p>
        </div>

        {(message || error) && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 text-[11px] font-bold text-center animate-slide-up">
            {message || error?.data?.message || 'Registration failed'}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Name</label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 pl-10 pr-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 transition-all dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors" size={12} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Source</label>
            <div className="relative group">
              <input
                type="email"
                placeholder="id@poojatelecom.com"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 pl-10 pr-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 transition-all dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors" size={12} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 pl-10 pr-12 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 transition-all dark:text-white tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors" size={12} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500">
                {showPassword ? <FaEyeSlash size={14}/> : <FaEye size={14}/>}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Verify Key</label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 pl-10 pr-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 transition-all dark:text-white tracking-widest"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors" size={12} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-12 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Register <FaArrowRight size={10} /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
          <p className="text-[12px] font-medium text-slate-500">
            Already a member?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-emerald-500 font-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
