import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Heart, Calendar, Percent, ShieldCheck, HeartHandshake, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppContext } from "../context/DataContext";

interface HeroProps {
  onOpenBudgetSidebar: () => void;
}

export default function Hero({ onOpenBudgetSidebar }: HeroProps) {
  const { data } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    "https://i.imgur.com/Es3OQW6.jpeg",
    "https://i.imgur.com/QXmyxhn.jpeg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleScrollToCatalog = () => {
    const catalogEl = document.getElementById("catalogo");
    if (catalogEl) {
      const headerOffset = 90;
      const elementPosition = catalogEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      id="inicio"
      className="relative pt-[64px] sm:pt-[74px] pb-4 bg-slate-50"
    >
      {/* Soft background glow accents */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-brand-pink/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 rounded-full bg-brand-tiffany/5 blur-3xl pointer-events-none" />

      {/* Full-width container of the banner */}
      <div className="w-full relative z-10 select-none">
        
        {/* Grand E-Commerce Promo Banner element - Edge to Edge width with responsive aspect ratio */}
        <div 
          className="relative w-full overflow-hidden shadow-xs border-y border-slate-200/40 bg-white group"
          id="hero_ecommerce_banner"
        >
          {/* Helper Image: This determines the natural height of the container perfectly on all devices, avoiding distortion */}
          <img
            src={banners[0]}
            alt="Helper Layout Guide"
            className="w-full h-auto pointer-events-none opacity-0 invisible block"
          />

          {/* Silder Active Image Layer */}
          <div className="absolute inset-0 w-full h-full">
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={currentSlide}
                src={banners[currentSlide]}
                alt={`DL Magic Paper Banner Promocional ${currentSlide + 1}`}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full h-full object-fill"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>

          {/* Clean glass reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-white/0 to-white/5 pointer-events-none" />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white backdrop-blur-xs border border-slate-200/50 flex items-center justify-center text-slate-700 hover:text-brand-pink shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white backdrop-blur-xs border border-slate-200/50 flex items-center justify-center text-slate-700 hover:text-brand-pink shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 cursor-pointer"
            aria-label="Próximo"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Navigation Dots Indicator */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx 
                    ? "bg-brand-pink w-4 sm:w-5 shadow-xs" 
                    : "bg-slate-400/55 hover:bg-slate-400"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Lower Store Benefits Block & CTAs within max container of the page for perfect design alignment */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-5 bg-white p-4 sm:p-5 rounded-[1.5rem] border border-slate-200/50 shadow-xs">
            
            {/* Virtual Store Info Badges - Mobile: Slider Horizontal Scroll, Desktop/Tablet: Grid columns */}
            <div className="flex flex-row lg:grid lg:grid-cols-3 gap-6 lg:gap-4 w-full lg:flex-1 overflow-x-auto lg:overflow-visible pb-2.5 lg:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden animate-fade-in">
              <div className="flex items-start gap-3 text-left shrink-0 min-w-[210px] sm:min-w-[240px] lg:min-w-0 font-sans">
                <div className="p-2 bg-pink-50 rounded-xl text-brand-pink shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 whitespace-nowrap">100% Personalizado</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal whitespace-normal sm:max-w-[200px]">Adicionamos o nome, idade e o tema que você preferir.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left shrink-0 min-w-[210px] sm:min-w-[240px] lg:min-w-0 font-sans">
                <div className="p-2 bg-pink-50 rounded-xl text-brand-pink shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 whitespace-nowrap">Atendimento Especial</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal whitespace-normal sm:max-w-[200px]">Ajustamos laços, fitas e cores direto pelo WhatsApp.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left shrink-0 min-w-[210px] sm:min-w-[240px] lg:min-w-0 font-sans">
                <div className="p-2 bg-pink-50 rounded-xl text-brand-pink shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 whitespace-nowrap">Orçamento sem Complicações</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal whitespace-normal sm:max-w-[200px]">Adicione os mimos favoritos e envie com um clique no WhatsApp.</p>
                </div>
              </div>
            </div>

            {/* Quick CTA Buttons */}
            <div className="flex flex-row items-center gap-3 w-full lg:w-auto shrink-0 justify-between sm:justify-start lg:justify-end pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-dashed border-slate-200 lg:pl-5">
              <button
                onClick={handleScrollToCatalog}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-5 py-2.5 rounded-full font-sans text-xs font-bold shadow-md shadow-brand-pink/10 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap active:scale-98"
              >
                Explorar Produtos
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBudgetSidebar}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-full font-sans text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer whitespace-nowrap active:scale-98"
              >
                <Heart className="w-4 h-4 text-brand-pink fill-brand-pink/15" />
                Ver Carrinho
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

