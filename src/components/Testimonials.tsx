import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ZoomIn, X, ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react";

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
    <section id="avaliacoes" className="py-20 lg:py-28 bg-[#FFF6F0] relative overflow-hidden border-t border-[#3A2439]/5">
      
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section title */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E8527A]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E8527A]" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#E8527A]">
              Prova Social & Carinho Real ✨
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3A2439] tracking-tight">
            Quem Compra Vive a Mágica
          </h2>
          <p className="font-sans text-[#3A2439]/70 font-normal leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
            O resultado da nossa papelaria está estampado no sorriso de cada cliente. Veja as conversas reais de carinho recebidas em nosso WhatsApp (toque para ampliar):
          </p>
        </div>

        {/* Real Screenshots Grid with Glassmorphism Framing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {TESTIMONIAL_IMAGES.map((item, index) => (
            <div 
              key={item.id}
              onClick={() => setSelectedImageIndex(index)}
              className="group relative bg-white border border-[#3A2439]/10 rounded-[2rem] p-3 shadow-md shadow-[#3A2439]/5 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-zoom-in overflow-hidden select-none flex flex-col"
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
                <div className="absolute inset-0 bg-[#3A2439]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/95 backdrop-blur-md text-[#3A2439] px-4 py-2.5 rounded-full font-sans text-xs font-bold flex items-center gap-2 shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-4 h-4 text-[#E8527A]" />
                    Ampliar Print
                  </div>
                </div>
              </div>

              {/* Bottom Card Area */}
              <div className="pt-3 pb-1 px-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="text-[#FFC947] flex">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-[10px] text-[#3A2439]/50 font-semibold uppercase tracking-wider font-sans">10/10</span>
                </div>

                {/* Micro Reaction Button */}
                <button
                  onClick={(e) => toggleLike(item.id, e)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    likes[item.id] 
                      ? "bg-red-50 border-red-200 text-[#E8527A] scale-110" 
                      : "bg-[#FFF6F0] border-[#3A2439]/10 text-[#3A2439]/50 hover:text-[#E8527A] hover:scale-105"
                  }`}
                  title="Amei isso!"
                >
                  <Heart className={`w-3.5 h-3.5 ${likes[item.id] ? "fill-[#E8527A] text-[#E8527A]" : ""}`} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Client trust guarantee badge */}
        <div className="mt-14 flex items-center justify-center gap-2.5 text-[#3A2439]/70 text-xs sm:text-sm font-semibold select-none">
          <Heart className="w-4 h-4 text-[#E8527A] fill-[#E8527A] animate-pulse shrink-0" />
          <span>Garantia de atendimento acolhedor com carinho DL Magic Paper</span>
        </div>

      </div>

      {/* LIGHTBOX MODAL TRIGGER */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#3A2439]/90 backdrop-blur-md flex items-center justify-center p-4"
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
              <div className="mt-4 flex items-center gap-6 text-white/80 font-sans text-xs sm:text-sm">
                <span>{selectedImageIndex + 1} de {TESTIMONIAL_IMAGES.length}</span>
                <span className="text-white/40">|</span>
                <span className="font-semibold text-[#FFC947]">DL Magic Paper</span>
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
