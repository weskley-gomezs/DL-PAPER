import { motion } from "motion/react";
import { Heart, Sparkles, Star, Users } from "lucide-react";
import { IMAGES } from "../data";

export default function About() {
  return (
    <section id="sobre" className="py-20 lg:py-28 bg-brand-pastel-bg/40 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-brand-pink/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 bottom-1/2 w-72 h-72 rounded-full bg-brand-tiffany/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Beautiful custom generated image of creative studio */}
          <div className="lg:col-span-5 order-2 lg:order-1" id="about_image_grid">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-brand-pink to-brand-tiffany rounded-[2.5rem] blur-xl opacity-20" />
              
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white bg-white shadow-2xl aspect-4/3">
                <img
                  src={IMAGES.about}
                  alt="Ateliê DL Magic Paper"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual watermark */}
                <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-widest text-slate-700 shadow-lg border border-pink-50 flex items-center gap-1.5 animate-pulse">
                  <Star className="w-3.5 h-3.5 text-brand-pink fill-brand-pink" />
                  <span>Espaço de Criação ✨</span>
                </div>
              </div>

              {/* Little Floating Decorative frame */}
              <div className="absolute -bottom-6 -right-6 lg:-right-8 bg-white/95 backdrop-blur-xs border border-pink-100 rounded-2xl p-4 shadow-xl max-w-[180px] text-left hidden sm:block">
                <p className="font-serif italic font-bold text-slate-700 text-sm">"Tudo feito à mão com papel e amor."</p>
                <p className="font-sans text-[10px] text-slate-400 mt-1 uppercase font-semibold">DL Magic Paper</p>
              </div>
            </div>
          </div>

          {/* Right Column - Deep storyteller copy */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-pink bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
              Nosso Sonho 🌸
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
              A História de Quem Faz com Amor
            </h2>

            <div className="space-y-4 font-sans text-base text-slate-600 font-light leading-relaxed">
              <p>
                A <strong className="font-semibold text-slate-800">DL MAGIC PAPER</strong> nasceu com o propósito de transformar momentos especiais em memórias inesquecíveis através da papelaria personalizada. Cada detalhe é pensado com carinho, criatividade e propósito para encantar nossos clientes.
              </p>
              <p>
                Acreditamos que o aniversário de uma criança — ou qualquer festa de família — é um marco único de amor. É por isso que nos recusamos a tratar as lembrancinhas como simples recipientes descartáveis. Nossos produtos são concebidos como lembranças afetivas duráveis que causam suspiros de surpresa nas mães e convidados.
              </p>
              <p>
                Nosso ateliê em Brasília une tecnologia moderna de corte a laser eletrônico preciso e processos de montagem manuais rigorosos. Da colagem impecável das camadas 3D até a amarração simétrica do laço Chanel, cada peça carrega a nossa energia dedicada.
              </p>
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
