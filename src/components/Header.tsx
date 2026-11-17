import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Instagram, Menu, X, Heart, ShoppingBag, Settings, ArrowLeft, PartyPopper, Briefcase } from "lucide-react";
import { useAppContext } from "../context/DataContext";
import { getSafeImageUrl } from "../lib/security";

interface HeaderProps {
  onOpenBudgetSidebar: () => void;
  cartItemsCount: number;
  hasActiveProduct?: boolean;
  onLeaveProductPage?: () => void;
  selectedSegment?: "todos" | "pessoal" | "corporativo";
  onSelectSegment?: (segment: "todos" | "pessoal" | "corporativo") => void;
}

export default function Header({ 
  onOpenBudgetSidebar, 
  cartItemsCount, 
  hasActiveProduct, 
  onLeaveProductPage,
  selectedSegment = "todos",
  onSelectSegment
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
    { label: "Kit de Festas Pessoais", href: "#kit-festas", segment: "pessoal" as const },
    { label: "Lembrancinhas Corporativas", href: "#corporativo", segment: "corporativo" as const },
    { label: "Catálogo de Produtos", href: "#produtos", segment: "todos" as const },
    { label: "Orçamento WhatsApp", href: "#contato" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof menuItems[0]) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (hasActiveProduct && onLeaveProductPage) {
      onLeaveProductPage();
    }

    if (item.segment && onSelectSegment) {
      onSelectSegment(item.segment);
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
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
              className="group flex items-center gap-2 sm:gap-3.5 shrink-0"
              id="header_logo"
            >
              <img 
                src={getSafeImageUrl(data.logo) || "https://i.imgur.com/LiPwTKg.png"} 
                alt="DL Magic Paper Logo" 
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain group-hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
                referrerPolicy="no-referrer"
              />
              <h1
                className="font-bold text-lg sm:text-xl md:text-2xl leading-[1.08] select-none tracking-tight text-left text-[#1e132c]"
                style={{ fontFamily: "'Bodoni Moda', serif" }}
              >
                <span className="block whitespace-nowrap">DL Magic</span>
                <span className="block whitespace-nowrap">Paper</span>
              </h1>
            </a>

            {/* Desktop Navigation */}
            <nav aria-label="Navegação Principal" className="hidden lg:flex items-center gap-2 xl:gap-4" id="desktop_nav">
              {!hasActiveProduct ? (
                menuItems.map((item) => {
                  const isSegmentActive =
                    item.segment &&
                    item.segment !== "todos" &&
                    item.segment === selectedSegment;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`font-sans text-xs xl:text-[13px] font-semibold transition-all relative py-1.5 px-2.5 xl:px-3 rounded-full flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        item.segment && item.segment !== "todos"
                          ? isSegmentActive
                            ? item.segment === "pessoal"
                              ? "bg-[#E8527A] text-white shadow-xs"
                              : "bg-[#3A2439] text-white shadow-xs"
                            : "text-[#3A2439]/80 hover:text-[#E8527A] hover:bg-white/80 border border-[#3A2439]/10"
                          : "text-[#3A2439]/80 hover:text-[#E8527A]"
                      }`}
                    >
                      {item.segment === "pessoal" && <PartyPopper className="w-3.5 h-3.5 shrink-0" />}
                      {item.segment === "corporativo" && <Briefcase className="w-3.5 h-3.5 shrink-0" />}
                      <span>{item.label}</span>
                    </a>
                  );
                })
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
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0" id="header_controls">
              
              {/* Admin Panel Launcher */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center justify-center p-1.5 sm:p-2 rounded-full text-[#3A2439]/60 hover:text-[#E8527A] hover:bg-white transition-all cursor-pointer"
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
                className="relative flex items-center justify-center p-1.5 sm:p-2 rounded-full text-[#3A2439]/70 hover:text-[#E8527A] hover:bg-white transition-all cursor-pointer"
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
                className="hidden xl:flex items-center gap-1.5 bg-[#E8527A] hover:bg-[#D43C65] text-white px-4 py-2 rounded-full font-bold shadow-xs hover:scale-102 transition-all cursor-pointer text-xs whitespace-nowrap"
                id="header_cta_budget"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Simular Orçamento</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              {!hasActiveProduct ? (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex lg:hidden items-center justify-center p-1.5 sm:p-2 rounded-full text-[#3A2439] hover:bg-white transition-all cursor-pointer"
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
            className="fixed inset-x-0 top-[76px] sm:top-[84px] z-30 bg-[#FFF6F0] shadow-xl rounded-b-3xl border-b border-[#3A2439]/10 p-6 flex flex-col gap-3 lg:hidden text-center"
            id="mobile_menu_container"
          >
            <nav aria-label="Navegação Principal Mobile" className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isSegmentActive =
                  item.segment &&
                  item.segment !== "todos" &&
                  item.segment === selectedSegment;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`font-sans font-semibold py-2.5 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${
                      item.segment && item.segment !== "todos"
                        ? isSegmentActive
                          ? item.segment === "pessoal"
                            ? "bg-[#E8527A] text-white shadow-xs"
                            : "bg-[#3A2439] text-white shadow-xs"
                          : "bg-white/80 text-[#3A2439] border border-[#3A2439]/10"
                        : "text-[#3A2439] hover:bg-white hover:text-[#E8527A]"
                    }`}
                  >
                    {item.segment === "pessoal" && <PartyPopper className="w-4 h-4" />}
                    {item.segment === "corporativo" && <Briefcase className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

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
