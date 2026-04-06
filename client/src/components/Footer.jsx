import { Link } from 'react-router-dom';
import { FaStore, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 pt-20 pb-10">
      <div className="main-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="bg-emerald-500 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <FaStore size={16} />
              </div>
              <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">
                POOJA<span className="text-emerald-500">T</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed max-w-sm">
              Direct-to-consumer premium electronics and telecommunication solutions. High-performance gadgets curated for professionals.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-emerald-500 hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon size={12} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation</h4>
            <ul className="flex flex-col gap-2.5">
              {['Home', 'Shop All', 'Categories', 'Deals', 'New Arrivals'].map((link, i) => (
                <li key={i}>
                  <Link to="/" className="text-[13px] font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Hub</h4>
            <ul className="flex flex-col gap-2.5">
              {['Track Order', 'Warranty Policy', 'Returns & Refunds', 'Privacy Policy', 'Terms of Service'].map((link, i) => (
                <li key={i}>
                  <Link to="/" className="text-[13px] font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect</h4>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-emerald-500 shrink-0 mt-0.5" size={12} />
                <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">hello@poojatelecom.com</span>
              </div>
              <div className="flex items-start gap-3">
                <FaPhoneAlt className="text-emerald-500 shrink-0 mt-0.5" size={12} />
                <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">+91 7721852240
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-emerald-500 shrink-0 mt-1" size={12} />
                <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400 leading-tight">
                  Shop No. 2, Near BRT Bus Stop, Mukai Chowk, Kiwale, Pune - 412101, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            © {currentYear} POOJA TELECOM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">Premium Experience</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
