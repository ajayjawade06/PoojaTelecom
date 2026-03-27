import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-gray-900 font-sans">
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
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          
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
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
