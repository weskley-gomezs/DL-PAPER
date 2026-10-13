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
  Scissors,
  PartyPopper,
  Briefcase,
  CheckCircle2
} from "lucide-react";
import { useAppContext } from "../context/DataContext";

interface HeroProps {
  onOpenBudgetSidebar: () => void;
  selectedSegment?: "pessoal" | "corporativo";
  onSelectSegment?: (segment: "pessoal" | "corporativo") => void;
}

export default function Hero({ 
  onOpenBudgetSidebar, 
  selectedSegment = "pessoal", 
  onSelectSegment 
}: HeroProps) {
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

  const handleChooseSegment = (segment: "pessoal" | "corporativo") => {
    if (onSelectSegment) {
      onSelectSegment(segment);
    }
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
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          
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
                Papelaria Personalizada & Afetiva
              </span>
            </div>
          </div>

          {/* Main Welcome Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3A2439] tracking-tight leading-tight">
            Bem-vindo(a) ao DL Magic Paper!
          </h1>
          
          <p className="font-sans text-sm sm:text-base text-[#3A2439]/75 font-normal max-w-2xl mx-auto mt-3 leading-relaxed">
            Transformamos papel em memórias inesquecíveis. Escolha abaixo se o seu pedido é para sua <strong>festa pessoal</strong> ou para sua <strong>empresa</strong> para acessar o catálogo exclusivo:
          </p>
        </div>

        {/* PRIORITY SEGMENT SELECTION CARDS (A pessoa escolhe um dos dois para entrar no catálogo) */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-12" id="hero_segment_choice_container">
          <div className="text-center mb-4">
            <span className="font-sans text-xs uppercase font-extrabold tracking-widest text-[#E8527A] bg-white px-3.5 py-1 rounded-full border border-[#E8527A]/20 shadow-2xs">
              👇 Escolha uma opção para entrar no catálogo
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Opção 1: Lembrancinhas Pessoais */}
            <button
              type="button"
              onClick={() => handleChooseSegment("pessoal")}
              className={`group text-left p-6 sm:p-7 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                selectedSegment === "pessoal"
                  ? "bg-white border-[#E8527A] ring-4 ring-[#E8527A]/20 shadow-md"
                  : "bg-white/90 hover:bg-white border-[#E8527A]/25 hover:border-[#E8527A]"
              }`}
              id="hero_btn_segment_pessoal"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E8527A] to-[#FFC947]" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8527A]/15 flex items-center justify-center text-[#E8527A] group-hover:scale-110 transition-transform">
                    <PartyPopper className="w-6 h-6 text-[#E8527A]" />
                  </div>
                  {selectedSegment === "pessoal" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E8527A] bg-[#FFF6F0] px-2.5 py-1 rounded-full border border-[#E8527A]/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E8527A]" />
                      Selecionado
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E8527A] font-sans block">
                    Festas & Celebrações
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#3A2439] group-hover:text-[#E8527A] transition-colors leading-snug">
                    Lembrancinhas Pessoais
                  </h3>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#3A2439]/75 font-normal leading-relaxed">
                  Caixas clássicas (Milk, Bala, Pirâmide, Sushi, Mala), topos de bolo 3D em camadas, forminhas de doces e mimos para aniversários e família.
                </p>
              </div>

              {/* Pill Button */}
              <div className="mt-6 pt-4 border-t border-[#E8527A]/15 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-[#E8527A] text-white font-sans text-xs font-bold shadow-xs group-hover:bg-[#D43C65] transition-colors">
                  <span>Ver Produtos Pessoais</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-semibold text-[#3A2439]/50">
                  Para festas
                </span>
              </div>
            </button>

            {/* Opção 2: Lembrancinhas Corporativas */}
            <button
              type="button"
              onClick={() => handleChooseSegment("corporativo")}
              className={`group text-left p-6 sm:p-7 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                selectedSegment === "corporativo"
                  ? "bg-white border-[#3A2439] ring-4 ring-[#FFC947]/30 shadow-md"
                  : "bg-white/90 hover:bg-white border-[#3A2439]/20 hover:border-[#3A2439]"
              }`}
              id="hero_btn_segment_corporativo"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FFC947] to-[#3A2439]" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFC947]/25 flex items-center justify-center text-[#3A2439] group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6 text-[#3A2439]" />
                  </div>
                  {selectedSegment === "corporativo" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3A2439] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3A2439]" />
                      Selecionado
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3A2439]/70 font-sans block">
                    Empresas & Clientes B2B
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#3A2439] group-hover:text-[#E8527A] transition-colors leading-snug">
                    Lembrancinhas Corporativas
                  </h3>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#3A2439]/75 font-normal leading-relaxed">
                  Brindes refinados com o logotipo da sua marca, tubolatas luxo, sacolinhas com fita de cetim, kits de onboarding e mimos para colaboradores e clientes.
                </p>
              </div>

              {/* Pill Button */}
              <div className="mt-6 pt-4 border-t border-[#3A2439]/10 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-[#3A2439] text-white font-sans text-xs font-bold shadow-xs group-hover:bg-[#E8527A] transition-colors">
                  <span>Ver Produtos Corporativos</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-semibold text-[#3A2439]/50">
                  Para empresas
                </span>
              </div>
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
                <p className="font-sans text-xs text-[#3A2439]/65">Criamos no tema, nome, cores ou logo que você desejar.</p>
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
