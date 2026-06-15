import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useAppContext } from "../context/DataContext";

export default function About() {
  const { data } = useAppContext();

  return (
    <section id="sobre" className="py-20 lg:py-28 bg-brand-pastel-bg/40 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-brand-pink/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 bottom-1/2 w-72 h-72 rounded-full bg-brand-tiffany/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Beautiful custom generated image of creative studio */}
          <div className="lg:col-span-6 order-2 lg:order-1" id="about_image_grid">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-brand-pink to-brand-tiffany rounded-[2.5rem] blur-xl opacity-20" />
              
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white bg-white shadow-2xl aspect-square lg:aspect-[4/5]">
                <img
                  src={data.aboutImage}
                  alt="Ateliê DL Magic Paper"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Little Floating Decorative frame */}
              <div className="absolute -bottom-6 -right-6 lg:-right-8 bg-white/95 backdrop-blur-xs border border-pink-100 rounded-2xl p-4 shadow-xl max-w-[180px] text-left hidden sm:block">
                <p className="font-serif italic font-bold text-slate-700 text-sm">"{data.aboutTexts.floatingText}"</p>
                <p className="font-sans text-[10px] text-slate-400 mt-1 uppercase font-semibold">DL Magic Paper</p>
              </div>
            </div>
          </div>

          {/* Right Column - Deep storyteller copy */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-pink bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
              {data.aboutTexts.tag}
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
              {data.aboutTexts.title}
            </h2>

            <div className="space-y-4 font-sans text-base text-slate-600 font-light leading-relaxed text-justify lg:text-left">
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

            {/* Premium Small Stats layout */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-pink-100" id="about_stats">
              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-pink">
                  1.5k+
                </div>
                <div className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Mães Encantadas
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-tiffany">
                  100%
                </div>
                <div className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Artesanal de Luxo
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-lilac">
                  Brasília
                </div>
                <div className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Sede Oficial
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
