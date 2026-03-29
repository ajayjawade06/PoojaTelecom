import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaBolt, FaArrowRight } from 'react-icons/fa';

const slides = [
  {
    id: 1,
    title: 'iPhone 16 Pro',
    subtitle: 'Built for Apple Intelligence.',
    description: 'The first iPhone designed from the ground up for Apple Intelligence. Personal, private, powerful.',
    image: 'https://images.unsplash.com/photo-1727104959451-872f23246f41?q=80&w=1200&auto=format&fit=crop',
    price: 'From ₹1,19,900',
    color: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950',
    accent: 'emerald',
    badge: 'New Arrival'
  },
  {
    id: 2,
    title: 'MacBook Pro M4',
    subtitle: 'A monstrous upgrade.',
    description: 'Up to 24 hours of battery life. The most advanced chips ever built for a personal computer.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
    price: 'Starting at ₹1,69,900',
    color: 'from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/20',
    accent: 'blue',
    badge: 'Pro Power'
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative h-[380px] md:h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 group bg-white dark:bg-slate-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === current ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.color}`}></div>
          
          <div className="main-container h-full flex flex-col md:flex-row items-center justify-between relative z-10 py-8">
            <div className="max-w-lg text-center md:text-left transition-all duration-500 delay-200">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] uppercase tracking-widest mb-4 border border-emerald-500/20">
                <FaBolt size={8} /> {slide.badge}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                {slide.title}
              </h1>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-6 font-medium max-w-sm">
                {slide.description}
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
                <Link to="/search/all" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-2.5 px-6 rounded-lg transition-all hover:scale-105 active:scale-95 text-[12px] flex items-center gap-2">
                  Shop Store <FaArrowRight size={10} />
                </Link>
                <span className="text-[13px] font-black text-emerald-500">
                   {slide.price}
                </span>
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

      {/* Nav */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all ${i === current ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
