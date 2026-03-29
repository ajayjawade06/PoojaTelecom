import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaChevronDown, FaStore, FaMoon, FaSun, FaArrowRight, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApiCall] = useLogoutMutation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery.trim()}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className={`fixed w-full top-0 z-[100] transition-all duration-300 ${isScrolled
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 py-3 shadow-sm'
        : 'bg-transparent py-5'
      }`}>

      <div className="main-container">
        <div className="flex items-center justify-between gap-4 h-auto min-h-[48px] py-1 flex-wrap md:flex-nowrap">

          <Link to="/" className="flex items-center gap-1.5 shrink-0 group">
            <div className="bg-emerald-500 text-white w-6 h-6 rounded-md flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
              <FaStore size={12} />
            </div>
            <span className={`font-black text-base tracking-tighter ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
              POOJA<span className="text-emerald-500">TELECOM</span>
            </span>
          </Link>

          {/* Minimal Search Bar */}
          {!isAuthPage && (
            <form onSubmit={submitHandler} className="hidden lg:flex flex-grow max-w-sm relative group">
              <input
                type="text"
                placeholder="Search premium tech..."
                className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 focus:border-emerald-500/50 py-2 pl-9 pr-3 rounded-full text-[11px] font-medium transition-all outline-none dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-white/10 focus:shadow-lg focus:shadow-emerald-500/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch size={10} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </form>
          )}

          {/* Navigation Actions */}
          <nav className="flex items-center gap-1">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex w-7 h-7 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <FaSun size={10} className="text-amber-400" /> : <FaMoon size={10} />}
            </button>

            {/* User Access */}
            {userInfo ? (
              <div className="relative group/profile pt-1">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-1.5 sm:py-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-800 dark:text-white"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <FaUser size={10} />
                  </div>
                  <FaChevronDown size={6} className={`hidden sm:block text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl py-2 z-[110] animate-scale-up overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 mb-1 bg-slate-50/50 dark:bg-white/5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Account Info</p>
                      <p className="text-[12px] font-black text-slate-900 dark:text-white truncate">{userInfo.name}</p>
                    </div>

                    <div className="px-2 py-1 space-y-0.5">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-emerald-500 rounded-xl transition-all" onClick={() => setIsProfileDropdownOpen(false)}>
                        <FaUser size={10} className="opacity-50" /> Profile
                      </Link>

                      {userInfo.isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all" onClick={() => setIsProfileDropdownOpen(false)}>
                          <FaCog size={10} className="opacity-50" /> Admin
                        </Link>
                      )}

                      <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-1 mx-2"></div>

                      <button
                        onClick={() => { logoutHandler(); setIsProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <FaSignOutAlt size={10} className="opacity-50" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 mx-2">
                <span>Login</span>
                <FaArrowRight size={8} />
              </Link>
            )}

            <Link to="/cart" className="relative group ml-1 sm:ml-2">
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all">
                <FaShoppingCart size={11} />
              </div>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-slate-950 shadow-sm animate-scale-up">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-7 h-7 flex items-center justify-center rounded-full text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 ml-1"
            >
              {isMobileMenuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Redesign */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[120] bg-white dark:bg-slate-900 p-6 animate-slide-up">
          <div className="flex justify-between items-center mb-10">
            <span className="font-black text-lg tracking-tighter text-slate-900 dark:text-white">POOJA<span className="text-emerald-500">T</span></span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-900 dark:text-white"><FaTimes size={14} /></button>
          </div>

          {!isAuthPage && (
            <form onSubmit={submitHandler} className="relative mb-8">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 py-2.5 px-5 rounded-full outline-none font-bold text-slate-700 dark:text-white text-[11px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"><FaSearch size={12} /></button>
            </form>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Settings</p>
              <button onClick={toggleTheme} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">
                {theme === 'dark' ? <><FaSun size={12} /> Light Mode</> : <><FaMoon size={12} /> Dark Mode</>}
              </button>
            </div>

            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Account</p>
            {userInfo ? (
              <>
                <Link to="/profile" className="flex items-center gap-4 py-4 px-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white font-bold text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaUser className="text-emerald-500" /> My Profile
                </Link>
                <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 py-4 px-6 bg-rose-50 dark:bg-rose-500/10 rounded-2xl text-rose-600 font-bold text-sm">
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-4 py-4 px-6 bg-emerald-500 text-white rounded-2xl font-bold text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                <FaUser /> Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
