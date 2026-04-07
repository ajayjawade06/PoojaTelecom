import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color }) => {
 return (
 <div className="flex items-center gap-1.5 whitespace-nowrap">
 <div className="flex items-center gap-0.5">
 {[1, 2, 3, 4, 5].map((index) => (
 <span key={index}>
 {value >= index ? (
 <FaStar className="text-amber-400" size={10} />
 ) : value >= index - 0.5 ? (
 <FaStarHalfAlt className="text-amber-400" size={10} />
 ) : (
 <FaRegStar className="text-slate-200 dark:text-slate-700" size={10} />
 )}
 </span>
 ))}
 </div>
 {text && (
 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
 {text}
 </span>
 )}
 </div>
 );
};

export default Rating;
