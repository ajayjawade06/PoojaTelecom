import { Link } from 'react-router-dom';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

const PrivacyPolicyPage = () => {
 return (
 <div className="min-h-screen bg-transparent pb-16 pt-8">
 <div className="max-w-3xl mx-auto px-4">

 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
 <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
 <span>/</span>
 <span className="text-slate-600 dark:text-slate-300">Privacy Policy</span>
 </div>

 {/* Header */}
 <div className="mb-10">
 <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 border border-blue-100 dark:border-blue-500/10">
 <FaLock size={24} />
 </div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Privacy Policy</h1>
 <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Last updated: April 2026</p>
 </div>

 {/* Policy Content */}
 <div className="space-y-6">
 {[
 {
 title: 'Information We Collect',
 content: [
 'Personal details: name, email, phone number, and shipping address when you create an account or place an order.',
 'Payment information is processed securely through third-party payment gateways — we do not store card details.',
 'Browsing data: pages visited, search queries, product interactions, and device/browser information.',
 'Cookies and analytics data to improve your shopping experience.',
 ]
 },
 {
 title: 'How We Use Your Data',
 content: [
 'Processing and fulfilling your orders, including shipping and delivery updates.',
 'Sending order confirmations, invoices, and support communications.',
 'Personalizing your shopping experience with relevant product recommendations.',
 'Improving our website, services, and customer support quality.',
 'Sending promotional offers and newsletters (only with your consent, you can opt out anytime).',
 ]
 },
 {
 title: 'Data Protection',
 content: [
 'All data is encrypted using industry-standard SSL/TLS protocols.',
 'Access to personal data is restricted to authorized personnel only.',
 'We conduct regular security audits and vulnerability assessments.',
 'We never sell or share your personal data with third parties for marketing purposes.',
 ]
 },
 {
 title: 'Third-Party Services',
 content: [
 'Payment processors (Razorpay/PayPal) for secure transaction handling.',
 'Shipping partners for order delivery — only shipping details are shared.',
 'Analytics services (Google Analytics) for website performance monitoring.',
 'Cloud hosting (secure servers) for data storage and processing.',
 ]
 },
 {
 title: 'Your Rights',
 content: [
 'Access: Request a copy of all personal data we hold about you.',
 'Correction: Update or correct inaccurate personal information.',
 'Deletion: Request deletion of your account and associated data.',
 'Opt-out: Unsubscribe from marketing communications at any time.',
 'Portability: Request your data in a machine-readable format.',
 ]
 },
 {
 title: 'Cookie Policy',
 content: [
 'Essential cookies: Required for site functionality (login, cart, checkout).',
 'Analytics cookies: Help us understand user behavior and improve our services.',
 'Preference cookies: Remember your settings (theme, language, location).',
 'You can manage cookie preferences through your browser settings.',
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

 </div>
 </div>
 );
};

export default PrivacyPolicyPage;
