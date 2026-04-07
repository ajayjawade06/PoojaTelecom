import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import { logout } from '../redux/slices/authSlice';
import { toggleCart } from '../redux/slices/cartSlice';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaChevronDown, FaStore, FaMoon, FaSun, FaArrowRight, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { getFullImageUrl } from '../utils/imageUtils';

const Header = () => {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
 const { theme, toggleTheme } = useTheme();
 const [searchQuery, setSearchQuery] = useState('');
 const [isScrolled, setIsScrolled] = useState(false);
 const [isSearchFocused, setIsSearchFocused] = useState(false);
 const dropdownRef = useRef(null);
 const searchRef = useRef(null);

 const { data: searchData, isFetching: isSearching } = useGetProductsQuery(
 { keyword: searchQuery, pageNumber: 1 }, 
 { skip: !searchQuery || !isSearchFocused }
 );

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
 if (searchRef.current && !searchRef.current.contains(event.target)) {
 setIsSearchFocused(false);
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
 <header className={`fixed w-full top-0 z-[100] transition-all duration-400 ${isScrolled
 ? 'backdrop-blur-2xl bg-white/70 dark:bg-black/60 border-b border-slate-200/50 dark:border-white/10 py-2 shadow-sm'
 : 'bg-transparent py-4'
 }`}>

 <div className="main-container">
 <div className="flex items-center justify-between gap-4 h-auto min-h-[48px] py-1 flex-wrap md:flex-nowrap">

 <Link to="/" className="flex items-center gap-2 shrink-0 group">
 <span className={`font-semibold text-2xl tracking-tight transition-colors ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
 Pooja<span className="font-light opacity-60">Telecom</span>
 </span>
 </Link>

 {/* Minimal Search Bar */}
 {!isAuthPage && (
 <div ref={searchRef} className="hidden lg:flex flex-grow max-w-sm relative group">
 <form onSubmit={submitHandler} className="w-full relative">
 <input
 type="text"
 placeholder="Search products..."
 className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 focus:border-blue-500/50 py-2.5 pl-10 pr-4 rounded-full text-[13px] font-medium transition-colors outline-none dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-[#1c1c1e]"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onFocus={() => setIsSearchFocused(true)}
 />
 <FaSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
 </form>

 {/* Instant Search Popover */}
 {isSearchFocused && searchQuery && (
 <div className="absolute top-[110%] left-0 w-full bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-[120] animate-fade-in">
 {isSearching ? (
 <div className="p-4 text-center text-xs text-slate-500 font-medium">Searching...</div>
 ) : searchData?.products?.length > 0 ? (
 <div className="max-h-[300px] overflow-y-auto pb-2">
 {searchData.products.slice(0, 5).map(product => (
 <Link 
 key={product._id} 
 to={`/product/${product._id}`}
 onClick={() => { setIsSearchFocused(false); setSearchQuery(''); }}
 className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
 >
 <img src={getFullImageUrl(product.image)} alt={product.name} className="w-10 h-10 object-contain rounded-md bg-white dark:bg-[#2c2c2e] p-1 shrink-0 border border-slate-100 dark:border-white/5" />
 <div className="flex-grow min-w-0">
 <p className="text-[12px] font-bold text-slate-900 dark:text-white truncate">{product.name}</p>
 <p className="text-[11px] font-bold text-blue-500">₹{product.price.toLocaleString('en-IN')}</p>
 </div>
 </Link>
 ))}
 <Link 
 to={`/search/${searchQuery}`} 
 onClick={() => setIsSearchFocused(false)}
 className="block text-center text-[10px] uppercase tracking-widest font-black text-blue-500 py-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors mt-2"
 >
 View all results <FaArrowRight className="inline ml-1 -mt-0.5" size={10} />
 </Link>
 </div>
 ) : (
 <div className="p-6 text-center">
 <p className="text-[12px] font-medium text-slate-500">No products found for "{searchQuery}"</p>
 </div>
 )}
 </div>
 )}
 </div>
 )}

 {/* Navigation Actions */}
 <nav className="flex items-center gap-1">

 {/* Theme Toggle */}
 <button
 onClick={toggleTheme}
 className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
 title="Toggle Theme"
 >
 {theme === 'dark' ? <FaSun size={14} className="text-amber-400" /> : <FaMoon size={14} />}
 </button>

 {/* User Access */}
 {userInfo ? (
 <div ref={dropdownRef} className="relative group/profile pt-1">
 <button
 onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
 className="flex items-center gap-1.5 p-1 sm:px-1.5 sm:py-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-800 dark:text-white"
 >
 <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
 <FaUser size={14} />
 </div>
 <FaChevronDown size={8} className={`hidden sm:block text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
 </button>

 {isProfileDropdownOpen && (
 <div className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-[#2c2c2e]/95 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-xl py-2 z-[110]">
 <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 mb-1">
 <p className="text-[14px] font-semibold text-slate-900 dark:text-white truncate tracking-tight">{userInfo.name}</p>
 <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{userInfo.email}</p>
 </div>

 <div className="px-2 py-1 space-y-0.5">
 <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
 <FaUser size={12} className="opacity-70" /> Profile
 </Link>

 {userInfo.isAdmin && (
 <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
 <FaCog size={12} className="opacity-70" /> Admin
 </Link>
 )}

 <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-1.5 mx-2"></div>

 <button
 onClick={() => { logoutHandler(); setIsProfileDropdownOpen(false); }}
 className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
 >
 <FaSignOutAlt size={12} className="opacity-70" /> Logout
 </button>
 </div>
 </div>
 )}
 </div>
 ) : (
 <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500 text-white font-medium text-[13px] hover:bg-blue-600 transition-colors mx-2">
 <span>Sign In</span>
 </Link>
 )}

 <button onClick={() => dispatch(toggleCart())} className="relative group ml-1 sm:ml-2">
 <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
 <FaShoppingCart size={14} />
 </div>
 {cartItems.length > 0 && (
 <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white dark:border-slate-900 shadow-sm">
 {cartItems.reduce((a, c) => a + c.qty, 0)}
 </span>
 )}
 </button>

 <button
 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
 className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 ml-1"
 >
 {isMobileMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
 </button>
 </nav>
 </div>
 </div>

 {/* Mobile Sidebar Redesign */}
 {isMobileMenuOpen && (
 <div className="md:hidden fixed inset-0 z-[120] bg-white dark:bg-slate-900 p-6">
 <div className="flex justify-between items-center mb-10">
 <span className="font-black text-lg tracking-tighter text-slate-900 dark:text-white">POOJA<span className="text-blue-500">T</span></span>
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
 <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500"><FaSearch size={12} /></button>
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
 <FaUser className="text-blue-500" /> My Profile
 </Link>
 <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 py-4 px-6 bg-rose-50 dark:bg-rose-500/10 rounded-2xl text-rose-600 font-bold text-sm">
 Sign Out
 </button>
 </>
 ) : (
 <Link to="/login" className="flex items-center gap-4 py-4 px-6 bg-blue-500 text-white rounded-2xl font-bold text-sm" onClick={() => setIsMobileMenuOpen(false)}>
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
