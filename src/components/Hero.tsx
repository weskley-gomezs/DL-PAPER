import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Gift, 
  Layers, 
  MessageCircle,
  Scissors
} from "lucide-react";
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
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

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
      const headerOffset = 80;
      const elementPosition = catalogEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleScrollToContact = () => {
    const contactEl = document.getElementById("contato");
    if (contactEl) {
      const headerOffset = 80;
      const elementPosition = contactEl.getBoundingClientRect().top;
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
      className="relative pt-24 sm:pt-28 pb-10 sm:pb-14 bg-[#FFF6F0] overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-[#FFC947]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Welcome Intro Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          
          {/* Logo Badge */}
          <div className="inline-flex mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-2.5 shadow-md shadow-[#E8527A]/15 border-2 border-white flex items-center justify-center transition-transform hover:scale-105">
              <img 
                src={data.logo || "https://i.imgur.com/fVtEcdv.png"} 
                alt="DL Magic Paper" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Pill Badge */}
          <div className="flex justify-center mb-3">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E8527A]/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E8527A]" />
              <span className="font-sans text-xs font-bold text-[#E8527A] tracking-wide">
                Papelaria de Personalizados Clássicos & Afetiva
              </span>
            </div>
          </div>

          {/* Main Welcome Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3A2439] tracking-tight leading-tight">
            Bem-vindo(a) ao DL Magic Paper!
          </h1>
          
          <p className="font-sans text-sm sm:text-base text-[#3A2439]/75 font-normal max-w-2xl mx-auto mt-3 leading-relaxed">
            Transformamos papel em memórias inesquecíveis. Caixas clássicas com laços de luxo, topos de bolo 3D em camadas, kits para festas e mimos produzidos artesanalmente com muito amor e carinho em Brasília.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
            <button
              type="button"
              onClick={handleScrollToCatalog}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8527A] hover:bg-[#D43C65] text-white font-sans text-sm font-bold shadow-md shadow-[#E8527A]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
              id="hero_btn_ver_catalogo"
            >
              <Package className="w-4 h-4" />
              Ver Catálogo Completo
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              type="button"
              onClick={handleScrollToContact}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-white/90 text-[#3A2439] border border-[#3A2439]/15 font-sans text-sm font-bold shadow-xs hover:border-[#E8527A] hover:text-[#E8527A] transition-all cursor-pointer"
              id="hero_btn_orcamento"
            >
              <MessageCircle className="w-4 h-4 text-[#E8527A]" />
              Pedir Orçamento no WhatsApp
            </button>
          </div>
        </div>

        {/* Carousel Promotional Banner Section */}
        <div className="max-w-5xl mx-auto mb-10">
          <div 
            className="relative w-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white bg-white group aspect-[16/7] sm:aspect-[21/9]"
            id="hero_banner_carousel"
          >
            {/* Slider Layer */}
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={currentSlide}
                src={banners[currentSlide]}
                alt={`DL Magic Paper Banner ${currentSlide + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full object-cover sm:object-fill"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#3A2439] hover:text-[#E8527A] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#3A2439] hover:text-[#E8527A] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
              aria-label="Próximo banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx 
                      ? "bg-[#E8527A] w-6" 
                      : "bg-white/70 hover:bg-white w-2"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Bar */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 bg-white/90 backdrop-blur-xs p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#3A2439]/10 shadow-xs">
            
            <div className="flex items-center gap-3.5 p-2 text-left">
              <div className="w-10 h-10 rounded-2xl bg-[#E8527A]/10 text-[#E8527A] flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#3A2439]">100% Personalizado</h4>
                <p className="font-sans text-xs text-[#3A2439]/65">Criamos no tema, nome e cores que você sonhar.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2 text-left border-t sm:border-t-0 sm:border-l border-[#3A2439]/10 pt-3 sm:pt-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FFC947]/20 text-[#3A2439] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-[#E8527A]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#3A2439]">Papelaria em Camadas 3D</h4>
                <p className="font-sans text-xs text-[#3A2439]/65">Papéis nobres de 180g com laços de cetim luxuosos.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2 text-left border-t sm:border-t-0 sm:border-l border-[#3A2439]/10 pt-3 sm:pt-2">
              <div className="w-10 h-10 rounded-2xl bg-[#E8527A]/10 text-[#E8527A] flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-[#E8527A]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#3A2439]">Atendimento Afetivo</h4>
                <p className="font-sans text-xs text-[#3A2439]/65">Orçamento rápido e direto pelo WhatsApp com carinho.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
