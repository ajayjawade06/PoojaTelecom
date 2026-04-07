import { Link } from 'react-router-dom';
import { FaStore, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLock, FaShieldAlt, FaCcVisa, FaCcMastercard, FaCcAmex, FaGooglePay } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/?sort=newest' },
    { name: 'Cart', path: '/cart' },
    { name: 'My Profile', path: '/profile' },
  ];

  const supportLinks = [
    { name: 'Track Order', path: '/track-order' },
    { name: 'Warranty Policy', path: '/warranty-policy' },
    { name: 'Returns & Refunds', path: '/refund-policy' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  return (
    <footer className="bg-white dark:bg-[#1c1c1e] border-t border-slate-200 dark:border-white/5 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Footer Content */}
      <div className="main-container relative z-10 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0 w-fit">
              <span className="font-semibold text-xl tracking-tight text-slate-900 dark:text-white">
                Pooja<span className="font-light opacity-60">Telecom</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-[12px] font-medium leading-relaxed max-w-[260px]">
              Premium electronics & telecom solutions curated for professionals. Authorized dealer for all major brands.
            </p>
            <div className="flex items-center gap-2 mt-1">
              {[
                { Icon: FaFacebook, href: '#' },
                { Icon: FaTwitter, href: '#' },
                { Icon: FaInstagram, href: '#' },
                { Icon: FaLinkedin, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200">
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Navigation</h4>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-[12px] font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Support</h4>
            <ul className="flex flex-col gap-2">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-[12px] font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:hello@poojatelecom.com" className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-blue-500" size={10} />
                </div>
                <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors">hello@poojatelecom.com</span>
              </a>
              <a href="tel:+917721852240" className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <FaPhoneAlt className="text-blue-500" size={10} />
                </div>
                <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors">+91 7721852240</span>
              </a>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FaMapMarkerAlt className="text-blue-500" size={10} />
                </div>
                <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Shop No. 2, Near BRT Bus Stop,<br />Mukai Chowk, Kiwale, Pune - 412101
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Trust Strip */}
        <div className="border-t border-slate-100 dark:border-white/5 pt-6 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Trust Badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <FaLock size={10} className="text-green-500" />
                <span>SSL Encrypted</span>
              </div>
              <div className="w-px h-3 bg-slate-200 dark:bg-white/10"></div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <FaShieldAlt size={10} className="text-blue-500" />
                <span>100% Secure</span>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-1">We Accept</span>
              <div className="flex items-center gap-2">
                {[
                  { Icon: FaCcVisa, color: 'text-blue-600' },
                  { Icon: FaCcMastercard, color: 'text-orange-500' },
                  { Icon: FaCcAmex, color: 'text-blue-400' },
                  { Icon: FaGooglePay, color: 'text-slate-700 dark:text-slate-300' },
                ].map(({ Icon, color }, i) => (
                  <div key={i} className="w-9 h-6 rounded bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                    <Icon size={16} className={color} />
                  </div>
                ))}
                <div className="px-2 h-6 rounded bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                  <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 tracking-wider">UPI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] font-medium text-slate-400">
            © {currentYear} Pooja Telecom. All rights reserved.
          </p>
          <span className="text-[10px] font-medium text-slate-400">
            Developed by <span className="text-slate-900 dark:text-white font-bold">Lipa</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
