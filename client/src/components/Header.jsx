import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaChevronDown, FaStore, FaMoon, FaSun } from 'react-icons/fa';

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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      isScrolled 
      ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg py-2 border-b border-slate-200/50 dark:border-white/5' 
      : 'bg-slate-900 border-b border-white/10 py-4'
    }`}>
      
      {/* Top Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="bg-emerald-500 text-white p-2 rounded-xl group-hover:rotate-12 transition-all shadow-xl shadow-emerald-500/20 active:scale-90">
              <FaStore size={20} />
            </div>
            <span className={`font-black text-xl tracking-tighter transition-colors ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
              POOJA<span className="text-emerald-500">TELECOM</span>
            </span>
          </Link>

          {/* Centered Search Bar */}
          <form onSubmit={submitHandler} className="hidden md:flex flex-grow max-w-lg relative group">
            <input
              type="text"
              placeholder="Search latest gadgets..."
              className={`w-full py-2.5 pl-6 pr-14 rounded-xl text-xs font-bold border-2 transition-all outline-none ${
                isScrolled 
                ? 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-white/5 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:shadow-xl focus:shadow-emerald-500/5 text-slate-900 dark:text-white' 
                : 'bg-white/10 border-transparent focus:bg-white focus:text-slate-900 focus:border-emerald-400 text-white placeholder-slate-400 backdrop-blur-md'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-emerald-500 hover:scale-110 active:scale-95 transition-all">
              <FaSearch size={14} />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all ${isScrolled ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-white/80 hover:bg-white/10'}`}
            >
               {theme === 'dark' ? <FaSun size={16} className="text-amber-400" /> : <FaMoon size={16} />}
            </button>

            {/* Login/Profile */}
            {userInfo ? (
              <div className="relative group/profile">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all ${
                    isScrolled ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <FaUser size={12} />
                  </div>
                  <span className="hidden xl:inline">{userInfo.name.split(' ')[0]}</span>
                  <FaChevronDown size={10} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-60 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-2xl py-4 z-50 animate-scale-up ring-1 ring-slate-900/5">
                    <div className="px-6 py-4 border-b border-slate-50 dark:border-white/5 mb-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Account</p>
                       <p className="text-sm font-black text-slate-800 dark:text-white truncate">{userInfo.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-4 px-6 py-3.5 text-sm font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-emerald-500 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm"><FaUser size={14} /></div>
                      My Hub
                    </Link>
                    {userInfo.isAdmin && (
                       <Link to="/admin" className="flex items-center gap-4 px-6 py-3.5 text-sm font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-emerald-500 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm"><FaStore size={14} /></div>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={logoutHandler} className="w-full flex items-center gap-4 px-6 py-3.5 text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-sm"><FaTimes size={14} /></div>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl transition-all ${
                isScrolled ? 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-white hover:bg-white/10'
              }`}>
                <FaUser className="text-emerald-500" />
                <span>Log In</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative group active:scale-95 transition-transform">
              <div className={`p-3 rounded-xl transition-all shadow-xl hover:-translate-y-1 ${
                isScrolled ? 'bg-slate-900 dark:bg-emerald-50 text-white shadow-slate-900/20' : 'bg-emerald-500 text-white shadow-emerald-500/30'
              }`}>
                <FaShoppingCart size={20} />
              </div>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-white dark:border-slate-900 shadow-2xl animate-bounce">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-3 rounded-xl active:scale-95 transition-all ${isScrolled ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800' : 'text-white bg-white/10'}`}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 fixed inset-0 z-[60] p-8 animate-slide-up flex flex-col">
           <div className="flex justify-between items-center mb-12">
              <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white">POOJA<span className="text-emerald-500">TELECOM</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white"><FaTimes size={20} /></button>
           </div>
           
           <form onSubmit={submitHandler} className="relative mb-8">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 py-5 px-8 rounded-[2rem] outline-none font-black text-slate-700 dark:text-white focus:border-emerald-500 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500 p-2"><FaSearch size={20} /></button>
           </form>

           <div className="space-y-4 overflow-y-auto flex-grow pb-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mt-8">Account</p>
              {userInfo ? (
                 <>
                  <Link to="/profile" className="flex items-center gap-4 py-5 px-8 bg-slate-50 dark:bg-slate-800 rounded-[2rem] text-slate-900 dark:text-white font-black text-sm active:scale-[0.98] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                    <FaUser className="text-emerald-500" /> My Hub
                  </Link>
                  <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 py-5 px-8 bg-rose-50 dark:bg-rose-500/10 rounded-[2rem] text-rose-700 font-black text-sm active:scale-[0.98] transition-all">
                    <FaTimes size={14} /> Sign Out
                  </button>
                 </>
              ) : (
                 <Link to="/login" className="flex items-center gap-4 py-5 px-8 bg-emerald-500 text-white rounded-[2rem] font-black text-sm active:scale-[0.98] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
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
