import React from "react";
import { Instagram, MessageCircle, Heart, Lock, Sparkles } from "lucide-react";
import { useAppContext } from "../context/DataContext";

export default function Footer() {
  const { data, setIsAdminOpen } = useAppContext();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Catálogo", href: "#catalogo" },
    { label: "Para Sua Festa", href: "#catalogo" },
    { label: "Para Sua Empresa", href: "#catalogo" },
    { label: "Avaliações", href: "#avaliacoes" },
    { label: "Sobre o Ateliê", href: "#sobre" },
    { label: "Orçamento", href: "#contato" }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href === "#inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetEl = document.getElementById(href.substring(1));
    if (targetEl) {
      const headerOffset = 90;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer className="bg-[#3A2439] text-[#FFF6F0]/70 py-16 relative overflow-hidden" id="footer_section">
      
      {/* Decorative glows */}
      <div className="absolute top-0 left-10 w-44 h-44 bg-[#E8527A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-52 h-52 bg-[#FFC947]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        
        {/* Main Grid Row */}
        <div className="grid md:grid-cols-12 gap-10 border-b border-white/10 pb-12 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center">
              <img 
                src={data.logo || "https://i.imgur.com/fVtEcdv.png"} 
                alt="DL Magic Paper Logo" 
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain bg-white/10 p-2 rounded-2xl border border-white/15"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <p className="text-xs sm:text-sm text-[#FFF6F0]/80 leading-relaxed font-normal max-w-sm">
              Papelaria personalizada e afetiva para festas encantadoras e brindes corporativos marcantes. Produção artesanal de luxo em Brasília com envio para todo o Brasil.
            </p>
          </div>

          {/* Quick Links Col */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-serif">
              Navegação
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-xs hover:text-[#FFC947] transition-colors text-[#FFF6F0]/75"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-serif">
              Canais Oficiais
            </h4>
            <div className="space-y-2 text-xs">
              <p className="leading-relaxed">
                <strong className="text-white">Brasília - DF</strong>
                <br />
                Ateliê em Brasília e envios para todo o Brasil
              </p>
              
              <div className="pt-2 flex items-center gap-3">
                
                {/* Instagram button */}
                <a
                  href={data.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#E8527A] transition-all shadow-xs"
                  title={`Acesse nosso Instagram ${data.instagramHandle}`}
                  id="footer_instagram_btn"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Whatsapp button */}
                <a
                  href={`https://wa.me/${data.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xs"
                  title={`Contate-nos pelo WhatsApp ${data.whatsappFormatted}`}
                  id="footer_whatsapp_btn"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>

              </div>

              <p className="text-[10px] text-[#FFF6F0]/60 pt-2 font-medium">
                WhatsApp: {data.whatsappFormatted}
                <br />
                Instagram: {data.instagramHandle}
              </p>

            </div>
          </div>

        </div>

        {/* Lower row Copyrights */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#FFF6F0]/60 text-[11px] font-medium" id="footer_copyright_row">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>© {currentYear} DL MAGIC PAPER — Todos os direitos reservados.</span>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1 hover:text-[#FFC947] text-[#FFF6F0]/60 transition-colors bg-transparent border-0 cursor-pointer font-semibold"
              id="admin_footer_trigger"
            >
              <Lock className="w-3 h-3" />
              Painel do Administrador
            </button>
          </div>
          <p className="flex items-center gap-1.5 shrink-0 font-light text-[#FFF6F0]/70">
            Feito com carinho, criatividade e propósito por{' '}
            <a 
              href="https://wa.me/5561996507712" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-[#E8527A] hover:text-[#FFC947] hover:underline inline-flex items-center gap-1 transition-all"
            >
              Weskley Gomes
              <Heart className="w-3.5 h-3.5 text-[#E8527A] fill-[#E8527A] animate-pulse" />
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
