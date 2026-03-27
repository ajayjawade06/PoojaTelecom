import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useVerifyEmailMutation } from '../redux/slices/usersApiSlice';
import { FaBoxOpen, FaEnvelope } from 'react-icons/fa';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { email, redirect } = location.state || { email: '', redirect: '/' };

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

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
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        </div>
        <div className="text-center z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-2xl mb-8 shadow-xl shadow-emerald-500/30">
            <FaBoxOpen size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Almost there!</h1>
          <p className="text-slate-300 text-lg max-w-xs mx-auto leading-relaxed">
            Check your inbox. We've sent a 6-digit verification code to confirm your email.
          </p>
        </div>
      </div>

      {/* Right OTP panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-5">
              <FaEnvelope size={28} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Verify Your Email</h2>
            <p className="text-slate-500">
              We sent a 6-digit code to<br />
              <strong className="text-slate-800">{email || 'your email address'}</strong>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium flex items-start gap-3">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submitHandler}>
            {/* 6-box OTP input */}
            <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
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
                  className="w-12 h-14 text-center text-2xl font-extrabold border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-500 text-slate-900 transition-all outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || code.join('').length < 6}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? 'Verifying...' : 'Verify & Get Started →'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-400">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              className="text-emerald-600 font-bold hover:underline"
              onClick={() => navigate('/register')}
            >
              register again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default VerifyEmailPage;
