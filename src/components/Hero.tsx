import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Scissors,
  PartyPopper,
  Briefcase,
  CheckCircle2,
  Gift,
  Building2,
  Star
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

  // High-resolution generated 3D papercraft hero banner + studio showcase banners
  const masterHeroBanner = "/src/assets/images/dl_magic_paper_hero_1791899151681.jpg";

  const promotionalBanners = [
    {
      src: "/src/assets/images/kit_caixas_classicas_1794613744144.jpg",
      title: "Lembrancinhas Clássicas em Camadas",
      subtitle: "Papéis nobres de 180g e acabamentos acetinados"
    },
    {
      src: "/src/assets/images/hero_stationery_1779734437655.png",
      title: "Kits Completos para sua Comemoração",
      subtitle: "Compre em conjunto com economia e harmonia visual"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotionalBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [promotionalBanners.length]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % promotionalBanners.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + promotionalBanners.length) % promotionalBanners.length);
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
      className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#FFF6F0] overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#FFC947]/15 rounded-full blur-3xl pointer-events-none" />
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
                Papelaria Personalizada Premium & Camadas 3D
              </span>
            </div>
          </div>

          {/* Main Welcome Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3A2439] tracking-tight leading-tight">
            Bem-vindo(a) ao DL Magic Paper!
          </h1>
          
          <p className="font-sans text-sm sm:text-base text-[#3A2439]/75 font-normal max-w-2xl mx-auto mt-3 leading-relaxed">
            Criamos papelaria afetiva em camadas 3D para festas inesquecíveis e embalagens elegantes para valorizar a marca da sua empresa.
          </p>
        </div>

        {/* ============================================================
            HERO BANNER PRINCIPAL (16:9 / Still-Life Still Luxury 3D Papercraft)
            Demonstrando visualmente as DUAS LINHAS: Festas (esquerda) & Corporativo (direita)
           ============================================================ */}
        <div className="max-w-5xl mx-auto mb-8 sm:mb-10">
          <div 
            className="relative w-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-white group"
            id="hero_main_dual_banner"
          >
            {/* Imagem do Banner Hero Principal em Alta Resolução */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FFF6F0]">
              <img
                src={masterHeroBanner}
                alt="DL Magic Paper - Linha Festas e Linha Corporativa em Papelaria Personalizada 3D"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />

              {/* Indicadores Visuais Sutis sobre as duas metades da foto */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-t from-black/40 via-transparent to-black/20 sm:to-transparent">
                {/* Top Labels */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-[#E8527A]/30 shadow-md">
                    <PartyPopper className="w-3.5 h-3.5 text-[#E8527A]" />
                    <span className="font-sans text-[11px] sm:text-xs font-bold text-[#E8527A] tracking-wide">
                      Linha Festas
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-[#3A2439]/90 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/20 shadow-md">
                    <Briefcase className="w-3.5 h-3.5 text-[#FFC947]" />
                    <span className="font-sans text-[11px] sm:text-xs font-bold text-white tracking-wide">
                      Linha Corporativa
                    </span>
                  </div>
                </div>

                {/* Bottom Caption Pill */}
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/40 shadow-sm text-[11px] sm:text-xs font-medium text-[#3A2439]">
                    <Sparkles className="w-3 h-3 text-[#E8527A]" />
                    <span>Selecione abaixo qual segmento você deseja explorar</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            DOIS BLOCOS/CARDS DE LINHAS DE PRODUTO
            (Espaço dedicado para 'Linha Festas' e 'Linha Corporativa')
           ============================================================ */}
        <div className="max-w-5xl mx-auto mb-12 sm:mb-14" id="hero_segment_choice_container">
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Bloco 1: Linha Festas (Lembrancinhas Pessoais) */}
            <div
              onClick={() => handleChooseSegment("pessoal")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleChooseSegment("pessoal");
                }
              }}
              className={`group text-left p-6 sm:p-7 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                selectedSegment === "pessoal"
                  ? "bg-white border-[#E8527A] ring-4 ring-[#E8527A]/20 shadow-md"
                  : "bg-white/95 hover:bg-white border-[#E8527A]/25 hover:border-[#E8527A]"
              }`}
              id="hero_btn_segment_pessoal"
            >
              {/* Top Pink/Gold Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E8527A] to-[#FFC947]" />

              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8527A]/15 flex items-center justify-center text-[#E8527A] group-hover:scale-110 transition-transform">
                    <PartyPopper className="w-6 h-6 text-[#E8527A]" />
                  </div>
                  {selectedSegment === "pessoal" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E8527A] bg-[#FFF6F0] px-3 py-1 rounded-full border border-[#E8527A]/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E8527A]" />
                      Ativo no Catálogo
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#E8527A] bg-[#FFF6F0] px-2.5 py-0.5 rounded-full">
                      Celebrações
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E8527A] font-sans block mb-1">
                    Lembrancinhas Pessoais & Afetivas
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2439] group-hover:text-[#E8527A] transition-colors leading-tight">
                    Linha Festas
                  </h3>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#3A2439]/75 font-normal leading-relaxed">
                  Caixas clássicas em camadas 3D (Milk, Bala, Pirâmide, Sushi, Mala), topos de bolo exclusivos, forminhas de doces e detalhes encantadores para aniversários, batizados e momentos em família.
                </p>
              </div>

              {/* Bottom Action Pill Button */}
              <div className="mt-6 pt-4 border-t border-[#E8527A]/15 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-[#E8527A] text-white font-sans text-xs font-bold shadow-xs group-hover:bg-[#D43C65] transition-colors">
                  <span>Ver Linha Festas</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-semibold text-[#3A2439]/50">
                  Para sua festa
                </span>
              </div>
            </div>

            {/* Bloco 2: Linha Corporativa (Brindes & Empresas B2B) */}
            <div
              onClick={() => handleChooseSegment("corporativo")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleChooseSegment("corporativo");
                }
              }}
              className={`group text-left p-6 sm:p-7 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                selectedSegment === "corporativo"
                  ? "bg-white border-[#3A2439] ring-4 ring-[#FFC947]/30 shadow-md"
                  : "bg-white/95 hover:bg-white border-[#3A2439]/20 hover:border-[#3A2439]"
              }`}
              id="hero_btn_segment_corporativo"
            >
              {/* Top Gold/Plum Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FFC947] to-[#3A2439]" />

              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFC947]/25 flex items-center justify-center text-[#3A2439] group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6 text-[#3A2439]" />
                  </div>
                  {selectedSegment === "corporativo" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3A2439] bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3A2439]" />
                      Ativo no Catálogo
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#3A2439] bg-amber-50 px-2.5 py-0.5 rounded-full">
                      Empresas & B2B
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3A2439]/70 font-sans block mb-1">
                    Brindes & Clientes Corporativos
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2439] group-hover:text-[#E8527A] transition-colors leading-tight">
                    Linha Corporativa
                  </h3>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#3A2439]/75 font-normal leading-relaxed">
                  Embalagens personalizadas com a sua marca, tubolatas luxo, sacolinhas premium com laço de cetim, caixas rígidas e brindes refinados para colaboradores, eventos corporativos e datas comemorativas.
                </p>
              </div>

              {/* Bottom Action Pill Button */}
              <div className="mt-6 pt-4 border-t border-[#3A2439]/10 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-[#3A2439] text-white font-sans text-xs font-bold shadow-xs group-hover:bg-[#E8527A] transition-colors">
                  <span>Ver Linha Corporativa</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-semibold text-[#3A2439]/50">
                  Para sua empresa
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Destaques Promocionais do Ateliê */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3A2439]/70 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#FFC947] fill-[#FFC947]" />
              Mais Destaques do Ateliê
            </span>
            <div className="flex items-center gap-1.5">
              {promotionalBanners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx 
                      ? "bg-[#E8527A] w-6" 
                      : "bg-[#3A2439]/20 hover:bg-[#3A2439]/40 w-2"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div 
            className="relative w-full rounded-3xl overflow-hidden shadow-lg border-2 border-white bg-white group aspect-[16/7] sm:aspect-[21/9]"
            id="hero_banner_carousel"
          >
            {/* Slider Layer */}
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={currentSlide}
                src={promotionalBanners[currentSlide].src}
                alt={promotionalBanners[currentSlide].title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full object-cover"
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

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent text-white pointer-events-none">
              <p className="font-serif font-bold text-sm sm:text-base drop-shadow-sm">
                {promotionalBanners[currentSlide].title}
              </p>
              <p className="font-sans text-xs text-white/90 drop-shadow-sm">
                {promotionalBanners[currentSlide].subtitle}
              </p>
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
