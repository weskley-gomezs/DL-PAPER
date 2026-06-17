import React from "react";
import { Instagram, MessageCircle, Heart, Lock } from "lucide-react";
import { useAppContext } from "../context/DataContext";

export default function Footer() {
  const { data, setIsAdminOpen } = useAppContext();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Catálogo", href: "#catalogo" },
    { label: "Temas mais vendidos", href: "#temas" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Sobre a Marca", href: "#sobre" },
    { label: "Avaliações", href: "#avaliacoes" },
    { label: "Solicitar Orçamento", href: "#contato" }
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
    <footer className="bg-slate-900 text-slate-400 py-16 relative overflow-hidden" id="footer_section">
      
      {/* Decorative colored lights */}
      <div className="absolute top-0 left-10 w-40 h-40 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-52 h-52 bg-brand-tiffany/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        
        {/* Main Grid Row */}
        <div className="grid md:grid-cols-12 gap-10 border-b border-slate-800 pb-12 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center">
              <img 
                src={data.logo} 
                alt="DL Magic Paper Logo" 
                className="w-32 h-32 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light max-w-sm">
              Trabalhamos com papelaria criativa para festas encantadoras. Transformamos caixas, topos de bolo e adesivos em portais de memórias afetivas insubstituíveis.
            </p>
            
          </div>

          {/* Quick Links Col */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Navegação do Ateliê
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-xs hover:text-brand-pink transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Canais Oficiais
            </h4>
            <div className="space-y-2 text-xs">
              <p className="leading-relaxed">
                <strong className="text-slate-300">Brasília - DF</strong>
                <br />
                Planaltina e Entregas em todo o Distrito Federal
              </p>
              
              <div className="pt-2 flex items-center gap-3">
                
                {/* Instagram button */}
                <a
                  href={data.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all shadow-xs"
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
                  className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-xs"
                  title={`Contate-nos pelo WhatsApp ${data.whatsappFormatted}`}
                  id="footer_whatsapp_btn"
                >
                  <MessageCircle className="w-5 h-5 fill-slate-300/10 hover:fill-transparent" />
                </a>

              </div>

              <p className="text-[10px] text-slate-500 pt-2 font-medium">
                Celular DF: {data.whatsappFormatted}
                <br />
                Instagram: {data.instagramHandle}
              </p>

            </div>
          </div>

        </div>

        {/* Lower row Copyrights */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-medium" id="footer_copyright_row">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>© {currentYear} DL MAGIC PAPER — Todos os direitos reservados.</span>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1 hover:text-brand-pink text-slate-500 transition-colors bg-transparent border-0 cursor-pointer font-semibold"
              id="admin_footer_trigger"
            >
              <Lock className="w-3 h-3" />
              Painel do Administrador
            </button>
          </div>
          <p className="flex items-center gap-1.5 shrink-0 font-light text-slate-500">
            Feito com carinho, criatividade e propósito por{' '}
            <a 
              href="https://wa.me/5561996507712" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-brand-pink hover:underline inline-flex items-center gap-1 transition-all"
            >
              Weskley Gomes
              <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink animate-pulse" />
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
