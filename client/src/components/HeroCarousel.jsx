import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaArrowRight } from 'react-icons/fa';
import { useGetCarouselSlidesQuery } from '../redux/slices/carouselApiSlice';

const HeroCarousel = () => {
  const { data: slides, isLoading, error } = useGetCarouselSlidesQuery();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  // Reset current if slides change and current is out of bounds
  useEffect(() => {
    if (slides && current >= slides.length) {
      setCurrent(0);
    }
  }, [slides, current]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="relative h-[380px] md:h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 animate-pulse">
        <div className="h-full flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5"></div>
        </div>
      </div>
    );
  }

  // Don't render if no slides or error
  if (error || !slides || slides.length === 0) {
    return null;
  }

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative h-[380px] md:h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 group bg-white dark:bg-slate-900">
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === current ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/20"></div>
          
          <div className="main-container h-full flex flex-col md:flex-row items-center justify-between relative z-10 py-8">
            <div className="max-w-lg text-center md:text-left transition-all duration-500 delay-200">
              {slide.subtitle && (
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] uppercase tracking-widest mb-4 border border-emerald-500/20">
                  <FaBolt size={8} /> {slide.subtitle}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                {slide.title}
              </h1>
              {slide.description && (
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-6 font-medium max-w-sm">
                  {slide.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
                <Link to={slide.link || '/search/all'} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-2.5 px-6 rounded-lg transition-all hover:scale-105 active:scale-95 text-[12px] flex items-center gap-2">
                  {slide.linkText || 'Shop Store'} <FaArrowRight size={10} />
                </Link>
                {slide.price && (
                  <span className="text-[13px] font-black text-emerald-500">
                     {slide.price}
                  </span>
                )}
              </div>
            </div>

            <div className="hidden md:block relative h-full aspect-square transition-all duration-700 delay-300">
               <img 
                 src={slide.image} 
                 className="h-full w-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform" 
                 alt={slide.title} 
               />
            </div>
          </div>
        </div>
      ))}

      {/* Nav Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all ${i === current ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
