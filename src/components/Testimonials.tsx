import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Quote, Heart } from "lucide-react";
import { TESTIMONIALS } from "../data";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // Auto scroll testimonials every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = TESTIMONIALS[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section id="avaliacoes" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center space-y-4 mb-12">
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-pink bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
            Relatos de Mãe 💌
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Quem Compra Vive a Mágica
          </h2>
          <p className="font-sans text-slate-500 font-light leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
            O segredo da nossa papelaria de luxo está nos sorrisos gerados na festa. Veja o que dizem as mamães e decoradoras que confiaram em nossos topos e caixas decoradas:
          </p>
        </div>

        {/* Carousel Outer Border Wrapper */}
        <div className="relative bg-slate-50/70 border border-slate-100/80 rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-slate-100/50 text-left">
          
          <Quote className="absolute top-8 right-8 text-pink-200/50 w-20 h-20 pointer-events-none transform -scale-x-100" />
          
          {/* Animated Slide Content Box */}
          <div className="relative min-h-[220px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="space-y-6 flex flex-col justify-between h-full"
                id={`testimonial_slide_${activeTestimonial.id}`}
              >
                {/* Stars ratings */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: activeTestimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>

                {/* Main Content text */}
                <blockquote className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed font-light italic">
                  "{activeTestimonial.content}"
                </blockquote>

                {/* Client Avatar, Name, Event Tag */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200/50">
                  <img
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-pink shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-serif font-extrabold text-slate-800 text-sm sm:text-base leading-tight">
                      {activeTestimonial.name}
                    </h4>
                    <p className="font-sans text-xs text-slate-400 font-medium mt-0.5">
                      {activeTestimonial.role}
                    </p>
                    <span className="inline-block mt-1 bg-pink-100/60 text-brand-pink px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                      {activeTestimonial.event}
                    </span>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls buttons */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="bg-white hover:bg-pink-50 border border-slate-100 text-slate-600 hover:text-brand-pink p-3 rounded-full shadow-lg transition-all cursor-pointer pointer-events-auto"
              title="Anterior"
              id="testimonial_prev_btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Micro Indicator dots */}
            <div className="flex items-center gap-1.5 px-3">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? "w-6 bg-brand-pink" : "bg-pink-200"
                  }`}
                  id={`testimonial_dot_${idx}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="bg-white hover:bg-pink-50 border border-slate-100 text-slate-600 hover:text-brand-pink p-3 rounded-full shadow-lg transition-all cursor-pointer pointer-events-auto"
              title="Próximo"
              id="testimonial_next_btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Client trust marker */}
        <div className="mt-16 flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-semibold">
          <Heart className="w-4 h-4 text-brand-pink fill-brand-pink animate-pulse" />
          <span>Garantia de pura magia e satisfação com selo DL Magic Paper</span>
        </div>

      </div>
    </section>
  );
}
