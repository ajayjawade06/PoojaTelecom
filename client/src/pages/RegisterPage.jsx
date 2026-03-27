import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaBoxOpen, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';

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
      const res = await register({ name, email, password }).unwrap();
      // Auto-verified - redirect directly to login
      navigate('/login');
    } catch (err) {}
  };

  const passwordStrength = password.length > 8 ? 'strong' : password.length > 5 ? 'medium' : password.length > 0 ? 'weak' : '';

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700" />
        </div>
        <div className="text-center z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-2xl mb-8 shadow-xl shadow-emerald-500/30">
            <FaBoxOpen size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Join the Family</h1>
          <ul className="space-y-3 mt-6 text-left">
            {['Fast & Free Delivery*', 'Exclusive Deals & Offers', 'Easy Returns Within 7 Days', 'Secure Payments with Razorpay'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-300">
                <FaCheck className="text-emerald-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <div className="bg-emerald-500 p-2 rounded-xl">
                <FaBoxOpen size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-800">Pooja Telecom</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500">Join thousands of happy customers.</p>
          </div>

          {(message || error) && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <span>{message || error?.data?.message || 'Registration failed. Please try again.'}</span>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 text-slate-800 font-medium transition-all placeholder-slate-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 text-slate-800 font-medium transition-all placeholder-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 text-slate-800 font-medium transition-all placeholder-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordStrength && (
                <div className="mt-2 flex gap-1.5">
                  {['weak', 'medium', 'strong'].map((level) => {
                    const colors = { weak: 'bg-rose-400', medium: 'bg-amber-400', strong: 'bg-emerald-400' };
                    const levels = ['weak', 'medium', 'strong'];
                    const active = levels.indexOf(passwordStrength) >= levels.indexOf(level);
                    return <div key={level} className={`h-1.5 flex-1 rounded-full transition-colors ${active ? colors[passwordStrength] : 'bg-slate-200'}`} />;
                  })}
                  <span className="text-xs font-medium text-slate-500 capitalize ml-1">{passwordStrength}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                className={`w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50 focus:bg-white text-slate-800 font-medium transition-all placeholder-slate-400 ${
                  confirmPassword && password !== confirmPassword ? 'border-rose-400 focus:border-rose-400' : 'border-slate-200 focus:border-emerald-500'
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-rose-500 mt-1 font-medium">Passwords don't match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
            >
              {isLoading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500">
            Already have an account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-emerald-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
