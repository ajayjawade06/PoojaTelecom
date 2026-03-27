import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaChevronDown, FaStore, FaMoon, FaSun, FaThLarge } from 'react-icons/fa';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const categories = ['Mobiles', 'Laptops', 'Wearables', 'Audio', 'Accessories', 'Tablets'];

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
      ? 'bg-white/80 backdrop-blur-xl shadow-lg py-2 border-b border-slate-200/50' 
      : 'bg-slate-900 border-b border-white/10 py-4'
    }`}>
      
      {/* Top Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="bg-emerald-500 text-white p-2.5 rounded-2xl group-hover:rotate-12 transition-all shadow-xl shadow-emerald-500/20 active:scale-90">
              <FaStore size={24} />
            </div>
            <span className={`font-black text-2xl tracking-tighter transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              POOJA<span className="text-emerald-500">TELECOM</span>
            </span>
          </Link>

          {/* Categories Dropdown (Desktop) */}
          <div className="hidden lg:block relative group">
             <button 
               onMouseEnter={() => setIsCategoryOpen(true)}
               onMouseLeave={() => setIsCategoryOpen(false)}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                 isScrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white/80 hover:bg-white/10'
               }`}
             >
                <FaThLarge className="text-emerald-500" />
                Categories
                <FaChevronDown size={10} className={`ml-1 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
             </button>

             {/* Mega Menu style dropdown */}
             <div 
               onMouseEnter={() => setIsCategoryOpen(true)}
               onMouseLeave={() => setIsCategoryOpen(false)}
               className={`absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-4 transition-all duration-300 transform origin-top ${
                 isCategoryOpen ? 'scale-100 opacity-100 translate-y-2' : 'scale-95 opacity-0 pointer-events-none'
               }`}
             >
                {categories.map((cat) => (
                  <Link 
                    key={cat} 
                    to={`/category/${cat}`} 
                    className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-500 transition-colors"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     {cat}
                  </Link>
                ))}
             </div>
          </div>

          {/* Centered Search Bar */}
          <form onSubmit={submitHandler} className="hidden md:flex flex-grow max-w-xl relative group">
            <input
              type="text"
              placeholder="Search latest gadgets..."
              className={`w-full py-3.5 pl-6 pr-14 rounded-2xl text-sm font-bold border-2 transition-all outline-none ${
                isScrolled 
                ? 'bg-slate-50 border-slate-100 focus:border-emerald-500 focus:bg-white focus:shadow-xl focus:shadow-emerald-500/5 text-slate-900' 
                : 'bg-white/10 border-transparent focus:bg-white focus:text-slate-900 focus:border-emerald-400 text-white placeholder-slate-400 backdrop-blur-md'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-emerald-500 hover:scale-110 active:scale-95 transition-all">
              <FaSearch size={18} />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Theme Toggle (UI Only) */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-xl transition-all ${isScrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white/80 hover:bg-white/10'}`}
            >
               {isDark ? <FaSun size={18} className="text-amber-400" /> : <FaMoon size={18} />}
            </button>

            {/* Login/Profile */}
            {userInfo ? (
              <div className="relative group/profile">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all ${
                    isScrolled ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <FaUser size={12} />
                  </div>
                  <span className="hidden xl:inline">{userInfo.name.split(' ')[0]}</span>
                  <FaChevronDown size={10} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-60 bg-white border border-slate-100 rounded-3xl shadow-2xl py-4 z-50 animate-scale-up ring-1 ring-slate-900/5">
                    <div className="px-6 py-4 border-b border-slate-50 mb-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Account</p>
                       <p className="text-sm font-black text-slate-800 truncate">{userInfo.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-4 px-6 py-3.5 text-sm font-black text-slate-600 hover:bg-slate-50 hover:text-emerald-500 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm"><FaUser size={14} /></div>
                      My Hub
                    </Link>
                    {userInfo.isAdmin && (
                       <Link to="/admin" className="flex items-center gap-4 px-6 py-3.5 text-sm font-black text-slate-600 hover:bg-slate-50 hover:text-emerald-500 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm"><FaStore size={14} /></div>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={logoutHandler} className="w-full flex items-center gap-4 px-6 py-3.5 text-sm font-black text-rose-500 hover:bg-rose-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm"><FaTimes size={14} /></div>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl transition-all ${
                isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}>
                <FaUser className="text-emerald-500" />
                <span>Log In</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative group active:scale-95 transition-transform">
              <div className={`p-3.5 rounded-2xl transition-all shadow-xl hover:-translate-y-1 ${
                isScrolled ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-emerald-500 text-white shadow-emerald-500/30'
              }`}>
                <FaShoppingCart size={22} />
              </div>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-white shadow-2xl animate-bounce">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-3 rounded-xl active:scale-95 transition-all ${isScrolled ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'}`}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white fixed inset-0 z-[60] p-8 animate-slide-up flex flex-col">
           <div className="flex justify-between items-center mb-12">
              <span className="font-black text-3xl tracking-tighter text-slate-900">POOJA<span className="text-emerald-500">TELECOM</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-slate-100 rounded-2xl text-slate-900"><FaTimes size={20} /></button>
           </div>
           
           <form onSubmit={submitHandler} className="relative mb-8">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-slate-50 border-2 border-slate-100 py-5 px-8 rounded-[2rem] outline-none font-black text-slate-700 focus:border-emerald-500 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500 p-2"><FaSearch size={20} /></button>
           </form>

           <div className="space-y-4 overflow-y-auto flex-grow pb-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Categories</p>
              <div className="grid grid-cols-2 gap-3">
                 {categories.map(cat => (
                    <Link key={cat} to={`/category/${cat}`} onClick={() => setIsMobileMenuOpen(false)} className="bg-slate-50 p-5 rounded-3xl font-black text-xs text-slate-600 uppercase tracking-widest hover:bg-emerald-50 transition-colors">
                       {cat}
                    </Link>
                 ))}
              </div>

              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mt-8">Account</p>
              {userInfo ? (
                 <>
                  <Link to="/profile" className="flex items-center gap-4 py-5 px-8 bg-slate-50 rounded-[2rem] text-slate-900 font-black text-sm active:scale-[0.98] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                    <FaUser className="text-emerald-500" /> My Hub
                  </Link>
                  <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 py-5 px-8 bg-rose-50 rounded-[2rem] text-rose-700 font-black text-sm active:scale-[0.98] transition-all">
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
