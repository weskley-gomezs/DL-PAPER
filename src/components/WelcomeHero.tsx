import React from "react";
import { Sparkles, ArrowRight, Heart, ShoppingBag, PackageOpen, Gift, Cake, MessageCircle } from "lucide-react";
import { useAppContext } from "../context/DataContext";

interface WelcomeHeroProps {
  onSelectCategory?: (category: string) => void;
  onOpenBudgetSidebar: () => void;
}

export default function WelcomeHero({
  onSelectCategory,
  onOpenBudgetSidebar,
}: WelcomeHeroProps) {
  const { data } = useAppContext();

  const handleScrollTo = (id: string, category?: string) => {
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const quickCategories = [
    { label: "Kits de Caixas", icon: PackageOpen, category: "Kits de Caixas" },
    { label: "Caixas Avulsas", icon: Gift, category: "Caixas Avulsas" },
    { label: "Topos de Bolo", icon: Cake, category: "Topos de Bolo" },
    { label: "Lembrancinhas", icon: Sparkles, category: "Lembrancinhas" },
  ];

  return (
    <section 
      id="inicio"
      className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#FFF6F0] overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-[#FFC947]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Logo and Greeting Header */}
        <div className="flex flex-col items-center space-y-4 mb-8 sm:mb-10">
          
          {/* Logo Badge */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-2 shadow-md shadow-[#E8527A]/10 border-2 border-white flex items-center justify-center transition-transform hover:scale-105">
            <img 
              src={data.logo || "https://i.imgur.com/fVtEcdv.png"} 
              alt="DL Magic Paper" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Friendly Greeting Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E8527A]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E8527A]" />
            <span className="font-sans text-xs font-semibold text-[#E8527A] tracking-wide">
              Papelaria Personalizada & Afetiva
            </span>
          </div>

          {/* Core Greeting Message */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3A2439] tracking-tight leading-tight max-w-3xl">
            Bem-vindo(a) ao DL Magic Paper!
            <span className="block text-2xl sm:text-3xl md:text-4xl font-normal text-[#E8527A] mt-2">
              Em que posso te ajudar hoje?
            </span>
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#3A2439]/75 max-w-xl leading-relaxed">
            Personalizando com amor e propósito. Explore nossos produtos artesanais separados por tipo ou solicite um orçamento direto pelo WhatsApp:
          </p>
        </div>

        {/* Primary Action Buttons (Pill format) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-10">
          <button
            type="button"
            onClick={() => handleScrollTo("catalogo")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#E8527A] hover:bg-[#D43C65] text-white font-sans text-sm font-bold shadow-md shadow-[#E8527A]/25 transition-all cursor-pointer hover:scale-102"
            id="hero_btn_ver_catalogo"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleScrollTo("contato")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white hover:bg-[#FFF6F0] text-[#3A2439] border border-[#3A2439]/15 font-sans text-sm font-bold shadow-xs transition-all cursor-pointer hover:border-[#E8527A]/40"
            id="hero_btn_orcamento"
          >
            <MessageCircle className="w-4 h-4 text-[#E8527A]" />
            <span>Fazer Orçamento</span>
          </button>
        </div>

        {/* Quick Category Jump Pills ("separa só pelo que é") */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-full p-3 border border-[#3A2439]/10 shadow-xs max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3A2439]/60 font-sans px-2">
              Ir direto para:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
              {quickCategories.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.category}
                    type="button"
                    onClick={() => handleScrollTo("catalogo", item.category)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF6F0] hover:bg-[#E8527A] text-[#3A2439] hover:text-white font-sans text-xs font-semibold border border-[#3A2439]/10 transition-all cursor-pointer group"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-[#E8527A] group-hover:text-white transition-colors" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-8 inline-flex items-center gap-2 text-xs text-[#3A2439]/70 font-medium">
          <Heart className="w-3.5 h-3.5 text-[#E8527A] fill-[#E8527A]" />
          <span>Produção artesanal com papéis de alta gramatura · Ateliê em Brasília com envio para todo o Brasil</span>
        </div>

      </div>
    </section>
  );
}
