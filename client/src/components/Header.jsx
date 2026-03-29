import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaChevronDown, FaStore, FaMoon, FaSun, FaArrowRight } from 'react-icons/fa';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <header className={`fixed w-full top-0 z-[100] transition-all duration-300 ${
      isScrolled 
      ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-white/5 py-2 shadow-sm' 
      : 'bg-transparent py-4'
    }`}>
      
      <div className="main-container">
        <div className="flex items-center justify-between gap-6 h-12">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="bg-emerald-500 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
              <FaStore size={16} />
            </div>
            <span className={`font-black text-lg tracking-tighter ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
              POOJA<span className="text-emerald-500">T</span>
            </span>
          </Link>

          {/* Minimal Search Bar */}
          <form onSubmit={submitHandler} className="hidden md:flex flex-grow max-w-sm relative group">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-emerald-500/30 py-2 pl-10 pr-4 rounded-full text-[12px] font-medium transition-all outline-none dark:text-white placeholder-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
          </form>

          {/* Navigation Actions */}
          <nav className="flex items-center gap-1">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title="Toggle Theme"
            >
               {theme === 'dark' ? <FaSun size={14} className="text-amber-400" /> : <FaMoon size={14} />}
            </button>

            {/* User Access */}
            {userInfo ? (
              <div className="relative group/profile pt-1">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <FaUser size={10} />
                  </div>
                  <FaChevronDown size={8} className={`text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl py-2 z-[110] animate-scale-up">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Account</p>
                       <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{userInfo.name}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-[12px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-emerald-500 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                      My Profile
                    </Link>
                    {userInfo.isAdmin && (
                       <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-[12px] font-bold text-blue-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        Admin Control
                      </Link>
                    )}
                    <button onClick={logoutHandler} className="w-full flex items-center gap-3 px-4 py-2 text-[12px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 mx-2">
                <span>Login</span>
                <FaArrowRight size={8} />
              </Link>
            )}

            {/* Cart Button */}
            <Link to="/cart" className="relative group ml-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md group-hover:scale-105 active:scale-95 transition-all">
                <FaShoppingCart size={14} />
              </div>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-fade-in">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 ml-2"
            >
              {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Redesign */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[120] bg-white dark:bg-slate-900 p-6 animate-slide-up">
           <div className="flex justify-between items-center mb-10">
              <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">POOJA<span className="text-emerald-500">T</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-900 dark:text-white"><FaTimes size={18} /></button>
           </div>
           
           <form onSubmit={submitHandler} className="relative mb-8">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 py-3 px-6 rounded-full outline-none font-bold text-slate-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"><FaSearch size={16} /></button>
           </form>

           <div className="space-y-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Account</p>
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
