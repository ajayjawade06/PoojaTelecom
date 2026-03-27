import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-extrabold text-white mb-6">Pooja Telecom</h3>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              Your trusted partner for the latest smartphones, premium audio, and essential digital accessories. Fast delivery and unbeatable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                 <FaFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                 <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                 <FaInstagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-3 font-medium">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">My Account</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Customer Service</h4>
            <ul className="space-y-3 font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Refunds & Returns</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center md:flex md:justify-between md:text-left items-center">
          <p className="mb-4 md:mb-0 text-sm font-medium">
            &copy; {new Date().getFullYear()} Pooja Telecom. All Rights Reserved.
          </p>
          <div className="flex justify-center space-x-4 text-2xl opacity-75 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <span role="img" aria-label="card">💳</span>
            <span role="img" aria-label="bank">🏦</span>
            <span role="img" aria-label="device">📱</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
