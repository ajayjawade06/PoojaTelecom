import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useResetPasswordMutation, useForgotPasswordMutation } from '../redux/slices/usersApiSlice';
import { FaLock, FaKey, FaArrowRight, FaEye, FaEyeSlash, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const emailParam = sp.get('email') || '';

  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [forgotPassword, { isLoading: isResendLoading }] = useForgotPasswordMutation();

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    setEmail(emailParam);
  }, [emailParam]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const resendHandler = async () => {
    try {
      await forgotPassword({ email }).unwrap();
      setTimeLeft(300);
      toast.success('Verification code resent successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to resend verification code');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await resetPassword({ email, code, newPassword: password }).unwrap();
      toast.success(res.message);
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-12 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 relative overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="w-full max-w-5xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] border border-slate-200/50 dark:border-white/10 shadow-2xl relative z-10 transition-all duration-200 flex flex-col lg:flex-row overflow-hidden"
      >
        
        {/* Left Info Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.15, type: 'spring', damping: 20 }}
          className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          </div>
          <div className="relative z-10 text-white">
            <h2 className="text-3xl lg:text-5xl font-black mb-6 tracking-tighter leading-tight">Secure Access.</h2>
            <p className="text-slate-300 text-sm lg:text-base leading-relaxed mb-8 max-w-sm">Enter the OTP sent to your email and seamlessly establish your new secure password credential.</p>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              <FaKey size={12}/> Zero-Knowledge Protocol
            </div>
          </div>
        </motion.div>

        {/* Right Form Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.25, type: 'spring', damping: 20 }}
          className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500 lg:hidden"></div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Reset Password</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Verify OTP and enter new key</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Source</label>
              <input
                type="email"
                placeholder="id@poojatelecom.com"
                className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 px-5 rounded-xl text-xs font-bold outline-none text-slate-400 dark:text-slate-500 cursor-not-allowed"
                value={email}
                readOnly
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">OTP Code</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="6-Digit OTP"
                  maxLength={6}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 pl-12 pr-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500/30 transition-all dark:text-white tracking-widest text-center"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <FaKey className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 transition-colors" size={14} />
              </div>
              {/* Timer & Resend */}
              <div className="flex flex-col items-center gap-2 pt-2">
                <div className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 py-1.5 px-4 rounded-full">
                  <FaClock className="text-blue-500" size={10} />
                  <span>Expires in:</span> 
                  <span className={`font-black font-mono tracking-wider ${timeLeft <= 60 ? 'text-rose-500' : 'text-blue-500'}`}>{formatTime(timeLeft)}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Didn't receive it?{' '}
                  {timeLeft > 0 ? (
                    <span className="text-slate-300 dark:text-slate-600 ml-1 cursor-not-allowed">Resend OTP</span>
                  ) : (
                    <button 
                      type="button" 
                      onClick={resendHandler}
                      disabled={isResendLoading}
                      className="text-blue-500 font-black hover:underline cursor-pointer ml-1 disabled:opacity-50"
                    >
                      {isResendLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 pl-10 pr-10 rounded-xl text-xs font-bold outline-none focus:border-blue-500/30 transition-all dark:text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 transition-colors" size={12} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500">
                    {showPassword ? <FaEyeSlash size={14}/> : <FaEye size={14}/>}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 pl-10 pr-4 rounded-xl text-xs font-bold outline-none focus:border-blue-500/30 transition-all dark:text-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-500 transition-colors" size={12} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 h-14 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 mt-8 relative overflow-hidden group/btn disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-200"></div>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
              ) : (
                <span className="relative z-10 flex items-center gap-3">Reset Password <FaArrowRight size={10} /></span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
            <Link to="/login" className="text-[10px] uppercase tracking-widest font-black text-slate-400 hover:text-blue-500 transition-colors">
              Cancel & Return
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
