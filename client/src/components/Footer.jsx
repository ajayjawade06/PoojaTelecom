import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight, FaStore } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300 dark:text-slate-400 pt-24 pb-12 border-t border-white/5 dark:border-white/[0.02] mt-auto relative overflow-hidden transition-colors duration-500">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/[0.02] rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="bg-emerald-500 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
                <FaStore size={20} />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white dark:text-gray-100">
                POOJA<span className="text-emerald-500">TELECOM</span>
              </span>
            </Link>
            <p className="text-slate-400 dark:text-slate-400 mb-8 max-w-sm leading-relaxed font-medium">
              India's premier destination for luxury tech. We bring the world's most innovative electronics right to your doorstep.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:-translate-y-1 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white dark:text-gray-200 font-black text-sm uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-all flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Home Store</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-400 transition-all flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Shopping Cart</Link></li>
              <li><Link to="/profile" className="hover:text-emerald-400 transition-all flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> User Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-all flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Account Access</Link></li>
            </ul>
          </div>

          {/* Legal/Support */}
          <div>
            <h4 className="text-white dark:text-gray-200 font-black text-sm uppercase tracking-[0.2em] mb-8">Support Hub</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-all flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Privacy Guidelines</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-all flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Terms of Delivery</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-all flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Satisfaction Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-all flex items-center gap-2 group"><FaArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /> Contact Experts</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-white dark:text-gray-200 font-black text-sm uppercase tracking-[0.2em] mb-8">Stay Connected</h4>
            <div className="bg-white/5 dark:bg-white/[0.02] p-6 rounded-3xl border border-white/10 dark:border-white/5">
               <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">Join our inner circle for early access and luxury offers.</p>
               <div className="flex gap-2">
                  <input type="email" placeholder="Email" className="w-full bg-slate-800 dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-1 focus:ring-emerald-500 outline-none" />
                  <button className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 active:scale-90 transition-all"><FaArrowRight size={12} /></button>
               </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/5 dark:border-white/[0.02] pt-12 text-center md:flex md:justify-between md:text-left items-center">
          <p className="mb-6 md:mb-0 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-600">
            &copy; {new Date().getFullYear()} Pooja Telecom — Crafted for Technology Enthuasiasts.
          </p>
          <div className="flex justify-center gap-6 items-center grayscale opacity-30 hover:opacity-100 transition-all duration-700 cursor-pointer">
             <div className="bg-white/10 dark:bg-white/5 px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter text-white">VISA</div>
             <div className="bg-white/10 dark:bg-white/5 px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter text-white">RAZORPAY</div>
             <div className="bg-white/10 dark:bg-white/5 px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter text-white">MASTERCARD</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
