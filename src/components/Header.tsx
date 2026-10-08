import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Instagram, Menu, X, Heart, ShoppingBag, Settings, ArrowLeft, PartyPopper, Briefcase } from "lucide-react";
import { useAppContext } from "../context/DataContext";

interface HeaderProps {
  onOpenBudgetSidebar: () => void;
  cartItemsCount: number;
  hasActiveProduct?: boolean;
  onLeaveProductPage?: () => void;
}

export default function Header({ 
  onOpenBudgetSidebar, 
  cartItemsCount, 
  hasActiveProduct, 
  onLeaveProductPage
}: HeaderProps) {
  const { data, setIsAdminOpen } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Início", href: "#inicio" },
    { label: "Catálogo", href: "#catalogo" },
    { label: "Avaliações", href: "#avaliacoes" },
    { label: "Sobre", href: "#sobre" },
    { label: "Orçamento", href: "#contato" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof menuItems[0]) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (hasActiveProduct && onLeaveProductPage) {
      onLeaveProductPage();
    }
    setTimeout(() => {
      if (item.href === "#inicio" || item.href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      
      const targetId = item.href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, hasActiveProduct ? 100 : 0);
  };

  return (
    <>
      <header
        id="app_header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || hasActiveProduct
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#3A2439]/10 py-2"
            : "bg-[#FFF6F0]/90 backdrop-blur-md shadow-xs border-b border-[#3A2439]/5 py-2.5 sm:py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (hasActiveProduct && onLeaveProductPage) {
                  onLeaveProductPage();
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="group flex items-center gap-2.5"
              id="header_logo"
            >
              <img 
                src={data.logo || "https://i.imgur.com/fVtEcdv.png"} 
                alt="DL Magic Paper Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-105 active:scale-95 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif font-bold text-lg sm:text-xl text-[#3A2439] tracking-tight hidden sm:inline-block">
                DL Magic Paper
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6" id="desktop_nav">
              {!hasActiveProduct ? (
                menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className="font-sans text-[13px] xl:text-[14px] font-semibold text-[#3A2439]/80 hover:text-[#E8527A] transition-colors relative group py-1.5 px-0.5"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#E8527A] transition-all duration-300 scale-x-0 group-hover:scale-x-100 origin-center" />
                  </a>
                ))
              ) : (
                <button
                  onClick={onLeaveProductPage}
                  className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-pink-50 border border-[#E8527A]/30 rounded-full text-[#E8527A] font-sans text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o Catálogo
                </button>
              )}
            </nav>

            {/* Right Side Icons & CTA */}
            <div className="flex items-center gap-2.5 sm:gap-3" id="header_controls">
              
              {/* Admin Panel Launcher */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center justify-center p-2 rounded-full text-[#3A2439]/60 hover:text-[#E8527A] hover:bg-white transition-all cursor-pointer"
                title="Painel de Administração"
                id="admin_panel_launcher_header"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Instagram URL icon */}
              <a
                href={data.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center justify-center p-2 rounded-full text-[#3A2439]/60 hover:text-[#E8527A] hover:bg-white transition-all"
                title={`Instagram ${data.instagramHandle}`}
                id="social_instagram_link"
              >
                <Instagram className="w-5 h-5" />
              </a>

              {/* Dynamic Budget Cart Trigger Button */}
              <button
                onClick={onOpenBudgetSidebar}
                className="relative flex items-center justify-center p-2 rounded-full text-[#3A2439]/70 hover:text-[#E8527A] hover:bg-white transition-all cursor-pointer"
                title="Ver meu orçamento simulado"
                id="budget_cart_button"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-[#E8527A] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </button>

              {/* CTA Budget request button */}
              <button
                onClick={onOpenBudgetSidebar}
                className="hidden md:flex items-center gap-1.5 bg-[#E8527A] hover:bg-[#D43C65] text-white px-4 py-2 rounded-full font-bold shadow-xs hover:scale-102 transition-all cursor-pointer text-xs"
                id="header_cta_budget"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Simular Orçamento</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              {!hasActiveProduct ? (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex lg:hidden items-center justify-center p-2 rounded-full text-[#3A2439] hover:bg-white transition-all cursor-pointer"
                  id="mobile_menu_toggle"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-[#E8527A]" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              ) : (
                <button
                  onClick={onLeaveProductPage}
                  className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8527A]/30 rounded-full text-[#E8527A] font-sans text-xs font-bold active:scale-95 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar
                </button>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && !hasActiveProduct && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-x-0 top-[60px] sm:top-[70px] z-30 bg-[#FFF6F0] shadow-xl rounded-b-3xl border-b border-[#3A2439]/10 p-6 flex flex-col gap-3 lg:hidden text-center"
            id="mobile_menu_container"
          >
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className="font-sans font-semibold text-[#3A2439] py-2.5 px-4 rounded-xl hover:bg-white hover:text-[#E8527A] transition-all text-sm"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="h-px bg-[#3A2439]/10 my-1" />

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBudgetSidebar();
                }}
                className="flex items-center justify-center gap-2 bg-[#E8527A] text-white py-3 rounded-full font-bold font-sans text-xs shadow-sm"
              >
                <Heart className="w-4 h-4 fill-white" />
                Simulação de Orçamento ({cartItemsCount} itens)
              </button>

              <div className="flex items-center justify-center gap-4 py-1">
                <a
                  href={data.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-[#3A2439]/70 hover:text-[#E8527A]"
                >
                  <Instagram className="w-4 h-4 text-[#E8527A]" />
                  {data.instagramHandle}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
