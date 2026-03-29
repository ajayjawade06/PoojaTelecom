import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useVerifyEmailMutation, useResendVerificationMutation } from '../redux/slices/usersApiSlice';
import { FaEnvelope, FaArrowRight, FaShieldAlt, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { email, redirect } = location.state || { email: '', redirect: '/' };

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResendLoading }] = useResendVerificationMutation();

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
      await resendVerification({ email }).unwrap();
      setTimeLeft(300); // Reset timer
      toast.success('Verification code resent successfully');
    } catch (err) {
      setError(err?.data?.message || 'Failed to resend verification code');
    }
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1);
    const updated = [...code];
    updated[idx] = val;
    setCode(updated);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`).focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const updated = [...code];
    pasted.split('').forEach((c, i) => { if (i < 6) updated[i] = c; });
    setCode(updated);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`).focus();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    setError('');
    try {
      const res = await verifyEmail({ email, code: fullCode }).unwrap();
      dispatch(setCredentials(res));
      navigate(redirect || '/');
    } catch (err) {
      setError(err?.data?.message || 'Invalid or expired code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-12 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 animate-fade-in relative overflow-hidden z-0">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-5xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] border border-slate-200/50 dark:border-white/10 shadow-2xl relative z-10 transition-all duration-500 hover:shadow-emerald-500/5 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Info Panel */}
        <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          </div>
          <div className="relative z-10 text-white">
            <h2 className="text-3xl lg:text-5xl font-black mb-6 tracking-tighter leading-tight">Identity Verification.</h2>
            <p className="text-slate-300 text-sm lg:text-base leading-relaxed mb-8 max-w-sm">To ensure the highest level of security for our premium members, please verify your email address to gain full platform access.</p>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
               <FaShieldAlt size={12}/> Secure Protocol Active
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 lg:hidden"></div>

          <div className="mb-10">
             <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Verify Email</h1>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
               Sent to <strong className="text-slate-800 dark:text-slate-200">{email || 'your email'}</strong>
             </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 text-[11px] font-bold animate-slide-up flex items-center gap-3">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-10 h-10 sm:w-12 sm:h-14 text-center text-xl font-extrabold border outline-none border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 focus:border-emerald-500/50 dark:text-white transition-all shadow-inner"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || code.join('').length < 6}
              className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 h-14 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 mt-8 relative overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
              ) : (
                <span className="relative z-10 flex items-center gap-3">Verify Identity <FaArrowRight size={10} /></span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5 mb-1 bg-slate-100 dark:bg-white/5 py-1 px-3 rounded-full">
               <FaClock className="text-emerald-500" size={10} />
               <span>Code expires in:</span> 
               <span className="text-emerald-500 font-black font-mono tracking-wider">{formatTime(timeLeft)}</span>
            </div>
            
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              Didn't receive it?{' '}
              {timeLeft > 0 ? (
                <span className="text-slate-300 dark:text-slate-600 ml-1 cursor-not-allowed">Resend OTP</span>
              ) : (
                <button 
                  type="button" 
                  onClick={resendHandler}
                  disabled={isResendLoading}
                  className="text-emerald-500 font-black hover:underline cursor-pointer ml-1 disabled:opacity-50"
                >
                  {isResendLoading ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
