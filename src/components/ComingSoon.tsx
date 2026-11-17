import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  MessageCircle, 
  Instagram, 
  Lock, 
  PartyPopper, 
  Briefcase, 
  MapPin,
  Clock
} from "lucide-react";
import { useAppContext } from "../context/DataContext";
import { buildSafeWhatsAppUrl, getSafeImageUrl } from "../lib/security";

export default function ComingSoon() {
  const { data, setIsAdminOpen } = useAppContext();

  const whatsappDirectUrl = buildSafeWhatsAppUrl(
    data.whatsappNumber,
    "Olá DL Magic Paper! Vi o aviso de 'Em Breve' no site e gostaria de solicitar um orçamento."
  );

  return (
    <div className="min-h-screen bg-[#FFF6F0] text-[#3A2439] relative overflow-hidden flex flex-col justify-between selection:bg-[#E8527A]/20 selection:text-[#E8527A]">
      
      {/* Soft Background Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-[#FFC947]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-80 h-80 bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Subtle Admin Trigger */}
      <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between relative z-20 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#3A2439]/60">
          <MapPin className="w-3.5 h-3.5 text-[#E8527A]" />
          <span>Brasília - DF • Entregas para todo o DF e Brasil</span>
        </div>

        <button
          type="button"
          onClick={() => setIsAdminOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#3A2439]/15 hover:border-[#E8527A]/40 text-xs font-semibold text-[#3A2439]/75 hover:text-[#E8527A] shadow-2xs transition-all cursor-pointer"
          title="Acesso exclusivo para edição do site"
          id="coming_soon_admin_btn"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Área Admin</span>
        </button>
      </header>

      {/* Center Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-[2.5rem] border-2 border-white shadow-2xl shadow-[#E8527A]/10 p-7 sm:p-12 text-center relative overflow-hidden"
        >
          {/* Top Rainbow Brand Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E8527A] via-[#FFC947] to-[#3A2439]" />

          {/* Logo */}
          <div className="inline-flex mb-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FFF6F0] p-3 shadow-md shadow-[#E8527A]/15 border-2 border-white flex items-center justify-center">
              <img
                src={getSafeImageUrl(data.logo) || "https://i.imgur.com/LiPwTKg.png"}
                alt="DL Magic Paper"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Em Breve Pill Badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF6F0] border border-[#E8527A]/25 text-xs font-extrabold uppercase tracking-wider text-[#E8527A]">
              <Clock className="w-3.5 h-3.5 text-[#E8527A]" />
              <span>Em Breve • Novidades no Ar</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3A2439] tracking-tight leading-tight">
            {data.comingSoonTitle || "Nosso Novo Catálogo Está Chegando!"}
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-sm sm:text-base text-[#3A2439]/75 max-w-xl mx-auto mt-4 leading-relaxed">
            {data.comingSoonSubtitle ||
              "Estamos preparando uma experiência ainda mais linda e organizada com nossa linha de Papelaria Personalizada para Festas e Brindes Corporativos."}
          </p>

          {/* Teaser Highlights */}
          <div className="grid sm:grid-cols-2 gap-3.5 max-w-xl mx-auto mt-7 text-left">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF6F0]/80 border border-[#E8527A]/15">
              <div className="w-9 h-9 rounded-xl bg-[#E8527A]/15 text-[#E8527A] flex items-center justify-center shrink-0">
                <PartyPopper className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-sm text-[#3A2439]">Linha Festas</h2>
                <p className="font-sans text-xs text-[#3A2439]/65 mt-0.5">
                  Caixas personalizadas, topos de bolo e lembrancinhas afetivas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF6F0]/80 border border-[#3A2439]/10">
              <div className="w-9 h-9 rounded-xl bg-[#FFC947]/30 text-[#3A2439] flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-sm text-[#3A2439]">Linha Corporativa</h2>
                <p className="font-sans text-xs text-[#3A2439]/65 mt-0.5">
                  Brindes personalizados com a sua marca, sacolas e kits B2B.
                </p>
              </div>
            </div>
          </div>

          {/* Direct Contact CTAs so clients can still order while site is Em Breve */}
          <div className="mt-8 pt-6 border-t border-[#3A2439]/10">
            <p className="font-sans text-xs font-semibold text-[#3A2439]/65 mb-4 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E8527A]" />
              <span>Enquanto finalizamos o site, continuamos atendendo normalmente:</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#E8527A] hover:bg-[#D43C65] text-white font-sans text-sm font-bold shadow-md shadow-[#E8527A]/25 transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir Orçamento no WhatsApp</span>
              </a>

              <a
                href={data.instagramUrl || "https://instagram.com/dlmagicpaper"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#FFF6F0] text-[#3A2439] border border-[#3A2439]/20 font-sans text-sm font-bold transition-all"
              >
                <Instagram className="w-4 h-4 text-[#E8527A]" />
                <span>{data.instagramHandle || "@dlmagicpaper"}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 py-5 text-center relative z-10">
        <p className="font-sans text-xs text-[#3A2439]/55">
          © {new Date().getFullYear()} <strong>DL Magic Paper</strong> — Papelaria Personalizada em Brasília - DF
        </p>
      </footer>
    </div>
  );
}
