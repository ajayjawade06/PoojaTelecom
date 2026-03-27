import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { FaBoxOpen, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex animate-fade-in bg-slate-950">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center p-16 relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse delay-1000" />
        </div>
        <div className="text-center z-10 relative">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[2rem] mb-10 shadow-2xl shadow-emerald-500/40 relative group">
            <div className="absolute inset-0 bg-emerald-400 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <FaBoxOpen size={40} className="text-white relative z-10 drop-shadow-lg" />
          </div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 tracking-tighter">
            Pooja <br/> Telecom
          </h1>
          <p className="text-slate-400 text-xl max-w-sm mx-auto font-medium leading-relaxed">
            The nexus of premium electronics and next-generation gadgets.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative overflow-hidden">
        {/* Mobile background glows */}
        <div className="absolute lg:hidden top-0 left-0 w-full h-full">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                <FaBoxOpen size={24} className="text-white" />
              </div>
              <span className="font-black text-3xl tracking-tighter text-white">Pooja</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 font-medium">Authenticate to access your dashboard.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-center gap-3 animate-slide-up">
              <span className="text-xl">⚠️</span>
              <span>{error?.data?.message || 'Authentication failed or credentials invalid.'}</span>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="group">
              <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2 transition-colors group-focus-within:text-emerald-400">Identity</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-emerald-500/50 text-white font-medium transition-all outline-none placeholder-slate-600 ring-4 ring-transparent focus:ring-emerald-500/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="group">
              <div className="flex justify-between mb-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest transition-colors group-focus-within:text-emerald-400">Passphrase</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 pr-12 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-emerald-500/50 text-white font-medium transition-all outline-none placeholder-slate-600 ring-4 ring-transparent focus:ring-emerald-500/10 tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden group bg-emerald-500 hover:bg-emerald-400 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-8 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Authorize Access <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-medium text-sm">
            Unregistered Agent?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className="text-emerald-400 font-black hover:text-emerald-300 transition-colors"
            >
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
