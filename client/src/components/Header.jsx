import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaChevronDown, FaStore } from 'react-icons/fa';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
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
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-slate-900 border-b border-white/10 py-3'}`}>
      
      {/* Top Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-10 h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="bg-emerald-500 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
              <FaStore size={22} />
            </div>
            <span className={`font-black text-xl tracking-tighter ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              POOJA<span className="text-emerald-500">TELECOM</span>
            </span>
          </Link>

          {/* Centered Search Bar */}
          <form onSubmit={submitHandler} className="hidden md:flex flex-grow max-w-2xl relative group">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className={`w-full py-2.5 pl-5 pr-12 rounded-xl text-sm font-medium border-2 transition-all outline-none ${
                isScrolled 
                ? 'bg-slate-50 border-slate-100 focus:border-emerald-500 focus:bg-white' 
                : 'bg-white/10 border-transparent focus:bg-white focus:text-slate-900 focus:border-emerald-500 text-white placeholder-slate-400'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:scale-110 transition-transform">
              <FaSearch size={18} />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-6">
            
            {/* Login/Profile */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                    isScrolled ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <FaUser className="text-emerald-500" />
                  <span className="hidden sm:inline">{userInfo.name.split(' ')[0]}</span>
                  <FaChevronDown size={10} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-3 z-50 animate-fade-in ring-1 ring-slate-900/5">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                       <p className="text-sm font-bold text-slate-800 truncate">{userInfo.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-500 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500"><FaUser size={14} /></div>
                      My Dashboard
                    </Link>
                    <button onClick={logoutHandler} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500"><FaTimes size={14} /></div>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}>
                <FaUser className="text-emerald-500" />
                <span>Log In</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className={`p-2.5 rounded-xl transition-all ${
                isScrolled ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'
              }`}>
                <FaShoppingCart size={20} />
              </div>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg border-2 border-white shadow-lg animate-bounce">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>

            {/* Admin Hub */}
            {userInfo && userInfo.isAdmin && (
               <Link to="/admin" className="hidden lg:flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all">
                 Admin Hub
               </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl ${isScrolled ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'}`}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white fixed inset-0 z-[60] p-6 animate-slide-up">
           <div className="flex justify-between items-center mb-10">
              <span className="font-black text-2xl tracking-tighter text-slate-900">POOJA<span className="text-emerald-500">TELECOM</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-100 rounded-2xl"><FaTimes /></button>
           </div>
           
           <form onSubmit={submitHandler} className="relative mb-8">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-slate-50 border border-slate-100 py-4 px-6 rounded-2xl outline-none font-bold text-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"><FaSearch /></button>
           </form>

           {userInfo && (
              <Link to="/profile" className="block py-4 px-6 bg-slate-50 rounded-2xl text-slate-700 font-black text-sm mb-2 active:scale-95 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                My Dashboard
              </Link>
           )}

           {userInfo && userInfo.isAdmin && (
              <Link to="/admin" className="block py-4 px-6 bg-emerald-50 rounded-2xl text-emerald-700 font-black text-sm mb-2 active:scale-95 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                Admin Hub
              </Link>
           )}

           {userInfo ? (
              <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="w-full py-4 px-6 bg-rose-50 rounded-2xl text-rose-700 font-black text-sm active:scale-95 transition-all">
                Sign Out
              </button>
           ) : (
              <Link to="/login" className="block py-4 px-6 bg-emerald-50 rounded-2xl text-emerald-700 font-black text-sm active:scale-95 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                Log In
              </Link>
           )}
        </div>
      )}
    </header>
  );
};

export default Header;
