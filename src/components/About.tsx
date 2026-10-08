import React from "react";
import { Sparkles, Heart } from "lucide-react";
import { useAppContext } from "../context/DataContext";

export default function About() {
  const { data } = useAppContext();

  return (
    <section id="sobre" className="py-20 lg:py-28 bg-[#FFF6F0] relative overflow-hidden border-t border-[#3A2439]/5">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-[#E8527A]/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 bottom-1/2 w-72 h-72 rounded-full bg-[#FFC947]/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Real Photo of Danyelle Lau / Studio */}
          <div className="lg:col-span-6 order-2 lg:order-1" id="about_image_grid">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#E8527A] to-[#FFC947] rounded-[2.5rem] blur-xl opacity-20" />
              
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white bg-white shadow-2xl aspect-square lg:aspect-[4/5]">
                <img
                  src={data.aboutImage || "https://i.imgur.com/nsjJjnO.jpeg"}
                  alt="Danyelle Lau - Quem Faz com Amor e Propósito"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Decorative frame */}
              <div className="absolute -bottom-6 -right-6 lg:-right-8 bg-white/95 backdrop-blur-xs border border-[#3A2439]/10 rounded-2xl p-4 shadow-xl max-w-[210px] text-left hidden sm:block">
                <p className="font-serif italic font-bold text-[#3A2439] text-sm">
                  "{data.aboutTexts.floatingText || "Tudo feito à mão com papel e amor."}"
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Heart className="w-3 h-3 text-[#E8527A] fill-[#E8527A]" />
                  <p className="font-sans text-[10px] text-[#3A2439]/60 uppercase font-semibold">DL Magic Paper</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Deep storyteller copy */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E8527A]/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E8527A]" />
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#E8527A]">
                {data.aboutTexts.tag || "A nossa história 🌸"}
              </span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3A2439] tracking-tight leading-tight">
              {data.aboutTexts.title || "Quem Faz com Amor e Propósito"}
            </h2>

            <div className="space-y-4 font-sans text-sm sm:text-base text-[#3A2439]/80 font-normal leading-relaxed text-justify lg:text-left">
              <p>
                {data.aboutTexts.paragraph1}
              </p>
              <p>
                {data.aboutTexts.paragraph2}
              </p>
              {data.aboutTexts.paragraph3 && (
                <p>
                  {data.aboutTexts.paragraph3}
                </p>
              )}
            </div>

            {/* Stats layout */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#3A2439]/10" id="about_stats">
              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#E8527A]">
                  1.5k+
                </div>
                <div className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-[#3A2439]/60 font-semibold">
                  Mães & Clientes
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FFC947]">
                  100%
                </div>
                <div className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-[#3A2439]/60 font-semibold">
                  Artesanal de Luxo
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#3A2439]">
                  Brasília
                </div>
                <div className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-[#3A2439]/60 font-semibold">
                  Ateliê Oficial
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
