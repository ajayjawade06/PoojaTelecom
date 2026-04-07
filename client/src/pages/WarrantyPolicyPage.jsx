import { Link } from 'react-router-dom';
import { FaShieldAlt, FaCheckCircle, FaEnvelope } from 'react-icons/fa';

const WarrantyPolicyPage = () => {
 return (
 <div className="min-h-screen bg-transparent pb-16 pt-8">
 <div className="max-w-3xl mx-auto px-4">

 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
 <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
 <span>/</span>
 <span className="text-slate-600 dark:text-slate-300">Warranty Policy</span>
 </div>

 {/* Header */}
 <div className="mb-10">
 <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 border border-blue-100 dark:border-blue-500/10">
 <FaShieldAlt size={24} />
 </div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Warranty Policy</h1>
 <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">100% genuine products with manufacturer warranty</p>
 </div>

 {/* Policy Content */}
 <div className="space-y-6">
 {[
 {
 title: 'Warranty Coverage',
 content: [
 'All products sold on Pooja Telecom come with official manufacturer warranty.',
 'Warranty period varies by product category — check product listing for details.',
 'Covers manufacturing defects, hardware malfunctions, and component failures.',
 'Warranty is valid from the date of delivery (invoice serves as proof).',
 ]
 },
 {
 title: 'How to Claim Warranty',
 content: [
 'Contact our support team with your Order ID and product details.',
 'Describe the issue and attach photos/videos if possible.',
 'We will coordinate with the manufacturer for repair or replacement.',
 'Turnaround time for warranty claims is typically 7-15 business days.',
 'You will receive status updates via email/SMS.',
 ]
 },
 {
 title: 'What\'s NOT Covered',
 content: [
 'Physical damage, water damage, or accidental drops.',
 'Unauthorized modifications or repairs by third-party service centers.',
 'Normal wear and tear (scratches, battery degradation over time).',
 'Software issues, virus infections, or user-installed applications.',
 'Products with tampered or removed warranty seals.',
 ]
 },
 {
 title: 'Extended Warranty',
 content: [
 'We offer extended warranty plans for select product categories.',
 'Extended warranty can be purchased within 30 days of original purchase.',
 'Covers an additional 1-2 years beyond manufacturer warranty.',
 'Contact us for pricing and availability on your specific product.',
 ]
 },
 ].map((section, i) => (
 <div key={i} className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none">
 <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">{section.title}</h3>
 <ul className="space-y-2.5">
 {section.content.map((item, j) => (
 <li key={j} className="flex items-start gap-3">
 <FaCheckCircle className="text-blue-500 shrink-0 mt-0.5" size={10} />
 <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{item}</span>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>

 {/* Contact */}
 <div className="mt-8 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10 p-6 flex items-start gap-4">
 <FaEnvelope className="text-blue-500 shrink-0 mt-1" size={18} />
 <div>
 <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight mb-1">Warranty Support</h4>
 <p className="text-[12px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
 Email us at <span className="font-bold text-blue-600 dark:text-blue-400">hello@poojatelecom.com</span> or 
 call <span className="font-bold text-blue-600 dark:text-blue-400">+91 7721852240</span> for warranty claims.
 </p>
 </div>
 </div>

 </div>
 </div>
 );
};

export default WarrantyPolicyPage;
