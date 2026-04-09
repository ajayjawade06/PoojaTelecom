import { useState, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-40 w-11 h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-lg shadow-slate-200/50 dark:shadow-black/30 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-blue-500/20 transition-all duration-200"
          aria-label="Back to top"
        >
          <FaChevronUp size={14} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
