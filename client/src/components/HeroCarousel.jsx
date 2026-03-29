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
    price: 'From ₹1,19,900*',
    color: 'from-slate-900 to-slate-800',
    accent: 'emerald',
    badge: 'New Launch'
  },
  {
    id: 2,
    title: 'MacBook Pro M4',
    subtitle: 'A monstrous upgrade.',
    description: 'Up to 24 hours of battery life. The most advanced chips ever built for a personal computer.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
    price: 'Starting at ₹1,69,900',
    color: 'from-blue-900 to-slate-900',
    accent: 'blue',
    badge: 'Pro Performance'
  },
  {
    id: 3,
    title: 'Watch Ultra 2',
    subtitle: 'The ultimate sports watch.',
    description: 'The most rugged and capable Apple Watch. Now in a stunning Satin Black finish.',
    image: 'https://images.unsplash.com/photo-1544117518-30dd0f7a5931?q=80&w=1200&auto=format&fit=crop',
    price: 'Now at ₹89,900',
    color: 'from-amber-900 to-slate-900',
    accent: 'amber',
    badge: 'Adventure Awaits'
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative h-[450px] md:h-[500px] w-full overflow-hidden rounded-[1.5rem] shadow-2xl shadow-slate-900/40 border border-white/10 group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.color}`}></div>
          
          {/* Content Container */}
          <div className="container mx-auto h-full px-8 md:px-16 flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className={`max-w-xl text-center md:text-left transition-all duration-700 delay-300 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className={`inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-${slide.accent}-500/10 text-${slide.accent}-400 font-black text-[10px] tracking-[0.2em] uppercase mb-6 border border-${slide.accent}-500/20 backdrop-blur-md`}>
                <FaBolt className="animate-pulse" /> {slide.badge}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tighter">
                {slide.title}
              </h1>
              <h2 className="text-xl md:text-2xl font-bold text-white/90 mb-4 drop-shadow-sm">
                 {slide.subtitle}
              </h2>
              <p className="text-sm text-slate-400 mb-8 font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                {slide.description}
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link to="/search/apple" className={`bg-${slide.accent}-500 text-white font-black py-4 px-8 rounded-xl transition-all shadow-xl shadow-${slide.accent}-500/20 hover:-translate-y-1 hover:shadow-${slide.accent}-500/40 active:scale-95 flex items-center gap-2 group text-xs`}>
                  Shop Now <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="bg-white/5 text-white border border-white/10 font-black py-4 px-8 rounded-xl backdrop-blur-md text-xs">
                   {slide.price}
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className={`mt-8 md:mt-0 relative transition-all duration-1000 delay-500 ${index === current ? 'translate-x-0 opacity-100 rotate-0' : 'translate-x-20 opacity-0 rotate-6'}`}>
               <div className={`absolute inset-x-0 -bottom-10 bg-${slide.accent}-500/20 blur-[100px] h-48 rounded-full`}></div>
               <img 
                 src={slide.image} 
                 className="w-[200px] md:w-[350px] h-auto object-contain relative z-10 drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] active:scale-105 transition-transform" 
                 alt={slide.title} 
               />
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 z-20 backdrop-blur-sm"
      >
        <FaChevronLeft />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 z-20 backdrop-blur-sm"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all rounded-full ${i === current ? 'w-10 bg-emerald-500' : 'w-3 bg-white/30 hover:bg-white/50'}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
