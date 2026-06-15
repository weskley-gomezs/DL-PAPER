import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Instagram, Menu, X, Heart, ShoppingBag, Settings } from "lucide-react";
import { useAppContext } from "../context/DataContext";

interface HeaderProps {
  onOpenBudgetSidebar: () => void;
  cartItemsCount: number;
}

export default function Header({ onOpenBudgetSidebar, cartItemsCount }: HeaderProps) {
  const { data, setIsAdminOpen } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // Monitor screen scroll to change background
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
    { label: "Início", href: "#" },
    { label: "Catálogo", href: "#catalogo" },
    { label: "Kits Festa", href: "#kits-festa" },
    { label: "Topos de Bolo", href: "#topos-bolo" },
    { label: "Personalizados", href: "#personalizados" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    // Smooth scroll to element with offset for header
    let targetId = href.substring(1);
    
    // Match customized headers
    if (href === "#topos-bolo") {
      targetId = "catalogo";
    } else if (href === "#personalizados") {
      targetId = "catalogo";
    } else if (href === "#kits-festa") {
      targetId = "catalogo";
    }
    
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const headerOffset = 90;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // If categories filter, click it via custom dispatch or custom event if needed
      if (href === "#topos-bolo" || href === "#kits-festa" || href === "#personalizados") {
        const catMap: { [key: string]: string } = {
          "#topos-bolo": "Topos de Bolo",
          "#kits-festa": "Kits Festa",
          "#personalizados": "Caixas Personalizadas"
        };
        const event = new CustomEvent("filterCategory", { detail: catMap[href] });
        window.dispatchEvent(event);
      }
    }
  };

  return (
    <>
      <header
        id="app_header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-pink-100/50 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <a 
              href="#" 
              onClick={(e) => handleNavClick(e, "#")}
              className="group flex items-center"
              id="header_logo"
            >
              <img 
                src={data.logo} 
                alt="DL Magic Paper Logo" 
                className="w-20 h-20 sm:w-28 sm:h-28 object-contain group-hover:scale-105 active:scale-95 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6" id="desktop_nav">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="font-sans text-[15px] font-medium text-slate-600 hover:text-brand-pink transition-colors relative group py-2"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-pink transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right Side Icons & CTA */}
            <div className="flex items-center gap-3" id="header_controls">
              
              {/* Admin Panel Launcher */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center justify-center p-2 rounded-full text-slate-500 hover:text-brand-pink hover:bg-pink-50 transition-all cursor-pointer"
                title="Painel de Administração (Administrador)"
                id="admin_panel_launcher_header"
              >
                <Settings className="w-5 h-5 text-slate-500 hover:text-brand-pink" />
              </button>

              {/* Instagram URL icon */}
              <a
                href={data.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center justify-center p-2 rounded-full text-slate-500 hover:text-brand-pink hover:bg-pink-50 transition-all"
                title={`Instagram ${data.instagramHandle}`}
                id="social_instagram_link"
              >
                <Instagram className="w-5 h-5" />
              </a>

              {/* Dynamic Budget Cart Trigger Button */}
              <button
                onClick={onOpenBudgetSidebar}
                className="relative flex items-center justify-center p-2 rounded-full text-slate-500 hover:text-brand-tiffany hover:bg-cyan-50 transition-all pointer-events-auto"
                title="Ver meu orçamento simulado"
                id="budget_cart_button"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-brand-pink text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </button>

              {/* CTA Budget request */}
              <button
                onClick={onOpenBudgetSidebar}
                className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-5 py-2.5 rounded-full font-semibold shadow-md shadow-brand-pink/20 hover:shadow-lg hover:shadow-brand-pink/30 hover:scale-102 transition-all cursor-pointer text-sm"
                id="header_cta_budget"
              >
                <Heart className="w-4 h-4 fill-white animate-pulse" />
                Solicitar orçamento
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex md:hidden items-center justify-center p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all"
                id="mobile_menu_toggle"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-brand-pink" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-x-0 top-[70px] z-30 bg-white shadow-xl rounded-b-3xl border-b border-pink-100 p-6 flex flex-col gap-4 md:hidden text-center"
            id="mobile_menu_container"
          >
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="font-sans font-medium text-slate-700 py-3 rounded-xl hover:bg-pink-50 hover:text-brand-pink transition-all"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="h-px bg-pink-100/60 my-2" />

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBudgetSidebar();
                }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-pink to-brand-lilac text-white py-3.5 rounded-xl font-bold font-sans shadow-md"
              >
                <Heart className="w-4 h-4 fill-white" />
                Orçamento Rápido ({cartItemsCount} itens)
              </button>

              <div className="flex items-center justify-center gap-4 py-2 mt-1">
                <a
                  href={data.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-pink"
                >
                  <Instagram className="w-5 h-5 text-pink-500" />
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
