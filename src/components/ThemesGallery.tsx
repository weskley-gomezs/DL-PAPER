import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Heart, Palette } from "lucide-react";
import { THEMES } from "../data";

export default function ThemesGallery() {
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);

  return (
    <section id="temas" className="py-20 lg:py-28 bg-brand-pastel-bg/50 relative overflow-hidden">
      {/* Visual accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-lilac/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-tiffany bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-100">
            Mais Amados 💝
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight">
            Temas Incríveis Mais Vendidos
          </h2>
          <p className="font-sans text-slate-500 leading-relaxed font-light text-base sm:text-lg">
            Nossos designs ganham vida com paletas selecionadas e layouts pensados sob medida. Confira alguns dos temas campeões de pedidos que deixam as mesas das festas simplesmente espetaculares:
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6" id="themes_gallery_grid">
          {THEMES.map((theme, idx) => {
            const isHovered = activeThemeId === theme.id;
            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onMouseEnter={() => setActiveThemeId(theme.id)}
                onMouseLeave={() => setActiveThemeId(null)}
                className="group relative h-72 sm:h-80 rounded-[2rem] overflow-hidden bg-slate-100 shadow-sm border border-slate-200/50 cursor-pointer"
                id={`theme_card_${theme.id}`}
              >
                {/* Background image */}
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Dark/color subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent transition-opacity" />

                {/* Theme Name and vibe content - static on bottom */}
                <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end text-left select-none text-white z-10 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {/* Circle Color Swatches */}
                    <div className="flex -space-x-1.5" title="Paleta de Cores">
                      {theme.colors.map((color, cIdx) => (
                        <span
                          key={cIdx}
                          style={{ backgroundColor: color }}
                          className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold tracking-wide">
                    {theme.name}
                  </h3>
                  
                  <p className="font-sans text-[11px] text-pink-200 uppercase tracking-widest font-semibold mt-0.5">
                    {theme.vibe}
                  </p>
                </div>

                {/* Interactive Glitter / Sparkle details on card */}
                {isHovered && (
                  <span className="absolute top-4 right-4 text-brand-yellow animate-spin pointer-events-none">
                    <Sparkles className="w-5 h-5 text-brand-yellow fill-brand-yellow" />
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic bottom callout */}
        <div className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-4 rounded-[1.5rem] bg-white border border-pink-100 shadow-xs max-w-2xl mx-auto"
          >
            <div className="p-2 bg-pink-50 rounded-xl text-brand-pink">
              <Palette className="w-5 h-5 text-brand-pink" />
            </div>
            <p className="font-sans text-xs sm:text-sm text-slate-500 text-center sm:text-left">
              <strong>Tem outro tema em mente?</strong> Não se preocupe! Nós desenhamos o tema da sua escolha sem custo adicional na contratação de qualquer kit completo. Conte-nos sua ideia!
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
