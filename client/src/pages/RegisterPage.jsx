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
      setMessage('Passwords do not match');
      return;
    }
    setMessage('');
    try {
      await register({ name, email, password }).unwrap();
      navigate('/verify-email', { state: { email, redirect } });
    } catch (err) {}
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-12 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 animate-fade-in relative overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-5xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] border border-slate-200/50 dark:border-white/10 shadow-2xl relative z-10 transition-all duration-500 hover:shadow-emerald-500/5 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Info Panel */}
        <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden order-2 lg:order-1">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          </div>
          <div className="relative z-10 text-white">
            <h2 className="text-3xl lg:text-5xl font-black mb-6 tracking-tighter leading-tight">Join the elite network.</h2>
            <p className="text-slate-300 text-sm lg:text-base leading-relaxed mb-8 max-w-sm">Create your account today to gain exclusive access to premium telecommunication gadgets, personalized offers, and lightning-fast checkout.</p>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
               <FaLock size={12}/> Secure Encrypted Setup
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative order-1 lg:order-2">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 lg:hidden"></div>

          <div className="mb-10">
             <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Create Account</h1>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Enter your details below</p>
          </div>

          {(message || error) && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 text-[11px] font-bold animate-slide-up flex items-center gap-3">
              <span>⚠️</span>
              <span>{message || error?.data?.message || 'Registration failed'}</span>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 pl-12 pr-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 transition-all dark:text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors" size={14} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="id@poojatelecom.com"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 pl-12 pr-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 transition-all dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors" size={14} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 pl-10 pr-10 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 transition-all dark:text-white tracking-widest"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors" size={12} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500">
                    {showPassword ? <FaEyeSlash size={14}/> : <FaEye size={14}/>}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 pl-10 pr-4 rounded-xl text-xs font-bold outline-none focus:border-emerald-500/30 transition-all dark:text-white tracking-widest"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors" size={12} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 h-14 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 mt-8 relative overflow-hidden group/btn disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
              ) : (
                <span className="relative z-10 flex items-center gap-3">Register <FaArrowRight size={10} /></span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-[12px] font-bold text-slate-400">
              Already a member?{' '}
              <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-emerald-500 font-black hover:underline uppercase tracking-widest ml-2 text-[11px]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
