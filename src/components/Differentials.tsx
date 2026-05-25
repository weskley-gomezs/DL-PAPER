import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { DIFFERENTIALS } from "../data";

export default function Differentials() {
  return (
    <section id="diferenciais" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-pink bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
            Nossa Fórmula Mágica ✨
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight">
            Por que Escolher a DL MAGIC PAPER?
          </h2>
          <p className="font-sans text-slate-500 leading-relaxed font-light text-base sm:text-lg">
            Muito além de papéis cortados, construímos portais para memórias duradouras da sua família. Conheça nossos pilares de integridade criativa e de serviço:
          </p>
        </div>

        {/* Bento/Grid Layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" id="differentials_bento_grid">
          {DIFFERENTIALS.map((diff, index) => {
            // Dynamically instantiate the correct Lucide icon
            const IconComponent = (Icons as any)[diff.icon] || Icons.CheckCircle;
            
            // Custom pastel bg colors for icon containers based on index
            const backgrounds = [
              "bg-pink-100 text-brand-pink border-pink-200/50",
              "bg-cyan-100 text-brand-tiffany border-cyan-200/50",
              "bg-purple-100 text-brand-lilac border-purple-200/50",
              "bg-yellow-100 text-amber-500 border-yellow-200/50",
              "bg-emerald-100 text-emerald-500 border-emerald-200/50",
              "bg-indigo-100 text-indigo-500 border-indigo-200/50"
            ];
            
            const bgClass = backgrounds[index % backgrounds.length];

            return (
              <motion.div
                key={diff.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col items-start text-left hover:bg-white glamour-card-hover"
                id={`differential_item_${diff.id}`}
              >
                {/* Icon Container */}
                <div className={`p-4 rounded-2xl border ${bgClass} mb-6 shadow-sm`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="font-serif text-xl font-bold text-slate-800 mb-2 tracking-tight">
                  {diff.title}
                </h3>
                
                <p className="font-sans text-sm text-slate-500 leading-relaxed font-light">
                  {diff.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
