import { motion } from "motion/react";
import { Sparkles, ArrowRight, Heart, Calendar } from "lucide-react";
import { useAppContext } from "../context/DataContext";

interface HeroProps {
  onOpenBudgetSidebar: () => void;
}

export default function Hero({ onOpenBudgetSidebar }: HeroProps) {
  const { data } = useAppContext();

  const handleScrollToCatalog = () => {
    const catalogEl = document.getElementById("catalogo");
    if (catalogEl) {
      const headerOffset = 90;
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
      className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden magic-radial-bg"
    >
      {/* Absolute Decorative Blobs */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-brand-pink/10 blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -left-12 w-80 h-80 rounded-full bg-brand-tiffany/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-60 h-60 rounded-full bg-brand-lilac/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column Content - High impact copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/60 border border-pink-200/50 text-brand-pink text-xs sm:text-sm font-semibold tracking-wide font-sans shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-pink" />
              <span>{data.heroTexts.tag}</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
              >
                <span className="text-slate-800 lg:block">{data.heroTexts.titlePrefix}</span>{" "}
                <span className="block mt-2 bg-gradient-to-r from-brand-pink via-brand-lilac to-brand-tiffany bg-clip-text text-transparent">
                  {data.heroTexts.titleColored}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-serif italic text-lg sm:text-xl lg:text-2xl text-slate-500 font-semibold max-w-xl mx-auto lg:mx-0"
              >
                {data.heroTexts.subtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="font-sans text-base sm:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light"
              >
                {data.heroTexts.description}
              </motion.p>
            </div>

            {/* Interactive Floating Badges / Visual anchors */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                onClick={handleScrollToCatalog}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-brand-pink/20 hover:shadow-xl hover:shadow-brand-pink/35 hover:-translate-y-0.5 transition-all text-base cursor-pointer"
              >
                Ver Catálogo
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBudgetSidebar}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-brand-tiffany border-2 border-brand-tiffany/30 px-8 py-4 rounded-full font-bold hover:bg-neutral-50 hover:border-brand-tiffany hover:shadow-md transition-all text-base cursor-pointer"
              >
                <Heart className="w-4 h-4 text-brand-tiffany fill-brand-tiffany/20" />
                Fazer Pedido
              </button>
            </motion.div>

            {/* Micro details row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-slate-400 text-xs sm:text-sm pt-4 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                <span>Atendimento de Coração</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-tiffany" />
                <span>Corte a Laser & 3D</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-lilac" />
                <span>Brasília & Envio Nacional</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column Content - Display Mockup Grid with generated high-end visual */}
          <div className="lg:col-span-5 relative" id="hero_display_grid">
            <div className="relative mx-auto max-w-[420px] aspect-square rounded-[2.5rem] bg-gradient-to-tr from-brand-pink/20 via-white/80 to-brand-tiffany/20 p-3 sm:p-4 shadow-2xl overflow-visible">
              
              {/* Spinning/Moving elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center shadow-lg transform rotate-12 animate-bounce pointer-events-none z-10">
                <Sparkles className="w-6 h-6 text-pink-500" />
              </div>
              
              <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-sm border border-pink-100 rounded-2xl p-3 shadow-xl flex items-center gap-3 max-w-[200px] pointer-events-none z-10">
                <div className="p-2 sm:p-2.5 bg-pink-100 rounded-xl text-brand-pink">
                  <Calendar className="w-5 h-5 text-brand-pink" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Produção</p>
                  <p className="text-xs font-extrabold text-slate-700">100% Artesanal</p>
                </div>
              </div>

              {/* Decorative craft scissor and ribbon tag */}
              <div className="absolute top-1/2 -right-8 bg-white/95 backdrop-blur-sm border border-cyan-100 rounded-2xl p-2.5 shadow-lg flex items-center gap-2 text-xs font-semibold text-slate-600 pointer-events-none z-10 transform -rotate-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Camadas de Amor ✂️</span>
              </div>

              {/* Main Image Frame (Contains our generated stationery mockup) */}
              <div className="w-full h-full rounded-[2rem] overflow-hidden bg-slate-100 relative group shadow-inner">
                <img
                  src={data.heroImage}
                  alt="Flatlay Papelaria Personalizada DL Magic Paper"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  id="hero_main_photograph"
                />
                
                {/* Gradient tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/10 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
