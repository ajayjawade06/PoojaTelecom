import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SideCart from './components/SideCart';
import BackToTop from './components/BackToTop';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import OrderList from './pages/admin/OrderList';
import UserList from './pages/admin/UserList';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ReportsPage from './pages/admin/ReportsPage';
import UserReviewsPage from './pages/admin/UserReviewsPage';
import CarouselManager from './pages/admin/CarouselManager';
import TrackOrderPage from './pages/TrackOrderPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import WarrantyPolicyPage from './pages/WarrantyPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';

const App = () => {
 return (
 <ThemeProvider>
 <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-200">
 <Header />
 <main className="flex-grow pt-24">
 <Routes>
 <Route path="/" element={<HomePage />} />
 <Route path="/search/:keyword" element={<HomePage />} />
 <Route path="/page/:pageNumber" element={<HomePage />} />
 <Route path="/search/:keyword/page/:pageNumber" element={<HomePage />} />
 <Route path="/category/:category" element={<HomePage />} />
 <Route path="/category/:category/page/:pageNumber" element={<HomePage />} />
 <Route path="/product/:id" element={<ProductPage />} />
 <Route path="/cart" element={<CartPage />} />
 <Route path="/login" element={<div className="-mt-24"><LoginPage /></div>} />
 <Route path="/register" element={<div className="-mt-24"><RegisterPage /></div>} />
 <Route path="/forgot-password" element={<div className="-mt-24"><ForgotPasswordPage /></div>} />
 <Route path="/reset-password" element={<div className="-mt-24"><ResetPasswordPage /></div>} />
 <Route path="/verify-email" element={<VerifyEmailPage />} />
 <Route path="/track-order" element={<TrackOrderPage />} />
 <Route path="/refund-policy" element={<RefundPolicyPage />} />
 <Route path="/warranty-policy" element={<WarrantyPolicyPage />} />
 <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
 <Route path="/terms" element={<TermsPage />} />
 
 <Route path="" element={<PrivateRoute />}>
 <Route path="/profile" element={<ProfilePage />} />
 <Route path="/shipping" element={<ShippingPage />} />
 <Route path="/placeorder" element={<PlaceOrderPage />} />
 <Route path="/order/:id" element={<OrderPage />} />
 </Route>

 <Route path="" element={<AdminRoute />}>
 <Route path="/admin" element={<Dashboard />} />
 <Route path="/admin/orderlist" element={<OrderList />} />
 <Route path="/admin/userlist" element={<UserList />} />
 <Route path="/admin/productlist" element={<ProductList />} />
 <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
 <Route path="/admin/reports" element={<ReportsPage />} />
 <Route path="/admin/user/:id/reviews" element={<UserReviewsPage />} />
 <Route path="/admin/carousel" element={<CarouselManager />} />
 </Route>
 </Routes>
 </main>
 <Footer />
 <SideCart />
	<BackToTop />
 <ToastContainer 
 position="top-center" 
 autoClose={3000} 
 hideProgressBar={true} 
 newestOnTop={true} 
 closeOnClick 
 rtl={false} 
 pauseOnFocusLoss 
 draggable 
 pauseOnHover 
 theme="dark" 
 />
 </div>
 </ThemeProvider>
 );
};

export default App;
