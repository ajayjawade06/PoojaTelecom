import { Link } from 'react-router-dom';
import { FaUndo, FaCheckCircle, FaClock, FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';

const RefundPolicyPage = () => {
 return (
 <div className="min-h-screen bg-transparent pb-16 pt-8">
 <div className="max-w-3xl mx-auto px-4">

 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
 <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
 <span>/</span>
 <span className="text-slate-600 dark:text-slate-300">Returns & Refunds</span>
 </div>

 {/* Header */}
 <div className="mb-10">
 <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 border border-blue-100 dark:border-blue-500/10">
 <FaUndo size={24} />
 </div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Returns & Refund Policy</h1>
 <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Hassle-free returns within 7 days of delivery</p>
 </div>

 {/* Quick Info Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
 {[
 { icon: FaClock, title: '7-Day Window', desc: 'Return within 7 days of delivery' },
 { icon: FaCheckCircle, title: 'Full Refund', desc: 'Get 100% money back on eligible items' },
 { icon: FaUndo, title: 'Free Returns', desc: 'No return shipping charges' },
 ].map((item, i) => (
 <div key={i} className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 p-5 shadow-lg shadow-slate-200/50 dark:shadow-none text-center">
 <item.icon className="text-blue-500 mx-auto mb-2" size={20} />
 <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">{item.title}</h4>
 <p className="text-[11px] font-medium text-slate-400">{item.desc}</p>
 </div>
 ))}
 </div>

 {/* Policy Sections */}
 <div className="space-y-6">
 {[
 {
 title: 'Eligibility for Returns',
 content: [
 'Products must be returned within 7 days of delivery date.',
 'Items must be unused, in original packaging, and with all tags/accessories intact.',
 'Electronics must not have been activated or registered.',
 'Products with manufacturing defects can be returned within 30 days.',
 'Sale/clearance items are eligible for exchange only, not refund.',
 ]
 },
 {
 title: 'How to Initiate a Return',
 content: [
 'Log in to your account and go to Profile → Order History.',
 'Select the order and click"Request Return/Refund".',
 'Choose your reason for return and upload photos if applicable.',
 'Our team will review and approve within 24-48 hours.',
 'Once approved, schedule a free pickup or drop off at our store.',
 ]
 },
 {
 title: 'Refund Process',
 content: [
 'Refunds are initiated once the returned item passes quality inspection.',
 'Original payment method refunds take 5-7 business days.',
 'UPI/Wallet refunds are processed within 24-48 hours.',
 'Bank transfer refunds may take up to 10 business days.',
 'You will receive email/SMS notifications at each step.',
 ]
 },
 {
 title: 'Non-Returnable Items',
 content: [
 'SIM cards and prepaid recharge vouchers.',
 'Customized or engraved products.',
 'Software licenses and digital downloads.',
 'Items damaged due to misuse or physical damage by the customer.',
 'Products without original packaging or missing accessories.',
 ]
 },
 {
 title: 'Exchange Policy',
 content: [
 'Exchanges are available for size/color variants of the same product.',
 'Exchange requests must be made within 7 days of delivery.',
 'If the exchange item has a price difference, you will be charged or refunded accordingly.',
 'Exchanges are subject to stock availability.',
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

 {/* Contact for Refunds */}
 <div className="mt-8 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10 p-6 flex items-start gap-4">
 <FaEnvelope className="text-blue-500 shrink-0 mt-1" size={18} />
 <div>
 <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight mb-1">Need Help with a Refund?</h4>
 <p className="text-[12px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
 Contact our support team at <span className="font-bold text-blue-600 dark:text-blue-400">hello@poojatelecom.com</span> or 
 call <span className="font-bold text-blue-600 dark:text-blue-400">+91 7721852240</span>. We typically respond within 2 hours during business hours.
 </p>
 </div>
 </div>

 </div>
 </div>
 );
};

export default RefundPolicyPage;
