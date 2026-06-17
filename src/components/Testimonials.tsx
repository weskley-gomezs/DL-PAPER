import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ZoomIn, X, ChevronLeft, ChevronRight, Star } from "lucide-react";

const TESTIMONIAL_IMAGES = [
  {
    id: "screenshot-1",
    url: "https://i.imgur.com/pd6klyB.png",
    alt: "Depoimento do WhatsApp de Cliente 1"
  },
  {
    id: "screenshot-2",
    url: "https://i.imgur.com/OGvCsV3.png",
    alt: "Depoimento do WhatsApp de Cliente 2"
  },
  {
    id: "screenshot-3",
    url: "https://i.imgur.com/OYYILEl.png",
    alt: "Depoimento do WhatsApp de Cliente 3"
  },
  {
    id: "screenshot-4",
    url: "https://i.imgur.com/cQ1hCX1.png",
    alt: "Depoimento do WhatsApp de Cliente 4"
  }
];

export default function Testimonials() {
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering lightbox
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % TESTIMONIAL_IMAGES.length);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + TESTIMONIAL_IMAGES.length) % TESTIMONIAL_IMAGES.length);
    }
  };

  return (
    <section id="avaliacoes" className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section title */}
        <div className="text-center space-y-4 mb-14">
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-pink bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
            Quem Compra Vive a Mágica ✨
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Depoimentos Reais de Clientes
          </h2>
          <p className="font-sans text-slate-500 font-normal leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
            O amor pela nossa papelaria está estampado na reação de cada mamãe. Clique para ampliar as mensagens reais de carinho recebidas em nosso WhatsApp:
          </p>
        </div>

        {/* Real Screenshots Grid with Glassmorphism Framing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {TESTIMONIAL_IMAGES.map((item, index) => (
            <div 
              key={item.id}
              onClick={() => setSelectedImageIndex(index)}
              className="group relative bg-white border border-slate-200/65 rounded-[2rem] p-3 shadow-md shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-zoom-in overflow-hidden select-none flex flex-col"
              id={`testimonial_screenshot_${item.id}`}
            >
              {/* Image Container with high quality presentation in dark mode styling to blend with WhatsApp dark screenshot background */}
              <div className="relative rounded-[1.5rem] bg-[#0b141a] border border-slate-100 overflow-hidden flex-1 flex items-center justify-center aspect-[9/16]">
                <img 
                  src={item.url} 
                  alt={item.alt}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Glass effect with Action Indicator */}
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md text-slate-800 px-4 py-2.5 rounded-full font-sans text-xs font-bold flex items-center gap-2 shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-4 h-4 text-brand-pink" />
                    Ampliar Mensagem
                  </div>
                </div>
              </div>

              {/* Bottom Card Area */}
              <div className="pt-3 pb-1 px-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="text-amber-400 flex">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-sans">10/10</span>
                </div>

                {/* Micro Reaction Button */}
                <button
                  onClick={(e) => toggleLike(item.id, e)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    likes[item.id] 
                      ? "bg-red-50 border-red-100 text-red-500 scale-110" 
                      : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-500 hover:scale-105"
                  }`}
                  title="Amei isso!"
                >
                  <Heart className={`w-3.5 h-3.5 ${likes[item.id] ? "fill-red-500" : ""}`} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Client trust guarantee badge */}
        <div className="mt-16 flex items-center justify-center gap-2.5 text-slate-400 text-xs sm:text-sm font-semibold select-none">
          <Heart className="w-4 h-4 text-brand-pink fill-brand-pink animate-pulse shrink-0" />
          <span>Garantia de felicidade e pura fofura com selo DL Magic Paper</span>
        </div>

      </div>

      {/* LIGHTBOX MODAL TRIGGER */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Modal Inner Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button top-right */}
              <button 
                onClick={() => setSelectedImageIndex(null)}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation Controls Left */}
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all cursor-pointer hidden sm:flex"
                title="Depoimento Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Screenshot Render */}
              <div className="bg-white/5 p-2 rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[75vh] flex items-center justify-center">
                <img 
                  src={TESTIMONIAL_IMAGES[selectedImageIndex].url} 
                  alt={TESTIMONIAL_IMAGES[selectedImageIndex].alt}
                  className="max-h-[70vh] w-auto object-contain rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Navigation Controls Right */}
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all cursor-pointer hidden sm:flex"
                title="Próximo Depoimento"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Bottom helper text */}
              <div className="mt-4 flex items-center gap-6 text-white/70 font-sans text-xs sm:text-sm">
                <span>{selectedImageIndex + 1} de {TESTIMONIAL_IMAGES.length}</span>
                <span className="text-white/40">|</span>
                <span className="font-semibold text-brand-pink">DL Magic Paper</span>
              </div>

              {/* Touch Helper Navigation for mobile screens */}
              <div className="flex sm:hidden items-center gap-6 mt-4">
                <button 
                  onClick={handlePrev} 
                  className="bg-white/10 hover:bg-white/20 text-white py-1.5 px-4 rounded-full font-sans text-xs transition-all"
                >
                  Anterior
                </button>
                <button 
                  onClick={handleNext} 
                  className="bg-white/10 hover:bg-white/20 text-white py-1.5 px-4 rounded-full font-sans text-xs transition-all"
                >
                  Próximo
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
