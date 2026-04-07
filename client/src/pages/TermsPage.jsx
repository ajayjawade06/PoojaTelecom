import { Link } from 'react-router-dom';
import { FaFileContract, FaCheckCircle } from 'react-icons/fa';

const TermsPage = () => {
 return (
 <div className="min-h-screen bg-transparent pb-16 pt-8">
 <div className="max-w-3xl mx-auto px-4">

 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
 <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
 <span>/</span>
 <span className="text-slate-600 dark:text-slate-300">Terms of Service</span>
 </div>

 {/* Header */}
 <div className="mb-10">
 <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 border border-blue-100 dark:border-blue-500/10">
 <FaFileContract size={24} />
 </div>
 <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Terms of Service</h1>
 <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Last updated: April 2026</p>
 </div>

 {/* Terms Content */}
 <div className="space-y-6">
 {[
 {
 title: 'General Terms',
 content: [
 'By accessing and using Pooja Telecom, you agree to be bound by these terms and conditions.',
 'These terms apply to all users, including browsers, vendors, customers, and content contributors.',
 'We reserve the right to update these terms at any time. Continued use constitutes acceptance.',
 'You must be at least 18 years old to make a purchase on this platform.',
 ]
 },
 {
 title: 'Account & Registration',
 content: [
 'You are responsible for maintaining the confidentiality of your account credentials.',
 'You must provide accurate and complete registration information.',
 'One account per person — multiple accounts may be terminated.',
 'We reserve the right to suspend or terminate accounts that violate our policies.',
 ]
 },
 {
 title: 'Orders & Payments',
 content: [
 'All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.',
 'We reserve the right to refuse or cancel any order for reasons including pricing errors or stock issues.',
 'Payment must be completed at the time of order placement.',
 'Orders are confirmed only after successful payment verification.',
 'Promotional discounts and coupon codes are subject to specific terms and validity periods.',
 ]
 },
 {
 title: 'Product Information',
 content: [
 'We strive for accuracy in product descriptions, images, and specifications.',
 'Actual product may slightly vary from images due to photography and display settings.',
 'Product availability is subject to change without prior notice.',
 'We do not warrant that product descriptions are error-free or complete.',
 ]
 },
 {
 title: 'Shipping & Delivery',
 content: [
 'Estimated delivery times are provided as guidance and are not guaranteed.',
 'Shipping charges are calculated based on order value and delivery location.',
 'Free shipping may be available for orders above a certain value.',
 'Risk of loss and title for items pass to you upon delivery to the carrier.',
 ]
 },
 {
 title: 'Intellectual Property',
 content: [
 'All content on this website (logos, images, text, code) is owned by Pooja Telecom.',
 'You may not copy, reproduce, or distribute any content without written permission.',
 'Product brands and trademarks belong to their respective owners.',
 'User-submitted content (reviews, photos) grants us a license to display and use it.',
 ]
 },
 {
 title: 'Limitation of Liability',
 content: [
 'Pooja Telecom shall not be liable for any indirect, incidental, or consequential damages.',
 'Our total liability shall not exceed the amount paid by you for the specific product/order.',
 'We are not responsible for delays caused by shipping carriers or force majeure events.',
 'Use of the platform is at your own risk.',
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

export default TermsPage;
